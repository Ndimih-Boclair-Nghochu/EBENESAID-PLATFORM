import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { getAuthenticatedUser } from '@/lib/auth';
import { getDefaultDashboardHref, isUniversityRole } from '@/lib/rbac';

export default async function UniversityLayout({ children }: { children: ReactNode }) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/login');
  }

  if (!isUniversityRole(user.userType) && !['admin', 'staff'].includes(user.userType)) {
    redirect(getDefaultDashboardHref(user.userType));
  }

  return children;
}
