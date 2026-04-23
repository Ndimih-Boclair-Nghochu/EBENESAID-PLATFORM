import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { getAuthenticatedUser } from '@/lib/auth';
import { getDefaultDashboardHref, isAdminRole } from '@/lib/rbac';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/login');
  }

  if (!isAdminRole(user.userType)) {
    redirect(getDefaultDashboardHref(user.userType));
  }

  return children;
}
