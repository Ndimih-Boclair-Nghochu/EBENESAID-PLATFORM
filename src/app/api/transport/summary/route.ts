import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getPartnerFinanceSummary, getPartnerProfile, getPlatformPricingSettings } from '@/lib/db';
import { hasAnyRole } from '@/lib/rbac';

async function loadPickups(request: NextRequest) {
  const { GET } = await import('@/app/api/transport/pickups/route');
  return GET(request);
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['transport', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'Transport access required.' }, { status: 403 });
  }

  try {
    const [pickupsRes, partnerProfile, finance, pricing] = await Promise.all([
      loadPickups(request),
      getPartnerProfile(user.id),
      getPartnerFinanceSummary(user.id),
      getPlatformPricingSettings(),
    ]);
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
        partnerProfile,
        finance,
        commissionPercent: partnerProfile?.commissionPercent ?? pricing.partnerDeductionPercent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Transport summary load error:', error);
    return NextResponse.json({ error: 'Failed to load transport dashboard.' }, { status: 500 });
  }
}
