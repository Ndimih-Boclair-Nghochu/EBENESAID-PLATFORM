import { NextRequest, NextResponse } from 'next/server';

import { consumePasswordResetToken, createSession, deleteAllUserSessions, updateUserPassword } from '@/lib/db';
import { sendPasswordChangedEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = String(body.token ?? '').trim();
    const newPassword = String(body.newPassword ?? '');
    const confirmPassword = String(body.confirmPassword ?? '');

    if (!token || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'Token and password fields are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    const user = await consumePasswordResetToken(token);
    if (!user || !user.is_active) {
      return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 });
    }

    await updateUserPassword(user.id, newPassword);
    await deleteAllUserSessions(user.id);
    const session = await createSession(user.id);

    void sendPasswordChangedEmail({
      toEmail: user.email,
      firstName: user.first_name,
      changedAt: new Date().toISOString(),
    });

    const response = NextResponse.json(
      { message: 'Your password has been reset successfully.' },
      { status: 200 }
    );

    response.cookies.set('eb_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(session.expiresAt),
    });

    return response;
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
}
