import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getPartnerFinanceSummary, getPartnerProfile, getPlatformPricingSettings, getPropertyListings } from '@/lib/db';
import { hasAnyRole, shouldScopeListingsToOwner } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['agent', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'Agent access required.' }, { status: 403 });
  }

  try {
    const [listings, partnerProfile, finance, pricing] = await Promise.all([
      getPropertyListings({
        createdByUserId: shouldScopeListingsToOwner(user.userType) ? user.id : undefined,
        includePending: true,
      }),
      getPartnerProfile(user.id),
      getPartnerFinanceSummary(user.id),
      getPlatformPricingSettings(),
    ]);

    const totalLeads = listings.reduce((sum, listing) => sum + Number(listing.leads ?? 0), 0);
    const verifiedCount = listings.filter(listing => listing.status === 'Verified').length;
    const pendingCount = listings.filter(listing => listing.status !== 'Verified').length;
    const revenueEstimate = listings
      .filter(listing => listing.status === 'Verified')
      .reduce((sum, listing) => sum + Number(listing.price ?? 0), 0);

    return NextResponse.json(
      {
        listings,
        metrics: {
          activeListings: listings.length,
          totalLeads,
          verifiedCount,
          pendingCount,
          revenueEstimate,
        },
        partnerProfile,
        finance,
        commissionPercent: partnerProfile?.commissionPercent ?? pricing.partnerDeductionPercent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Agent summary load error:', error);
    return NextResponse.json({ error: 'Failed to load agent dashboard.' }, { status: 500 });
  }
}
