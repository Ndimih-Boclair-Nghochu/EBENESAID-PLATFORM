import { ensureCoreTables, type SafeUser } from '@/lib/db';
import { dbPool as pool } from '@/lib/postgres';
import { runLocalSpecialist, type SpecialistKey } from '@/ai/local-brain';
import {
  sendAdminAlertEmail,
  sendDirectMessageNotificationEmail,
  sendPlatformAnnouncementEmail,
  sendSupportReceivedEmail,
} from '@/lib/email';

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

function getAdminAlertRecipient() {
  return process.env.INITIAL_ADMIN_EMAIL?.trim() || process.env.BREVO_SENDER_EMAIL?.trim() || process.env.EMAIL_FROM?.trim() || '';
}

export type JobPartnerListing = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  logo: string;
  description: string;
  category: string;
  requirements: string;
  status: string;
  applications: number;
  createdAt: string;
};

export type JobPartnerApplicant = {
  applicationId: number;
  jobId: number;
  jobTitle: string;
  studentId: number;
  studentName: string;
  email: string;
  country: string;
  status: string;
  appliedAt: string;
};

export type CommunityCircle = {
  id: number;
  name: string;
  members: string;
  description: string;
  joined: boolean;
  status: 'pending' | 'approved' | 'rejected';
  isMine: boolean;
  rejectionReason: string;
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
  contactType: string;
  lastMsg: string;
  time: string;
  unread: number;
  icon: string;
};

export type MessageContact = {
  userId: number;
  name: string;
  email: string;
  userType: string;
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
  supplierUserId: number | null;
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
  assignedTransportUserId: number | null;
  assignedVehicleId: number | null;
};

export type TransportFleetVehicle = {
  id: number;
  model: string;
  plate: string;
  capacity: string;
  status: string;
  serviceStatus: string;
  imageUrl: string;
  lastServiceDate: string;
  insuranceStatus: string;
};

export type SupportMessage = {
  id: number;
  role: 'user' | 'admin' | 'system';
  time: string;
  content: string;
};

export type AdminSupportThread = {
  userId: number;
  name: string;
  email: string;
  type: string;
  lastMsg: string;
  time: string;
  unread: number;
};

export type StudentBillingProfile = {
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  billingCountry: string;
  billingCurrency: string;
  billingAddress: string;
  providerPreference: 'stripe' | 'flutterwave';
  stripeCustomerEmail: string;
  stripeCustomerId: string;
  stripePaymentMethodLabel: string;
  stripeCheckoutMode: string;
  flutterwaveCustomerEmail: string;
  flutterwaveCustomerId: string;
  flutterwavePaymentMethod: string;
  flutterwaveMobileMoneyProvider: string;
  flutterwaveReference: string;
  invoiceEmail: string;
  autoRenew: boolean;
};

export type CommunityApprovalRequest = {
  id: number;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string;
};

let studentSchemaReady: Promise<void> | null = null;

const defaultAiConversations: Array<{
  name: string;
  contactType: string;
  icon: string;
  specialist: SpecialistKey;
  greeting: (user: SafeUser) => string;
}> = [
  {
    name: 'EBENESAID AI Navigator',
    contactType: 'ai_navigator',
    icon: 'bot',
    specialist: 'navigator',
    greeting: (user) =>
      `Good to see you, ${user.firstName}. I can guide you through the full platform and point you to the right specialist whenever you need a faster route.`,
  },
  {
    name: 'EBENESAID AI Housing',
    contactType: 'ai_housing',
    icon: 'hotel',
    specialist: 'housing',
    greeting: (user) =>
      `Hello ${user.firstName}. Ask me about verified housing, room suitability, commute fit, or what to check before contacting a housing partner.`,
  },
  {
    name: 'EBENESAID AI Career',
    contactType: 'ai_career',
    icon: 'briefcase',
    specialist: 'career',
    greeting: (user) =>
      `Hello ${user.firstName}. I can help you focus on jobs, work readiness, application choices, and student-friendly opportunities on the platform.`,
  },
  {
    name: 'EBENESAID AI Documents',
    contactType: 'ai_documents',
    icon: 'file',
    specialist: 'documents',
    greeting: (user) =>
      `Hello ${user.firstName}. I can help with passports, letters, uploads, visa or permit paperwork, and document readiness across your relocation flow.`,
  },
];

async function ensureStudentTables() {
  if (!studentSchemaReady) {
    studentSchemaReady = (async () => {
      await ensureCoreTables();

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
        ALTER TABLE job_listings
        ADD COLUMN IF NOT EXISTS created_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
      `);

      await pool.query(`
        ALTER TABLE job_listings
        ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Open';
      `);

      await pool.query(`
        ALTER TABLE job_listings
        ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '';
      `);

      await pool.query(`
        ALTER TABLE job_listings
        ADD COLUMN IF NOT EXISTS requirements TEXT NOT NULL DEFAULT '';
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
        ALTER TABLE community_circles
        ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved';
      `);

      await pool.query(`
        ALTER TABLE community_circles
        ADD COLUMN IF NOT EXISTS created_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
      `);

      await pool.query(`
        ALTER TABLE community_circles
        ADD COLUMN IF NOT EXISTS approved_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
      `);

      await pool.query(`
        ALTER TABLE community_circles
        ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
      `);

      await pool.query(`
        ALTER TABLE community_circles
        ADD COLUMN IF NOT EXISTS rejection_reason TEXT NOT NULL DEFAULT '';
      `);

      await pool.query(`
        ALTER TABLE community_circles
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
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
          counterpart_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          icon TEXT NOT NULL,
          unread INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (user_id, name, contact_type)
        );
      `);

      await pool.query(`
        ALTER TABLE student_conversations
        ADD COLUMN IF NOT EXISTS counterpart_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
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
        ALTER TABLE food_menu_items
        ADD COLUMN IF NOT EXISTS created_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
      `);

      await pool.query(`
        ALTER TABLE food_menu_items
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
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
        ALTER TABLE student_food_orders
        ADD COLUMN IF NOT EXISTS item_id INTEGER REFERENCES food_menu_items(id) ON DELETE SET NULL;
      `);

      await pool.query(`
        ALTER TABLE student_food_orders
        ADD COLUMN IF NOT EXISTS supplier_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
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
        ALTER TABLE student_arrival_bookings
        ADD COLUMN IF NOT EXISTS assigned_transport_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
      `);

      await pool.query(`
        ALTER TABLE student_arrival_bookings
        ADD COLUMN IF NOT EXISTS assigned_vehicle_id INTEGER;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS transport_fleet_vehicles (
          id SERIAL PRIMARY KEY,
          created_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          model TEXT NOT NULL,
          plate TEXT NOT NULL,
          capacity TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'Active',
          service_status TEXT NOT NULL DEFAULT 'Passed',
          image_url TEXT NOT NULL DEFAULT '',
          last_service_date TEXT NOT NULL DEFAULT '',
          insurance_status TEXT NOT NULL DEFAULT 'Verified',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (created_by_user_id, plate)
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

      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_billing_profiles (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          billing_name TEXT NOT NULL DEFAULT '',
          billing_email TEXT NOT NULL DEFAULT '',
          billing_phone TEXT NOT NULL DEFAULT '',
          billing_country TEXT NOT NULL DEFAULT '',
          billing_currency TEXT NOT NULL DEFAULT 'EUR',
          billing_address TEXT NOT NULL DEFAULT '',
          provider_preference TEXT NOT NULL DEFAULT 'stripe',
          stripe_customer_email TEXT NOT NULL DEFAULT '',
          stripe_customer_id TEXT NOT NULL DEFAULT '',
          stripe_payment_method_label TEXT NOT NULL DEFAULT '',
          stripe_checkout_mode TEXT NOT NULL DEFAULT 'card',
          flutterwave_customer_email TEXT NOT NULL DEFAULT '',
          flutterwave_customer_id TEXT NOT NULL DEFAULT '',
          flutterwave_payment_method TEXT NOT NULL DEFAULT 'card',
          flutterwave_mobile_money_provider TEXT NOT NULL DEFAULT '',
          flutterwave_reference TEXT NOT NULL DEFAULT '',
          invoice_email TEXT NOT NULL DEFAULT '',
          auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

async function ensureDefaultAiConversations(user: SafeUser) {
  for (const conversation of defaultAiConversations) {
    const result = await pool.query(
      `INSERT INTO student_conversations (user_id, name, contact_type, icon, unread, created_at)
       VALUES ($1, $2, $3, $4, 0, NOW())
       ON CONFLICT (user_id, name, contact_type)
       DO UPDATE SET icon = EXCLUDED.icon
       RETURNING id`,
      [user.id, conversation.name, conversation.contactType, conversation.icon]
    );

    const conversationId = result.rows[0]?.id;
    if (!conversationId) {
      continue;
    }

    const existingMessages = await pool.query(
      `SELECT id FROM student_conversation_messages WHERE conversation_id = $1 LIMIT 1`,
      [conversationId]
    );

    if (!existingMessages.rows[0]) {
      await pool.query(
        `INSERT INTO student_conversation_messages (conversation_id, role, sender_name, content)
         VALUES ($1, 'other', $2, $3)`,
        [conversationId, conversation.name, conversation.greeting(user)]
      );
    }
  }
}

function getAiSpecialistForConversation(contactType: string): SpecialistKey | null {
  switch (contactType) {
    case 'ai_navigator':
      return 'navigator';
    case 'ai_housing':
      return 'housing';
    case 'ai_career':
      return 'career';
    case 'ai_documents':
      return 'documents';
    default:
      return null;
  }
}

function getDirectConversationType(counterpartUserId: number) {
  return `direct:${counterpartUserId}`;
}

function getMessageContactIcon(userType: string) {
  if (userType === 'admin' || userType === 'staff') return 'building';
  if (userType === 'agent') return 'hotel';
  if (userType === 'supplier') return 'soup';
  if (userType === 'job_partner') return 'briefcase';
  if (userType === 'student') return 'user';
  return 'building';
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
     WHERE j.status = 'Open'
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

  const jobResult = await pool.query(
    `SELECT title, company, created_by_user_id
     FROM job_listings
     WHERE id = $1`,
    [jobId]
  );

  const job = jobResult.rows[0];
  return job
    ? {
        title: String(job.title ?? ''),
        company: String(job.company ?? ''),
        partnerUserId: Number(job.created_by_user_id ?? 0) || null,
      }
    : null;
}

export async function getJobPartnerListings(user: SafeUser): Promise<JobPartnerListing[]> {
  await ensureStudentDataTables();
  const result = await pool.query(
    `SELECT j.id, j.title, j.company, j.location, j.salary, j.job_type, j.logo, j.description, j.category, j.requirements, j.status, j.created_at,
            COUNT(a.id) AS applications
     FROM job_listings j
     LEFT JOIN student_job_applications a ON a.job_id = j.id
     WHERE j.created_by_user_id = $1
     GROUP BY j.id
     ORDER BY j.created_at DESC, j.id DESC`,
    [user.id]
  );

  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    salary: row.salary,
    type: row.job_type,
    logo: row.logo,
    description: row.description,
    category: row.category ?? '',
    requirements: row.requirements ?? '',
    status: row.status,
    applications: Number(row.applications ?? 0),
    createdAt: row.created_at,
  }));
}

export async function createJobPartnerListing(
  user: SafeUser,
  data: {
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    logo?: string;
    description: string;
    category?: string;
    requirements?: string;
    status?: string;
  }
) {
  await ensureStudentDataTables();
  await pool.query(
    `INSERT INTO job_listings (
       title, company, location, salary, job_type, logo, description, created_by_user_id, status, category, requirements, created_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
    [
      data.title.trim(),
      data.company.trim(),
      data.location.trim(),
      data.salary.trim(),
      data.type.trim(),
      data.logo?.trim() || 'https://picsum.photos/seed/ebenesaid-job/120/120',
      data.description.trim(),
      user.id,
      data.status?.trim() || 'Open',
      data.category?.trim() || '',
      data.requirements?.trim() || '',
    ]
  );
}

export async function updateJobPartnerListing(
  user: SafeUser,
  listingId: number,
  data: {
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    logo?: string;
    description: string;
    category?: string;
    requirements?: string;
    status?: string;
  }
) {
  await ensureStudentDataTables();
  const result = await pool.query(
    `UPDATE job_listings
     SET title = $3,
         company = $4,
         location = $5,
         salary = $6,
         job_type = $7,
         logo = $8,
         description = $9,
         category = $10,
         requirements = $11,
         status = $12
     WHERE id = $1 AND created_by_user_id = $2
     RETURNING id`,
    [
      listingId,
      user.id,
      data.title.trim(),
      data.company.trim(),
      data.location.trim(),
      data.salary.trim(),
      data.type.trim(),
      data.logo?.trim() || 'https://picsum.photos/seed/ebenesaid-job/120/120',
      data.description.trim(),
      data.category?.trim() || '',
      data.requirements?.trim() || '',
      data.status?.trim() || 'Open',
    ]
  );

  return Boolean(result.rows[0]);
}

export async function getJobPartnerApplicants(user: SafeUser): Promise<JobPartnerApplicant[]> {
  await ensureStudentDataTables();
  const result = await pool.query(
    `SELECT a.id AS application_id, a.job_id, a.status, a.applied_at,
            j.title AS job_title,
            u.id AS student_id, u.first_name, u.last_name, u.email, u.country_of_origin
     FROM student_job_applications a
     INNER JOIN job_listings j ON j.id = a.job_id
     INNER JOIN users u ON u.id = a.user_id
     WHERE j.created_by_user_id = $1
     ORDER BY a.applied_at DESC, a.id DESC`,
    [user.id]
  );

  return result.rows.map((row) => ({
    applicationId: row.application_id,
    jobId: row.job_id,
    jobTitle: row.job_title,
    studentId: row.student_id,
    studentName: `${row.first_name} ${row.last_name}`.trim(),
    email: row.email,
    country: row.country_of_origin ?? '',
    status: row.status,
    appliedAt: formatTimeLabel(row.applied_at),
  }));
}

export async function updateJobApplicationStatus(
  user: SafeUser,
  applicationId: number,
  status: string
) {
  await ensureStudentDataTables();
  const result = await pool.query(
    `UPDATE student_job_applications a
     SET status = $3
     FROM job_listings j
     WHERE a.id = $1
       AND j.id = a.job_id
       AND j.created_by_user_id = $2
     RETURNING a.id`,
    [applicationId, user.id, status.trim()]
  );

  return Boolean(result.rows[0]);
}

export async function getCommunityData(user: SafeUser) {
  await ensureStudentDataTables();
  const circles = await pool.query(
    `SELECT c.id, c.name, c.members_label, c.description, c.status, c.rejection_reason,
            CASE WHEN m.id IS NULL THEN false ELSE true END AS joined,
            CASE WHEN c.created_by_user_id = $1 THEN true ELSE false END AS is_mine
     FROM community_circles c
     LEFT JOIN community_memberships m ON m.circle_id = c.id AND m.user_id = $1
     WHERE c.status = 'approved' OR c.created_by_user_id = $1
     ORDER BY CASE c.status WHEN 'approved' THEN 0 WHEN 'pending' THEN 1 ELSE 2 END, c.id ASC`,
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
      status: row.status,
      isMine: row.is_mine,
      rejectionReason: row.rejection_reason ?? '',
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
  const circle = await pool.query(
    `SELECT status FROM community_circles WHERE id = $1`,
    [circleId]
  );

  if (!circle.rows[0]) {
    throw new Error('Community circle not found.');
  }

  if (circle.rows[0].status !== 'approved') {
    throw new Error('Only approved circles can be joined.');
  }

  await pool.query(
    `INSERT INTO community_memberships (user_id, circle_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, circle_id) DO NOTHING`,
    [user.id, circleId]
  );
}

export async function createCircleMessage(user: SafeUser, circleId: number, content: string) {
  await ensureStudentDataTables();
  const membership = await pool.query(
    `SELECT 1
     FROM community_memberships
     WHERE user_id = $1 AND circle_id = $2`,
    [user.id, circleId]
  );

  if (!membership.rows[0]) {
    throw new Error('Join the circle before posting messages.');
  }

  await pool.query(
    `INSERT INTO community_messages (circle_id, author_name, content)
     VALUES ($1, $2, $3)`,
    [circleId, `${user.firstName} ${user.lastName}`.trim(), content.trim()]
  );
}

export async function requestCommunityCircle(
  user: SafeUser,
  data: { name: string; description: string }
) {
  await ensureStudentDataTables();

  const name = data.name.trim();
  const description = data.description.trim();

  if (!name || !description) {
    throw new Error('Circle name and description are required.');
  }

  await pool.query(
    `INSERT INTO community_circles (name, members_label, description, status, created_by_user_id, rejection_reason)
     VALUES ($1, 'Pending approval', $2, 'pending', $3, '')`,
    [name, description, user.id]
  );
}

export async function getCommunityApprovalRequests(): Promise<CommunityApprovalRequest[]> {
  await ensureStudentDataTables();

  const result = await pool.query(
    `SELECT c.id, c.name, c.description, c.status, c.rejection_reason, c.created_at,
            u.first_name, u.last_name
     FROM community_circles c
     LEFT JOIN users u ON u.id = c.created_by_user_id
     WHERE c.status IN ('pending', 'rejected')
     ORDER BY c.created_at DESC, c.id DESC`
  );

  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    createdBy: `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() || 'Unknown student',
    createdAt: formatTimeLabel(row.created_at),
    status: row.status,
    rejectionReason: row.rejection_reason ?? '',
  }));
}

export async function reviewCommunityApprovalRequest(
  adminUser: SafeUser,
  circleId: number,
  decision: 'approved' | 'rejected',
  rejectionReason: string
) {
  await ensureStudentDataTables();

  const result = await pool.query(
    `UPDATE community_circles
     SET status = $2,
         approved_by_user_id = $3,
         approved_at = CASE WHEN $2 = 'approved' THEN NOW() ELSE approved_at END,
         members_label = CASE WHEN $2 = 'approved' THEN '1' ELSE members_label END,
         rejection_reason = CASE WHEN $2 = 'rejected' THEN $4 ELSE '' END
     WHERE id = $1
     RETURNING id, created_by_user_id, status`,
    [circleId, decision, adminUser.id, rejectionReason.trim()]
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error('Community request not found.');
  }

  if (decision === 'approved' && row.created_by_user_id) {
    await pool.query(
      `INSERT INTO community_memberships (user_id, circle_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, circle_id) DO NOTHING`,
      [row.created_by_user_id, circleId]
    );
  }
}

export async function getConversations(user: SafeUser) {
  await ensureStudentDataTables();
  await ensureDefaultAiConversations(user);

  const [conversations, messages, contacts] = await Promise.all([
    pool.query(
      `SELECT c.id, c.name, c.contact_type, c.icon, c.unread, c.counterpart_user_id,
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
    ),
    pool.query(
      `SELECT m.id, m.conversation_id, m.role, m.sender_name, m.content, m.created_at
     FROM student_conversation_messages m
     JOIN student_conversations c ON c.id = m.conversation_id
     WHERE c.user_id = $1
     ORDER BY m.created_at ASC`,
      [user.id]
    ),
    pool.query(
      `SELECT id, first_name, last_name, email, user_type
       FROM users
       WHERE id <> $1 AND is_active = TRUE
       ORDER BY CASE WHEN user_type = 'admin' THEN 0 WHEN user_type = 'staff' THEN 1 ELSE 2 END, first_name ASC, last_name ASC`,
      [user.id]
    ),
  ]);

  return {
    conversations: conversations.rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.contact_type,
      contactType: row.contact_type,
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
    contacts: contacts.rows.map(row => ({
      userId: row.id,
      name: `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() || row.email,
      email: row.email,
      userType: row.user_type,
      icon: getMessageContactIcon(row.user_type),
    })) as MessageContact[],
  };
}

async function ensureDirectConversation(userId: number, counterpartId: number) {
  const [userRowResult, counterpartRowResult] = await Promise.all([
    pool.query(`SELECT id, first_name, last_name, email, user_type FROM users WHERE id = $1`, [userId]),
    pool.query(`SELECT id, first_name, last_name, email, user_type FROM users WHERE id = $1`, [counterpartId]),
  ]);

  const userRow = userRowResult.rows[0];
  const counterpartRow = counterpartRowResult.rows[0];
  if (!userRow || !counterpartRow) {
    throw new Error('Conversation participant not found.');
  }

  const userConversationType = getDirectConversationType(counterpartId);
  const counterpartConversationType = getDirectConversationType(userId);
  const userConversationName = `${counterpartRow.first_name ?? ''} ${counterpartRow.last_name ?? ''}`.trim() || counterpartRow.email;
  const counterpartConversationName = `${userRow.first_name ?? ''} ${userRow.last_name ?? ''}`.trim() || userRow.email;

  const [senderConversation, recipientConversation] = await Promise.all([
    pool.query(
      `INSERT INTO student_conversations (user_id, name, contact_type, counterpart_user_id, icon, unread, created_at)
       VALUES ($1, $2, $3, $4, $5, 0, NOW())
       ON CONFLICT (user_id, name, contact_type)
       DO UPDATE SET counterpart_user_id = EXCLUDED.counterpart_user_id, icon = EXCLUDED.icon
       RETURNING id`,
      [userId, userConversationName, userConversationType, counterpartId, getMessageContactIcon(counterpartRow.user_type)]
    ),
    pool.query(
      `INSERT INTO student_conversations (user_id, name, contact_type, counterpart_user_id, icon, unread, created_at)
       VALUES ($1, $2, $3, $4, $5, 0, NOW())
       ON CONFLICT (user_id, name, contact_type)
       DO UPDATE SET counterpart_user_id = EXCLUDED.counterpart_user_id, icon = EXCLUDED.icon
       RETURNING id`,
      [counterpartId, counterpartConversationName, counterpartConversationType, userId, getMessageContactIcon(userRow.user_type)]
    ),
  ]);

  return {
    senderConversationId: Number(senderConversation.rows[0]?.id),
    recipientConversationId: Number(recipientConversation.rows[0]?.id),
  };
}

export async function sendConversationMessage(
  user: SafeUser,
  conversationId: number,
  content: string,
  recipientUserId?: number
) {
  await ensureStudentDataTables();
  await ensureDefaultAiConversations(user);

  const trimmedContent = content.trim();
  if (!trimmedContent && !recipientUserId) {
    throw new Error('Message content is required.');
  }

  if (recipientUserId && (!Number.isInteger(recipientUserId) || recipientUserId <= 0)) {
    throw new Error('Valid recipient is required.');
  }

  let resolvedConversationId = conversationId;
  if (!resolvedConversationId && recipientUserId) {
    const directConversation = await ensureDirectConversation(user.id, recipientUserId);
    resolvedConversationId = directConversation.senderConversationId;
    if (!trimmedContent) {
      return;
    }
  }

  const conversationResult = await pool.query(
    `SELECT id, name, contact_type, counterpart_user_id
     FROM student_conversations
     WHERE id = $1 AND user_id = $2`,
    [resolvedConversationId, user.id]
  );

  const conversation = conversationResult.rows[0];
  if (!conversation) {
    throw new Error('Conversation not found.');
  }

  await pool.query(
    `INSERT INTO student_conversation_messages (conversation_id, role, sender_name, content)
     VALUES ($1, 'me', $2, $3)`,
    [resolvedConversationId, `${user.firstName} ${user.lastName}`.trim(), trimmedContent]
  );

  if (conversation.contact_type.startsWith('direct:') && conversation.counterpart_user_id) {
    const mirrored = await ensureDirectConversation(user.id, Number(conversation.counterpart_user_id));
    await pool.query(
      `INSERT INTO student_conversation_messages (conversation_id, role, sender_name, content)
       VALUES ($1, 'other', $2, $3)`,
      [mirrored.recipientConversationId, `${user.firstName} ${user.lastName}`.trim(), trimmedContent]
    );
    await pool.query(
      `UPDATE student_conversations
       SET unread = unread + 1
       WHERE id = $1`,
      [mirrored.recipientConversationId]
    );

    const counterpartResult = await pool.query(
      `SELECT first_name, last_name, email
       FROM users
       WHERE id = $1`,
      [conversation.counterpart_user_id]
    );
    const counterpart = counterpartResult.rows[0];
    if (counterpart?.email) {
      void sendDirectMessageNotificationEmail({
        toEmail: counterpart.email,
        recipientName: `${counterpart.first_name ?? ''} ${counterpart.last_name ?? ''}`.trim() || counterpart.email,
        senderName: `${user.firstName} ${user.lastName}`.trim() || user.email,
        messagePreview: trimmedContent,
      });
    }

    return;
  }

  const specialist = getAiSpecialistForConversation(conversation.contact_type);
  if (!specialist) {
    return;
  }

  const result = await runLocalSpecialist({
    specialist,
    message: trimmedContent,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      university: user.university,
      countryOfOrigin: user.countryOfOrigin,
      userType: user.userType,
    },
  });

  await pool.query(
    `INSERT INTO student_conversation_messages (conversation_id, role, sender_name, content)
     VALUES ($1, 'other', $2, $3)`,
    [conversationId, conversation.name, result.response]
  );
}

export async function getFoodData(user: SafeUser) {
  await ensureStudentDataTables();
  const items = await pool.query(
    `SELECT id, name, price, delivery_fee, kitchen, prep_time, rating, image_url, tags, created_by_user_id
     FROM food_menu_items
     WHERE is_active = TRUE
     ORDER BY id ASC`
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
      supplierUserId: row.created_by_user_id ?? null,
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
  data: { itemId: number; fulfillment: string }
) {
  await ensureStudentDataTables();
  const itemResult = await pool.query(
    `SELECT id, name, price, delivery_fee, created_by_user_id
     FROM food_menu_items
     WHERE id = $1 AND is_active = TRUE`,
    [data.itemId]
  );

  const item = itemResult.rows[0];
  if (!item) {
    throw new Error('Menu item not found.');
  }

  const total = Number(item.price) + (data.fulfillment.trim() === 'Delivery' ? Number(item.delivery_fee ?? 0) : 0);

  await pool.query(
    `INSERT INTO student_food_orders (user_id, item_id, supplier_user_id, item_name, total, fulfillment, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'Initialized')`,
    [user.id, item.id, item.created_by_user_id ?? null, item.name, total, data.fulfillment.trim()]
  );

  return {
    itemName: String(item.name ?? ''),
    total,
    fulfillment: data.fulfillment.trim(),
    supplierUserId: Number(item.created_by_user_id ?? 0) || null,
  };
}

export async function getArrivalBooking(user: SafeUser): Promise<ArrivalBooking> {
  await ensureStudentDataTables();
  const result = await pool.query(
    `SELECT id, airport_code, destination, pickup_status, pickup_booked, notes, assigned_transport_user_id, assigned_vehicle_id
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
    assignedTransportUserId: row?.assigned_transport_user_id ?? null,
    assignedVehicleId: row?.assigned_vehicle_id ?? null,
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
                   assigned_transport_user_id = NULL,
                   assigned_vehicle_id = NULL,
                   updated_at = NOW()`,
    [user.id, data.destination.trim(), data.pickupBooked ? 'Booked' : 'Not booked', data.pickupBooked, data.notes.trim()]
  );
}

export async function getTransportFleetVehicles(user: SafeUser): Promise<TransportFleetVehicle[]> {
  await ensureStudentDataTables();
  const result = await pool.query(
    `SELECT id, model, plate, capacity, status, service_status, image_url, last_service_date, insurance_status
     FROM transport_fleet_vehicles
     WHERE created_by_user_id = $1
     ORDER BY created_at DESC, id DESC`,
    [user.id]
  );

  return result.rows.map((row) => ({
    id: row.id,
    model: row.model,
    plate: row.plate,
    capacity: row.capacity,
    status: row.status,
    serviceStatus: row.service_status,
    imageUrl: row.image_url,
    lastServiceDate: row.last_service_date,
    insuranceStatus: row.insurance_status,
  }));
}

export async function createTransportFleetVehicle(
  user: SafeUser,
  data: {
    model: string;
    plate: string;
    capacity: string;
    status?: string;
    serviceStatus?: string;
    imageUrl?: string;
    lastServiceDate?: string;
    insuranceStatus?: string;
  }
) {
  await ensureStudentDataTables();
  await pool.query(
    `INSERT INTO transport_fleet_vehicles (
       created_by_user_id, model, plate, capacity, status, service_status, image_url, last_service_date, insurance_status, created_at, updated_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
    [
      user.id,
      data.model.trim(),
      data.plate.trim().toUpperCase(),
      data.capacity.trim(),
      data.status?.trim() || 'Active',
      data.serviceStatus?.trim() || 'Passed',
      data.imageUrl?.trim() || 'https://picsum.photos/seed/ebenesaid-fleet/600/400',
      data.lastServiceDate?.trim() || '',
      data.insuranceStatus?.trim() || 'Verified',
    ]
  );
}

export async function updateTransportFleetVehicleStatus(
  user: SafeUser,
  vehicleId: number,
  status: string
) {
  await ensureStudentDataTables();
  const result = await pool.query(
    `UPDATE transport_fleet_vehicles
     SET status = $3,
         updated_at = NOW()
     WHERE id = $1 AND created_by_user_id = $2
     RETURNING id`,
    [vehicleId, user.id, status.trim()]
  );

  return Boolean(result.rows[0]);
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
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    throw new Error('Support message content is required.');
  }

  await pool.query(
    `INSERT INTO student_support_messages (user_id, role, content)
     VALUES ($1, 'user', $2), ($1, 'admin', $3)`,
    [
      user.id,
      trimmedContent,
      'Thanks for contacting support. A team member will review your request and follow up shortly.',
    ]
  );

  void sendSupportReceivedEmail({
    toEmail: user.email,
    firstName: user.firstName,
    messagePreview: trimmedContent,
  });

  const adminRecipient = getAdminAlertRecipient();
  if (adminRecipient) {
    void sendAdminAlertEmail({
      toEmail: adminRecipient,
      title: 'New support request received',
      intro: 'A new support request was submitted on EBENESAID and is waiting for team review.',
      highlights: [
        { label: 'User', value: `${user.firstName} ${user.lastName}`.trim() || user.email },
        { label: 'Email', value: user.email },
        { label: 'Account type', value: user.userType },
      ],
      body: [trimmedContent],
      action: {
        label: 'Open Support Inbox',
        href: `${(process.env.NEXT_PUBLIC_APP_URL || 'https://ebenesaid.com').replace(/\/$/, '')}/admin/support`,
      },
    });
  }
}

export async function getAdminSupportInbox() {
  await ensureStudentDataTables();

  const threads = await pool.query(
    `SELECT u.id AS user_id, u.first_name, u.last_name, u.email, u.user_type,
            COALESCE(last_msg.content, '') AS last_msg,
            COALESCE(last_msg.created_at, u.created_at) AS last_time,
            COUNT(*) FILTER (WHERE s.role = 'user') AS unread
     FROM users u
     LEFT JOIN student_support_messages s ON s.user_id = u.id
     LEFT JOIN LATERAL (
       SELECT content, created_at
       FROM student_support_messages
       WHERE user_id = u.id
       ORDER BY created_at DESC
       LIMIT 1
     ) last_msg ON TRUE
     WHERE EXISTS (
       SELECT 1 FROM student_support_messages existing WHERE existing.user_id = u.id
     )
     GROUP BY u.id, u.first_name, u.last_name, u.email, u.user_type, last_msg.content, last_msg.created_at, u.created_at
     ORDER BY last_time DESC`
  );

  return threads.rows.map(row => ({
    userId: row.user_id,
    name: `${row.first_name} ${row.last_name}`.trim(),
    email: row.email,
    type: row.user_type,
    lastMsg: row.last_msg,
    time: formatTimeLabel(row.last_time),
    unread: Number(row.unread ?? 0),
  })) as AdminSupportThread[];
}

export async function getAdminSupportMessages(userId: number): Promise<SupportMessage[]> {
  await ensureStudentDataTables();
  const result = await pool.query(
    `SELECT id, role, content, created_at
     FROM student_support_messages
     WHERE user_id = $1
     ORDER BY created_at ASC`,
    [userId]
  );

  return result.rows.map(row => ({
    id: row.id,
    role: row.role,
    content: row.content,
    time: formatTimeLabel(row.created_at),
  }));
}

export async function sendAdminSupportReply(userId: number, content: string) {
  await ensureStudentDataTables();
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    throw new Error('Reply content is required.');
  }

  await pool.query(
    `INSERT INTO student_support_messages (user_id, role, content)
     VALUES ($1, 'admin', $2)`,
    [userId, trimmedContent]
  );

  const userResult = await pool.query(
    `SELECT first_name, email
     FROM users
     WHERE id = $1`,
    [userId]
  );

  const row = userResult.rows[0];
  if (row?.email) {
    void sendPlatformAnnouncementEmail({
      toEmail: row.email,
      firstName: row.first_name || 'there',
      subject: 'New reply from EBENESAID support',
      title: 'Support replied to your request',
      intro: 'The EBENESAID support team has sent you a new reply in your support thread.',
      body: [
        trimmedContent,
        'Open your support area in the platform to review the full conversation and continue the discussion if needed.',
      ],
      action: {
        label: 'Open Support',
        href: `${(process.env.NEXT_PUBLIC_APP_URL || 'https://ebenesaid.com').replace(/\/$/, '')}/support`,
      },
    });
  }
}

function toBillingProfile(
  user: SafeUser,
  row?: Record<string, unknown>
): StudentBillingProfile {
  return {
    billingName: String(row?.billing_name ?? `${user.firstName} ${user.lastName}`.trim()),
    billingEmail: String(row?.billing_email ?? user.email ?? ''),
    billingPhone: String(row?.billing_phone ?? user.phone ?? ''),
    billingCountry: String(row?.billing_country ?? user.countryOfOrigin ?? ''),
    billingCurrency: String(row?.billing_currency ?? 'EUR'),
    billingAddress: String(row?.billing_address ?? ''),
    providerPreference: String(row?.provider_preference ?? 'stripe') === 'flutterwave' ? 'flutterwave' : 'stripe',
    stripeCustomerEmail: String(row?.stripe_customer_email ?? user.email ?? ''),
    stripeCustomerId: String(row?.stripe_customer_id ?? ''),
    stripePaymentMethodLabel: String(row?.stripe_payment_method_label ?? ''),
    stripeCheckoutMode: String(row?.stripe_checkout_mode ?? 'card'),
    flutterwaveCustomerEmail: String(row?.flutterwave_customer_email ?? user.email ?? ''),
    flutterwaveCustomerId: String(row?.flutterwave_customer_id ?? ''),
    flutterwavePaymentMethod: String(row?.flutterwave_payment_method ?? 'card'),
    flutterwaveMobileMoneyProvider: String(row?.flutterwave_mobile_money_provider ?? ''),
    flutterwaveReference: String(row?.flutterwave_reference ?? ''),
    invoiceEmail: String(row?.invoice_email ?? user.email ?? ''),
    autoRenew: Boolean(row?.auto_renew ?? false),
  };
}

export async function getStudentBillingProfile(user: SafeUser): Promise<StudentBillingProfile> {
  await ensureStudentDataTables();
  const result = await pool.query(
    `SELECT billing_name, billing_email, billing_phone, billing_country, billing_currency, billing_address,
            provider_preference, stripe_customer_email, stripe_customer_id, stripe_payment_method_label, stripe_checkout_mode,
            flutterwave_customer_email, flutterwave_customer_id, flutterwave_payment_method, flutterwave_mobile_money_provider,
            flutterwave_reference, invoice_email, auto_renew
     FROM student_billing_profiles
     WHERE user_id = $1`,
    [user.id]
  );

  return toBillingProfile(user, result.rows[0]);
}

export async function updateStudentBillingProfile(
  user: SafeUser,
  data: StudentBillingProfile
): Promise<StudentBillingProfile> {
  await ensureStudentDataTables();
  const result = await pool.query(
    `INSERT INTO student_billing_profiles (
        user_id, billing_name, billing_email, billing_phone, billing_country, billing_currency, billing_address,
        provider_preference, stripe_customer_email, stripe_customer_id, stripe_payment_method_label, stripe_checkout_mode,
        flutterwave_customer_email, flutterwave_customer_id, flutterwave_payment_method, flutterwave_mobile_money_provider,
        flutterwave_reference, invoice_email, auto_renew, updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16,
        $17, $18, $19, NOW()
      )
      ON CONFLICT (user_id)
      DO UPDATE SET
        billing_name = EXCLUDED.billing_name,
        billing_email = EXCLUDED.billing_email,
        billing_phone = EXCLUDED.billing_phone,
        billing_country = EXCLUDED.billing_country,
        billing_currency = EXCLUDED.billing_currency,
        billing_address = EXCLUDED.billing_address,
        provider_preference = EXCLUDED.provider_preference,
        stripe_customer_email = EXCLUDED.stripe_customer_email,
        stripe_customer_id = EXCLUDED.stripe_customer_id,
        stripe_payment_method_label = EXCLUDED.stripe_payment_method_label,
        stripe_checkout_mode = EXCLUDED.stripe_checkout_mode,
        flutterwave_customer_email = EXCLUDED.flutterwave_customer_email,
        flutterwave_customer_id = EXCLUDED.flutterwave_customer_id,
        flutterwave_payment_method = EXCLUDED.flutterwave_payment_method,
        flutterwave_mobile_money_provider = EXCLUDED.flutterwave_mobile_money_provider,
        flutterwave_reference = EXCLUDED.flutterwave_reference,
        invoice_email = EXCLUDED.invoice_email,
        auto_renew = EXCLUDED.auto_renew,
        updated_at = NOW()
      RETURNING billing_name, billing_email, billing_phone, billing_country, billing_currency, billing_address,
                provider_preference, stripe_customer_email, stripe_customer_id, stripe_payment_method_label, stripe_checkout_mode,
                flutterwave_customer_email, flutterwave_customer_id, flutterwave_payment_method, flutterwave_mobile_money_provider,
                flutterwave_reference, invoice_email, auto_renew`,
    [
      user.id,
      data.billingName.trim(),
      data.billingEmail.trim().toLowerCase(),
      data.billingPhone.trim(),
      data.billingCountry.trim(),
      data.billingCurrency.trim().toUpperCase(),
      data.billingAddress.trim(),
      data.providerPreference === 'flutterwave' ? 'flutterwave' : 'stripe',
      data.stripeCustomerEmail.trim().toLowerCase(),
      data.stripeCustomerId.trim(),
      data.stripePaymentMethodLabel.trim(),
      data.stripeCheckoutMode.trim(),
      data.flutterwaveCustomerEmail.trim().toLowerCase(),
      data.flutterwaveCustomerId.trim(),
      data.flutterwavePaymentMethod.trim(),
      data.flutterwaveMobileMoneyProvider.trim(),
      data.flutterwaveReference.trim(),
      data.invoiceEmail.trim().toLowerCase(),
      data.autoRenew,
    ]
  );

  return toBillingProfile(user, result.rows[0]);
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
