import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getPublicHomePageContent, getPublicMarketingPageContent, updatePublicHomePageContent, updatePublicMarketingPageContent } from '@/lib/db';
import { normalizeLocale } from '@/lib/i18n';
import { normalizeMarketingPageContent, type MarketingPageKey } from '@/lib/marketing-site-content';
import { normalizeHomePageContent } from '@/lib/public-site-content';
import { isAdminRole } from '@/lib/rbac';

function isMarketingPage(value: string | null): value is MarketingPageKey {
  return value === 'about' || value === 'how-it-works' || value === 'contact';
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !isAdminRole(user.userType)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const page = request.nextUrl.searchParams.get('page');
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale'));

  if (page === 'home') {
    const content = await getPublicHomePageContent(locale);
    return NextResponse.json({ page, locale, content }, { status: 200 });
  }

  if (isMarketingPage(page)) {
    const content = await getPublicMarketingPageContent(page, locale);
    return NextResponse.json({ page, locale, content }, { status: 200 });
  }

  return NextResponse.json({ error: 'Unsupported content page.' }, { status: 400 });
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !isAdminRole(user.userType)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const body = await request.json();
  const page = body.page;
  const locale = normalizeLocale(body.locale);

  if (page === 'home') {
    const content = normalizeHomePageContent(body.content, locale);
    const savedContent = await updatePublicHomePageContent(content, locale);
    return NextResponse.json({ page, locale, content: savedContent }, { status: 200 });
  }

  if (isMarketingPage(page)) {
    const content = normalizeMarketingPageContent(page, body.content, locale);
    const savedContent = await updatePublicMarketingPageContent(page, content, locale);
    return NextResponse.json({ page, locale, content: savedContent }, { status: 200 });
  }

  return NextResponse.json({ error: 'Unsupported content page.' }, { status: 400 });
}
