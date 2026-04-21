import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getCommunityApprovalRequests } from '@/lib/student-account';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function requireAdmin(userType?: string) {
  return userType === 'admin' || userType === 'staff';
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !requireAdmin(user.userType)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const [housingResult, communityRequests] = await Promise.all([
      pool.query(
        `SELECT id, title, location, status, created_at
         FROM property_listings
         WHERE status <> 'Verified'
         ORDER BY updated_at DESC, id DESC`
      ),
      getCommunityApprovalRequests(),
    ]);

    return NextResponse.json(
      {
        housing: housingResult.rows.map(row => ({
          id: row.id,
          title: row.title,
          location: row.location,
          status: row.status,
          createdAt: row.created_at,
        })),
        jobs: [],
        identities: [],
        institutions: [],
        communities: communityRequests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin verification load error:', error);
    return NextResponse.json({ error: 'Failed to load verification queue.' }, { status: 500 });
  }
}
