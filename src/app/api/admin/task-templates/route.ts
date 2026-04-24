import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import {
  createStudentTaskTemplate,
  deleteStudentTaskTemplate,
  listStudentTaskTemplates,
  type StudentTaskDurationBand,
  updateStudentTaskTemplate,
} from '@/lib/db';
import { isAdminRole } from '@/lib/rbac';

function parseDurationBand(value: unknown): StudentTaskDurationBand {
  return String(value) === 'under_3_months' ? 'under_3_months' : 'over_3_months';
}

function normalizePayload(body: Record<string, unknown>) {
  const title = String(body.title ?? '').trim();
  const description = String(body.description ?? '').trim();
  const category = String(body.category ?? '').trim();
  const href = String(body.href ?? '').trim();
  const sortOrder = Number(body.sortOrder ?? 0);

  if (!title || !description || !category || !href) {
    throw new Error('Title, description, category, and route are required.');
  }

  return {
    durationBand: parseDurationBand(body.durationBand),
    title,
    description,
    category,
    href,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    isActive: body.isActive !== false,
  };
}

async function getAdminUser(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !isAdminRole(user.userType)) {
    return null;
  }
  return user;
}

export async function GET(request: NextRequest) {
  const user = await getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const templates = await listStudentTaskTemplates();
    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    console.error('Admin task template load error:', error);
    return NextResponse.json({ error: 'Failed to load student task templates.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    await createStudentTaskTemplate(normalizePayload(body));
    const templates = await listStudentTaskTemplates();
    return NextResponse.json({ templates }, { status: 201 });
  } catch (error) {
    console.error('Admin task template create error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create student task template.' },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const templateId = Number(body.id);
    if (!Number.isInteger(templateId) || templateId <= 0) {
      return NextResponse.json({ error: 'Valid template id is required.' }, { status: 400 });
    }

    const updated = await updateStudentTaskTemplate(templateId, normalizePayload(body));
    if (!updated) {
      return NextResponse.json({ error: 'Template not found.' }, { status: 404 });
    }

    const templates = await listStudentTaskTemplates();
    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    console.error('Admin task template update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update student task template.' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const templateId = Number(body.id);
    if (!Number.isInteger(templateId) || templateId <= 0) {
      return NextResponse.json({ error: 'Valid template id is required.' }, { status: 400 });
    }

    const deleted = await deleteStudentTaskTemplate(templateId);
    if (!deleted) {
      return NextResponse.json({ error: 'Template not found.' }, { status: 404 });
    }

    const templates = await listStudentTaskTemplates();
    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    console.error('Admin task template delete error:', error);
    return NextResponse.json({ error: 'Failed to delete student task template.' }, { status: 500 });
  }
}
