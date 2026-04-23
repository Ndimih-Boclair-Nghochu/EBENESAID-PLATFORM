import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getAdminSupportInbox, getAdminSupportMessages, sendAdminSupportReply } from '@/lib/student-account';
import { isOperationsRole } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !isOperationsRole(user.userType)) {
    return NextResponse.json({ error: 'Operations access required.' }, { status: 403 });
  }

  try {
    const userIdParam = request.nextUrl.searchParams.get('userId');
    const inbox = await getAdminSupportInbox();
    const activeUserId = userIdParam ? Number(userIdParam) : inbox[0]?.userId;
    const messages = activeUserId ? await getAdminSupportMessages(activeUserId) : [];

    return NextResponse.json({ inbox, activeUserId: activeUserId ?? null, messages }, { status: 200 });
  } catch (error) {
    console.error('Admin support load error:', error);
    return NextResponse.json({ error: 'Failed to load admin support inbox.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !isOperationsRole(user.userType)) {
    return NextResponse.json({ error: 'Operations access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const userId = Number(body.userId);
    const content = String(body.content ?? '');

    if (!Number.isInteger(userId) || userId <= 0 || !content.trim()) {
      return NextResponse.json({ error: 'Valid userId and reply content are required.' }, { status: 400 });
    }

    await sendAdminSupportReply(userId, content);
    const inbox = await getAdminSupportInbox();
    const messages = await getAdminSupportMessages(userId);
    return NextResponse.json({ inbox, activeUserId: userId, messages }, { status: 201 });
  } catch (error) {
    console.error('Admin support reply error:', error);
    return NextResponse.json({ error: 'Failed to send admin reply.' }, { status: 500 });
  }
}
