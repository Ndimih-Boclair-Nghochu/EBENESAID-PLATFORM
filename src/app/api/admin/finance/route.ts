import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getAdminFinanceLedger, getPlatformPricingSettings } from '@/lib/db';
import { isAdminRole } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !isAdminRole(user.userType)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const limit = Number(request.nextUrl.searchParams.get('limit') ?? 25);
    const [ledger, pricing] = await Promise.all([
      getAdminFinanceLedger(limit),
      getPlatformPricingSettings(),
    ]);

    return NextResponse.json({ ledger, pricing }, { status: 200 });
  } catch (error) {
    console.error('Admin finance ledger error:', error);
    return NextResponse.json({ error: 'Failed to load finance ledger.' }, { status: 500 });
  }
}
