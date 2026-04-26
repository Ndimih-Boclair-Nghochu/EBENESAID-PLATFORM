import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { createSession, deleteAllUserSessions, getUserById, updateUserPassword, verifyPassword } from '@/lib/db';
import { sendPasswordChangedEmail } from '@/lib/email';

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const currentPassword = String(body.currentPassword ?? '');
    const newPassword = String(body.newPassword ?? '');
    const confirmPassword = String(body.confirmPassword ?? '');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'All password fields are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New passwords do not match.' }, { status: 400 });
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const valid = verifyPassword(currentPassword, dbUser.password_hash, dbUser.password_salt);
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
    }

    await updateUserPassword(user.id, newPassword);
    await deleteAllUserSessions(user.id);
    const session = await createSession(user.id);

    void sendPasswordChangedEmail({
      toEmail: dbUser.email,
      firstName: dbUser.first_name,
      changedAt: new Date().toISOString(),
    });

    const response = NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });
    response.cookies.set('eb_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(session.expiresAt),
    });

    return response;
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 });
  }
}
