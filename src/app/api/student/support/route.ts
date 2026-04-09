import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { createSupportMessage, getSupportMessages } from '@/lib/student-account';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const messages = await getSupportMessages(user);
  return NextResponse.json({ messages }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  try {
    const body = await request.json();
    await createSupportMessage(user, String(body.content ?? ''));
    const messages = await getSupportMessages(user);
    return NextResponse.json({ messages }, { status: 201 });
  } catch (error) {
    console.error('Support send error:', error);
    return NextResponse.json({ error: 'Failed to send support message.' }, { status: 500 });
  }
}
