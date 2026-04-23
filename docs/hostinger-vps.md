# Hostinger VPS Deployment

This project is prepared to run on a Hostinger VPS with:

- Ubuntu VPS
- Docker Engine + Docker Compose
- PostgreSQL in Docker
- Next.js app in Docker
- Nginx on the VPS
- Let's Encrypt SSL

## Recommended Hostinger setup

Use an Ubuntu VPS plan with at least:

- 2 vCPU
- 4 GB RAM
- 80 GB SSD

That gives the app, PostgreSQL, and Nginx enough room to run reliably.

## Before you run deployment

1. Create a Hostinger VPS and connect with SSH.
2. Point your domain `A` record to the VPS public IP.
3. Wait for DNS to resolve.
4. Log in to the VPS as `root` or a sudo user.

## One-time deployment steps

```bash
sudo mkdir -p /opt
cd /opt
sudo git clone https://github.com/Ndimih-Boclair-Nghochu/EBENESAID-PLATFORM.git ebenesaid-platform
cd ebenesaid-platform
sudo bash scripts/deploy-hostinger-vps.sh
```

The first run creates:

- `/opt/ebenesaid-platform/hostinger.env`

Edit that file with your real values, then run the script again:

```bash
sudo nano /opt/ebenesaid-platform/hostinger.env
sudo bash /opt/ebenesaid-platform/scripts/deploy-hostinger-vps.sh
```

## Required values in `hostinger.env`

These must be set:

- `APP_DOMAIN`
- `LETSENCRYPT_EMAIL`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_PASSWORD`
- `NEXT_PUBLIC_APP_URL`

Recommended:

- `EBENESAID_AI_MODE=local`

Optional:

- Firebase public keys
- Stripe keys
- Flutterwave keys
- OpenAI / Google GenAI keys when real AI mode is enabled later

## How the stack works

- `db` container stores PostgreSQL data in a named Docker volume
- `app` container builds and runs the production Next.js standalone server
- Nginx forwards traffic from ports `80` and `443` to the app on port `3000`
- Certbot installs and renews SSL certificates
- The app auto-creates core tables on startup
- The first admin account is seeded from the environment variables if it does not already exist

## Common commands

Check containers:

```bash
cd /opt/ebenesaid-platform
sudo docker compose --env-file hostinger.env ps
```

See logs:

```bash
cd /opt/ebenesaid-platform
sudo docker compose --env-file hostinger.env logs -f
```

Restart after changes:

```bash
cd /opt/ebenesaid-platform
sudo docker compose --env-file hostinger.env up -d --build
```

## Updating the server later

```bash
cd /opt/ebenesaid-platform
sudo git pull origin main
sudo docker compose --env-file hostinger.env up -d --build
```

## Notes

- Keep `EBENESAID_AI_MODE=local` until you intentionally enable a real provider.
- If payment keys are blank, the platform stays in safe test-mode payment behavior.
- PostgreSQL data stays persistent in Docker volume `postgres_data`.
