'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, ChevronDown, LogOut, User, MessageSquare, LifeBuoy, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export const roleProfiles = {
  student: {
    name: "Louis D.",
    email: "louis@student.edu",
    role: "Student",
    sub: "RTU Riga · Class of 2025",
    avatar: "https://picsum.photos/seed/user-louis/200/200",
    initials: "LD",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
    accentClass: "bg-green-700",
    settingsHref: "/settings",
  },
  admin: {
    name: "Alex M.",
    email: "admin@ebenesaid.com",
    role: "Administrator",
    sub: "System Admin · Full Access",
    avatar: "https://picsum.photos/seed/admin-alex-pro/200/200",
    initials: "AM",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    accentClass: "bg-rose-600",
    settingsHref: "/settings",
  },
  university: {
    name: "Dr. Sarah K.",
    email: "sarah@rtu.lv",
    role: "University Partner",
    sub: "RTU Riga · Partner Portal",
    avatar: "https://picsum.photos/seed/uni-sarah-prof/200/200",
    initials: "SK",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    accentClass: "bg-indigo-600",
    settingsHref: "/settings",
  },
  supplier: {
    name: "Chef Omar A.",
    email: "omar@westernkitchen.lv",
    role: "Food Supplier",
    sub: "Western Kitchen · Active",
    avatar: "https://picsum.photos/seed/supplier-omar-chef/200/200",
    initials: "OA",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
    accentClass: "bg-orange-600",
    settingsHref: "/settings",
  },
  agent: {
    name: "Mark E.",
    email: "mark@rigaprops.lv",
    role: "Housing Agent",
    sub: "Riga Properties · Verified Agent",
    avatar: "https://picsum.photos/seed/agent-mark-prop/200/200",
    initials: "ME",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
    accentClass: "bg-green-700",
    settingsHref: "/settings",
  },
  transport: {
    name: "Josef K.",
    email: "josef@rigataxi.lv",
    role: "Transport Partner",
    sub: "RIX Airport Specialist · Online",
    avatar: "https://picsum.photos/seed/transport-josef-drv/200/200",
    initials: "JK",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    accentClass: "bg-emerald-600",
    settingsHref: "/settings",
  },
};

const notifications = [
  { id: 1, title: "New booking request", desc: "Student from Nigeria inquired about your listing", time: "2m ago", unread: true },
  { id: 2, title: "Document verified", desc: "Your residence permit has been approved", time: "1h ago", unread: true },
  { id: 3, title: "Order delivered", desc: "Your Jollof Rice order was delivered", time: "3h ago", unread: false },
];

/**
 * PageHeader — Universal top bar for all authenticated pages.
 * Shows role-based profile picture, user name, notification bell,
 * and a profile dropdown with quick navigation links.
 */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const [profile, setProfile] = useState(roleProfiles.student);
  const [mounted, setMounted] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('eb_demo_role') as keyof typeof roleProfiles;
      if (role && roleProfiles[role]) {
        setProfile(roleProfiles[role]);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') localStorage.removeItem('eb_demo_role');
      await signOut(auth);
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
        <div className="space-y-1.5">
          <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
          <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">

      {/* Left: Page title */}
      <div className="min-w-0 flex-1">
        {subtitle && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 hidden sm:block">
            {subtitle}
          </p>
        )}
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none truncate">
          {title}
        </h1>
      </div>

      {/* Right: Actions + Notifications + Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

        {/* Custom actions slot */}
        {actions && <div className="hidden sm:flex items-center gap-2">{actions}</div>}

        {/* Notification bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-green-500 rounded-full shadow-sm" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 sm:w-80 rounded-2xl p-0 shadow-xl border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <p className="text-xs font-black text-slate-900 uppercase tracking-wide">Notifications</p>
              {unreadCount > 0 && (
                <Badge className="bg-green-100 text-green-700 border-none text-[10px] font-bold px-2 py-0.5">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="divide-y divide-slate-50">
              {notifications.map(n => (
                <div key={n.id} className={`px-4 py-3.5 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${n.unread ? 'bg-green-50/30' : ''}`}>
                  <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-green-500' : 'bg-slate-200'}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{n.title}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">{n.desc}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-slate-50 text-center">
              <Link href="/support" className="text-xs font-bold text-green-700 hover:text-green-700 transition-colors">
                View all notifications
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group outline-none">
              <div className="relative">
                <Avatar className="h-8 w-8 rounded-xl border-2 border-white shadow-md ring-1 ring-slate-100">
                  <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />
                  <AvatarFallback className={`${profile.accentClass} text-white font-black text-xs rounded-xl`}>
                    {profile.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-black text-slate-900 leading-none">{profile.name}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5 leading-none">{profile.role}</p>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-300 hidden sm:block group-hover:text-slate-500 transition-colors" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2 shadow-xl border border-slate-100">
            {/* Profile card */}
            <div className="px-3 py-3 flex items-center gap-3 mb-1">
              <div className="relative shrink-0">
                <Avatar className="h-11 w-11 rounded-xl border-2 border-white shadow-md ring-1 ring-slate-100">
                  <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />
                  <AvatarFallback className={`${profile.accentClass} text-white font-black text-sm rounded-xl`}>
                    {profile.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-black text-slate-900 leading-none truncate">{profile.name}</p>
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                </div>
                <Badge className={`mt-1.5 text-[9px] font-bold border px-2 py-0 rounded-full ${profile.badgeClass}`}>
                  {profile.role}
                </Badge>
              </div>
            </div>

            <DropdownMenuSeparator className="my-1 bg-slate-50" />

            <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer gap-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-green-700 focus:bg-slate-50 focus:text-green-700">
              <Link href="/settings">
                <User className="h-3.5 w-3.5 text-slate-400" /> My Profile & Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer gap-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-green-700 focus:bg-slate-50 focus:text-green-700">
              <Link href="/messages">
                <MessageSquare className="h-3.5 w-3.5 text-slate-400" /> Messages
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer gap-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-green-700 focus:bg-slate-50 focus:text-green-700">
              <Link href="/support">
                <LifeBuoy className="h-3.5 w-3.5 text-slate-400" /> Support
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-slate-50" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl px-3 py-2.5 cursor-pointer gap-2.5 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
