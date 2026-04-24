import { NextRequest, NextResponse } from 'next/server';

import { getPublicHomePageContent, getPublicMarketingPageContent } from '@/lib/db';
import { normalizeLocale } from '@/lib/i18n';
import type { MarketingPageKey } from '@/lib/marketing-site-content';

function isMarketingPage(value: string | null): value is MarketingPageKey {
  return value === 'about' || value === 'how-it-works' || value === 'contact';
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');
  const locale = normalizeLocale(searchParams.get('locale'));

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
