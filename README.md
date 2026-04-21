# EBENESAID Platform

Production-oriented Next.js platform for international student relocation, admin operations, and partner services.

## Local Development

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL`.
2. Install dependencies with `npm install`.
3. Run `npm run typecheck` and `npm run build` before deployment.
4. Start development with `npm run dev`.

## Docker

`docker compose up -d --build` starts the app and PostgreSQL. The app creates core tables lazily and seeds the first admin from:

- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_PASSWORD`
- `INITIAL_ADMIN_FIRST_NAME`
- `INITIAL_ADMIN_LAST_NAME`

## Required Environment

- `DATABASE_URL`
- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_PASSWORD`
- `OPENAI_API_KEY` optional; AI falls back to test mode when absent.
- `GOOGLE_GENAI_API_KEY` optional for Genkit/Gemini flows.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` for Stripe.
- `FLUTTERWAVE_SECRET_KEY`, `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` for Flutterwave.
