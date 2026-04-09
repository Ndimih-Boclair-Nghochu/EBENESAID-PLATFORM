import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getStudentDocuments, saveStudentDocument } from '@/lib/student-account';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const documents = await getStudentDocuments(user);
  return NextResponse.json({ documents }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  try {
    const body = await request.json();
    await saveStudentDocument(user, {
      name: String(body.name ?? ''),
      type: String(body.type ?? ''),
      fileUrl: String(body.fileUrl ?? ''),
    });
    const documents = await getStudentDocuments(user);
    return NextResponse.json({ documents }, { status: 201 });
  } catch (error) {
    console.error('Document save error:', error);
    return NextResponse.json({ error: 'Failed to save document.' }, { status: 500 });
  }
}
