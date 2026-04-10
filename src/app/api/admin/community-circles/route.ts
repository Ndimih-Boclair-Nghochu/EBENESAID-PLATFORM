import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getCommunityApprovalRequests, reviewCommunityApprovalRequest } from '@/lib/student-account';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || user.userType !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const requests = await getCommunityApprovalRequests();
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error('Community approval queue load error:', error);
    return NextResponse.json({ error: 'Failed to load community approval queue.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || user.userType !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const circleId = Number(body.circleId);
    const decision = String(body.decision) === 'rejected' ? 'rejected' : 'approved';
    const rejectionReason = String(body.rejectionReason ?? '');

    if (!Number.isInteger(circleId) || circleId <= 0) {
      return NextResponse.json({ error: 'Valid circleId is required.' }, { status: 400 });
    }

    await reviewCommunityApprovalRequest(user, circleId, decision, rejectionReason);
    const requests = await getCommunityApprovalRequests();
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error('Community approval update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to review community request.' },
      { status: 500 }
    );
  }
}
