import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { applyToJob, getStudentJobs } from '@/lib/student-account';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const jobs = await getStudentJobs(user);
  return NextResponse.json({ jobs }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  try {
    const body = await request.json();
    await applyToJob(user, Number(body.jobId));
    const jobs = await getStudentJobs(user);
    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error('Job apply error:', error);
    return NextResponse.json({ error: 'Failed to apply to job.' }, { status: 500 });
  }
}
