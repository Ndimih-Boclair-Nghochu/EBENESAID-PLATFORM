import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { createFoodOrder, getFoodData } from '@/lib/student-account';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const data = await getFoodData(user);
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  try {
    const body = await request.json();
    await createFoodOrder(user, {
      itemId: Number(body.itemId),
      fulfillment: String(body.fulfillment ?? ''),
    });
    const data = await getFoodData(user);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Food order error:', error);
    return NextResponse.json({ error: 'Failed to create food order.' }, { status: 500 });
  }
}
