-- EBENESAID Platform — Full Database Initialisation
-- Run this once on a fresh PostgreSQL instance:
--   psql -U postgres -d ebenesaid_db -f scripts/init-db.sql
--
-- The application also auto-creates all tables on first startup,
-- so this file is provided as a reference and for CI pipelines.

-- ─── Core users & sessions ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id                SERIAL PRIMARY KEY,
  email             TEXT NOT NULL UNIQUE,
  password_hash     TEXT NOT NULL,
  password_salt     TEXT NOT NULL,
  first_name        TEXT NOT NULL DEFAULT '',
  last_name         TEXT NOT NULL DEFAULT '',
  phone             TEXT NOT NULL DEFAULT '',
  university        TEXT NOT NULL DEFAULT '',
  country_of_origin TEXT NOT NULL DEFAULT '',
  user_type         TEXT NOT NULL DEFAULT 'student',
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  trial_start_date  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trial_end_date    TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  has_paid          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at     TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sessions (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_token_idx ON sessions (token);

-- ─── Student dashboard ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS student_dashboard_tasks (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  done        BOOLEAN NOT NULL DEFAULT FALSE,
  category    TEXT NOT NULL,
  href        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS student_dashboard_tasks_user_title_idx
  ON student_dashboard_tasks (user_id, title);

CREATE TABLE IF NOT EXISTS student_onboarding_profiles (
  id                    SERIAL PRIMARY KEY,
  user_id               INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  program_duration_band TEXT,
  onboarding_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  selected_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Property listings ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS property_listings (
  id                  SERIAL PRIMARY KEY,
  title               TEXT NOT NULL,
  location            TEXT NOT NULL,
  price               NUMERIC(10, 2) NOT NULL,
  type                TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'Pending',
  details             TEXT NOT NULL,
  image_url           TEXT NOT NULL,
  leads               INTEGER NOT NULL DEFAULT 0,
  trust_score         INTEGER NOT NULL DEFAULT 50,
  created_by_user_id  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Payments ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS student_platform_payments (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider     TEXT NOT NULL,
  amount_eur   NUMERIC(10, 2) NOT NULL,
  status       TEXT NOT NULL DEFAULT 'completed',
  reference    TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Documents ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS student_documents (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  status     TEXT NOT NULL,
  date_label TEXT NOT NULL,
  doc_type   TEXT NOT NULL,
  file_url   TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Jobs ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS job_listings (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  company     TEXT NOT NULL,
  location    TEXT NOT NULL,
  salary      TEXT NOT NULL,
  job_type    TEXT NOT NULL,
  logo        TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_job_applications (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id     INTEGER NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
  status     TEXT NOT NULL DEFAULT 'Applied',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, job_id)
);

-- ─── Community ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS community_circles (
  id                  SERIAL PRIMARY KEY,
  name                TEXT NOT NULL,
  members_label       TEXT NOT NULL,
  description         TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'approved',
  created_by_user_id  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  approved_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  approved_at         TIMESTAMPTZ,
  rejection_reason    TEXT NOT NULL DEFAULT '',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_memberships (
  id        SERIAL PRIMARY KEY,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  circle_id INTEGER NOT NULL REFERENCES community_circles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, circle_id)
);

CREATE TABLE IF NOT EXISTS community_messages (
  id          SERIAL PRIMARY KEY,
  circle_id   INTEGER NOT NULL REFERENCES community_circles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Messaging ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS student_conversations (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  contact_type TEXT NOT NULL,
  icon         TEXT NOT NULL,
  unread       INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name, contact_type)
);

CREATE TABLE IF NOT EXISTS student_conversation_messages (
  id              SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES student_conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL,
  sender_name     TEXT NOT NULL,
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Food ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS food_menu_items (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  price        NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) NOT NULL,
  kitchen      TEXT NOT NULL,
  prep_time    TEXT NOT NULL,
  rating       NUMERIC(3, 1) NOT NULL,
  image_url    TEXT NOT NULL,
  tags         JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS student_food_orders (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_name   TEXT NOT NULL,
  total       NUMERIC(10, 2) NOT NULL,
  fulfillment TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'Initialized',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Arrival ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS student_arrival_bookings (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  airport_code   TEXT NOT NULL,
  destination    TEXT NOT NULL,
  pickup_status  TEXT NOT NULL,
  pickup_booked  BOOLEAN NOT NULL DEFAULT FALSE,
  notes          TEXT NOT NULL DEFAULT '',
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Support ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS student_support_messages (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Billing ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS student_billing_profiles (
  id                             SERIAL PRIMARY KEY,
  user_id                        INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  billing_name                   TEXT NOT NULL DEFAULT '',
  billing_email                  TEXT NOT NULL DEFAULT '',
  billing_phone                  TEXT NOT NULL DEFAULT '',
  billing_country                TEXT NOT NULL DEFAULT '',
  billing_currency               TEXT NOT NULL DEFAULT 'EUR',
  billing_address                TEXT NOT NULL DEFAULT '',
  provider_preference            TEXT NOT NULL DEFAULT 'stripe',
  stripe_customer_email          TEXT NOT NULL DEFAULT '',
  stripe_customer_id             TEXT NOT NULL DEFAULT '',
  stripe_payment_method_label    TEXT NOT NULL DEFAULT '',
  stripe_checkout_mode           TEXT NOT NULL DEFAULT 'card',
  flutterwave_customer_email     TEXT NOT NULL DEFAULT '',
  flutterwave_customer_id        TEXT NOT NULL DEFAULT '',
  flutterwave_payment_method     TEXT NOT NULL DEFAULT 'card',
  flutterwave_mobile_money_provider TEXT NOT NULL DEFAULT '',
  flutterwave_reference          TEXT NOT NULL DEFAULT '',
  invoice_email                  TEXT NOT NULL DEFAULT '',
  auto_renew                     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at                     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
