import { NextRequest } from 'next/server';

import { getSessionByToken, getUserById, SafeUser, toSafeUser } from '@/lib/db';

export async function getAuthenticatedUserFromRequest(
  request: NextRequest
): Promise<SafeUser | null> {
  const sessionToken = request.cookies.get('eb_session')?.value;
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
