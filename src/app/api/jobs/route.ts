import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getUserById } from '@/lib/db';
import { sendPlatformAnnouncementEmail } from '@/lib/email';
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
    const application = await applyToJob(user, Number(body.jobId));
    const jobs = await getStudentJobs(user);

    if (application) {
      void sendPlatformAnnouncementEmail({
        toEmail: user.email,
        firstName: user.firstName,
        subject: 'Your EBENESAID job application was submitted',
        title: 'Job application received',
        intro: 'Your application has been recorded successfully on EBENESAID.',
        body: [
          `Position: ${application.title}`,
          `Company: ${application.company}`,
          'You can continue tracking your opportunities from the jobs module in your account.',
        ],
        action: {
          label: 'Open Jobs',
          href: `${(process.env.NEXT_PUBLIC_APP_URL || 'https://ebenesaid.com').replace(/\/$/, '')}/jobs`,
        },
      });

      if (application.partnerUserId) {
        const partner = await getUserById(application.partnerUserId);
        if (partner?.email) {
          void sendPlatformAnnouncementEmail({
            toEmail: partner.email,
            firstName: partner.first_name,
            subject: 'New EBENESAID job application',
            title: 'A new applicant is waiting',
            intro: 'A student submitted a new application to one of your listed opportunities.',
            body: [
              `Student: ${user.firstName} ${user.lastName}`.trim(),
              `Position: ${application.title}`,
              `Student email: ${user.email}`,
            ],
            action: {
              label: 'Open Job Dashboard',
              href: `${(process.env.NEXT_PUBLIC_APP_URL || 'https://ebenesaid.com').replace(/\/$/, '')}/job-partner/jobs`,
            },
          });
        }
      }
    }

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error('Job apply error:', error);
    return NextResponse.json({ error: 'Failed to apply to job.' }, { status: 500 });
  }
}
