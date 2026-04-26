import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, createSession } from '@/lib/db';
import { sendAdminAlertEmail, sendWelcomeEmail } from '@/lib/email';

function getAdminAlertRecipient() {
  return process.env.INITIAL_ADMIN_EMAIL?.trim() || process.env.BREVO_SENDER_EMAIL?.trim() || process.env.EMAIL_FROM?.trim() || '';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword, firstName, lastName, phone, university, countryOfOrigin } = body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 409 }
      );
    }

    // Create user (only students can self-register)
    const user = await createUser({
      email,
      password,
      firstName,
      lastName,
      phone,
      university,
      countryOfOrigin,
      userType: 'student', // Only students can self-register
    });

    // Create session
    const session = await createSession(user.id);

    const adminAlertRecipient = getAdminAlertRecipient();
    void Promise.allSettled([
      sendWelcomeEmail({
        toEmail: user.email,
        firstName: user.firstName,
        university: user.university,
      }),
      adminAlertRecipient
        ? sendAdminAlertEmail({
            toEmail: adminAlertRecipient,
            title: 'New student registration',
            intro: 'A new student account has been created on EBENESAID and is ready for onboarding follow-up.',
            highlights: [
              { label: 'Student', value: `${user.firstName} ${user.lastName}`.trim() || user.email },
              { label: 'Email', value: user.email },
              { label: 'University', value: user.university || 'Not provided' },
            ],
            action: {
              label: 'Open Admin Users',
              href: `${(process.env.NEXT_PUBLIC_APP_URL || 'https://ebenesaid.com').replace(/\/$/, '')}/admin/users`,
            },
          })
        : Promise.resolve({ ok: false, provider: 'brevo' as const }),
    ]);

    // Set session cookie
    const response = NextResponse.json(
      { message: 'Account created successfully!', user },
      { status: 201 }
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
    console.error('Registration error:', error);
    let message = 'An unexpected error occurred.';
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    // Handle SQLite unique constraint
    if (message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Return the actual error message for debugging
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
