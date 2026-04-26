import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { sendAdminAlertEmail, sendPlatformAnnouncementEmail } from '@/lib/email';
import { getArrivalBooking, saveArrivalBooking } from '@/lib/student-account';

function getAdminAlertRecipient() {
  return process.env.INITIAL_ADMIN_EMAIL?.trim() || process.env.BREVO_SENDER_EMAIL?.trim() || process.env.EMAIL_FROM?.trim() || '';
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const booking = await getArrivalBooking(user);
  return NextResponse.json({ booking }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  try {
    const body = await request.json();
    await saveArrivalBooking(user, {
      destination: String(body.destination ?? ''),
      pickupBooked: Boolean(body.pickupBooked),
      notes: String(body.notes ?? ''),
    });
    const booking = await getArrivalBooking(user);

    if (booking.pickupBooked) {
      void sendPlatformAnnouncementEmail({
        toEmail: user.email,
        firstName: user.firstName,
        subject: 'Your EBENESAID arrival request was saved',
        title: 'Arrival support confirmed',
        intro: 'Your arrival and pickup request has been saved successfully.',
        body: [
          `Destination: ${booking.destination}`,
          `Pickup status: ${booking.pickupStatus}`,
          'The operations team can now review your arrival details from the transport workflow.',
        ],
        action: {
          label: 'Open Arrival Support',
          href: `${(process.env.NEXT_PUBLIC_APP_URL || 'https://ebenesaid.com').replace(/\/$/, '')}/arrival`,
        },
      });

      const adminRecipient = getAdminAlertRecipient();
      if (adminRecipient) {
        void sendAdminAlertEmail({
          toEmail: adminRecipient,
          title: 'New arrival support request',
          intro: 'A student updated their arrival support details and requested pickup visibility.',
          highlights: [
            { label: 'Student', value: `${user.firstName} ${user.lastName}`.trim() || user.email },
            { label: 'Email', value: user.email },
            { label: 'Destination', value: booking.destination },
          ],
          action: {
            label: 'Open Transport Requests',
            href: `${(process.env.NEXT_PUBLIC_APP_URL || 'https://ebenesaid.com').replace(/\/$/, '')}/transport/pickups`,
          },
        });
      }
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.error('Arrival save error:', error);
    return NextResponse.json({ error: 'Failed to save arrival booking.' }, { status: 500 });
  }
}
