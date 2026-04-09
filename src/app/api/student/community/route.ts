import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { createCircleMessage, getCommunityData, joinCircle } from '@/lib/student-account';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const data = await getCommunityData(user);
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  try {
    const body = await request.json();
    const action = String(body.action ?? '');

    if (action === 'join') {
      await joinCircle(user, Number(body.circleId));
    } else if (action === 'message') {
      await createCircleMessage(user, Number(body.circleId), String(body.content ?? ''));
    } else {
      return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
    }

    const data = await getCommunityData(user);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Community action error:', error);
    return NextResponse.json({ error: 'Failed to update community data.' }, { status: 500 });
  }
}
