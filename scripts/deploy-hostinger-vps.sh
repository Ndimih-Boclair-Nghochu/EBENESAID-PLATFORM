#!/usr/bin/env bash

set -euo pipefail

APP_DIR="${APP_DIR:-/opt/ebenesaid-platform}"
REPO_URL="${REPO_URL:-https://github.com/Ndimih-Boclair-Nghochu/EBENESAID-PLATFORM.git}"
BRANCH="${BRANCH:-main}"
ENV_FILE="${ENV_FILE:-$APP_DIR/hostinger.env}"
SITE_NAME="${SITE_NAME:-ebenesaid-platform}"

log() {
  echo ""
  echo "==> $1"
}

fail() {
  echo ""
  echo "ERROR: $1" >&2
  exit 1
}

require_root() {
  if [[ "${EUID}" -ne 0 ]]; then
    fail "Run this script with sudo or as root."
  fi
}

install_base_packages() {
  log "Installing system packages"
  apt-get update -y
  apt-get install -y ca-certificates curl git nginx certbot python3-certbot-nginx ufw
}

install_docker() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    log "Docker is already installed"
    return
  fi

  log "Installing Docker Engine and Docker Compose plugin"
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
}

prepare_repo() {
  if [[ -d "$APP_DIR/.git" ]]; then
    log "Updating repository"
    git -C "$APP_DIR" fetch origin "$BRANCH"
    git -C "$APP_DIR" checkout "$BRANCH"
    git -C "$APP_DIR" pull --ff-only origin "$BRANCH"
  else
    log "Cloning repository"
    mkdir -p "$(dirname "$APP_DIR")"
    git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
  fi
}

prepare_env_file() {
  if [[ -f "$ENV_FILE" ]]; then
    return
  fi

  log "Creating VPS environment file"
  cp "$APP_DIR/deploy/hostinger/hostinger.env.example" "$ENV_FILE"
  fail "Edit $ENV_FILE with your real domain, passwords, admin email, and provider keys, then run this script again."
}

load_env() {
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a

  : "${APP_DOMAIN:?APP_DOMAIN is required in $ENV_FILE}"
  : "${LETSENCRYPT_EMAIL:?LETSENCRYPT_EMAIL is required in $ENV_FILE}"
  : "${DB_USER:?DB_USER is required in $ENV_FILE}"
  : "${DB_PASSWORD:?DB_PASSWORD is required in $ENV_FILE}"
  : "${DB_NAME:?DB_NAME is required in $ENV_FILE}"
  : "${INITIAL_ADMIN_EMAIL:?INITIAL_ADMIN_EMAIL is required in $ENV_FILE}"
  : "${INITIAL_ADMIN_PASSWORD:?INITIAL_ADMIN_PASSWORD is required in $ENV_FILE}"
  : "${NEXT_PUBLIC_APP_URL:?NEXT_PUBLIC_APP_URL is required in $ENV_FILE}"
}

configure_firewall() {
  log "Configuring firewall"
  ufw allow OpenSSH
  ufw allow "Nginx Full"
  ufw --force enable
}

configure_nginx() {
  log "Configuring Nginx reverse proxy"
  sed "s/__DOMAIN__/${APP_DOMAIN}/g" \
    "$APP_DIR/deploy/hostinger/nginx-http.conf.template" \
    > "/etc/nginx/sites-available/${SITE_NAME}"

  ln -sf "/etc/nginx/sites-available/${SITE_NAME}" "/etc/nginx/sites-enabled/${SITE_NAME}"
  rm -f /etc/nginx/sites-enabled/default
  nginx -t
  systemctl reload nginx
}

start_stack() {
  log "Building and starting Docker services"
  cd "$APP_DIR"
  docker compose --env-file "$ENV_FILE" up -d --build
}

obtain_ssl() {
  log "Requesting Let's Encrypt certificate"
  certbot --nginx \
    -d "$APP_DOMAIN" \
    -d "www.${APP_DOMAIN}" \
    --non-interactive \
    --agree-tos \
    -m "$LETSENCRYPT_EMAIL" \
    --redirect
}

show_status() {
  log "Deployment status"
  cd "$APP_DIR"
  docker compose --env-file "$ENV_FILE" ps
  echo ""
  echo "App URL: https://${APP_DOMAIN}"
  echo "Environment file: ${ENV_FILE}"
  echo "Compose logs: docker compose --env-file ${ENV_FILE} logs -f"
}

require_root
install_base_packages
install_docker
prepare_repo
prepare_env_file
load_env
configure_firewall
configure_nginx
start_stack
obtain_ssl
show_status
