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
import { useAuthContext } from "@/auth/provider";
import { useRouter } from "next/navigation";

const notifications: { id: number; title: string; desc: string; time: string; unread: boolean }[] = [];

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
  const { user, logout } = useAuthContext();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  if (!mounted || !user) {
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
              <Button variant="ghost" size="sm" className="rounded-xl font-bold text-xs text-slate-500 hover:text-green-700 hover:bg-green-50">
                View all
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile dropdown using real backend user */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
              <Avatar className="h-8 w-8 rounded-xl border border-white/20 shadow-sm">
                <AvatarImage alt="@user" />
                <AvatarFallback className="bg-green-50 text-green-700 font-black text-xs">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3 w-3 text-slate-400 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-2xl border-none mb-2 animate-in slide-in-from-bottom-2 duration-300">
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black leading-none text-slate-900 tracking-tight">{user.firstName} {user.lastName}</p>
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                </div>
                <p className="text-[8px] font-black leading-none text-primary uppercase tracking-[0.2em]">
                  {user.userType}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-slate-50 mx-1" />
            <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold hover:bg-slate-50 cursor-pointer transition-colors gap-2 text-xs">
              <User className="h-4 w-4 text-slate-400" /> My Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold hover:bg-slate-50 cursor-pointer transition-colors gap-2 text-xs">
              <Settings className="h-4 w-4 text-slate-400" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold hover:bg-slate-50 cursor-pointer transition-colors gap-2 text-xs">
              <LifeBuoy className="h-4 w-4 text-slate-400" /> Support
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-slate-50 mx-1" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl px-3 py-2.5 font-bold text-red-500 hover:bg-red-50 cursor-pointer transition-colors gap-2 text-xs"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
