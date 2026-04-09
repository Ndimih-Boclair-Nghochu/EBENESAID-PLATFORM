/**
 * SQLite Database Layer for EBENESAID Platform
 * Uses Node.js 22 built-in node:sqlite module
 */


import { Pool } from 'pg';
import crypto from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ─── Password Hashing ──────────────────────────────────────────────────────────

// ─── Password Hashing ──────────────────────────────────────────────────────────

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(testHash));
}

// ─── Session Token ──────────────────────────────────────────────────────────────

export function generateSessionToken(): string {
  return crypto.randomBytes(48).toString('hex');
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
  isActive: boolean;
  trialStartDate: string;
  trialEndDate: string;
  hasPaid: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface StudentDashboardTask {
  id: number;
  userId: number;
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
    isActive: dbUser.is_active,
    trialStartDate: dbUser.trial_start_date,
    trialEndDate: dbUser.trial_end_date,
    hasPaid: dbUser.has_paid,
    createdAt: dbUser.created_at,
    lastLoginAt: dbUser.last_login_at,
  };
}

type DashboardSeedTask = {
  title: string;
  desc: string;
  category: string;
  href: string;
  sortOrder: number;
};

const defaultDashboardTasks: DashboardSeedTask[] = [
  {
    title: 'Finalize Housing',
    desc: 'Confirm verified accommodation before arrival.',
    category: 'Housing',
    href: '/accommodation',
    sortOrder: 1,
  },
  {
    title: 'Plan Airport Transfer',
    desc: 'Book airport-to-city transport in advance.',
    category: 'Logistics',
    href: '/arrival',
    sortOrder: 2,
  },
  {
    title: 'University Enrollment',
    desc: 'Prepare documents for orientation day.',
    category: 'Academic',
    href: '/docs',
    sortOrder: 3,
  },
  {
    title: 'Residence Permit',
    desc: 'Prepare your permit and local registration paperwork.',
    category: 'Legal',
    href: '/docs',
    sortOrder: 4,
  },
  {
    title: 'Get a Local SIM Card',
    desc: 'Set up your Latvian phone number after arrival.',
    category: 'Setup',
    href: '/settings',
    sortOrder: 5,
  },
  {
    title: 'Open a Bank Account',
    desc: 'Open a local IBAN for rent, salary, and daily payments.',
    category: 'Finance',
    href: '/dashboard',
    sortOrder: 6,
  },
  {
    title: 'Register for E-talons',
    desc: 'Get your public transport card ready for Riga travel.',
    category: 'Logistics',
    href: '/arrival',
    sortOrder: 7,
  },
  {
    title: 'Explore Career Services',
    desc: 'Browse verified part-time roles and student-friendly employers.',
    category: 'Career',
    href: '/jobs',
    sortOrder: 8,
  },
  {
    title: 'Cultural Orientation',
    desc: 'Review local guidance and join the student community.',
    category: 'Culture',
    href: '/community',
    sortOrder: 9,
  },
];

let schemaReady: Promise<void> | null = null;

async function ensurePlatformTables(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_dashboard_tasks (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    })().catch(error => {
      schemaReady = null;
      throw error;
    });
  }

  await schemaReady;
}

type ListingSeed = {
  title: string;
  location: string;
  price: number;
  type: string;
  status: string;
  details: string;
  imageUrl: string;
  leads: number;
  trustScore: number;
};

const defaultPropertyListings: ListingSeed[] = [
  {
    title: 'Premium Riga Center Studio',
    location: 'K. Valdemara iela, Riga',
    price: 380,
    type: 'Studio',
    status: 'Verified',
    details: 'Luxury student studio in a historic building. Fully furnished, 24sqm, five minutes from the University of Latvia with utilities averaging EUR 80 per month.',
    imageUrl: 'https://picsum.photos/seed/apt-verified-1/900/700',
    leads: 12,
    trustScore: 92,
  },
  {
    title: 'International Student Hub',
    location: 'Zunda krastmala, Riga',
    price: 270,
    type: 'Shared Room',
    status: 'Verified',
    details: 'Modern shared apartment near RTU with a private bedroom, all bills included, and a strong student community atmosphere.',
    imageUrl: 'https://picsum.photos/seed/apt-verified-2/900/700',
    leads: 8,
    trustScore: 88,
  },
  {
    title: 'Modern Old Town Apartment',
    location: 'Kalku iela, Riga',
    price: 450,
    type: 'Whole Apartment',
    status: 'Pending',
    details: 'Bright central apartment with updated kitchen, flexible lease options, and quick access to transport, cafes, and student services.',
    imageUrl: 'https://picsum.photos/seed/apt-verified-3/900/700',
    leads: 4,
    trustScore: 74,
  },
];

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

async function seedPropertyListings(): Promise<void> {
  await ensurePlatformTables();

  const existing = await pool.query('SELECT COUNT(*)::int AS count FROM property_listings');
  if ((existing.rows[0]?.count ?? 0) > 0) {
    return;
  }

  for (const listing of defaultPropertyListings) {
    await pool.query(
      `INSERT INTO property_listings
       (title, location, price, type, status, details, image_url, leads, trust_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        listing.title,
        listing.location,
        listing.price,
        listing.type,
        listing.status,
        listing.details,
        listing.imageUrl,
        listing.leads,
        listing.trustScore,
      ]
    );
  }
}

export async function getPropertyListings(options?: {
  createdByUserId?: number;
  includePending?: boolean;
}): Promise<PropertyListing[]> {
  await seedPropertyListings();

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

function buildStudentDashboardGuidance(user: SafeUser, tasks: StudentDashboardTask[]): string {
  const nextPendingTask = tasks.find(task => !task.done);
  const university = user.university || 'your university';
  const origin = user.countryOfOrigin || 'your home country';

  if (!nextPendingTask) {
    return `You have completed your current relocation checklist for ${university}. Keep your documents updated, monitor messages, and use the platform modules to stay ready for each next step.`;
  }

  return `Your next priority is "${nextPendingTask.title}" for ${university}. Since you are relocating from ${origin}, focus on one completed admin step at a time and use the linked module to keep your move organized.`;
}

async function seedStudentDashboardTasks(userId: number): Promise<void> {
  await ensurePlatformTables();

  for (const task of defaultDashboardTasks) {
    await pool.query(
      `INSERT INTO student_dashboard_tasks (user_id, title, description, done, category, href, sort_order)
       VALUES ($1, $2, $3, false, $4, $5, $6)
       ON CONFLICT (user_id, title) DO NOTHING`,
      [userId, task.title, task.desc, task.category, task.href, task.sortOrder]
    );
  }
}

export async function getStudentDashboardData(user: SafeUser): Promise<StudentDashboardData> {
  await seedStudentDashboardTasks(user.id);

  const result = await pool.query(
    `SELECT id, user_id, title, description, done, category, href, sort_order, created_at, updated_at
     FROM student_dashboard_tasks
     WHERE user_id = $1
     ORDER BY sort_order ASC, id ASC`,
    [user.id]
  );

  const tasks = result.rows.map(toStudentDashboardTask);

  return {
    tasks,
    guidance: buildStudentDashboardGuidance(user, tasks),
  };
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
     RETURNING id, user_id, title, description, done, category, href, sort_order, created_at, updated_at`,
    [taskId, userId, done]
  );

  const row = result.rows[0];
  return row ? toStudentDashboardTask(row) : undefined;
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
}): Promise<SafeUser> {
  const { hash, salt } = hashPassword(data.password);
  const now = new Date();
  const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const userType = data.userType || 'student';

  const result = await pool.query(
    `INSERT INTO users (email, password_hash, password_salt, first_name, last_name, phone, university, country_of_origin, user_type, is_active, trial_start_date, trial_end_date, has_paid, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, $10, $11, false, NOW(), NOW())
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
      now.toISOString(),
      trialEnd.toISOString(),
    ]
  );
  return toSafeUser(result.rows[0]);
}

export async function getUserByEmail(email: string): Promise<DbUser | undefined> {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
  return result.rows[0];
}

export async function getUserById(id: number): Promise<DbUser | undefined> {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

export async function updateLastLogin(userId: number): Promise<void> {
  await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [userId]);
}

// ─── Session CRUD (PostgreSQL) ────────────────────────────────────────────────

export async function createSession(userId: number): Promise<{ token: string; expiresAt: string }> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
  await pool.query(
    'INSERT INTO sessions (user_id, token, expires_at, created_at) VALUES ($1, $2, $3, NOW())',
    [userId, token, expiresAt]
  );
  return { token, expiresAt };
}

export async function getSessionByToken(token: string): Promise<{ user_id: number; expires_at: string } | undefined> {
  // Clean expired sessions
  await pool.query('DELETE FROM sessions WHERE expires_at < NOW()');
  const result = await pool.query('SELECT user_id, expires_at FROM sessions WHERE token = $1 AND expires_at > NOW()', [token]);
  return result.rows[0];
}

export async function deleteSession(token: string): Promise<void> {
  await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
}

export async function deleteAllUserSessions(userId: number): Promise<void> {
  await pool.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
}
