
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";

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
  { name: "Ops Command", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Statistics", href: "/admin/statistics", icon: PieChart },
  { name: "Financial Analysis", href: "/admin/finance", icon: Landmark },
  { name: "Messages", href: "/messages", icon: MessagesSquare },
  { name: "Support Inbox", href: "/admin/support", icon: MessageSquare },
  { name: "Verification Queue", href: "/admin/verification", icon: ShieldAlert },
  { name: "User Directory", href: "/admin/users", icon: Users },
  { name: "Institutions", href: "/admin/institutions", icon: Building2 },
  { name: "Incident Reports", href: "/admin/reports", icon: Flag },
  { name: "Order Food", href: "/food", icon: Utensils },
];

const universityNavigation = [
  { name: "University Node", href: "/university/dashboard", icon: LayoutDashboard },
  { name: "Student Registry", href: "/university/students", icon: GraduationCap },
  { name: "Messages", href: "/messages", icon: MessagesSquare },
  { name: "Admissions Sync", href: "/university/sync", icon: RefreshCw },
  { name: "Verification", href: "/university/verification", icon: ShieldCheck },
  { name: "Messaging", href: "/university/chat", icon: MessageSquare },
  { name: "Order Food", href: "/food", icon: Utensils },
  { name: "System Support", href: "/support", icon: LifeBuoy },
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
  { name: "Agent Command", href: "/agent/dashboard", icon: BarChart3 },
  { name: "My Listings", href: "/agent/listings", icon: Hotel },
  { name: "Booking Leads", href: "/agent/leads", icon: Users },
  { name: "Messages", href: "/messages", icon: MessagesSquare },
  { name: "Order Food", href: "/food", icon: Utensils },
  { name: "System Support", href: "/support", icon: LifeBuoy },
];

const transportNavigation = [
  { name: "Logistics Console", href: "/transport/dashboard", icon: Navigation },
  { name: "Pickup Registry", href: "/transport/pickups", icon: Clock },
  { name: "Messages", href: "/messages", icon: MessagesSquare },
  { name: "System Support", href: "/support", icon: LifeBuoy },
];

export function MainNav() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();
  const { user } = useUser();
  const [demoRole, setDemoRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDemoRole(localStorage.getItem('eb_demo_role'));
    }
  }, []);

  const isAdmin = user?.email?.includes('admin') || pathname.startsWith('/admin') || demoRole === 'admin';
  const isUniversity = user?.email?.includes('uni') || pathname.startsWith('/university') || demoRole === 'university';
  const isSupplier = user?.email?.includes('supplier') || pathname.startsWith('/supplier') || demoRole === 'supplier';
  const isAgent = user?.email?.includes('agent') || pathname.startsWith('/agent') || demoRole === 'agent';
  const isTransport = user?.email?.includes('transport') || pathname.startsWith('/transport') || demoRole === 'transport';

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('eb_demo_role');
      }
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  let navItems = studentNavigation;
  let roleLabel = 'Global OS';
  let sectionLabel = 'System Modules';

  if (isAdmin) {
    navItems = adminNavigation;
    roleLabel = 'System Admin';
    sectionLabel = 'System Control';
  } else if (isUniversity) {
    navItems = universityNavigation;
    roleLabel = 'Partner Hub';
    sectionLabel = 'Institutional Nodes';
  } else if (isSupplier) {
    navItems = supplierNavigation;
    roleLabel = 'Food Node';
    sectionLabel = 'Kitchen Protocol';
  } else if (isAgent) {
    navItems = agentNavigation;
    roleLabel = 'Housing Node';
    sectionLabel = 'Property Protocol';
  } else if (isTransport) {
    navItems = transportNavigation;
    roleLabel = 'Transport Service';
    sectionLabel = 'Logistics Protocol';
  }

  return (
    <nav className="flex flex-col h-full gap-4 px-4 py-8">
      <div className="flex items-center gap-3 pb-8 pt-2 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xl shadow-sky-900/20 shrink-0">
          <ShieldCheck className="h-6 w-6 text-sky-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tighter text-white font-headline italic uppercase leading-none">EBENESAID</span>
          <span className="text-[8px] font-black text-sky-200 uppercase tracking-[0.4em] mt-1">
            {roleLabel}
          </span>
        </div>
      </div>
      
      <div className="space-y-1 flex-1">
        <p className="px-4 text-[9px] font-black text-sky-200/50 uppercase tracking-[0.4em] mb-4">
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
                  ? "bg-white text-sky-600 shadow-lg shadow-sky-900/20"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-sky-600" : "text-white/40 group-hover:text-white")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="pt-6 space-y-1 border-t border-white/10">
        <p className="px-4 text-[9px] font-black text-sky-200/50 uppercase tracking-[0.4em] mb-4 mt-2">Preferences</p>
        <Link
          href="/settings"
          className={cn(
            "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
            pathname === "/settings"
              ? "bg-white text-sky-600"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          )}
        >
          <Settings className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
          Settings
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
