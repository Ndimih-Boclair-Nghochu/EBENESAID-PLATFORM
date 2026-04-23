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
    const partnerAccounts = await pool.query(
      `SELECT id, first_name, last_name, email, university, created_at
       FROM users
       WHERE user_type = 'university'
       ORDER BY created_at DESC`
    );

    const studentCounts = await pool.query(
      `SELECT university, COUNT(*) AS students
       FROM users
       WHERE user_type = 'student' AND TRIM(COALESCE(university, '')) <> ''
       GROUP BY university`
    );

    const byUniversity = new Map(
      studentCounts.rows.map(row => [String(row.university), Number(row.students)])
    );

    const institutions = partnerAccounts.rows.map(row => ({
      id: row.id,
      name: row.university || `${row.first_name} ${row.last_name}`.trim(),
      contactEmail: row.email,
      students: byUniversity.get(row.university) ?? 0,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ institutions }, { status: 200 });
  } catch (error) {
    console.error('Admin institutions load error:', error);
    return NextResponse.json({ error: 'Failed to load institutions.' }, { status: 500 });
  }
}
