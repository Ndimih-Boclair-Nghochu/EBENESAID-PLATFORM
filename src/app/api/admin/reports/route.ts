import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { dbPool as pool } from '@/lib/postgres';
import { isAdminRole } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !isAdminRole(user.userType)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const reports: Array<Record<string, string | number>> = [];

    try {
      const pendingListings = await pool.query(
        `SELECT id, title, details, status, updated_at
         FROM property_listings
         WHERE status <> 'Verified'
         ORDER BY updated_at DESC`
      );
      reports.push(
        ...pendingListings.rows.map(row => ({
          id: `listing-${row.id}`,
          type: 'Housing',
          subject: row.title,
          reporter: 'Platform Inventory',
          target: 'Property Listing',
          status: 'Pending',
          date: row.updated_at,
          desc: row.details,
          href: '/agent/listings',
        }))
      );
    } catch {}

    try {
      const pendingCircles = await pool.query(
        `SELECT id, name, description, created_at
         FROM community_circles
         WHERE status = 'pending'
         ORDER BY created_at DESC`
      );
      reports.push(
        ...pendingCircles.rows.map(row => ({
          id: `circle-${row.id}`,
          type: 'Circle',
          subject: row.name,
          reporter: 'Student Circle',
          target: 'Community Request',
          status: 'Pending',
          date: row.created_at,
          desc: row.description,
          href: '/admin/verification',
        }))
      );
    } catch {}

    try {
      const supportCases = await pool.query(
        `SELECT s.id, s.content, s.created_at, u.first_name, u.last_name, u.email
         FROM student_support_messages s
         JOIN users u ON u.id = s.user_id
         WHERE s.role = 'user'
         ORDER BY s.created_at DESC
         LIMIT 20`
      );
      reports.push(
        ...supportCases.rows.map(row => ({
          id: `support-${row.id}`,
          type: 'Support',
          subject: `Support request from ${row.first_name} ${row.last_name}`.trim(),
          reporter: row.email,
          target: 'Admin Support',
          status: 'In Review',
          date: row.created_at,
          desc: row.content,
          href: '/admin/support',
        }))
      );
    } catch {}

    const sorted = reports
      .sort((a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime())
      .map(report => ({
        ...report,
        dateLabel: new Date(String(report.date)).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

    return NextResponse.json({ reports: sorted }, { status: 200 });
  } catch (error) {
    console.error('Admin reports load error:', error);
    return NextResponse.json({ error: 'Failed to load reports.' }, { status: 500 });
  }
}
