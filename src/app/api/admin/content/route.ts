import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getPublicHomePageContent, updatePublicHomePageContent } from '@/lib/db';
import { normalizeLocale } from '@/lib/i18n';
import { normalizeHomePageContent } from '@/lib/public-site-content';
import { isAdminRole } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !isAdminRole(user.userType)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const page = request.nextUrl.searchParams.get('page');
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale'));

  if (page !== 'home') {
    return NextResponse.json({ error: 'Unsupported content page.' }, { status: 400 });
  }

  const content = await getPublicHomePageContent(locale);
  return NextResponse.json({ page, locale, content }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !isAdminRole(user.userType)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const body = await request.json();
  const page = body.page;
  const locale = normalizeLocale(body.locale);

  if (page !== 'home') {
    return NextResponse.json({ error: 'Unsupported content page.' }, { status: 400 });
  }

  const content = normalizeHomePageContent(body.content, locale);
  const savedContent = await updatePublicHomePageContent(content, locale);
  return NextResponse.json({ page, locale, content: savedContent }, { status: 200 });
}
