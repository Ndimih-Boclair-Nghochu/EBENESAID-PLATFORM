import { Pool } from 'pg';

import type { SafeUser } from '@/lib/db';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export type StudentDocument = {
  id: number;
  name: string;
  status: string;
  dateLabel: string;
  type: string;
  fileUrl: string;
};

export type StudentJob = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  logo: string;
  description: string;
  applied: boolean;
};

export type CommunityCircle = {
  id: number;
  name: string;
  members: string;
  description: string;
  joined: boolean;
};

export type CircleMessage = {
  id: number;
  circleId: number;
  author: string;
  content: string;
  createdAt: string;
};

export type Conversation = {
  id: number;
  name: string;
  type: string;
  lastMsg: string;
  time: string;
  unread: number;
  icon: string;
};

export type ConversationMessage = {
  id: number;
  conversationId: number;
  role: 'me' | 'other' | 'admin' | 'system';
  name: string;
  content: string;
  time: string;
};

export type FoodItem = {
  id: number;
  name: string;
  price: number;
  deliveryFee: number;
  kitchen: string;
  time: string;
  rating: number;
  img: string;
  tags: string[];
};

export type FoodOrder = {
  id: number;
  itemName: string;
  total: number;
  fulfillment: string;
  status: string;
  createdAt: string;
};

export type ArrivalBooking = {
  id: number | null;
  airportCode: string;
  destination: string;
  pickupStatus: string;
  pickupBooked: boolean;
  notes: string;
};

export type SupportMessage = {
  id: number;
  role: 'user' | 'admin' | 'system';
  time: string;
  content: string;
};

let studentSchemaReady: Promise<void> | null = null;

async function ensureStudentTables() {
  if (!studentSchemaReady) {
    studentSchemaReady = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_documents (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          status TEXT NOT NULL,
          date_label TEXT NOT NULL,
          doc_type TEXT NOT NULL,
          file_url TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS job_listings (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          company TEXT NOT NULL,
          location TEXT NOT NULL,
          salary TEXT NOT NULL,
          job_type TEXT NOT NULL,
          logo TEXT NOT NULL,
          description TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_job_applications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          job_id INTEGER NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
          status TEXT NOT NULL DEFAULT 'Applied',
          applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (user_id, job_id)
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS community_circles (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          members_label TEXT NOT NULL,
          description TEXT NOT NULL
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS community_memberships (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          circle_id INTEGER NOT NULL REFERENCES community_circles(id) ON DELETE CASCADE,
          joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (user_id, circle_id)
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS community_messages (
          id SERIAL PRIMARY KEY,
          circle_id INTEGER NOT NULL REFERENCES community_circles(id) ON DELETE CASCADE,
          author_name TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_conversations (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          contact_type TEXT NOT NULL,
          icon TEXT NOT NULL,
          unread INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (user_id, name, contact_type)
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_conversation_messages (
          id SERIAL PRIMARY KEY,
          conversation_id INTEGER NOT NULL REFERENCES student_conversations(id) ON DELETE CASCADE,
          role TEXT NOT NULL,
          sender_name TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS food_menu_items (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          price NUMERIC(10,2) NOT NULL,
          delivery_fee NUMERIC(10,2) NOT NULL,
          kitchen TEXT NOT NULL,
          prep_time TEXT NOT NULL,
          rating NUMERIC(3,1) NOT NULL,
          image_url TEXT NOT NULL,
          tags JSONB NOT NULL DEFAULT '[]'::jsonb
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_food_orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          item_name TEXT NOT NULL,
          total NUMERIC(10,2) NOT NULL,
          fulfillment TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'Initialized',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_arrival_bookings (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          airport_code TEXT NOT NULL,
          destination TEXT NOT NULL,
          pickup_status TEXT NOT NULL,
          pickup_booked BOOLEAN NOT NULL DEFAULT FALSE,
          notes TEXT NOT NULL DEFAULT '',
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_support_messages (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
    })().catch(error => {
      studentSchemaReady = null;
      throw error;
    });
  }

  await studentSchemaReady;
}

async function ensureStudentDataTables() {
  await ensureStudentTables();
}

function formatTimeLabel(value: string | Date) {
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function getStudentDocuments(user: SafeUser): Promise<StudentDocument[]> {
  await ensureStudentDataTables();
  const result = await pool.query(
    `SELECT id, name, status, date_label, doc_type, file_url
     FROM student_documents WHERE user_id = $1 ORDER BY id ASC`,
    [user.id]
  );
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    status: row.status,
    dateLabel: row.date_label,
    type: row.doc_type,
    fileUrl: row.file_url,
  }));
}

export async function saveStudentDocument(
  user: SafeUser,
  data: { name: string; type: string; fileUrl: string }
) {
  await ensureStudentDataTables();
  await pool.query(
    `INSERT INTO student_documents (user_id, name, status, date_label, doc_type, file_url)
     VALUES ($1, $2, 'Pending', $3, $4, $5)`,
    [user.id, data.name.trim(), formatTimeLabel(new Date()), data.type.trim(), data.fileUrl.trim()]
  );
}

export async function getStudentJobs(user: SafeUser): Promise<StudentJob[]> {
  await ensureStudentDataTables();
  const result = await pool.query(
    `SELECT j.id, j.title, j.company, j.location, j.salary, j.job_type, j.logo, j.description,
            CASE WHEN a.id IS NULL THEN false ELSE true END AS applied
     FROM job_listings j
     LEFT JOIN student_job_applications a ON a.job_id = j.id AND a.user_id = $1
     ORDER BY j.id ASC`,
    [user.id]
  );
  return result.rows.map(row => ({
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    salary: row.salary,
    type: row.job_type,
    logo: row.logo,
    description: row.description,
    applied: row.applied,
  }));
}

export async function applyToJob(user: SafeUser, jobId: number) {
  await ensureStudentDataTables();
  await pool.query(
    `INSERT INTO student_job_applications (user_id, job_id, status)
     VALUES ($1, $2, 'Applied')
     ON CONFLICT (user_id, job_id) DO NOTHING`,
    [user.id, jobId]
  );
}

export async function getCommunityData(user: SafeUser) {
  await ensureStudentDataTables();
  const circles = await pool.query(
    `SELECT c.id, c.name, c.members_label, c.description,
            CASE WHEN m.id IS NULL THEN false ELSE true END AS joined
     FROM community_circles c
     LEFT JOIN community_memberships m ON m.circle_id = c.id AND m.user_id = $1
     ORDER BY c.id ASC`,
    [user.id]
  );

  const messages = await pool.query(
    `SELECT id, circle_id, author_name, content, created_at
     FROM community_messages
     ORDER BY created_at ASC`,
    []
  );

  return {
    circles: circles.rows.map(row => ({
      id: row.id,
      name: row.name,
      members: row.members_label,
      description: row.description,
      joined: row.joined,
    })) as CommunityCircle[],
    messages: messages.rows.map(row => ({
      id: row.id,
      circleId: row.circle_id,
      author: row.author_name,
      content: row.content,
      createdAt: formatTimeLabel(row.created_at),
    })) as CircleMessage[],
  };
}

export async function joinCircle(user: SafeUser, circleId: number) {
  await ensureStudentDataTables();
  await pool.query(
    `INSERT INTO community_memberships (user_id, circle_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, circle_id) DO NOTHING`,
    [user.id, circleId]
  );
}

export async function createCircleMessage(user: SafeUser, circleId: number, content: string) {
  await ensureStudentDataTables();
  await pool.query(
    `INSERT INTO community_messages (circle_id, author_name, content)
     VALUES ($1, $2, $3)`,
    [circleId, `${user.firstName} ${user.lastName}`.trim(), content.trim()]
  );
}

export async function getConversations(user: SafeUser) {
  await ensureStudentDataTables();

  const conversations = await pool.query(
    `SELECT c.id, c.name, c.contact_type, c.icon, c.unread,
            COALESCE(m.content, '') AS last_msg,
            COALESCE(m.created_at, c.created_at) AS last_time
     FROM student_conversations c
     LEFT JOIN LATERAL (
       SELECT content, created_at
       FROM student_conversation_messages
       WHERE conversation_id = c.id
       ORDER BY created_at DESC
       LIMIT 1
     ) m ON TRUE
     WHERE c.user_id = $1
     ORDER BY last_time DESC`,
    [user.id]
  );

  const messages = await pool.query(
    `SELECT m.id, m.conversation_id, m.role, m.sender_name, m.content, m.created_at
     FROM student_conversation_messages m
     JOIN student_conversations c ON c.id = m.conversation_id
     WHERE c.user_id = $1
     ORDER BY m.created_at ASC`,
    [user.id]
  );

  return {
    conversations: conversations.rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.contact_type,
      lastMsg: row.last_msg,
      time: formatTimeLabel(row.last_time),
      unread: row.unread,
      icon: row.icon,
    })) as Conversation[],
    messages: messages.rows.map(row => ({
      id: row.id,
      conversationId: row.conversation_id,
      role: row.role,
      name: row.sender_name,
      content: row.content,
      time: formatTimeLabel(row.created_at),
    })) as ConversationMessage[],
  };
}

export async function sendConversationMessage(user: SafeUser, conversationId: number, content: string) {
  await ensureStudentDataTables();
  await pool.query(
    `INSERT INTO student_conversation_messages (conversation_id, role, sender_name, content)
     VALUES ($1, 'me', $2, $3)`,
    [conversationId, `${user.firstName} ${user.lastName}`.trim(), content.trim()]
  );
}

export async function getFoodData(user: SafeUser) {
  await ensureStudentDataTables();
  const items = await pool.query(
    `SELECT id, name, price, delivery_fee, kitchen, prep_time, rating, image_url, tags
     FROM food_menu_items ORDER BY id ASC`
  );
  const orders = await pool.query(
    `SELECT id, item_name, total, fulfillment, status, created_at
     FROM student_food_orders
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [user.id]
  );

  return {
    items: items.rows.map(row => ({
      id: row.id,
      name: row.name,
      price: Number(row.price),
      deliveryFee: Number(row.delivery_fee),
      kitchen: row.kitchen,
      time: row.prep_time,
      rating: Number(row.rating),
      img: row.image_url,
      tags: row.tags ?? [],
    })) as FoodItem[],
    orders: orders.rows.map(row => ({
      id: row.id,
      itemName: row.item_name,
      total: Number(row.total),
      fulfillment: row.fulfillment,
      status: row.status,
      createdAt: formatTimeLabel(row.created_at),
    })) as FoodOrder[],
  };
}

export async function createFoodOrder(
  user: SafeUser,
  data: { itemName: string; total: number; fulfillment: string }
) {
  await ensureStudentDataTables();
  await pool.query(
    `INSERT INTO student_food_orders (user_id, item_name, total, fulfillment, status)
     VALUES ($1, $2, $3, $4, 'Initialized')`,
    [user.id, data.itemName.trim(), data.total, data.fulfillment.trim()]
  );
}

export async function getArrivalBooking(user: SafeUser): Promise<ArrivalBooking> {
  await ensureStudentDataTables();
  const result = await pool.query(
    `SELECT id, airport_code, destination, pickup_status, pickup_booked, notes
     FROM student_arrival_bookings WHERE user_id = $1`,
    [user.id]
  );
  const row = result.rows[0];
  return {
    id: row?.id ?? null,
    airportCode: row?.airport_code ?? 'RIX',
    destination: row?.destination ?? 'Riga',
    pickupStatus: row?.pickup_status ?? 'Not booked',
    pickupBooked: row?.pickup_booked ?? false,
    notes: row?.notes ?? '',
  };
}

export async function saveArrivalBooking(
  user: SafeUser,
  data: { destination: string; pickupBooked: boolean; notes: string }
) {
  await ensureStudentDataTables();
  await pool.query(
    `INSERT INTO student_arrival_bookings (user_id, airport_code, destination, pickup_status, pickup_booked, notes, updated_at)
     VALUES ($1, 'RIX', $2, $3, $4, $5, NOW())
     ON CONFLICT (user_id)
     DO UPDATE SET destination = EXCLUDED.destination,
                   pickup_status = EXCLUDED.pickup_status,
                   pickup_booked = EXCLUDED.pickup_booked,
                   notes = EXCLUDED.notes,
                   updated_at = NOW()`,
    [user.id, data.destination.trim(), data.pickupBooked ? 'Booked' : 'Not booked', data.pickupBooked, data.notes.trim()]
  );
}

export async function getSupportMessages(user: SafeUser): Promise<SupportMessage[]> {
  await ensureStudentDataTables();
  const result = await pool.query(
    `SELECT id, role, content, created_at
     FROM student_support_messages
     WHERE user_id = $1
     ORDER BY created_at ASC`,
    [user.id]
  );
  return result.rows.map(row => ({
    id: row.id,
    role: row.role,
    content: row.content,
    time: formatTimeLabel(row.created_at),
  }));
}

export async function createSupportMessage(user: SafeUser, content: string) {
  await ensureStudentDataTables();
  await pool.query(
    `INSERT INTO student_support_messages (user_id, role, content)
     VALUES ($1, 'user', $2), ($1, 'admin', $3)`,
    [
      user.id,
      content.trim(),
      'Thanks for contacting support. A team member will review your request and follow up shortly.',
    ]
  );
}

export async function updateStudentProfile(
  user: SafeUser,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    university: string;
    countryOfOrigin: string;
  }
): Promise<SafeUser> {
  const result = await pool.query(
    `UPDATE users
     SET first_name = $2,
         last_name = $3,
         email = $4,
         phone = $5,
         university = $6,
         country_of_origin = $7,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, email, first_name, last_name, phone, university, country_of_origin, user_type, is_active, trial_start_date, trial_end_date, has_paid, created_at, last_login_at`,
    [
      user.id,
      data.firstName.trim(),
      data.lastName.trim(),
      data.email.trim().toLowerCase(),
      data.phone.trim(),
      data.university.trim(),
      data.countryOfOrigin.trim(),
    ]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    university: row.university,
    countryOfOrigin: row.country_of_origin,
    userType: row.user_type,
    isActive: row.is_active,
    trialStartDate: row.trial_start_date,
    trialEndDate: row.trial_end_date,
    hasPaid: row.has_paid,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}
