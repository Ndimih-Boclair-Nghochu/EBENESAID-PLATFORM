import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { sendAdminSupportReply } from '@/lib/student-account';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function requireUniversity(userType?: string) {
  return userType === 'university' || userType === 'admin' || userType === 'staff';
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !requireUniversity(user.userType)) {
    return NextResponse.json({ error: 'University access required.' }, { status: 403 });
  }

  try {
    const university = String(user.university ?? '').trim();
    if (!university) {
      return NextResponse.json({ threads: [], activeStudentId: null, messages: [] }, { status: 200 });
    }

    const threadsResult = await pool.query(
      `SELECT u.id AS user_id, u.first_name, u.last_name, u.email, u.country_of_origin,
              COALESCE(last_msg.content, '') AS last_msg,
              COALESCE(last_msg.created_at, u.created_at) AS last_time
       FROM users u
       LEFT JOIN LATERAL (
         SELECT content, created_at
         FROM student_support_messages
         WHERE user_id = u.id
         ORDER BY created_at DESC
         LIMIT 1
       ) last_msg ON TRUE
       WHERE u.user_type = 'student' AND u.university = $1
       ORDER BY last_time DESC, u.id DESC`,
      [university]
    );

    const threads = threadsResult.rows.map(row => ({
      userId: row.user_id,
      name: `${row.first_name} ${row.last_name}`.trim(),
      email: row.email,
      country: row.country_of_origin ?? '',
      lastMsg: row.last_msg,
      lastTime: row.last_time,
    }));

    const userIdParam = request.nextUrl.searchParams.get('userId');
    const activeStudentId = userIdParam ? Number(userIdParam) : threads[0]?.userId ?? null;

    const messagesResult = activeStudentId
      ? await pool.query(
          `SELECT id, role, content, created_at
           FROM student_support_messages
           WHERE user_id = $1
           ORDER BY created_at ASC`,
          [activeStudentId]
        )
      : { rows: [] };

    return NextResponse.json(
      {
        threads,
        activeStudentId,
        messages: messagesResult.rows.map(row => ({
          id: row.id,
          role: row.role,
          content: row.content,
          createdAt: row.created_at,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('University chat load error:', error);
    return NextResponse.json({ error: 'Failed to load university chat.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !requireUniversity(user.userType)) {
    return NextResponse.json({ error: 'University access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const userId = Number(body.userId);
    const content = String(body.content ?? '').trim();

    if (!Number.isInteger(userId) || userId <= 0 || !content) {
      return NextResponse.json({ error: 'Valid userId and message content are required.' }, { status: 400 });
    }

    await sendAdminSupportReply(userId, content);
    return GET(new NextRequest(`${request.nextUrl.origin}/api/university/chat?userId=${userId}`, { headers: request.headers }));
  } catch (error) {
    console.error('University chat send error:', error);
    return NextResponse.json({ error: 'Failed to send university message.' }, { status: 500 });
  }
}
