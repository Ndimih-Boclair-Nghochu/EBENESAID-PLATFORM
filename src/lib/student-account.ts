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

const seedDocuments = [
  ['Passport (Data Page)', 'Verified', 'Jan 12, 2025', 'Identity', 'https://example.com/passport.pdf'],
  ['University Acceptance Letter', 'Verified', 'Dec 15, 2024', 'Education', 'https://example.com/acceptance.pdf'],
  ['Student Visa (Long Stay)', 'Expiring Soon', 'Feb 01, 2025', 'Legal', 'https://example.com/visa.pdf'],
  ['Proof of Financial Means', 'Pending', 'Jan 20, 2025', 'Finance', ''],
  ['International Health Insurance', 'Not Uploaded', '-', 'Health', ''],
  ['Lease Agreement (Certified)', 'Not Uploaded', '-', 'Housing', ''],
];

const seedJobs = [
  ['Part-time Delivery Associate', 'Wolt Latvia', 'Riga, Latvia', 'EUR 800 - EUR 1,200', 'Flexible', 'WL', 'Flexible student-friendly delivery role with onboarding support.'],
  ['Junior IT Support (Internship)', 'Accenture Baltics', 'Teika, Riga', 'EUR 600 stipend', 'Part-time', 'AC', 'Junior internship for students with basic IT troubleshooting skills.'],
  ['English Tutor for Kids', 'Language Hub', 'Remote/Riga', 'EUR 15/hour', 'Hourly', 'LH', 'Tutoring role for native or fluent English speakers working with children.'],
];

const seedCircles = [
  ['RTU International', '1.2k', 'Official hub for all international students at RTU.'],
  ['Riga Flatmates', '800', 'Find verified roommates and shared housing tips.'],
  ['West African Students', '150', 'Cultural connection and support for West African talent.'],
  ['Tech & Innovation', '450', 'For the builders and dreamers in the Baltic tech scene.'],
];

const seedFood = [
  ['Jollof Rice & Plantain', 8.5, 1.5, 'West African Hub', '25m', 4.9, 'https://picsum.photos/seed/jollof/400/300', JSON.stringify(['Bestseller', 'Spicy'])],
  ['Latvian Dumplings (Pelmeni)', 6.5, 1.0, 'Riga Local Eats', '15m', 4.7, 'https://picsum.photos/seed/dumplings/400/300', JSON.stringify(['Local', 'Student Favorite'])],
  ['Chicken Tikka Masala', 9.0, 2.0, 'Indo-Baltic Spice', '30m', 4.8, 'https://picsum.photos/seed/curry/400/300', JSON.stringify(['Verified', 'Halal'])],
];

async function seedStudentData(user: SafeUser) {
  await ensureStudentTables();

  const docCount = await pool.query('SELECT COUNT(*)::int AS count FROM student_documents WHERE user_id = $1', [user.id]);
  if ((docCount.rows[0]?.count ?? 0) === 0) {
    for (const [name, status, dateLabel, type, fileUrl] of seedDocuments) {
      await pool.query(
        'INSERT INTO student_documents (user_id, name, status, date_label, doc_type, file_url) VALUES ($1, $2, $3, $4, $5, $6)',
        [user.id, name, status, dateLabel, type, fileUrl]
      );
    }
  }

  const jobsCount = await pool.query('SELECT COUNT(*)::int AS count FROM job_listings');
  if ((jobsCount.rows[0]?.count ?? 0) === 0) {
    for (const [title, company, location, salary, type, logo, description] of seedJobs) {
      await pool.query(
        'INSERT INTO job_listings (title, company, location, salary, job_type, logo, description) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [title, company, location, salary, type, logo, description]
      );
    }
  }

  const circlesCount = await pool.query('SELECT COUNT(*)::int AS count FROM community_circles');
  if ((circlesCount.rows[0]?.count ?? 0) === 0) {
    for (const [name, membersLabel, description] of seedCircles) {
      await pool.query(
        'INSERT INTO community_circles (name, members_label, description) VALUES ($1, $2, $3)',
        [name, membersLabel, description]
      );
    }
  }

  const circleMessageCount = await pool.query('SELECT COUNT(*)::int AS count FROM community_messages');
  if ((circleMessageCount.rows[0]?.count ?? 0) === 0) {
    await pool.query(
      `INSERT INTO community_messages (circle_id, author_name, content)
       SELECT id, 'Kofi Mensah', 'Does anyone know the fastest way to get to the Immigration Office (PMLP)?'
       FROM community_circles WHERE name = 'RTU International' LIMIT 1`
    );
    await pool.query(
      `INSERT INTO community_messages (circle_id, author_name, content)
       SELECT id, 'Ananya S.', 'Looking for more people for a weekend trip to Sigulda. We have a car.'
       FROM community_circles WHERE name = 'Tech & Innovation' LIMIT 1`
    );
  }

  const convoCount = await pool.query('SELECT COUNT(*)::int AS count FROM student_conversations WHERE user_id = $1', [user.id]);
  if ((convoCount.rows[0]?.count ?? 0) === 0) {
    const seedConversations = [
      ['Louis D.', 'Student', 'User'],
      ['Sia LatProp', 'Housing Agent', 'Hotel'],
      ['West African Hub', 'Food Supplier', 'Soup'],
      ['RTU Riga', 'University', 'Building2'],
      ['EBENESAID Support', 'Support', 'LifeBuoy'],
    ];

    for (const [name, type, icon] of seedConversations) {
      const result = await pool.query(
        'INSERT INTO student_conversations (user_id, name, contact_type, icon) VALUES ($1, $2, $3, $4) RETURNING id',
        [user.id, name, type, icon]
      );
      const conversationId = result.rows[0].id;
      await pool.query(
        'INSERT INTO student_conversation_messages (conversation_id, role, sender_name, content) VALUES ($1, $2, $3, $4)',
        [conversationId, 'other', name, `Welcome to your secure conversation with ${name}.`]
      );
    }
  }

  const foodCount = await pool.query('SELECT COUNT(*)::int AS count FROM food_menu_items');
  if ((foodCount.rows[0]?.count ?? 0) === 0) {
    for (const [name, price, fee, kitchen, prepTime, rating, imageUrl, tags] of seedFood) {
      await pool.query(
        'INSERT INTO food_menu_items (name, price, delivery_fee, kitchen, prep_time, rating, image_url, tags) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb)',
        [name, price, fee, kitchen, prepTime, rating, imageUrl, tags]
      );
    }
  }

  await pool.query(
    `INSERT INTO student_arrival_bookings (user_id, airport_code, destination, pickup_status, pickup_booked, notes)
     VALUES ($1, 'RIX', 'K. Valdemara iela 21, Centrs', 'Not booked', false, '')
     ON CONFLICT (user_id) DO NOTHING`,
    [user.id]
  );

  const supportCount = await pool.query('SELECT COUNT(*)::int AS count FROM student_support_messages WHERE user_id = $1', [user.id]);
  if ((supportCount.rows[0]?.count ?? 0) === 0) {
    await pool.query(
      'INSERT INTO student_support_messages (user_id, role, content) VALUES ($1, $2, $3), ($1, $4, $5)',
      [
        user.id,
        'system',
        'Welcome to the official EBENESAID support channel. How can we assist your relocation today?',
        'admin',
        'Your support inbox is active. Send a message any time and the operations team will respond.',
      ]
    );
  }
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
  await seedStudentData(user);
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
  await seedStudentData(user);
  await pool.query(
    `INSERT INTO student_documents (user_id, name, status, date_label, doc_type, file_url)
     VALUES ($1, $2, 'Pending', $3, $4, $5)`,
    [user.id, data.name.trim(), formatTimeLabel(new Date()), data.type.trim(), data.fileUrl.trim()]
  );
}

export async function getStudentJobs(user: SafeUser): Promise<StudentJob[]> {
  await seedStudentData(user);
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
  await seedStudentData(user);
  await pool.query(
    `INSERT INTO student_job_applications (user_id, job_id, status)
     VALUES ($1, $2, 'Applied')
     ON CONFLICT (user_id, job_id) DO NOTHING`,
    [user.id, jobId]
  );
}

export async function getCommunityData(user: SafeUser) {
  await seedStudentData(user);
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
  await seedStudentData(user);
  await pool.query(
    `INSERT INTO community_memberships (user_id, circle_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, circle_id) DO NOTHING`,
    [user.id, circleId]
  );
}

export async function createCircleMessage(user: SafeUser, circleId: number, content: string) {
  await seedStudentData(user);
  await pool.query(
    `INSERT INTO community_messages (circle_id, author_name, content)
     VALUES ($1, $2, $3)`,
    [circleId, `${user.firstName} ${user.lastName}`.trim(), content.trim()]
  );
}

export async function getConversations(user: SafeUser) {
  await seedStudentData(user);

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
  await seedStudentData(user);
  await pool.query(
    `INSERT INTO student_conversation_messages (conversation_id, role, sender_name, content)
     VALUES ($1, 'me', $2, $3)`,
    [conversationId, `${user.firstName} ${user.lastName}`.trim(), content.trim()]
  );
}

export async function getFoodData(user: SafeUser) {
  await seedStudentData(user);
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
  await seedStudentData(user);
  await pool.query(
    `INSERT INTO student_food_orders (user_id, item_name, total, fulfillment, status)
     VALUES ($1, $2, $3, $4, 'Initialized')`,
    [user.id, data.itemName.trim(), data.total, data.fulfillment.trim()]
  );
}

export async function getArrivalBooking(user: SafeUser): Promise<ArrivalBooking> {
  await seedStudentData(user);
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
  await seedStudentData(user);
  await pool.query(
    `UPDATE student_arrival_bookings
     SET destination = $2,
         pickup_booked = $3,
         pickup_status = $4,
         notes = $5,
         updated_at = NOW()
     WHERE user_id = $1`,
    [user.id, data.destination.trim(), data.pickupBooked, data.pickupBooked ? 'Booked' : 'Not booked', data.notes.trim()]
  );
}

export async function getSupportMessages(user: SafeUser): Promise<SupportMessage[]> {
  await seedStudentData(user);
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
  await seedStudentData(user);
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
