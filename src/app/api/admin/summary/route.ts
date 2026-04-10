import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function requireAdmin(userType?: string) {
  return userType === 'admin' || userType === 'staff';
}

async function safeCount(query: string, values: unknown[] = []) {
  try {
    const result = await pool.query(query, values);
    return Number(result.rows[0]?.count ?? 0);
  } catch {
    return 0;
  }
}

async function safeRows<T>(query: string, values: unknown[] = []): Promise<T[]> {
  try {
    const result = await pool.query(query, values);
    return result.rows as T[];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !requireAdmin(user.userType)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const totalStudents = await safeCount(`SELECT COUNT(*) FROM users WHERE user_type = 'student'`);
    const totalUsers = await safeCount(`SELECT COUNT(*) FROM users`);
    const partnerUniversities = await safeCount(`SELECT COUNT(*) FROM users WHERE user_type = 'university'`);
    const houseAgents = await safeCount(`SELECT COUNT(*) FROM users WHERE user_type = 'agent'`);
    const suppliers = await safeCount(`SELECT COUNT(*) FROM users WHERE user_type = 'supplier'`);
    const transportPartners = await safeCount(`SELECT COUNT(*) FROM users WHERE user_type = 'transport'`);
    const activeJobs = await safeCount(`SELECT COUNT(*) FROM job_listings`);
    const verifiedListings = await safeCount(`SELECT COUNT(*) FROM property_listings WHERE status = 'Verified'`);
    const pendingListings = await safeCount(`SELECT COUNT(*) FROM property_listings WHERE status <> 'Verified'`);
    const pendingCircles = await safeCount(`SELECT COUNT(*) FROM community_circles WHERE status = 'pending'`);
    const totalDocuments = await safeCount(`SELECT COUNT(*) FROM student_documents`);
    const totalFoodItems = await safeCount(`SELECT COUNT(*) FROM food_menu_items`);
    const totalArrivalBookings = await safeCount(`SELECT COUNT(*) FROM student_arrival_bookings`);
    const totalPayments = await safeCount(`SELECT COUNT(*) FROM student_platform_payments`);

    const paymentRevenueRows = await safeRows<{ total: string }>(
      `SELECT COALESCE(SUM(amount_eur), 0) AS total FROM student_platform_payments WHERE status = 'completed'`
    );
    const platformRevenue = Number(paymentRevenueRows[0]?.total ?? 0);

    const taskProgressRows = await safeRows<{ done_count: string; total_count: string }>(
      `SELECT COUNT(*) FILTER (WHERE done = TRUE) AS done_count, COUNT(*) AS total_count
       FROM student_dashboard_tasks`
    );
    const doneCount = Number(taskProgressRows[0]?.done_count ?? 0);
    const totalTaskCount = Number(taskProgressRows[0]?.total_count ?? 0);
    const complianceRate = totalTaskCount > 0 ? Math.round((doneCount / totalTaskCount) * 100) : 0;

    const enrollmentData = await safeRows<{ month: string; students: string; verified: string }>(
      `SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month,
              COUNT(*) FILTER (WHERE user_type = 'student') AS students,
              COUNT(*) FILTER (WHERE user_type = 'student' AND is_active = TRUE) AS verified
       FROM users
       WHERE created_at >= NOW() - INTERVAL '6 months'
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY DATE_TRUNC('month', created_at)`
    );

    const topUniversities = await safeRows<{ name: string; students: string }>(
      `SELECT university AS name, COUNT(*) AS students
       FROM users
       WHERE user_type = 'student' AND TRIM(COALESCE(university, '')) <> ''
       GROUP BY university
       ORDER BY COUNT(*) DESC, university ASC
       LIMIT 5`
    );

    const recentSupport = await safeRows<{ content: string; created_at: string }>(
      `SELECT content, created_at
       FROM student_support_messages
       ORDER BY created_at DESC
       LIMIT 3`
    );

    const recentPayments = await safeRows<{ provider: string; amount_eur: string; created_at: string }>(
      `SELECT provider, amount_eur, created_at
       FROM student_platform_payments
       ORDER BY created_at DESC
       LIMIT 3`
    );

    const recentListings = await safeRows<{ title: string; status: string; updated_at: string }>(
      `SELECT title, status, updated_at
       FROM property_listings
       ORDER BY updated_at DESC
       LIMIT 3`
    );

    const recentActivity = [
      ...recentSupport.map(item => ({
        type: 'support',
        message: item.content,
        time: item.created_at,
      })),
      ...recentPayments.map(item => ({
        type: 'payment',
        message: `${item.provider} payment recorded: EUR ${item.amount_eur}`,
        time: item.created_at,
      })),
      ...recentListings.map(item => ({
        type: 'listing',
        message: `${item.title} is ${item.status}`,
        time: item.updated_at,
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 6)
      .map(item => ({
        ...item,
        timeLabel: new Date(item.time).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

    return NextResponse.json(
      {
        overview: {
          totalStudents,
          totalUsers,
          partnerUniversities,
          houseAgents,
          suppliers,
          transportPartners,
          activeJobs,
          verifiedListings,
          pendingVerifications: pendingListings + pendingCircles,
          platformRevenue,
          complianceRate,
          platformHealth: 100,
        },
        modules: [
          { name: 'Verified Housing', active: verifiedListings, total: verifiedListings + pendingListings, href: '/accommodation' },
          { name: 'Career Board', active: activeJobs, total: activeJobs, href: '/jobs' },
          { name: 'Document Wallets', active: totalDocuments, total: totalDocuments, href: '/docs' },
          { name: 'Food Suppliers', active: totalFoodItems, total: totalFoodItems, href: '/food' },
          { name: 'Transport Fleet', active: totalArrivalBookings, total: totalArrivalBookings, href: '/arrival' },
          { name: 'Student Circles', active: await safeCount(`SELECT COUNT(*) FROM community_circles WHERE status = 'approved'`), total: await safeCount(`SELECT COUNT(*) FROM community_circles`), href: '/community' },
        ],
        enrollmentData: enrollmentData.map(row => ({
          month: row.month,
          students: Number(row.students),
          verified: Number(row.verified),
        })),
        topUniversities: topUniversities.map(row => ({
          name: row.name,
          students: Number(row.students),
        })),
        recentActivity,
        finance: {
          platformRevenue,
          totalPayments,
        },
        statistics: {
          totalStudents,
          verifiedListings,
          activeJobs,
          complianceRate,
        },
        institutions: {
          totalPartners: partnerUniversities,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin summary load error:', error);
    return NextResponse.json({ error: 'Failed to load admin summary.' }, { status: 500 });
  }
}
