import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken, getUserById, toSafeUser } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('eb_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated.' },
        { status: 401 }
      );
    }

    // Look up session
    const session = getSessionByToken(sessionToken);
    if (!session) {
      // Session expired or invalid — clear the cookie
      const response = NextResponse.json(
        { error: 'Session expired. Please sign in again.' },
        { status: 401 }
      );
      response.cookies.delete('eb_session');
      return response;
    }

    // Get user
    const dbUser = getUserById(session.user_id);
    if (!dbUser) {
      const response = NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
      response.cookies.delete('eb_session');
      return response;
    }

    if (!dbUser.is_active) {
      const response = NextResponse.json(
        { error: 'Account deactivated.' },
        { status: 403 }
      );
      response.cookies.delete('eb_session');
      return response;
    }

    return NextResponse.json({ user: toSafeUser(dbUser) }, { status: 200 });
  } catch (error: unknown) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
