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

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['staff', 'admin'])) {
    return NextResponse.json({ error: 'Staff access required.' }, { status: 403 });
  }

  const [pendingListings, pendingCircles, supportThreads, activeStudents, openPickups, activeOrders] = await Promise.all([
    safeCount(`SELECT COUNT(*) FROM property_listings WHERE status <> 'Verified'`),
    safeCount(`SELECT COUNT(*) FROM community_circles WHERE status = 'pending'`),
    safeCount(`SELECT COUNT(DISTINCT user_id) FROM student_support_messages`),
    safeCount(`SELECT COUNT(*) FROM users WHERE user_type = 'student' AND is_active = TRUE`),
    safeCount(`SELECT COUNT(*) FROM student_arrival_bookings WHERE pickup_status <> 'Completed'`),
    safeCount(`SELECT COUNT(*) FROM student_food_orders WHERE status <> 'Delivered' AND status <> 'Cancelled'`),
  ]);

  return NextResponse.json(
    {
      metrics: {
        pendingVerifications: pendingListings + pendingCircles,
        supportThreads,
        activeStudents,
        openPickups,
        activeOrders,
      },
      workQueues: [
        { name: 'Housing verification', count: pendingListings, href: '/staff/verification' },
        { name: 'Community approvals', count: pendingCircles, href: '/staff/verification' },
        { name: 'Support conversations', count: supportThreads, href: '/staff/support' },
        { name: 'Open transport pickups', count: openPickups, href: '/transport/pickups' },
        { name: 'Active food orders', count: activeOrders, href: '/supplier/orders' },
      ],
    },
    { status: 200 }
  );
}
