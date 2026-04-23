# EBENESAID Platform

Production-oriented Next.js platform for international student relocation, admin operations, and partner services.

## Local Development

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL`.
2. Install dependencies with `npm install`.
3. Run `npm run typecheck` to validate TypeScript.
4. Run `npm run build` before deployment.
5. Start development with `npm run dev`.

## Foundation Notes

- The platform uses a shared PostgreSQL pool to avoid duplicated database connections across API routes.
- AI provider keys are optional for now. The platform runs in local EBENESAID AI mode unless `EBENESAID_AI_MODE=live` is explicitly set with provider credentials.

## Docker

`docker compose up -d --build` starts the app and PostgreSQL. The app creates core tables lazily and seeds the first admin from:

- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_PASSWORD`
- `INITIAL_ADMIN_FIRST_NAME`
- `INITIAL_ADMIN_LAST_NAME`

## Runtime Environment Expectations

- `DATABASE_URL` is required for data-backed flows.
- Admin bootstrap values are optional but recommended for first deployment.
- Payment keys are optional in test mode and become required when live checkout and webhook handling is enabled.
- `EBENESAID_AI_MODE=local` is the recommended default until the business is ready to connect a real AI provider.

## Required Environment

- `DATABASE_URL`
- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_PASSWORD`
- `EBENESAID_AI_MODE` defaults to `local`; set to `live` only when enabling real AI APIs.
- `OPENAI_API_KEY` optional for future provider-enabled flows.
- `GOOGLE_GENAI_API_KEY` optional for future provider-enabled Genkit flows.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` for Stripe.
- `FLUTTERWAVE_SECRET_KEY`, `FLUTTERWAVE_WEBHOOK_SECRET_HASH`, `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` for Flutterwave.
