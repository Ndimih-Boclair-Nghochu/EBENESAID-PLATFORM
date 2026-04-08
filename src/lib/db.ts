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
