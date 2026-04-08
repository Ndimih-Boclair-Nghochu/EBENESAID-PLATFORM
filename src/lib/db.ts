/**
 * SQLite Database Layer for EBENESAID Platform
 * Uses Node.js 22 built-in node:sqlite module
 */

// @ts-expect-error - node:sqlite is experimental in Node 22
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import crypto from 'crypto';

// Database file location - in project root for easy access
const DB_PATH = path.join(process.cwd(), 'ebenesaid.db');

let _db: InstanceType<typeof DatabaseSync> | null = null;

export function getDb(): InstanceType<typeof DatabaseSync> {
  if (!_db) {
    _db = new DatabaseSync(DB_PATH);
    // Enable WAL mode for better concurrent performance
    _db.exec('PRAGMA journal_mode=WAL');
    _db.exec('PRAGMA foreign_keys=ON');
    initializeSchema(_db);
  }
  return _db;
}

function initializeSchema(db: InstanceType<typeof DatabaseSync>) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT DEFAULT '',
      university TEXT DEFAULT '',
      country_of_origin TEXT DEFAULT '',
      user_type TEXT NOT NULL DEFAULT 'student' CHECK(user_type IN ('student', 'admin', 'university', 'supplier', 'agent', 'transport')),
      is_active INTEGER NOT NULL DEFAULT 1,
      trial_start_date TEXT NOT NULL,
      trial_end_date TEXT NOT NULL,
      has_paid INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  `);
}

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

// ─── User Types ─────────────────────────────────────────────────────────────────

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
  is_active: number;
  trial_start_date: string;
  trial_end_date: string;
  has_paid: number;
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
    isActive: dbUser.is_active === 1,
    trialStartDate: dbUser.trial_start_date,
    trialEndDate: dbUser.trial_end_date,
    hasPaid: dbUser.has_paid === 1,
    createdAt: dbUser.created_at,
    lastLoginAt: dbUser.last_login_at,
  };
}

// ─── User CRUD ──────────────────────────────────────────────────────────────────

export function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  university?: string;
  countryOfOrigin?: string;
  userType?: string;
}): SafeUser {
  const db = getDb();
  const { hash, salt } = hashPassword(data.password);

  const now = new Date();
  const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const stmt = db.prepare(`
    INSERT INTO users (email, password_hash, password_salt, first_name, last_name, phone, university, country_of_origin, user_type, trial_start_date, trial_end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.email.toLowerCase().trim(),
    hash,
    salt,
    data.firstName.trim(),
    data.lastName.trim(),
    data.phone?.trim() || '',
    data.university?.trim() || '',
    data.countryOfOrigin?.trim() || '',
    data.userType || 'student',
    now.toISOString(),
    trialEnd.toISOString()
  );

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as DbUser;
  return toSafeUser(user);
}

export function getUserByEmail(email: string): DbUser | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim()) as DbUser | undefined;
}

export function getUserById(id: number): DbUser | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as DbUser | undefined;
}

export function updateLastLogin(userId: number): void {
  const db = getDb();
  db.prepare('UPDATE users SET last_login_at = datetime(\'now\') WHERE id = ?').run(userId);
}

// ─── Session CRUD ───────────────────────────────────────────────────────────────

export function createSession(userId: number): { token: string; expiresAt: string } {
  const db = getDb();
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  db.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)').run(userId, token, expiresAt);

  return { token, expiresAt };
}

export function getSessionByToken(token: string): { user_id: number; expires_at: string } | undefined {
  const db = getDb();
  // Clean expired sessions first
  db.prepare('DELETE FROM sessions WHERE expires_at < datetime(\'now\')').run();

  return db.prepare('SELECT user_id, expires_at FROM sessions WHERE token = ? AND expires_at > datetime(\'now\')').get(token) as
    | { user_id: number; expires_at: string }
    | undefined;
}

export function deleteSession(token: string): void {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

export function deleteAllUserSessions(userId: number): void {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
}
