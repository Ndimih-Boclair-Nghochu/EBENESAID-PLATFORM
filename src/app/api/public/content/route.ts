import { NextRequest, NextResponse } from 'next/server';

import { getPublicHomePageContent } from '@/lib/db';
import { normalizeLocale } from '@/lib/i18n';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');
  const locale = normalizeLocale(searchParams.get('locale'));

  if (page !== 'home') {
    return NextResponse.json({ error: 'Unsupported content page.' }, { status: 400 });
  }

  const content = await getPublicHomePageContent(locale);
  return NextResponse.json({ page, locale, content }, { status: 200 });
}
