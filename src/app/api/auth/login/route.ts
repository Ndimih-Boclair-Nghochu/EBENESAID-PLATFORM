import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword, createSession, updateLastLogin, toSafeUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Find user
    const dbUser = getUserByEmail(email);
    if (!dbUser) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!dbUser.is_active) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = verifyPassword(password, dbUser.password_hash, dbUser.password_salt);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Update last login
    updateLastLogin(dbUser.id);

    // Create session
    const session = createSession(dbUser.id);

    // Build response
    const safeUser = toSafeUser(dbUser);
    const response = NextResponse.json(
      { message: 'Login successful!', user: safeUser },
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
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
