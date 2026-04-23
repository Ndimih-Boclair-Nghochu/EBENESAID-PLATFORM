import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { dbPool as pool } from '@/lib/postgres';
import { isAgentRole } from '@/lib/rbac';

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
  if (!user || !isAgentRole(user.userType)) {
    return NextResponse.json({ error: 'Housing partner access required.' }, { status: 403 });
  }

  try {
    await ensurePartnerVerificationTable();
    const result = await pool.query(
      `SELECT id, document_name, document_type, file_url, status, notes, created_at, reviewed_at
       FROM partner_verification_documents
       WHERE partner_user_id = $1
       ORDER BY created_at DESC`,
      [user.id]
    );

    return NextResponse.json(
      {
        documents: result.rows.map(row => ({
          id: row.id,
          name: row.document_name,
          type: row.document_type,
          fileUrl: row.file_url,
          status: row.status,
          notes: row.notes,
          createdAt: row.created_at,
          reviewedAt: row.reviewed_at,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Agent verification load error:', error);
    return NextResponse.json({ error: 'Failed to load verification documents.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !isAgentRole(user.userType)) {
    return NextResponse.json({ error: 'Housing partner access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const type = String(body.type ?? '').trim();
    const fileUrl = String(body.fileUrl ?? '').trim();

    if (!name || !type || !fileUrl) {
      return NextResponse.json({ error: 'Document name, type, and file link are required.' }, { status: 400 });
    }

    await ensurePartnerVerificationTable();
    await pool.query(
      `INSERT INTO partner_verification_documents (partner_user_id, document_name, document_type, file_url, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'Pending', NOW(), NOW())`,
      [user.id, name, type, fileUrl]
    );

    return GET(request);
  } catch (error) {
    console.error('Agent verification save error:', error);
    return NextResponse.json({ error: 'Failed to save verification document.' }, { status: 500 });
  }
}
