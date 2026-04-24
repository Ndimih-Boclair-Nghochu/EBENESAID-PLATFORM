'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";
import {
  LayoutDashboard,
  Home,
  FileText,
  Briefcase,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  PlaneTakeoff,
  BarChart3,
  Building2,
  ShieldAlert,
  Flag,
  PieChart,
  Landmark,
  MessageSquare,
  GraduationCap,
  Utensils,
  Soup,
  RefreshCw,
  ClipboardList,
  ShoppingBag,
  Hotel,
  LifeBuoy,
  MessagesSquare,
  Navigation,
  Car,
  Clock,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/auth/provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  getPortalLabels,
  isAdminRole,
  isAgentRole,
  isInvestorRole,
  isJobPartnerRole,
  isStaffRole,
  isSupplierRole,
  isTransportRole,
  isUniversityRole,
} from "@/lib/rbac";

const studentNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Verified Housing", href: "/accommodation", icon: Home },
  { name: "Arrival & Transit", href: "/arrival", icon: PlaneTakeoff },
  { name: "Messages", href: "/messages", icon: MessagesSquare },
  { name: "Secure Wallet", href: "/docs", icon: FileText },
  { name: "Job Board", href: "/jobs", icon: Briefcase },
  { name: "Order Food", href: "/food", icon: Utensils },
  { name: "Student Circle", href: "/community", icon: Users },
  { name: "Support", href: "/support", icon: LifeBuoy },
];

const adminNavigation = [
  { name: "Ops Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Statistics", href: "/admin/statistics", icon: PieChart },
  { name: "Financial Analysis", href: "/admin/finance", icon: Landmark },
  { name: "Public Content", href: "/admin/content", icon: FileText },
  { name: "Student Tasks", href: "/admin/task-templates", icon: ClipboardList },
  { name: "Messages", href: "/messages", icon: MessagesSquare },
  { name: "Support Inbox", href: "/admin/support", icon: MessageSquare },
  { name: "Verification Queue", href: "/admin/verification", icon: ShieldAlert },
  { name: "User Directory", href: "/admin/users", icon: Users },
  { name: "Institutions", href: "/admin/institutions", icon: Building2 },
  { name: "Incident Reports", href: "/admin/reports", icon: Flag },
];

const universityNavigation = [
  { name: "Partner Dashboard", href: "/university/dashboard", icon: LayoutDashboard },
  { name: "Student Registry", href: "/university/students", icon: GraduationCap },
  { name: "Messages", href: "/messages", icon: MessagesSquare },
  { name: "Admissions Sync", href: "/university/sync", icon: RefreshCw },
  { name: "Verification", href: "/university/verification", icon: ShieldCheck },
  { name: "Institutional Chat", href: "/university/chat", icon: MessageSquare },
  { name: "Support", href: "/support", icon: LifeBuoy },
];

const supplierNavigation = [
  { name: "Kitchen Console", href: "/supplier/dashboard", icon: Soup },
  { name: "Order Ledger", href: "/supplier/orders", icon: ClipboardList },
  { name: "Messages", href: "/messages", icon: MessagesSquare },
  { name: "Menu Manager", href: "/supplier/menu", icon: Utensils },
  { name: "Order Food", href: "/food", icon: ShoppingBag },
  { name: "System Support", href: "/support", icon: LifeBuoy },
];

const agentNavigation = [
  { name: "Agent Dashboard", href: "/agent/dashboard", icon: BarChart3 },
  { name: "My Listings", href: "/agent/listings", icon: Hotel },
  { name: "Booking Leads", href: "/agent/leads", icon: Users },
  { name: "Messages", href: "/messages", icon: MessagesSquare },
  { name: "Support", href: "/support", icon: LifeBuoy },
];

const staffNavigation = [
  { name: "Staff Dashboard", href: "/staff/dashboard", icon: LayoutDashboard },
  { name: "Verification Queue", href: "/staff/verification", icon: ShieldAlert },
  { name: "Support Desk", href: "/staff/support", icon: MessageSquare },
  { name: "Messages", href: "/messages", icon: MessagesSquare },
  { name: "System Support", href: "/support", icon: LifeBuoy },
];

const investorNavigation = [
  { name: "Investor Dashboard", href: "/investor/dashboard", icon: PieChart },
  { name: "Platform Metrics", href: "/investor/dashboard#metrics", icon: BarChart3 },
  { name: "Updates", href: "/investor/dashboard#updates", icon: FileText },
  { name: "Messages", href: "/messages", icon: MessagesSquare },
  { name: "Support", href: "/support", icon: LifeBuoy },
];

const jobPartnerNavigation = [
  { name: "Employer Dashboard", href: "/job-partner/dashboard", icon: BarChart3 },
  { name: "Job Listings", href: "/job-partner/jobs", icon: Briefcase },
  { name: "Messages", href: "/messages", icon: MessagesSquare },
  { name: "Support", href: "/support", icon: LifeBuoy },
];

const transportNavigation = [
  { name: "Logistics Console", href: "/transport/dashboard", icon: Navigation },
  { name: "Pickup Registry", href: "/transport/pickups", icon: Clock },
  { name: "Fleet Manager", href: "/transport/fleet", icon: Car },
  { name: "Messages", href: "/messages", icon: MessagesSquare },
  { name: "System Support", href: "/support", icon: LifeBuoy },
];

export function MainNav() {

  const pathname = usePathname();
  const router = useRouter();
  // Use the real backend user from AuthProvider
  const { user, logout } = useAuthContext();


  // Role detection based on userType from backend
  const isAdmin = isAdminRole(user?.userType) || pathname.startsWith('/admin');
  const isStaff = isStaffRole(user?.userType) || pathname.startsWith('/staff');
  const isInvestor = isInvestorRole(user?.userType) || pathname.startsWith('/investor');
  const isUniversity = isUniversityRole(user?.userType) || pathname.startsWith('/university');
  const isSupplier = isSupplierRole(user?.userType) || pathname.startsWith('/supplier');
  const isAgent = isAgentRole(user?.userType) || pathname.startsWith('/agent');
  const isJobPartner = isJobPartnerRole(user?.userType) || pathname.startsWith('/job-partner');
  const isTransport = isTransportRole(user?.userType) || pathname.startsWith('/transport');


  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  let navItems = studentNavigation;
  const { roleLabel, sectionLabel } = getPortalLabels(user?.userType, pathname);

  if (isAdmin) {
    navItems = adminNavigation;
  } else if (isStaff) {
    navItems = staffNavigation;
  } else if (isInvestor) {
    navItems = investorNavigation;
  } else if (isUniversity) {
    navItems = universityNavigation;
  } else if (isSupplier) {
    navItems = supplierNavigation;
  } else if (isAgent) {
    navItems = agentNavigation;
  } else if (isJobPartner) {
    navItems = jobPartnerNavigation;
  } else if (isTransport) {
    navItems = transportNavigation;
  }

  return (
    <nav className="flex flex-col h-full gap-4 px-4 py-8">
      <div className="flex items-center gap-3 pb-8 pt-2 px-2">
        <div className="flex flex-col">
          <BrandLogo frameClassName="border border-white/15 bg-white p-1.5 shadow-[0_12px_28px_rgba(0,0,0,0.22)] ring-4 ring-white/5" imageClassName="w-12" />
          <span className="text-[8px] font-black text-green-200 uppercase tracking-[0.4em] mt-1">
            {roleLabel}
          </span>
        </div>
      </div>
      
      <div className="space-y-1 flex-1">
        <p className="px-4 text-[9px] font-black text-green-200/50 uppercase tracking-[0.4em] mb-4">
          {sectionLabel}
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200",
                isActive
                  ? "bg-white text-green-700 shadow-lg shadow-green-900/20"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-green-700" : "text-white/40 group-hover:text-white")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="pt-6 space-y-1 border-t border-white/10">
        <p className="px-4 text-[9px] font-black text-green-200/50 uppercase tracking-[0.4em] mb-4 mt-2">Preferences</p>
        <div className="px-1">
          <LanguageSwitcher compact />
        </div>
        <Link
          href="/settings"
          className={cn(
            "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
            pathname === "/settings"
              ? "bg-white text-green-700"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          )}
        >
          <Settings className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
          Settings
        </Link>
        <Link
          href="/billing"
          className={cn(
            "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
            pathname === "/billing"
              ? "bg-white text-green-700"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          )}
        >
          <CreditCard className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
          Billing
        </Link>
        <button
          onClick={handleLogout}
          className="w-full group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-white/70 hover:bg-red-500/10 hover:text-red-200 transition-all mt-1"
        >
          <LogOut className="h-5 w-5 text-white/40 group-hover:text-red-200 transition-colors" />
          Log Out
        </button>
      </div>
    </nav>
  );
}
