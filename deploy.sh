#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# EBENESAID Platform — Hostinger VPS deployment script
#
# USAGE (run as root or with sudo on your VPS):
#   bash deploy.sh
#
# What this script does:
#   1. Installs Node.js 22, PostgreSQL 16, Nginx, PM2, Certbot
#   2. Creates the database and user
#   3. Clones / pulls the latest code
#   4. Installs dependencies and builds the Next.js app
#   5. Configures Nginx and PM2
#   6. (Optionally) obtains an SSL certificate via Let's Encrypt
#
# Edit the VARIABLES section below before running.
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ─── VARIABLES — edit these ──────────────────────────────────────────────────
APP_DIR="/var/www/ebenesaid"
REPO_URL="https://github.com/YOUR_ORG/ebenesaid-platform.git"
BRANCH="main"
DOMAIN="yourdomain.com"
DB_NAME="ebenesaid_db"
DB_USER="ebenesaid_user"
DB_PASSWORD="CHANGE_THIS_STRONG_PASSWORD"
# ─────────────────────────────────────────────────────────────────────────────

log() { echo -e "\n\033[1;32m▶ $1\033[0m"; }
err() { echo -e "\n\033[1;31m✗ $1\033[0m" >&2; exit 1; }

[[ $EUID -ne 0 ]] && err "Run this script as root: sudo bash deploy.sh"

# ─── 1. System packages ───────────────────────────────────────────────────────
log "Updating system packages"
apt-get update -qq && apt-get upgrade -y -qq

log "Installing prerequisites"
apt-get install -y -qq curl git build-essential nginx certbot python3-certbot-nginx ufw

# ─── 2. Node.js 22 ───────────────────────────────────────────────────────────
if ! command -v node &>/dev/null || [[ $(node -v | cut -d. -f1 | tr -d v) -lt 22 ]]; then
  log "Installing Node.js 22"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y -qq nodejs
fi
log "Node.js $(node -v) | npm $(npm -v)"

# ─── 3. PM2 ──────────────────────────────────────────────────────────────────
if ! command -v pm2 &>/dev/null; then
  log "Installing PM2"
  npm install -g pm2 --silent
fi

# ─── 4. PostgreSQL 16 ────────────────────────────────────────────────────────
if ! command -v psql &>/dev/null; then
  log "Installing PostgreSQL 16"
  apt-get install -y -qq postgresql postgresql-contrib
  systemctl enable --now postgresql
fi

log "Creating database and user"
sudo -u postgres psql <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE USER "${DB_USER}" WITH PASSWORD '${DB_PASSWORD}';
  END IF;
END
\$\$;
CREATE DATABASE "${DB_NAME}" OWNER "${DB_USER}" ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8' TEMPLATE template0;
GRANT ALL PRIVILEGES ON DATABASE "${DB_NAME}" TO "${DB_USER}";
SQL

# ─── 5. Clone / pull code ─────────────────────────────────────────────────────
if [[ -d "$APP_DIR/.git" ]]; then
  log "Pulling latest code"
  git -C "$APP_DIR" fetch origin "$BRANCH"
  git -C "$APP_DIR" reset --hard "origin/$BRANCH"
else
  log "Cloning repository"
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi

# ─── 6. Environment file ──────────────────────────────────────────────────────
if [[ ! -f "$APP_DIR/.env.local" ]]; then
  log "Creating .env.local from template — EDIT IT NOW"
  cp "$APP_DIR/.env.example" "$APP_DIR/.env.local"
  sed -i "s|postgresql://ebenesaid_user:your_secure_password@localhost:5432/ebenesaid_db|postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}|" "$APP_DIR/.env.local"
  echo ""
  echo "  ╔══════════════════════════════════════════════════════════╗"
  echo "  ║  STOP — edit $APP_DIR/.env.local now              ║"
  echo "  ║  Fill in Firebase keys, Google AI key, and domain.      ║"
  echo "  ║  Then rerun this script.                                 ║"
  echo "  ╚══════════════════════════════════════════════════════════╝"
  exit 0
fi

# ─── 7. Install deps & build ──────────────────────────────────────────────────
log "Installing Node.js dependencies"
cd "$APP_DIR"
npm ci --ignore-scripts

log "Building Next.js application (this takes a few minutes)"
npm run build

# ─── 8. Copy static assets for standalone output ─────────────────────────────
log "Setting up standalone output"
cp -r "$APP_DIR/.next/static" "$APP_DIR/.next/standalone/.next/static"
[[ -d "$APP_DIR/public" ]] && cp -r "$APP_DIR/public" "$APP_DIR/.next/standalone/public"

# ─── 9. Log directory ─────────────────────────────────────────────────────────
mkdir -p /var/log/ebenesaid

# ─── 10. PM2 setup ───────────────────────────────────────────────────────────
log "Starting/restarting application with PM2"
cd "$APP_DIR"
pm2 startOrRestart ecosystem.config.js --env production
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash

# ─── 11. Firewall ─────────────────────────────────────────────────────────────
log "Configuring UFW firewall"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# ─── 12. Nginx ───────────────────────────────────────────────────────────────
log "Configuring Nginx"
sed "s/yourdomain.com/${DOMAIN}/g" "$APP_DIR/nginx.conf" > /etc/nginx/sites-available/ebenesaid
ln -sf /etc/nginx/sites-available/ebenesaid /etc/nginx/sites-enabled/ebenesaid
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ─── 13. SSL certificate ─────────────────────────────────────────────────────
if [[ "$DOMAIN" != "yourdomain.com" ]]; then
  log "Obtaining SSL certificate for $DOMAIN"
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "admin@${DOMAIN}" || \
    echo "Certbot failed — ensure DNS is pointing to this server and try manually."
fi

log "✓ Deployment complete!"
echo ""
echo "  App:      https://${DOMAIN}"
echo "  PM2:      pm2 list"
echo "  Logs:     pm2 logs ebenesaid-platform"
echo "  Restart:  pm2 restart ebenesaid-platform"
echo ""
