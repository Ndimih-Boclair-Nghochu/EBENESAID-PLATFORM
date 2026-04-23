import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { dbPool as pool } from '@/lib/postgres';
import { hasAnyRole } from '@/lib/rbac';

async function safeCount(query: string) {
  try {
    const result = await pool.query(query);
    return Number(result.rows[0]?.count ?? 0);
  } catch {
    return 0;
  }
}

async function safeRows<T>(query: string): Promise<T[]> {
  try {
    const result = await pool.query(query);
    return result.rows as T[];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['investor', 'admin'])) {
    return NextResponse.json({ error: 'Investor access required.' }, { status: 403 });
  }

  const [
    students,
    partners,
    investors,
    listings,
    jobs,
    foodItems,
    transportBookings,
    completedStudentPayments,
    partnerTransactions,
    studentRevenueRows,
    partnerNetRows,
  ] = await Promise.all([
    safeCount(`SELECT COUNT(*) FROM users WHERE user_type = 'student'`),
    safeCount(`SELECT COUNT(*) FROM users WHERE user_type IN ('university', 'agent', 'job_partner', 'supplier', 'transport')`),
    safeCount(`SELECT COUNT(*) FROM users WHERE user_type = 'investor'`),
    safeCount(`SELECT COUNT(*) FROM property_listings`),
    safeCount(`SELECT COUNT(*) FROM job_listings`),
    safeCount(`SELECT COUNT(*) FROM food_menu_items WHERE is_active = TRUE`),
    safeCount(`SELECT COUNT(*) FROM student_arrival_bookings`),
    safeCount(`SELECT COUNT(*) FROM student_platform_payments WHERE status = 'completed'`),
    safeCount(`SELECT COUNT(*) FROM partner_transactions`),
    safeRows<{ total: string }>(`SELECT COALESCE(SUM(amount_eur), 0) AS total FROM student_platform_payments WHERE status = 'completed'`),
    safeRows<{ total: string }>(`SELECT COALESCE(SUM(net_amount_eur), 0) AS total FROM partner_transactions WHERE status = 'completed'`),
  ]);

  const recentActivity = await safeRows<{ label: string; created_at: string }>(
    `SELECT label, created_at FROM (
       SELECT 'Student payment completed' AS label, created_at FROM student_platform_payments WHERE status = 'completed'
       UNION ALL
       SELECT 'Partner transaction recorded' AS label, created_at FROM partner_transactions
       UNION ALL
       SELECT 'New user account created' AS label, created_at FROM users
     ) activity
     ORDER BY created_at DESC
     LIMIT 6`
  );

  return NextResponse.json(
    {
      metrics: {
        students,
        partners,
        investors,
        listings,
        jobs,
        foodItems,
        transportBookings,
        completedStudentPayments,
        partnerTransactions,
        studentRevenueEur: Number(studentRevenueRows[0]?.total ?? 0),
        partnerNetEur: Number(partnerNetRows[0]?.total ?? 0),
      },
      updates: [
        {
          title: 'Partner network expansion',
          body: `${partners} operational partner accounts are active across education, housing, employment, food, and transport modules.`,
        },
        {
          title: 'Student pipeline',
          body: `${students} student accounts are currently represented in the platform database.`,
        },
        {
          title: 'Service marketplace',
          body: `${listings + jobs + foodItems + transportBookings} marketplace and service records are available across the platform modules.`,
        },
      ],
      recentActivity: recentActivity.map((item) => ({
        label: item.label,
        timeLabel: new Date(item.created_at).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
      })),
    },
    { status: 200 }
  );
}
