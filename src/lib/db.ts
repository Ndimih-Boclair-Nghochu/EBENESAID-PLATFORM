import crypto from 'crypto';
import { dbPool as pool } from '@/lib/postgres';
import { defaultLocale, normalizeLocale, type SupportedLocale } from '@/lib/i18n';
import {
  getDefaultMarketingPageContent,
  normalizeMarketingPageContent,
  type MarketingPageContent,
  type MarketingPageKey,
} from '@/lib/marketing-site-content';
import { getDefaultHomePageContent, normalizeHomePageContent, type HomePageContent } from '@/lib/public-site-content';

// ─── Password Hashing ──────────────────────────────────────────────────────────

// ─── Password Hashing ──────────────────────────────────────────────────────────

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  if (!password || !hash || !salt) {
    return false;
  }

  try {
    const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    const expected = Buffer.from(hash, 'hex');
    const actual = Buffer.from(testHash, 'hex');

    if (expected.length === 0 || expected.length !== actual.length) {
      return false;
    }

    return crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

// ─── Session Token ──────────────────────────────────────────────────────────────

export function generateSessionToken(): string {
  return crypto.randomBytes(48).toString('hex');
}

function hashOpaqueToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}


export interface DbUser {
  id: number;
  email: string;
  password_hash: string;
  password_salt: string;
  first_name: string;
  last_name: string;
  phone: string;
  university: string;
  country_of_origin: string;
  user_type: string;
  is_active: boolean;
  trial_start_date: string;
  trial_end_date: string;
  has_paid: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface SafeUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  university: string;
  countryOfOrigin: string;
  userType: string;
  avatar?: string | null;
  isActive: boolean;
  trialStartDate: string;
  trialEndDate: string;
  hasPaid: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AdminDirectoryUser extends SafeUser {
  updatedAt: string;
  partnerProfile?: {
    partnerType: string;
    businessName: string;
    contactPerson: string;
    commissionPercent: number | null;
    metadata: Record<string, unknown>;
  } | null;
}

export type PartnerProfileRecord = {
  partnerType: string;
  businessName: string;
  contactPerson: string;
  commissionPercent: number | null;
  metadata: Record<string, unknown>;
};

export type PartnerFinanceSummary = {
  transactionCount: number;
  grossAmountEur: number;
  deductionAmountEur: number;
  netAmountEur: number;
  pendingCount: number;
};

export type AdminStudentPaymentRecord = {
  id: number;
  studentName: string;
  studentEmail: string;
  provider: string;
  amountEur: number;
  status: string;
  reference: string;
  createdAt: string;
  completedAt: string | null;
};

export type AdminPartnerTransactionRecord = {
  id: number;
  partnerName: string;
  partnerEmail: string;
  partnerType: string;
  businessName: string;
  provider: string;
  grossAmountEur: number;
  deductionPercent: number;
  deductionAmountEur: number;
  netAmountEur: number;
  status: string;
  reference: string;
  createdAt: string;
};

export type AdminFinanceLedger = {
  studentPayments: AdminStudentPaymentRecord[];
  partnerTransactions: AdminPartnerTransactionRecord[];
  totals: {
    studentRevenueEur: number;
    partnerGrossEur: number;
    partnerDeductionsEur: number;
    partnerNetEur: number;
    studentPaymentCount: number;
    partnerTransactionCount: number;
  };
};

export interface StudentDashboardTask {
  id: number;
  userId: number;
  templateId: number | null;
  title: string;
  desc: string;
  done: boolean;
  category: string;
  href: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentDashboardData {
  tasks: StudentDashboardTask[];
  guidance: string;
}

export interface StudentOnboardingProfile {
  programDurationBand: 'under_3_months' | 'over_3_months' | 'already_in_latvia' | null;
  onboardingCompleted: boolean;
}

export type StudentProgramDurationBand = 'under_3_months' | 'over_3_months' | 'already_in_latvia';
export type StudentTaskDurationBand = Exclude<StudentProgramDurationBand, 'already_in_latvia'>;

export interface StudentTaskTemplate {
  id: number;
  title: string;
  description: string;
  category: string;
  href: string;
  sortOrder: number;
  durationBand: StudentTaskDurationBand;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyListing {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  status: string;
  details: string;
  imageUrl: string;
  leads: number;
  trustScore: number;
  createdByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export const PLATFORM_FEE_EUR = 5;
export const DEFAULT_PARTNER_DEDUCTION_PERCENT = 10;

export const PLATFORM_ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'investor', label: 'Investor' },
  { value: 'university', label: 'University' },
  { value: 'agent', label: 'House Agent' },
  { value: 'job_partner', label: 'Job Supplier' },
  { value: 'supplier', label: 'Food Supplier' },
  { value: 'transport', label: 'Transport Partner' },
] as const;

export type PlatformUserType = typeof PLATFORM_ROLE_OPTIONS[number]['value'];

type PartnerProfileInput = {
  partnerType: string;
  businessName: string;
  contactPerson: string;
  commissionPercent?: number | null;
  metadata?: Record<string, unknown>;
};

function isPartnerRole(userType: string): boolean {
  return userType === 'university' || userType === 'agent' || userType === 'job_partner' || userType === 'supplier' || userType === 'transport';
}

export function toSafeUser(dbUser: DbUser): SafeUser {
  return {
    id: dbUser.id,
    email: dbUser.email,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    phone: dbUser.phone,
    university: dbUser.university,
    countryOfOrigin: dbUser.country_of_origin,
    userType: dbUser.user_type,
    avatar: null,
    isActive: dbUser.is_active,
    trialStartDate: dbUser.trial_start_date,
    trialEndDate: dbUser.trial_end_date,
    hasPaid: dbUser.has_paid,
    createdAt: dbUser.created_at,
    lastLoginAt: dbUser.last_login_at,
  };
}

function normalizeUserType(userType?: string): PlatformUserType {
  const normalized = String(userType ?? 'student').trim().toLowerCase();
  if (
    normalized === 'admin' ||
    normalized === 'staff' ||
    normalized === 'investor' ||
    normalized === 'university' ||
    normalized === 'agent' ||
    normalized === 'job_partner' ||
    normalized === 'supplier' ||
    normalized === 'transport' ||
    normalized === 'student'
  ) {
    return normalized;
  }

  return 'student';
}

let schemaReady: Promise<void> | null = null;
let coreSchemaReady: Promise<void> | null = null;

export type PlatformPricingSettings = {
  studentFeeEur: number;
  partnerDeductionPercent: number;
};

export type PasswordResetTokenIssuance = {
  token: string;
  expiresAt: string;
};

export type PlatformIntelligenceSnapshot = {
  students: number;
  users: number;
  verifiedListings: number;
  openJobs: number;
  communityCircles: number;
  foodItems: number;
  todayListings: number;
  todayJobs: number;
  todayFoodItems: number;
};

export type PublicPageKey = 'home';

const defaultStudentTaskTemplates: Record<StudentTaskDurationBand, Array<{
  title: string;
  description: string;
  category: string;
  href: string;
}>> = {
  under_3_months: [
    {
      title: 'Upload Passport Copy',
      description: 'Add the identification page of your valid passport to your secure wallet.',
      category: 'Legal',
      href: '/docs',
    },
    {
      title: 'Upload Admission Or Invitation Letter',
      description: 'Store the letter that confirms your short course or exchange placement.',
      category: 'Academic',
      href: '/docs',
    },
    {
      title: 'Upload Travel Insurance',
      description: 'Keep proof of insurance that covers your stay in Latvia.',
      category: 'Legal',
      href: '/docs',
    },
    {
      title: 'Upload Accommodation Proof',
      description: 'Add your housing confirmation, hotel booking, or lease document.',
      category: 'Housing',
      href: '/docs',
    },
    {
      title: 'Upload Proof Of Funds',
      description: 'Store your bank statement or sponsor letter for immigration checks.',
      category: 'Finance',
      href: '/docs',
    },
    {
      title: 'Plan Arrival In Riga',
      description: 'Set your destination and pickup status for airport arrival support.',
      category: 'Logistics',
      href: '/arrival',
    },
  ],
  over_3_months: [
    {
      title: 'Upload Passport Copy',
      description: 'Add the identification page of your valid passport to your secure wallet.',
      category: 'Legal',
      href: '/docs',
    },
    {
      title: 'Upload University Acceptance Letter',
      description: 'Store the official admission letter for your full study program.',
      category: 'Academic',
      href: '/docs',
    },
    {
      title: 'Upload Visa Or Residence Permit Documents',
      description: 'Keep all long-stay visa or residence permit paperwork in one place.',
      category: 'Legal',
      href: '/docs',
    },
    {
      title: 'Upload Health Insurance',
      description: 'Add your health insurance certificate for the full study period.',
      category: 'Legal',
      href: '/docs',
    },
    {
      title: 'Upload Accommodation Contract',
      description: 'Store the signed lease or housing confirmation for your program.',
      category: 'Housing',
      href: '/docs',
    },
    {
      title: 'Upload Proof Of Funds',
      description: 'Keep your tuition or maintenance funds evidence ready for review.',
      category: 'Finance',
      href: '/docs',
    },
    {
      title: 'Plan Arrival In Riga',
      description: 'Set your destination and pickup status for airport arrival support.',
      category: 'Logistics',
      href: '/arrival',
    },
    {
      title: 'Track Enrollment Originals',
      description: 'Prepare your original academic documents for enrollment and registration.',
      category: 'Academic',
      href: '/docs',
    },
  ],
};

export async function ensureCoreTables(): Promise<void> {
  if (!coreSchemaReady) {
    coreSchemaReady = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          password_salt TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          phone TEXT NOT NULL DEFAULT '',
          university TEXT NOT NULL DEFAULT '',
          country_of_origin TEXT NOT NULL DEFAULT '',
          user_type TEXT NOT NULL DEFAULT 'student',
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          trial_start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          trial_end_date TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days',
          has_paid BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          last_login_at TIMESTAMPTZ
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token TEXT NOT NULL UNIQUE,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE INDEX IF NOT EXISTS sessions_token_idx ON sessions (token)
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token_hash TEXT NOT NULL UNIQUE,
          expires_at TIMESTAMPTZ NOT NULL,
          used_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx ON password_reset_tokens (user_id)
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS platform_settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS public_site_content (
          page_key TEXT NOT NULL,
          locale TEXT NOT NULL,
          content JSONB NOT NULL DEFAULT '{}'::jsonb,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (page_key, locale)
        )
      `);

      await pool.query(
        `INSERT INTO platform_settings (key, value)
         VALUES ('student_fee_eur', $1), ('partner_deduction_percent', $2)
         ON CONFLICT (key) DO NOTHING`,
        [String(PLATFORM_FEE_EUR), String(DEFAULT_PARTNER_DEDUCTION_PERCENT)]
      );

      await pool.query(`
        CREATE TABLE IF NOT EXISTS partner_profiles (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          partner_type TEXT NOT NULL,
          business_name TEXT NOT NULL DEFAULT '',
          contact_person TEXT NOT NULL DEFAULT '',
          commission_percent NUMERIC(5,2),
          metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS partner_transactions (
          id SERIAL PRIMARY KEY,
          partner_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          provider TEXT NOT NULL DEFAULT 'manual',
          gross_amount_eur NUMERIC(10,2) NOT NULL,
          deduction_percent NUMERIC(5,2) NOT NULL,
          deduction_amount_eur NUMERIC(10,2) NOT NULL,
          net_amount_eur NUMERIC(10,2) NOT NULL,
          status TEXT NOT NULL DEFAULT 'completed',
          reference TEXT NOT NULL UNIQUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await seedInitialAdminAccount();
    })().catch(error => {
      coreSchemaReady = null;
      throw error;
    });
  }

  await coreSchemaReady;
}

async function seedInitialAdminAccount(): Promise<void> {
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows[0]) {
    return;
  }

  const { hash, salt } = hashPassword(password);
  await pool.query(
    `INSERT INTO users (
       email, password_hash, password_salt, first_name, last_name, phone, university,
       country_of_origin, user_type, is_active, trial_start_date, trial_end_date, has_paid,
       created_at, updated_at
     )
     VALUES ($1, $2, $3, $4, $5, '', 'EBENESAID', '', 'admin', TRUE, NOW(), NOW() + INTERVAL '30 days', TRUE, NOW(), NOW())`,
    [
      email,
      hash,
      salt,
      process.env.INITIAL_ADMIN_FIRST_NAME?.trim() || 'Platform',
      process.env.INITIAL_ADMIN_LAST_NAME?.trim() || 'Admin',
    ]
  );
}

async function ensurePlatformTables(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await ensureCoreTables();

      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_task_templates (
          id SERIAL PRIMARY KEY,
          duration_band TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          href TEXT NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_dashboard_tasks (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          template_id INTEGER REFERENCES student_task_templates(id) ON DELETE SET NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          done BOOLEAN NOT NULL DEFAULT FALSE,
          category TEXT NOT NULL,
          href TEXT NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS student_dashboard_tasks_user_title_idx
        ON student_dashboard_tasks (user_id, title)
      `);

      await pool.query(`
        ALTER TABLE student_dashboard_tasks
        ADD COLUMN IF NOT EXISTS template_id INTEGER REFERENCES student_task_templates(id) ON DELETE SET NULL
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS property_listings (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          location TEXT NOT NULL,
          price NUMERIC(10, 2) NOT NULL,
          type TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'Pending',
          details TEXT NOT NULL,
          image_url TEXT NOT NULL,
          leads INTEGER NOT NULL DEFAULT 0,
          trust_score INTEGER NOT NULL DEFAULT 50,
          created_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_onboarding_profiles (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          program_duration_band TEXT,
          onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
          selected_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_platform_payments (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          provider TEXT NOT NULL,
          amount_eur NUMERIC(10, 2) NOT NULL,
          status TEXT NOT NULL DEFAULT 'completed',
          reference TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await seedStudentTaskTemplates();
    })().catch(error => {
      schemaReady = null;
      throw error;
    });
  }

  await schemaReady;
}

function toStudentTaskTemplate(row: {
  id: number;
  duration_band: string;
  title: string;
  description: string;
  category: string;
  href: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}): StudentTaskTemplate {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    href: row.href,
    sortOrder: row.sort_order,
    durationBand: row.duration_band === 'under_3_months' ? 'under_3_months' : 'over_3_months',
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function seedStudentTaskTemplates() {
  const existing = await pool.query(`SELECT COUNT(*)::int AS count FROM student_task_templates`);
  if (Number(existing.rows[0]?.count ?? 0) > 0) {
    return;
  }

  for (const band of Object.keys(defaultStudentTaskTemplates) as StudentTaskDurationBand[]) {
    for (const [index, task] of defaultStudentTaskTemplates[band].entries()) {
      await pool.query(
        `INSERT INTO student_task_templates (
          duration_band, title, description, category, href, sort_order, is_active, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW(), NOW())`,
        [band, task.title, task.description, task.category, task.href, index]
      );
    }
  }
}

function toPropertyListing(row: {
  id: number;
  title: string;
  location: string;
  price: string | number;
  type: string;
  status: string;
  details: string;
  image_url: string;
  leads: number;
  trust_score: number;
  created_by_user_id: number | null;
  created_at: string;
  updated_at: string;
}): PropertyListing {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    price: Number(row.price),
    type: row.type,
    status: row.status,
    details: row.details,
    imageUrl: row.image_url,
    leads: row.leads,
    trustScore: row.trust_score,
    createdByUserId: row.created_by_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPropertyListings(options?: {
  createdByUserId?: number;
  includePending?: boolean;
}): Promise<PropertyListing[]> {
  await ensurePlatformTables();

  const conditions: string[] = [];
  const values: Array<number | string | boolean> = [];

  if (options?.createdByUserId) {
    values.push(options.createdByUserId);
    conditions.push(`created_by_user_id = $${values.length}`);
  }

  if (!options?.includePending) {
    conditions.push(`status = 'Verified'`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await pool.query(
    `SELECT id, title, location, price, type, status, details, image_url, leads, trust_score, created_by_user_id, created_at, updated_at
     FROM property_listings
     ${whereClause}
     ORDER BY updated_at DESC, id DESC`
  );

  return result.rows.map(toPropertyListing);
}

export async function createPropertyListing(data: {
  title: string;
  location: string;
  price: number;
  type: string;
  status?: string;
  details: string;
  imageUrl: string;
  createdByUserId?: number | null;
}): Promise<PropertyListing> {
  await ensurePlatformTables();

  const result = await pool.query(
    `INSERT INTO property_listings
     (title, location, price, type, status, details, image_url, leads, trust_score, created_by_user_id, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 70, $8, NOW(), NOW())
     RETURNING id, title, location, price, type, status, details, image_url, leads, trust_score, created_by_user_id, created_at, updated_at`,
    [
      data.title.trim(),
      data.location.trim(),
      data.price,
      data.type.trim(),
      data.status?.trim() || 'Pending',
      data.details.trim(),
      data.imageUrl.trim(),
      data.createdByUserId ?? null,
    ]
  );

  return toPropertyListing(result.rows[0]);
}

export async function updatePropertyListing(
  listingId: number,
  data: {
    title: string;
    location: string;
    price: number;
    type: string;
    status: string;
    details: string;
    imageUrl: string;
  }
): Promise<PropertyListing | undefined> {
  await ensurePlatformTables();

  const result = await pool.query(
    `UPDATE property_listings
     SET title = $2,
         location = $3,
         price = $4,
         type = $5,
         status = $6,
         details = $7,
         image_url = $8,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, location, price, type, status, details, image_url, leads, trust_score, created_by_user_id, created_at, updated_at`,
    [
      listingId,
      data.title.trim(),
      data.location.trim(),
      data.price,
      data.type.trim(),
      data.status.trim(),
      data.details.trim(),
      data.imageUrl.trim(),
    ]
  );

  const row = result.rows[0];
  return row ? toPropertyListing(row) : undefined;
}

export async function deletePropertyListing(listingId: number): Promise<boolean> {
  await ensurePlatformTables();

  const result = await pool.query('DELETE FROM property_listings WHERE id = $1', [listingId]);
  return (result.rowCount ?? 0) > 0;
}

function toStudentDashboardTask(row: {
  id: number;
  user_id: number;
  template_id: number | null;
  title: string;
  description: string;
  done: boolean;
  category: string;
  href: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}): StudentDashboardTask {
  return {
    id: row.id,
    userId: row.user_id,
    templateId: row.template_id,
    title: row.title,
    desc: row.description,
    done: row.done,
    category: row.category,
    href: row.href,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildStudentDashboardGuidance(
  user: SafeUser,
  tasks: StudentDashboardTask[],
  programDurationBand: StudentProgramDurationBand | null
): string {
  const nextPendingTask = tasks.find(task => !task.done);
  const university = user.university || 'your university';
  const origin = user.countryOfOrigin || 'your home country';

  if (programDurationBand === 'already_in_latvia') {
    return `You are already in Latvia, ${user.firstName}. Use EBENESAID to explore housing, jobs, documents, community, transport, and support services that are available on the platform right now.`;
  }

  if (!nextPendingTask) {
    if (!tasks.length) {
      return `Your admin has not published a default checklist for ${university} yet. Once your stay period is configured, your assigned relocation tasks will appear here automatically.`;
    }

    return `You have completed your current relocation checklist for ${university}. Keep your documents updated, monitor messages, and use the platform modules to stay ready for each next step.`;
  }

  return `Your next priority is "${nextPendingTask.title}" for ${university}. Since you are relocating from ${origin}, focus on one completed admin step at a time and use the linked module to keep your move organized.`;
}

async function getStudentTaskTemplatesByBand(
  programDurationBand: StudentTaskDurationBand,
  options?: { includeInactive?: boolean }
): Promise<StudentTaskTemplate[]> {
  await ensurePlatformTables();

  const values: Array<string | boolean> = [programDurationBand];
  const conditions = ['duration_band = $1'];

  if (!options?.includeInactive) {
    values.push(true);
    conditions.push(`is_active = $${values.length}`);
  }

  const result = await pool.query(
    `SELECT id, duration_band, title, description, category, href, sort_order, is_active, created_at, updated_at
     FROM student_task_templates
     WHERE ${conditions.join(' AND ')}
     ORDER BY sort_order ASC, id ASC`,
    values
  );

  return result.rows.map(toStudentTaskTemplate);
}

async function assignStudentTaskTemplates(userId: number, programDurationBand: StudentTaskDurationBand) {
  await pool.query(`DELETE FROM student_dashboard_tasks WHERE user_id = $1`, [userId]);

  const tasks = await getStudentTaskTemplatesByBand(programDurationBand);
  for (const [index, task] of tasks.entries()) {
    await pool.query(
      `INSERT INTO student_dashboard_tasks (user_id, template_id, title, description, done, category, href, sort_order, created_at, updated_at)
       VALUES ($1, $2, $3, $4, FALSE, $5, $6, $7, NOW(), NOW())`,
      [userId, task.id, task.title, task.description, task.category, task.href, task.sortOrder ?? index]
    );
  }
}

async function syncStudentDashboardTasksForUser(userId: number, programDurationBand: StudentTaskDurationBand) {
  const [templateResult, currentTaskResult] = await Promise.all([
    pool.query(
      `SELECT id, duration_band, title, description, category, href, sort_order, is_active, created_at, updated_at
       FROM student_task_templates
       WHERE duration_band = $1 AND is_active = TRUE
       ORDER BY sort_order ASC, id ASC`,
      [programDurationBand]
    ),
    pool.query(
      `SELECT id, user_id, template_id, title, description, done, category, href, sort_order, created_at, updated_at
       FROM student_dashboard_tasks
       WHERE user_id = $1
       ORDER BY sort_order ASC, id ASC`,
      [userId]
    ),
  ]);

  const templates = templateResult.rows.map(toStudentTaskTemplate);
  const currentTasks = currentTaskResult.rows.map(toStudentDashboardTask);
  const currentByTemplateId = new Map<number, StudentDashboardTask>();
  const currentByTitle = new Map<string, StudentDashboardTask>();

  for (const task of currentTasks) {
    if (task.templateId) {
      currentByTemplateId.set(task.templateId, task);
    }
    currentByTitle.set(task.title.toLowerCase(), task);
  }

  const activeTemplateIds = new Set<number>();

  for (const [index, template] of templates.entries()) {
    activeTemplateIds.add(template.id);
    const existingTask =
      currentByTemplateId.get(template.id) ?? currentByTitle.get(template.title.toLowerCase());

    if (existingTask) {
      await pool.query(
        `UPDATE student_dashboard_tasks
         SET template_id = $2,
             title = $3,
             description = $4,
             category = $5,
             href = $6,
             sort_order = $7,
             updated_at = NOW()
         WHERE id = $1`,
        [
          existingTask.id,
          template.id,
          template.title,
          template.description,
          template.category,
          template.href,
          template.sortOrder ?? index,
        ]
      );
      continue;
    }

    await pool.query(
      `INSERT INTO student_dashboard_tasks (user_id, template_id, title, description, done, category, href, sort_order, created_at, updated_at)
       VALUES ($1, $2, $3, $4, FALSE, $5, $6, $7, NOW(), NOW())`,
      [userId, template.id, template.title, template.description, template.category, template.href, template.sortOrder ?? index]
    );
  }

  for (const task of currentTasks) {
    const taskTemplateId = task.templateId;
    if (taskTemplateId && !activeTemplateIds.has(taskTemplateId)) {
      await pool.query(`DELETE FROM student_dashboard_tasks WHERE id = $1`, [task.id]);
      continue;
    }

    if (!taskTemplateId) {
      const matchedTemplate = templates.find(template => template.title.toLowerCase() === task.title.toLowerCase());
      if (!matchedTemplate) {
        await pool.query(`DELETE FROM student_dashboard_tasks WHERE id = $1`, [task.id]);
      }
    }
  }
}

export async function syncStudentDashboardTasksForBand(programDurationBand: StudentTaskDurationBand) {
  await ensurePlatformTables();

  const users = await pool.query(
    `SELECT user_id
     FROM student_onboarding_profiles
     WHERE onboarding_completed = TRUE AND program_duration_band = $1`,
    [programDurationBand]
  );

  for (const row of users.rows) {
    await syncStudentDashboardTasksForUser(Number(row.user_id), programDurationBand);
  }
}

export async function getStudentDashboardData(user: SafeUser): Promise<StudentDashboardData> {
  await ensurePlatformTables();
  const onboarding = await getStudentOnboardingProfile(user.id);

  if (onboarding.programDurationBand === 'already_in_latvia') {
    await pool.query(`DELETE FROM student_dashboard_tasks WHERE user_id = $1`, [user.id]);
    return {
      tasks: [],
      guidance: buildStudentDashboardGuidance(user, [], onboarding.programDurationBand),
    };
  }

  let result = await pool.query(
    `SELECT id, user_id, template_id, title, description, done, category, href, sort_order, created_at, updated_at
     FROM student_dashboard_tasks
     WHERE user_id = $1
     ORDER BY sort_order ASC, id ASC`,
    [user.id]
  );

  let tasks = result.rows.map(toStudentDashboardTask);

  if (!tasks.length) {
    if (onboarding.onboardingCompleted && onboarding.programDurationBand) {
      await syncStudentDashboardTasksForUser(user.id, onboarding.programDurationBand);
      result = await pool.query(
        `SELECT id, user_id, template_id, title, description, done, category, href, sort_order, created_at, updated_at
         FROM student_dashboard_tasks
         WHERE user_id = $1
         ORDER BY sort_order ASC, id ASC`,
        [user.id]
      );
      tasks = result.rows.map(toStudentDashboardTask);
    }
  }

  return {
    tasks,
    guidance: buildStudentDashboardGuidance(user, tasks, onboarding.programDurationBand),
  };
}

export async function getStudentOnboardingProfile(userId: number): Promise<StudentOnboardingProfile> {
  await ensurePlatformTables();

  const result = await pool.query(
    `SELECT program_duration_band, onboarding_completed
     FROM student_onboarding_profiles
     WHERE user_id = $1`,
    [userId]
  );

  const row = result.rows[0];
  const band = row?.program_duration_band;

  return {
    programDurationBand:
      band === 'under_3_months' || band === 'over_3_months' || band === 'already_in_latvia' ? band : null,
    onboardingCompleted: Boolean(row?.onboarding_completed ?? false),
  };
}

export async function saveStudentOnboardingSelection(
  userId: number,
  programDurationBand: StudentProgramDurationBand
): Promise<StudentDashboardData> {
  await ensurePlatformTables();

  await pool.query(
    `INSERT INTO student_onboarding_profiles (user_id, program_duration_band, onboarding_completed, selected_at, updated_at)
     VALUES ($1, $2, TRUE, NOW(), NOW())
     ON CONFLICT (user_id)
     DO UPDATE SET program_duration_band = EXCLUDED.program_duration_band,
                   onboarding_completed = TRUE,
                   selected_at = NOW(),
                   updated_at = NOW()`,
    [userId, programDurationBand]
  );

  if (programDurationBand === 'already_in_latvia') {
    await pool.query(`DELETE FROM student_dashboard_tasks WHERE user_id = $1`, [userId]);
  } else {
    await assignStudentTaskTemplates(userId, programDurationBand);
  }

  const dbUser = await getUserById(userId);
  if (!dbUser) {
    throw new Error('User not found while saving onboarding selection.');
  }

  return getStudentDashboardData(toSafeUser(dbUser));
}

export async function listStudentTaskTemplates(): Promise<Record<StudentTaskDurationBand, StudentTaskTemplate[]>> {
  await ensurePlatformTables();

  const result = await pool.query(
    `SELECT id, duration_band, title, description, category, href, sort_order, is_active, created_at, updated_at
     FROM student_task_templates
     ORDER BY duration_band ASC, sort_order ASC, id ASC`
  );

  return result.rows.reduce<Record<StudentTaskDurationBand, StudentTaskTemplate[]>>(
    (accumulator, row) => {
      const template = toStudentTaskTemplate(row);
      accumulator[template.durationBand].push(template);
      return accumulator;
    },
    { under_3_months: [], over_3_months: [] }
  );
}

export async function createStudentTaskTemplate(data: {
  durationBand: StudentTaskDurationBand;
  title: string;
  description: string;
  category: string;
  href: string;
  sortOrder: number;
  isActive?: boolean;
}): Promise<StudentTaskTemplate> {
  await ensurePlatformTables();

  const result = await pool.query(
    `INSERT INTO student_task_templates (
      duration_band, title, description, category, href, sort_order, is_active, created_at, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    RETURNING id, duration_band, title, description, category, href, sort_order, is_active, created_at, updated_at`,
    [
      data.durationBand,
      data.title.trim(),
      data.description.trim(),
      data.category.trim(),
      data.href.trim(),
      data.sortOrder,
      data.isActive !== false,
    ]
  );

  return toStudentTaskTemplate(result.rows[0]);
}

export async function updateStudentTaskTemplate(
  templateId: number,
  data: {
    durationBand: StudentTaskDurationBand;
    title: string;
    description: string;
    category: string;
    href: string;
    sortOrder: number;
    isActive: boolean;
  }
): Promise<StudentTaskTemplate | undefined> {
  await ensurePlatformTables();

  const result = await pool.query(
    `UPDATE student_task_templates
     SET duration_band = $2,
         title = $3,
         description = $4,
         category = $5,
         href = $6,
         sort_order = $7,
         is_active = $8,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, duration_band, title, description, category, href, sort_order, is_active, created_at, updated_at`,
    [
      templateId,
      data.durationBand,
      data.title.trim(),
      data.description.trim(),
      data.category.trim(),
      data.href.trim(),
      data.sortOrder,
      data.isActive,
    ]
  );

  const row = result.rows[0];
  return row ? toStudentTaskTemplate(row) : undefined;
}

export async function deleteStudentTaskTemplate(templateId: number): Promise<boolean> {
  await ensurePlatformTables();
  const result = await pool.query(`DELETE FROM student_task_templates WHERE id = $1`, [templateId]);
  return (result.rowCount ?? 0) > 0;
}

export async function updateStudentDashboardTask(
  userId: number,
  taskId: number,
  done: boolean
): Promise<StudentDashboardTask | undefined> {
  await ensurePlatformTables();

  const result = await pool.query(
    `UPDATE student_dashboard_tasks
     SET done = $3, updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING id, user_id, template_id, title, description, done, category, href, sort_order, created_at, updated_at`,
    [taskId, userId, done]
  );

  const row = result.rows[0];
  return row ? toStudentDashboardTask(row) : undefined;
}

export async function completePlatformPayment(
  userId: number,
  provider: 'stripe' | 'flutterwave'
): Promise<{ reference: string; amount: number }> {
  await ensurePlatformTables();

  const pricing = await getPlatformPricingSettings();
  const reference = `EB-${provider.toUpperCase()}-${Date.now()}`;

  await pool.query(
    `INSERT INTO student_platform_payments (user_id, provider, amount_eur, status, reference, created_at, completed_at)
     VALUES ($1, $2, $3, 'completed', $4, NOW(), NOW())`,
    [userId, provider, pricing.studentFeeEur, reference]
  );

  await pool.query(
    `UPDATE users
     SET has_paid = TRUE,
         updated_at = NOW()
     WHERE id = $1`,
    [userId]
  );

  return { reference, amount: pricing.studentFeeEur };
}

// ─── User CRUD (PostgreSQL) ────────────────────────────────────────────────────

export async function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  university?: string;
  countryOfOrigin?: string;
  userType?: string;
  isActive?: boolean;
  partnerProfile?: PartnerProfileInput;
}): Promise<SafeUser> {
  await ensureCoreTables();

  const { hash, salt } = hashPassword(data.password);
  const now = new Date();
  const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const userType = normalizeUserType(data.userType);
  const isActive = data.isActive ?? true;

  const result = await pool.query(
    `INSERT INTO users (email, password_hash, password_salt, first_name, last_name, phone, university, country_of_origin, user_type, is_active, trial_start_date, trial_end_date, has_paid, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, false, NOW(), NOW())
     RETURNING *`,
    [
      data.email.toLowerCase().trim(),
      hash,
      salt,
      data.firstName.trim(),
      data.lastName.trim(),
      data.phone?.trim() || '',
      data.university?.trim() || '',
      data.countryOfOrigin?.trim() || '',
      userType,
      isActive,
      now.toISOString(),
      trialEnd.toISOString(),
    ]
  );
  const user = result.rows[0] as DbUser;

  if (user.is_active !== isActive) {
    await pool.query(
      `UPDATE users
       SET is_active = $2,
           updated_at = NOW()
       WHERE id = $1`,
      [user.id, isActive]
    );
    user.is_active = isActive;
  }

  if (isPartnerRole(userType)) {
    const businessName = data.partnerProfile?.businessName?.trim() || data.university?.trim() || `${data.firstName.trim()} ${data.lastName.trim()}`.trim();
    const contactPerson = data.partnerProfile?.contactPerson?.trim() || `${data.firstName.trim()} ${data.lastName.trim()}`.trim();
    const commissionPercent =
      typeof data.partnerProfile?.commissionPercent === 'number' && Number.isFinite(data.partnerProfile.commissionPercent)
        ? Math.max(0, Math.min(data.partnerProfile.commissionPercent, 100))
        : null;

    await pool.query(
      `INSERT INTO partner_profiles (user_id, partner_type, business_name, contact_person, commission_percent, metadata, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, NOW(), NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET
         partner_type = EXCLUDED.partner_type,
         business_name = EXCLUDED.business_name,
         contact_person = EXCLUDED.contact_person,
         commission_percent = EXCLUDED.commission_percent,
         metadata = EXCLUDED.metadata,
         updated_at = NOW()`,
      [
        user.id,
        data.partnerProfile?.partnerType?.trim() || userType,
        businessName,
        contactPerson,
        commissionPercent,
        JSON.stringify(data.partnerProfile?.metadata ?? {}),
      ]
    );
  }

  return toSafeUser(user);
}

export async function getUserByEmail(email: string): Promise<DbUser | undefined> {
  await ensureCoreTables();
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
  return result.rows[0];
}

export async function getUserById(id: number): Promise<DbUser | undefined> {
  await ensureCoreTables();
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

export async function updateLastLogin(userId: number): Promise<void> {
  await ensureCoreTables();
  await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [userId]);
}

// ─── Session CRUD (PostgreSQL) ────────────────────────────────────────────────

export async function createSession(userId: number): Promise<{ token: string; expiresAt: string }> {
  await ensureCoreTables();
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
  await pool.query(
    'INSERT INTO sessions (user_id, token, expires_at, created_at) VALUES ($1, $2, $3, NOW())',
    [userId, token, expiresAt]
  );
  return { token, expiresAt };
}

export async function getSessionByToken(token: string): Promise<{ user_id: number; expires_at: string } | undefined> {
  await ensureCoreTables();
  // Clean expired sessions
  await pool.query("DELETE FROM sessions WHERE expires_at::timestamptz < NOW()");
  const result = await pool.query(
    "SELECT user_id, expires_at FROM sessions WHERE token = $1 AND expires_at::timestamptz > NOW()",
    [token]
  );
  return result.rows[0];
}

export async function listUsersForAdmin(): Promise<AdminDirectoryUser[]> {
  await ensureCoreTables();
  const result = await pool.query(
    `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.university, u.country_of_origin, u.user_type, u.is_active,
            u.trial_start_date, u.trial_end_date, u.has_paid, u.created_at, u.updated_at, u.last_login_at,
            pp.partner_type, pp.business_name, pp.contact_person, pp.commission_percent, pp.metadata
     FROM users u
     LEFT JOIN partner_profiles pp ON pp.user_id = u.id
     ORDER BY u.created_at DESC, u.id DESC`
  );

  return result.rows.map((row) => ({
    ...toSafeUser(row),
    updatedAt: row.updated_at,
    partnerProfile: row.partner_type
      ? {
          partnerType: row.partner_type,
          businessName: row.business_name,
          contactPerson: row.contact_person,
          commissionPercent: row.commission_percent === null ? null : Number(row.commission_percent),
          metadata: row.metadata ?? {},
        }
      : null,
  }));
}

export async function setUserActiveState(userId: number, isActive: boolean): Promise<SafeUser | undefined> {
  await ensureCoreTables();
  const result = await pool.query(
    `UPDATE users
     SET is_active = $2,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, email, first_name, last_name, phone, university, country_of_origin, user_type, is_active, trial_start_date, trial_end_date, has_paid, created_at, updated_at, last_login_at`,
    [userId, isActive]
  );

  const row = result.rows[0];
  return row ? toSafeUser(row) : undefined;
}

export async function deleteUserById(userId: number): Promise<SafeUser | undefined> {
  await ensureCoreTables();
  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING *`,
    [userId]
  );

  const row = result.rows[0];
  return row ? toSafeUser(row) : undefined;
}

export async function getPartnerProfile(userId: number): Promise<PartnerProfileRecord | null> {
  await ensureCoreTables();
  const result = await pool.query(
    `SELECT partner_type, business_name, contact_person, commission_percent, metadata
     FROM partner_profiles
     WHERE user_id = $1`,
    [userId]
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return {
    partnerType: row.partner_type,
    businessName: row.business_name,
    contactPerson: row.contact_person,
    commissionPercent: row.commission_percent === null ? null : Number(row.commission_percent),
    metadata: row.metadata ?? {},
  };
}

export async function getPartnerFinanceSummary(userId: number): Promise<PartnerFinanceSummary> {
  await ensureCoreTables();
  const result = await pool.query(
    `SELECT
       COUNT(*) AS transaction_count,
       COALESCE(SUM(gross_amount_eur), 0) AS gross_amount_eur,
       COALESCE(SUM(deduction_amount_eur), 0) AS deduction_amount_eur,
       COALESCE(SUM(net_amount_eur), 0) AS net_amount_eur,
       COUNT(*) FILTER (WHERE status <> 'completed') AS pending_count
     FROM partner_transactions
     WHERE partner_user_id = $1`,
    [userId]
  );

  const row = result.rows[0];
  return {
    transactionCount: Number(row?.transaction_count ?? 0),
    grossAmountEur: Number(row?.gross_amount_eur ?? 0),
    deductionAmountEur: Number(row?.deduction_amount_eur ?? 0),
    netAmountEur: Number(row?.net_amount_eur ?? 0),
    pendingCount: Number(row?.pending_count ?? 0),
  };
}

export async function recordPartnerTransaction(data: {
  partnerUserId: number;
  grossAmountEur: number;
  provider: string;
  reference: string;
  status?: string;
}): Promise<void> {
  await ensureCoreTables();

  const grossAmount = Number.isFinite(data.grossAmountEur) && data.grossAmountEur > 0 ? data.grossAmountEur : 0;
  if (grossAmount <= 0) {
    return;
  }

  const [pricing, profile] = await Promise.all([
    getPlatformPricingSettings(),
    getPartnerProfile(data.partnerUserId),
  ]);
  const deductionPercent = profile?.commissionPercent ?? pricing.partnerDeductionPercent;
  const deductionAmount = Number(((grossAmount * deductionPercent) / 100).toFixed(2));
  const netAmount = Number((grossAmount - deductionAmount).toFixed(2));

  await pool.query(
    `INSERT INTO partner_transactions (
       partner_user_id, provider, gross_amount_eur, deduction_percent, deduction_amount_eur,
       net_amount_eur, status, reference, created_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
     ON CONFLICT (reference) DO NOTHING`,
    [
      data.partnerUserId,
      data.provider,
      grossAmount,
      deductionPercent,
      deductionAmount,
      netAmount,
      data.status ?? 'completed',
      data.reference,
    ]
  );
}

export async function updateUserPassword(userId: number, password: string): Promise<void> {
  await ensureCoreTables();
  const { hash, salt } = hashPassword(password);
  await pool.query(
    `UPDATE users
     SET password_hash = $2,
         password_salt = $3,
         updated_at = NOW()
     WHERE id = $1`,
    [userId, hash, salt]
  );
}

export async function deleteSession(token: string): Promise<void> {
  await ensureCoreTables();
  await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
}

export async function deleteAllUserSessions(userId: number): Promise<void> {
  await ensureCoreTables();
  await pool.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
}

export async function createPasswordResetToken(userId: number): Promise<PasswordResetTokenIssuance> {
  await ensureCoreTables();

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashOpaqueToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  await pool.query(
    `DELETE FROM password_reset_tokens
     WHERE user_id = $1 OR used_at IS NOT NULL OR expires_at <= NOW()`,
    [userId]
  );

  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, created_at)
     VALUES ($1, $2, $3, NOW())`,
    [userId, tokenHash, expiresAt]
  );

  return { token, expiresAt };
}

export async function consumePasswordResetToken(token: string): Promise<DbUser | undefined> {
  await ensureCoreTables();

  const normalized = String(token ?? '').trim();
  if (!normalized) {
    return undefined;
  }

  const tokenHash = hashOpaqueToken(normalized);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `SELECT pr.id AS reset_id, pr.user_id, u.*
       FROM password_reset_tokens pr
       JOIN users u ON u.id = pr.user_id
       WHERE pr.token_hash = $1
         AND pr.used_at IS NULL
         AND pr.expires_at > NOW()
       LIMIT 1
       FOR UPDATE`,
      [tokenHash]
    );

    const row = result.rows[0];
    if (!row) {
      await client.query('ROLLBACK');
      return undefined;
    }

    await client.query(
      `UPDATE password_reset_tokens
       SET used_at = NOW()
       WHERE id = $1`,
      [row.reset_id]
    );

    await client.query(
      `DELETE FROM password_reset_tokens
       WHERE user_id = $1 AND id <> $2`,
      [row.user_id, row.reset_id]
    );

    await client.query('COMMIT');
    delete row.reset_id;
    delete row.user_id;
    return row as DbUser;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getPlatformPricingSettings(): Promise<PlatformPricingSettings> {
  await ensureCoreTables();

  const result = await pool.query(
    `SELECT key, value FROM platform_settings
     WHERE key IN ('student_fee_eur', 'partner_deduction_percent')`
  );

  const values = new Map(result.rows.map(row => [row.key, row.value]));
  return {
    studentFeeEur: Number(values.get('student_fee_eur') ?? PLATFORM_FEE_EUR),
    partnerDeductionPercent: Number(values.get('partner_deduction_percent') ?? DEFAULT_PARTNER_DEDUCTION_PERCENT),
  };
}

export async function updatePlatformPricingSettings(data: PlatformPricingSettings): Promise<PlatformPricingSettings> {
  await ensureCoreTables();

  const studentFee = Number.isFinite(data.studentFeeEur) && data.studentFeeEur >= 0 ? data.studentFeeEur : PLATFORM_FEE_EUR;
  const partnerDeduction =
    Number.isFinite(data.partnerDeductionPercent) && data.partnerDeductionPercent >= 0
      ? Math.min(data.partnerDeductionPercent, 100)
      : DEFAULT_PARTNER_DEDUCTION_PERCENT;

  await pool.query(
    `INSERT INTO platform_settings (key, value, updated_at)
     VALUES ('student_fee_eur', $1, NOW()), ('partner_deduction_percent', $2, NOW())
     ON CONFLICT (key)
     DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [String(studentFee), String(partnerDeduction)]
  );

  return {
    studentFeeEur: studentFee,
    partnerDeductionPercent: partnerDeduction,
  };
}

export async function getAdminFinanceLedger(limit = 25): Promise<AdminFinanceLedger> {
  await ensurePlatformTables();

  const normalizedLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 25;

  const [studentPaymentsResult, partnerTransactionsResult, totalsResult] = await Promise.all([
    pool.query(
      `SELECT p.id,
              CONCAT(u.first_name, ' ', u.last_name) AS student_name,
              u.email AS student_email,
              p.provider,
              p.amount_eur,
              p.status,
              p.reference,
              p.created_at,
              p.completed_at
       FROM student_platform_payments p
       JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC
       LIMIT $1`,
      [normalizedLimit]
    ),
    pool.query(
      `SELECT t.id,
              CONCAT(u.first_name, ' ', u.last_name) AS partner_name,
              u.email AS partner_email,
              COALESCE(pp.partner_type, u.user_type) AS partner_type,
              COALESCE(NULLIF(pp.business_name, ''), u.university, 'Partner account') AS business_name,
              t.provider,
              t.gross_amount_eur,
              t.deduction_percent,
              t.deduction_amount_eur,
              t.net_amount_eur,
              t.status,
              t.reference,
              t.created_at
       FROM partner_transactions t
       JOIN users u ON u.id = t.partner_user_id
       LEFT JOIN partner_profiles pp ON pp.user_id = u.id
       ORDER BY t.created_at DESC
       LIMIT $1`,
      [normalizedLimit]
    ),
    pool.query(
      `SELECT
          COALESCE((SELECT SUM(amount_eur) FROM student_platform_payments WHERE status = 'completed'), 0) AS student_revenue_eur,
          COALESCE((SELECT COUNT(*) FROM student_platform_payments), 0) AS student_payment_count,
          COALESCE((SELECT SUM(gross_amount_eur) FROM partner_transactions), 0) AS partner_gross_eur,
          COALESCE((SELECT SUM(deduction_amount_eur) FROM partner_transactions), 0) AS partner_deductions_eur,
          COALESCE((SELECT SUM(net_amount_eur) FROM partner_transactions), 0) AS partner_net_eur,
          COALESCE((SELECT COUNT(*) FROM partner_transactions), 0) AS partner_transaction_count`
    ),
  ]);

  const totals = totalsResult.rows[0] ?? {};

  return {
    studentPayments: studentPaymentsResult.rows.map(row => ({
      id: Number(row.id),
      studentName: row.student_name,
      studentEmail: row.student_email,
      provider: row.provider,
      amountEur: Number(row.amount_eur),
      status: row.status,
      reference: row.reference,
      createdAt: row.created_at,
      completedAt: row.completed_at,
    })),
    partnerTransactions: partnerTransactionsResult.rows.map(row => ({
      id: Number(row.id),
      partnerName: row.partner_name,
      partnerEmail: row.partner_email,
      partnerType: row.partner_type,
      businessName: row.business_name,
      provider: row.provider,
      grossAmountEur: Number(row.gross_amount_eur),
      deductionPercent: Number(row.deduction_percent),
      deductionAmountEur: Number(row.deduction_amount_eur),
      netAmountEur: Number(row.net_amount_eur),
      status: row.status,
      reference: row.reference,
      createdAt: row.created_at,
    })),
    totals: {
      studentRevenueEur: Number(totals.student_revenue_eur ?? 0),
      partnerGrossEur: Number(totals.partner_gross_eur ?? 0),
      partnerDeductionsEur: Number(totals.partner_deductions_eur ?? 0),
      partnerNetEur: Number(totals.partner_net_eur ?? 0),
      studentPaymentCount: Number(totals.student_payment_count ?? 0),
      partnerTransactionCount: Number(totals.partner_transaction_count ?? 0),
    },
  };
}

export async function getPublicHomePageContent(locale: SupportedLocale = defaultLocale): Promise<HomePageContent> {
  await ensureCoreTables();

  const normalizedLocale = normalizeLocale(locale);
  const result = await pool.query(
    `SELECT content
     FROM public_site_content
     WHERE page_key = 'home' AND locale = $1`,
    [normalizedLocale]
  );

  const row = result.rows[0];
  if (!row) {
    return getDefaultHomePageContent(normalizedLocale);
  }

  return normalizeHomePageContent(row.content, normalizedLocale);
}

export async function updatePublicHomePageContent(content: HomePageContent, locale: SupportedLocale = defaultLocale): Promise<HomePageContent> {
  await ensureCoreTables();

  const normalizedLocale = normalizeLocale(locale);
  const normalizedContent = normalizeHomePageContent(content, normalizedLocale);

  await pool.query(
    `INSERT INTO public_site_content (page_key, locale, content, updated_at)
     VALUES ('home', $1, $2::jsonb, NOW())
     ON CONFLICT (page_key, locale)
     DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()`,
    [normalizedLocale, JSON.stringify(normalizedContent)]
  );

  return normalizedContent;
}

export async function getPublicMarketingPageContent<TPage extends MarketingPageKey>(
  page: TPage,
  locale: SupportedLocale = defaultLocale
): Promise<MarketingPageContent> {
  await ensureCoreTables();

  const normalizedLocale = normalizeLocale(locale);
  const result = await pool.query(
    `SELECT content
     FROM public_site_content
     WHERE page_key = $1 AND locale = $2`,
    [page, normalizedLocale]
  );

  const row = result.rows[0];
  if (!row) {
    return getDefaultMarketingPageContent(page, normalizedLocale);
  }

  return normalizeMarketingPageContent(page, row.content, normalizedLocale);
}

export async function updatePublicMarketingPageContent<TPage extends MarketingPageKey>(
  page: TPage,
  content: MarketingPageContent,
  locale: SupportedLocale = defaultLocale
): Promise<MarketingPageContent> {
  await ensureCoreTables();

  const normalizedLocale = normalizeLocale(locale);
  const normalizedContent = normalizeMarketingPageContent(page, content, normalizedLocale);

  await pool.query(
    `INSERT INTO public_site_content (page_key, locale, content, updated_at)
     VALUES ($1, $2, $3::jsonb, NOW())
     ON CONFLICT (page_key, locale)
     DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()`,
    [page, normalizedLocale, JSON.stringify(normalizedContent)]
  );

  return normalizedContent;
}

export async function getPlatformIntelligenceSnapshot(): Promise<PlatformIntelligenceSnapshot> {
  await ensureCoreTables();

  async function safeCount(query: string) {
    try {
      const result = await pool.query(query);
      return Number(result.rows[0]?.count ?? 0);
    } catch {
      return 0;
    }
  }

  const [students, users, verifiedListings, openJobs, communityCircles, foodItems, todayListings, todayJobs, todayFoodItems] = await Promise.all([
    safeCount(`SELECT COUNT(*) FROM users WHERE user_type = 'student'`),
    safeCount(`SELECT COUNT(*) FROM users`),
    safeCount(`SELECT COUNT(*) FROM property_listings WHERE status = 'Verified'`),
    safeCount(`SELECT COUNT(*) FROM job_listings`),
    safeCount(`SELECT COUNT(*) FROM community_circles WHERE status = 'approved'`),
    safeCount(`SELECT COUNT(*) FROM food_menu_items`),
    safeCount(`SELECT COUNT(*) FROM property_listings WHERE DATE(created_at) = CURRENT_DATE`),
    safeCount(`SELECT COUNT(*) FROM job_listings WHERE DATE(created_at) = CURRENT_DATE`),
    safeCount(`SELECT COUNT(*) FROM food_menu_items WHERE DATE(created_at) = CURRENT_DATE`),
  ]);

  return {
    students,
    users,
    verifiedListings,
    openJobs,
    communityCircles,
    foodItems,
    todayListings,
    todayJobs,
    todayFoodItems,
  };
}
