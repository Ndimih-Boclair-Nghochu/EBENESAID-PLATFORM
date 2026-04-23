import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getCommunityApprovalRequests } from '@/lib/student-account';
import { dbPool as pool } from '@/lib/postgres';
import { isOperationsRole } from '@/lib/rbac';

async function ensurePartnerVerificationTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS partner_verification_documents (
      id SERIAL PRIMARY KEY,
      partner_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      document_name TEXT NOT NULL,
      document_type TEXT NOT NULL,
      file_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      notes TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      reviewed_at TIMESTAMPTZ
    )
  `);
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !isOperationsRole(user.userType)) {
    return NextResponse.json({ error: 'Operations access required.' }, { status: 403 });
  }

  try {
    await ensurePartnerVerificationTable();

    const [housingResult, partnerDocumentsResult, communityRequests] = await Promise.all([
      pool.query(
        `SELECT id, title, location, status, created_at
         FROM property_listings
         WHERE status <> 'Verified'
         ORDER BY updated_at DESC, id DESC`
      ),
      pool.query(
        `SELECT d.id, d.document_name, d.document_type, d.file_url, d.status, d.notes, d.created_at, d.reviewed_at,
                u.email, CONCAT(u.first_name, ' ', u.last_name) AS partner_name,
                COALESCE(NULLIF(pp.business_name, ''), u.university, 'Partner account') AS business_name,
                COALESCE(pp.partner_type, u.user_type) AS partner_type
         FROM partner_verification_documents d
         JOIN users u ON u.id = d.partner_user_id
         LEFT JOIN partner_profiles pp ON pp.user_id = u.id
         ORDER BY
           CASE WHEN d.status = 'Pending' THEN 0 ELSE 1 END,
           d.created_at DESC`
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
        partnerDocuments: partnerDocumentsResult.rows.map(row => ({
          id: row.id,
          name: row.document_name,
          type: row.document_type,
          fileUrl: row.file_url,
          status: row.status,
          notes: row.notes,
          partnerName: row.partner_name,
          partnerEmail: row.email,
          businessName: row.business_name,
          partnerType: row.partner_type,
          createdAt: row.created_at,
          reviewedAt: row.reviewed_at,
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

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !isOperationsRole(user.userType)) {
    return NextResponse.json({ error: 'Operations access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const documentId = Number(body.documentId);
    const decision = String(body.decision ?? '').toLowerCase();
    const notes = String(body.notes ?? '').trim();

    if (!Number.isInteger(documentId) || documentId <= 0) {
      return NextResponse.json({ error: 'Valid document id is required.' }, { status: 400 });
    }

    const status = decision === 'approved' ? 'Approved' : decision === 'rejected' ? 'Rejected' : '';
    if (!status) {
      return NextResponse.json({ error: 'Decision must be approved or rejected.' }, { status: 400 });
    }

    await ensurePartnerVerificationTable();
    await pool.query(
      `UPDATE partner_verification_documents
       SET status = $2,
           notes = $3,
           reviewed_at = NOW(),
           updated_at = NOW()
       WHERE id = $1`,
      [documentId, status, notes || (status === 'Approved' ? 'Credential approved by operations.' : 'Credential requires correction.')]
    );

    return GET(request);
  } catch (error) {
    console.error('Partner document review error:', error);
    return NextResponse.json({ error: 'Failed to review partner document.' }, { status: 500 });
  }
}
