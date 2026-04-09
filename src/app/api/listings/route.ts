import { NextRequest, NextResponse } from 'next/server';

import {
  createPropertyListing,
  deletePropertyListing,
  getPropertyListings,
  getSessionByToken,
  getUserById,
  toSafeUser,
  updatePropertyListing,
} from '@/lib/db';

async function getAuthenticatedUser(request: NextRequest) {
  const sessionToken = request.cookies.get('eb_session')?.value;
  if (!sessionToken) return null;

  const session = await getSessionByToken(sessionToken);
  if (!session) return null;

  const dbUser = await getUserById(session.user_id);
  if (!dbUser || !dbUser.is_active) return null;

  return toSafeUser(dbUser);
}

function canManageListings(userType: string) {
  return ['agent', 'admin'].includes(userType);
}

function validateListingPayload(body: Record<string, unknown>) {
  const title = String(body.title ?? '').trim();
  const location = String(body.location ?? '').trim();
  const type = String(body.type ?? '').trim();
  const details = String(body.details ?? '').trim();
  const imageUrl = String(body.imageUrl ?? '').trim();
  const status = String(body.status ?? 'Pending').trim();
  const price = Number(body.price);

  if (!title || !location || !type || !details || !imageUrl) {
    return { error: 'Title, location, type, details, and imageUrl are required.' };
  }

  if (!Number.isFinite(price) || price <= 0) {
    return { error: 'A valid positive price is required.' };
  }

  return {
    value: {
      title,
      location,
      type,
      details,
      imageUrl,
      status: status || 'Pending',
      price,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const includePending = request.nextUrl.searchParams.get('includePending') === 'true';
    const mine = request.nextUrl.searchParams.get('mine') === 'true';
    const user = await getAuthenticatedUser(request);

    const listings = await getPropertyListings({
      includePending,
      createdByUserId: mine && user ? user.id : undefined,
    });

    return NextResponse.json({ listings }, { status: 200 });
  } catch (error) {
    console.error('Listings load error:', error);
    return NextResponse.json({ error: 'Failed to load listings.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    if (!canManageListings(user.userType)) {
      return NextResponse.json({ error: 'Not authorized to create listings.' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = validateListingPayload(body);
    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const listing = await createPropertyListing({
      ...parsed.value,
      createdByUserId: user.id,
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error('Listing create error:', error);
    return NextResponse.json({ error: 'Failed to create listing.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    if (!canManageListings(user.userType)) {
      return NextResponse.json({ error: 'Not authorized to update listings.' }, { status: 403 });
    }

    const body = await request.json();
    const listingId = Number(body.id);
    if (!Number.isInteger(listingId) || listingId <= 0) {
      return NextResponse.json({ error: 'Valid listing id is required.' }, { status: 400 });
    }

    const parsed = validateListingPayload(body);
    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const listing = await updatePropertyListing(listingId, parsed.value);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    return NextResponse.json({ listing }, { status: 200 });
  } catch (error) {
    console.error('Listing update error:', error);
    return NextResponse.json({ error: 'Failed to update listing.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    if (!canManageListings(user.userType)) {
      return NextResponse.json({ error: 'Not authorized to delete listings.' }, { status: 403 });
    }

    const listingId = Number(request.nextUrl.searchParams.get('id'));
    if (!Number.isInteger(listingId) || listingId <= 0) {
      return NextResponse.json({ error: 'Valid listing id is required.' }, { status: 400 });
    }

    const deleted = await deletePropertyListing(listingId);
    if (!deleted) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Listing delete error:', error);
    return NextResponse.json({ error: 'Failed to delete listing.' }, { status: 500 });
  }
}
