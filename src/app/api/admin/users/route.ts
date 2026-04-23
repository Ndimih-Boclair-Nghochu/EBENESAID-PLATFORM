import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { createUser, getUserByEmail, listUsersForAdmin, PLATFORM_ROLE_OPTIONS, setUserActiveState } from '@/lib/db';
import { isAdminRole } from '@/lib/rbac';

function isPartnerRole(userType: string) {
  return userType === 'university' || userType === 'agent' || userType === 'job_partner' || userType === 'supplier' || userType === 'transport';
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !isAdminRole(user.userType)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const users = await listUsersForAdmin();
    return NextResponse.json({ users, roleOptions: PLATFORM_ROLE_OPTIONS }, { status: 200 });
  } catch (error) {
    console.error('Admin users load error:', error);
    return NextResponse.json({ error: 'Failed to load user directory.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminUser = await getAuthenticatedUserFromRequest(request);
  if (!adminUser || !isAdminRole(adminUser.userType)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    const firstName = String(body.firstName ?? '').trim();
    const lastName = String(body.lastName ?? '').trim();
    const userType = String(body.userType ?? 'student');
    const isActive = body.isActive !== false;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Email, password, first name, and last name are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
    }

    const partnerProfile = isPartnerRole(userType)
      ? {
          partnerType: String(body.partnerType ?? userType).trim(),
          businessName: String(body.businessName ?? body.university ?? '').trim(),
          contactPerson: String(body.contactPerson ?? `${firstName} ${lastName}`).trim(),
          commissionPercent:
            body.commissionPercent === '' || body.commissionPercent === undefined || body.commissionPercent === null
              ? null
              : Number(body.commissionPercent),
          metadata: {
            notes: String(body.partnerNotes ?? '').trim(),
          },
        }
      : undefined;

    if (isPartnerRole(userType) && !partnerProfile?.businessName) {
      return NextResponse.json({ error: 'Business or institution name is required for partner accounts.' }, { status: 400 });
    }

    await createUser({
      email,
      password,
      firstName,
      lastName,
      phone: String(body.phone ?? ''),
      university: String(body.university ?? ''),
      countryOfOrigin: String(body.countryOfOrigin ?? ''),
      userType,
      isActive,
      partnerProfile,
    });

    const users = await listUsersForAdmin();
    return NextResponse.json({ users }, { status: 201 });
  } catch (error) {
    console.error('Admin user creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create user.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const adminUser = await getAuthenticatedUserFromRequest(request);
  if (!adminUser || !isAdminRole(adminUser.userType)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const userId = Number(body.userId);
    const isActive = Boolean(body.isActive);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: 'Valid userId is required.' }, { status: 400 });
    }

    const updated = await setUserActiveState(userId, isActive);
    if (!updated) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const users = await listUsersForAdmin();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Admin user status update error:', error);
    return NextResponse.json({ error: 'Failed to update user status.' }, { status: 500 });
  }
}
