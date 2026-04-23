import type { PlatformUserType } from '@/lib/db';

const ADMIN_ROLES: PlatformUserType[] = ['admin'];
const STAFF_ROLES: PlatformUserType[] = ['staff'];
const INVESTOR_ROLES: PlatformUserType[] = ['investor'];
const UNIVERSITY_ROLES: PlatformUserType[] = ['university'];
const SUPPLIER_ROLES: PlatformUserType[] = ['supplier'];
const AGENT_ROLES: PlatformUserType[] = ['agent'];
const JOB_PARTNER_ROLES: PlatformUserType[] = ['job_partner'];
const TRANSPORT_ROLES: PlatformUserType[] = ['transport'];
const LISTING_MANAGER_ROLES: PlatformUserType[] = ['agent', 'admin', 'staff'];

export function hasAnyRole(userType: string | undefined, roles: readonly PlatformUserType[]) {
  return userType ? roles.includes(userType as PlatformUserType) : false;
}

export function isAdminRole(userType?: string) {
  return hasAnyRole(userType, ADMIN_ROLES);
}

export function isStaffRole(userType?: string) {
  return hasAnyRole(userType, STAFF_ROLES);
}

export function isInvestorRole(userType?: string) {
  return hasAnyRole(userType, INVESTOR_ROLES);
}

export function isOperationsRole(userType?: string) {
  return isAdminRole(userType) || isStaffRole(userType);
}

export function isUniversityRole(userType?: string) {
  return hasAnyRole(userType, UNIVERSITY_ROLES);
}

export function isSupplierRole(userType?: string) {
  return hasAnyRole(userType, SUPPLIER_ROLES);
}

export function isAgentRole(userType?: string) {
  return hasAnyRole(userType, AGENT_ROLES);
}

export function isJobPartnerRole(userType?: string) {
  return hasAnyRole(userType, JOB_PARTNER_ROLES);
}

export function isTransportRole(userType?: string) {
  return hasAnyRole(userType, TRANSPORT_ROLES);
}

export function canManageListings(userType?: string) {
  return hasAnyRole(userType, LISTING_MANAGER_ROLES);
}

export function shouldScopeListingsToOwner(userType?: string) {
  return userType === 'agent';
}

export function getDefaultDashboardHref(userType?: string) {
  if (isAdminRole(userType)) return '/admin/dashboard';
  if (isStaffRole(userType)) return '/staff/dashboard';
  if (isInvestorRole(userType)) return '/investor/dashboard';
  if (isUniversityRole(userType)) return '/university/dashboard';
  if (isSupplierRole(userType)) return '/supplier/dashboard';
  if (isAgentRole(userType)) return '/agent/dashboard';
  if (isJobPartnerRole(userType)) return '/job-partner/dashboard';
  if (isTransportRole(userType)) return '/transport/dashboard';
  return '/dashboard';
}

export function getMessagesHref(userType?: string) {
  if (isUniversityRole(userType)) return '/university/chat';
  return '/messages';
}

export function getSupportHref(userType?: string) {
  if (isAdminRole(userType)) return '/admin/support';
  if (isStaffRole(userType)) return '/staff/support';
  if (isUniversityRole(userType)) return '/university/chat';
  return '/support';
}

export function getPortalLabels(userType?: string, pathname = '') {
  if (isAdminRole(userType) || pathname.startsWith('/admin')) {
    return { roleLabel: 'Administrator', sectionLabel: 'Admin Controls' };
  }

  if (isStaffRole(userType) || pathname.startsWith('/staff')) {
    return { roleLabel: 'Operations Staff', sectionLabel: 'Staff Console' };
  }

  if (isInvestorRole(userType) || pathname.startsWith('/investor')) {
    return { roleLabel: 'Investor', sectionLabel: 'Investor View' };
  }

  if (isUniversityRole(userType) || pathname.startsWith('/university')) {
    return { roleLabel: 'University Partner', sectionLabel: 'Partner Menu' };
  }

  if (isSupplierRole(userType) || pathname.startsWith('/supplier')) {
    return { roleLabel: 'Food Supplier', sectionLabel: 'Kitchen Menu' };
  }

  if (isAgentRole(userType) || pathname.startsWith('/agent')) {
    return { roleLabel: 'Housing Agent', sectionLabel: 'Agent Menu' };
  }

  if (isJobPartnerRole(userType) || pathname.startsWith('/job-partner')) {
    return { roleLabel: 'Job Supplier', sectionLabel: 'Employer Menu' };
  }

  if (isTransportRole(userType) || pathname.startsWith('/transport')) {
    return { roleLabel: 'Transport Partner', sectionLabel: 'Logistics Menu' };
  }

  return { roleLabel: 'Student Portal', sectionLabel: 'Main Menu' };
}
