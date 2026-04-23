import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { getSessionByToken, getUserById, SafeUser, toSafeUser } from '@/lib/db';

type CookieAccessor = {
  get(name: string): { value: string } | undefined;
};

async function getAuthenticatedUserFromCookies(cookieStore: CookieAccessor): Promise<SafeUser | null> {
  const sessionToken = cookieStore.get('eb_session')?.value;
  if (!sessionToken) {
    return null;
  }

  const session = await getSessionByToken(sessionToken);
  if (!session) {
    return null;
  }

  const dbUser = await getUserById(session.user_id);
  if (!dbUser || !dbUser.is_active) {
    return null;
  }

  return toSafeUser(dbUser);
}

export async function getAuthenticatedUserFromRequest(
  request: NextRequest
): Promise<SafeUser | null> {
  return getAuthenticatedUserFromCookies(request.cookies);
}

export async function getAuthenticatedUser(): Promise<SafeUser | null> {
  const cookieStore = await cookies();
  return getAuthenticatedUserFromCookies(cookieStore);
}
