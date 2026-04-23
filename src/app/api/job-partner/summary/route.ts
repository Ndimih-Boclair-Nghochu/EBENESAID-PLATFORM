import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getPartnerFinanceSummary, getPartnerProfile, getPlatformPricingSettings } from '@/lib/db';
import { hasAnyRole } from '@/lib/rbac';
import { getJobPartnerApplicants, getJobPartnerListings } from '@/lib/student-account';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['job_partner', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'Employer access required.' }, { status: 403 });
  }

  try {
    const [jobs, applicants, partnerProfile, finance, pricing] = await Promise.all([
      getJobPartnerListings(user),
      getJobPartnerApplicants(user),
      getPartnerProfile(user.id),
      getPartnerFinanceSummary(user.id),
      getPlatformPricingSettings(),
    ]);

    return NextResponse.json(
      {
        jobs,
        applicants,
        partnerProfile,
        finance,
        commissionPercent: partnerProfile?.commissionPercent ?? pricing.partnerDeductionPercent,
        metrics: {
          totalJobs: jobs.length,
          openJobs: jobs.filter((job) => job.status === 'Open').length,
          totalApplicants: applicants.length,
          shortlistedApplicants: applicants.filter((applicant) => applicant.status === 'Shortlisted').length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Job partner summary load error:', error);
    return NextResponse.json({ error: 'Failed to load employer dashboard.' }, { status: 500 });
  }
}
