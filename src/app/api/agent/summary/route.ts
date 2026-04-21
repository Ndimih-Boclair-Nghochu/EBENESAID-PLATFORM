import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getPropertyListings } from '@/lib/db';

function requireAgent(userType?: string) {
  return userType === 'agent' || userType === 'admin' || userType === 'staff';
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !requireAgent(user.userType)) {
    return NextResponse.json({ error: 'Agent access required.' }, { status: 403 });
  }

  try {
    const listings = await getPropertyListings({
      createdByUserId: user.userType === 'agent' ? user.id : undefined,
      includePending: true,
    });

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
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Agent summary load error:', error);
    return NextResponse.json({ error: 'Failed to load agent dashboard.' }, { status: 500 });
  }
}
