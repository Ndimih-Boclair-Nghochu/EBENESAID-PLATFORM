import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getPlatformPricingSettings, updatePlatformPricingSettings } from '@/lib/db';

function requireAdmin(userType?: string) {
  return userType === 'admin' || userType === 'staff';
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !requireAdmin(user.userType)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const pricing = await getPlatformPricingSettings();
  return NextResponse.json({ pricing }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !requireAdmin(user.userType)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const body = await request.json();
  const pricing = await updatePlatformPricingSettings({
    studentFeeEur: Number(body.studentFeeEur),
    partnerDeductionPercent: Number(body.partnerDeductionPercent),
  });

  return NextResponse.json({ pricing }, { status: 200 });
}
