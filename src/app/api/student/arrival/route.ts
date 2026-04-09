import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getArrivalBooking, saveArrivalBooking } from '@/lib/student-account';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const booking = await getArrivalBooking(user);
  return NextResponse.json({ booking }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  try {
    const body = await request.json();
    await saveArrivalBooking(user, {
      destination: String(body.destination ?? ''),
      pickupBooked: Boolean(body.pickupBooked),
      notes: String(body.notes ?? ''),
    });
    const booking = await getArrivalBooking(user);
    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.error('Arrival save error:', error);
    return NextResponse.json({ error: 'Failed to save arrival booking.' }, { status: 500 });
  }
}
