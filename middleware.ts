import { NextRequest, NextResponse } from 'next/server';

const protectedPrefixes = [
  '/admin',
  '/agent',
  '/billing',
  '/community',
  '/dashboard',
  '/docs',
  '/food',
  '/investor',
  '/job-partner',
  '/jobs',
  '/messages',
  '/settings',
  '/staff',
  '/supplier',
  '/support',
  '/transport',
  '/university',
];

const publicStudentServicePages = new Set(['/accommodation', '/arrival']);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('eb_session')?.value;
  const isProtected =
    protectedPrefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
    publicStudentServicePages.has(pathname);

  if (isProtected && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/agent/:path*',
    '/billing',
    '/community',
    '/dashboard',
    '/docs',
    '/food',
    '/investor/:path*',
    '/job-partner/:path*',
    '/jobs',
    '/messages',
    '/settings',
    '/staff/:path*',
    '/supplier/:path*',
    '/support',
    '/transport/:path*',
    '/university/:path*',
    '/accommodation',
    '/arrival',
  ],
};
