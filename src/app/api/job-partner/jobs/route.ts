import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import {
  createJobPartnerListing,
  getJobPartnerApplicants,
  getJobPartnerListings,
  updateJobApplicationStatus,
  updateJobPartnerListing,
} from '@/lib/student-account';
import { hasAnyRole } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['job_partner', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'Employer access required.' }, { status: 403 });
  }

  try {
    const [jobs, applicants] = await Promise.all([
      getJobPartnerListings(user),
      getJobPartnerApplicants(user),
    ]);

    return NextResponse.json({ jobs, applicants }, { status: 200 });
  } catch (error) {
    console.error('Job partner jobs load error:', error);
    return NextResponse.json({ error: 'Failed to load employer jobs.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['job_partner', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'Employer access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const title = String(body.title ?? '').trim();
    const company = String(body.company ?? '').trim();
    const location = String(body.location ?? '').trim();
    const salary = String(body.salary ?? '').trim();
    const type = String(body.type ?? '').trim();
    const description = String(body.description ?? '').trim();

    if (!title || !company || !location || !salary || !type || !description) {
      return NextResponse.json({ error: 'Title, company, location, salary, type, and description are required.' }, { status: 400 });
    }

    await createJobPartnerListing(user, {
      title,
      company,
      location,
      salary,
      type,
      description,
      category: String(body.category ?? ''),
      requirements: String(body.requirements ?? ''),
      status: String(body.status ?? 'Open'),
      logo: String(body.logo ?? ''),
    });

    const jobs = await getJobPartnerListings(user);
    return NextResponse.json({ jobs }, { status: 201 });
  } catch (error) {
    console.error('Job partner job create error:', error);
    return NextResponse.json({ error: 'Failed to create employer job.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['job_partner', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'Employer access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (body.mode === 'application') {
      const applicationId = Number(body.applicationId);
      const status = String(body.status ?? '').trim();

      if (!Number.isInteger(applicationId) || applicationId <= 0 || !status) {
        return NextResponse.json({ error: 'Valid application and status are required.' }, { status: 400 });
      }

      const updated = await updateJobApplicationStatus(user, applicationId, status);
      if (!updated) {
        return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
      }

      const applicants = await getJobPartnerApplicants(user);
      return NextResponse.json({ applicants }, { status: 200 });
    }

    const listingId = Number(body.listingId);
    if (!Number.isInteger(listingId) || listingId <= 0) {
      return NextResponse.json({ error: 'Valid listing id is required.' }, { status: 400 });
    }

    const updated = await updateJobPartnerListing(user, listingId, {
      title: String(body.title ?? '').trim(),
      company: String(body.company ?? '').trim(),
      location: String(body.location ?? '').trim(),
      salary: String(body.salary ?? '').trim(),
      type: String(body.type ?? '').trim(),
      description: String(body.description ?? '').trim(),
      category: String(body.category ?? '').trim(),
      requirements: String(body.requirements ?? '').trim(),
      status: String(body.status ?? 'Open').trim(),
      logo: String(body.logo ?? '').trim(),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Job listing not found.' }, { status: 404 });
    }

    const jobs = await getJobPartnerListings(user);
    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error('Job partner job update error:', error);
    return NextResponse.json({ error: 'Failed to update employer records.' }, { status: 500 });
  }
}
