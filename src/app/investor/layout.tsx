import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { getAuthenticatedUser } from '@/lib/auth';
import { getDefaultDashboardHref, hasAnyRole } from '@/lib/rbac';

export default async function InvestorLayout({ children }: { children: ReactNode }) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/login');
  }

  if (!hasAnyRole(user.userType, ['investor', 'admin'])) {
    redirect(getDefaultDashboardHref(user.userType));
  }

  return children;
}
