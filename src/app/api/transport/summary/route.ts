import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';

async function loadPickups(request: NextRequest) {
  const { GET } = await import('@/app/api/transport/pickups/route');
  return GET(request);
}

function requireTransport(userType?: string) {
  return userType === 'transport' || userType === 'admin' || userType === 'staff';
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !requireTransport(user.userType)) {
    return NextResponse.json({ error: 'Transport access required.' }, { status: 403 });
  }

  try {
    const pickupsRes = await loadPickups(request);
    const data = await pickupsRes.json();
    if (!pickupsRes.ok) {
      return NextResponse.json({ error: data.error || 'Failed to load transport dashboard.' }, { status: pickupsRes.status });
    }

    const pickups = data.pickups ?? [];
    const booked = pickups.filter((pickup: { pickupBooked: boolean }) => pickup.pickupBooked).length;
    const completed = pickups.filter((pickup: { pickupStatus: string }) => pickup.pickupStatus === 'Completed').length;

    return NextResponse.json(
      {
        pickups,
        metrics: {
          totalPickups: pickups.length,
          booked,
          completed,
          pending: pickups.length - completed,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Transport summary load error:', error);
    return NextResponse.json({ error: 'Failed to load transport dashboard.' }, { status: 500 });
  }
}
