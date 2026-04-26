import { NextRequest, NextResponse } from 'next/server';

import { createPasswordResetToken, getUserByEmail } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';

function getResetBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'https://ebenesaid.com').replace(/\/$/, '');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const user = await getUserByEmail(email);

    if (user?.is_active) {
      try {
        const issued = await createPasswordResetToken(user.id);
        const resetUrl = `${getResetBaseUrl()}/reset-password?token=${encodeURIComponent(issued.token)}`;

        await sendPasswordResetEmail({
          toEmail: user.email,
          firstName: user.first_name,
          resetUrl,
          expiresAt: issued.expiresAt,
        });
      } catch (error) {
        console.error('Forgot password email error:', error);
      }
    }

    return NextResponse.json(
      {
        message: 'If an account exists for that email, a password reset link has been sent.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password request error:', error);
    return NextResponse.json({ error: 'Failed to process password reset request.' }, { status: 500 });
  }
}
