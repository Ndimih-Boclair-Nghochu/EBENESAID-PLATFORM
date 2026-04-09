'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronUp, ShieldCheck, User as UserIcon, CreditCard, LogOut, CheckCircle2 } from "lucide-react";
import { useAuthContext } from "@/auth/provider";
import { useRouter } from "next/navigation";

/**
 * @component UserNav
 * @description Compact user profile trigger for the platform sidebar.
 * Optimized for hydration safety.
 */
export function UserNav() {
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  if (!mounted) {
    return (
      <div className="h-16 w-full flex items-center gap-3 px-3">
        <div className="h-10 w-10 rounded-xl bg-white/10 animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
          <div className="h-2 w-32 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // Render user info from real backend user
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-14 w-full justify-between gap-3 px-3 hover:bg-white/10 rounded-xl border border-transparent hover:border-white/10 transition-all group">
          <div className="flex items-center gap-3 overflow-hidden text-left">
            <Avatar className="h-9 w-9 rounded-xl border border-white/20 shadow-sm transition-transform group-hover:scale-105 shrink-0">
              <AvatarImage src={user?.avatar || undefined} alt="@user" />
              <AvatarFallback className="bg-white text-green-700 font-black text-xs">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start overflow-hidden">
              <span className="text-xs font-black text-white leading-none">{user?.firstName} {user?.lastName}</span>
              <span className="text-[8px] font-bold text-green-200 truncate w-full mt-1.5 uppercase tracking-widest">{user?.email}</span>
            </div>
          </div>
          <ChevronUp className="h-3 w-3 text-green-200 group-hover:text-white transition-colors shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-2xl p-2 shadow-2xl border-none mb-2 animate-in slide-in-from-bottom-2 duration-300" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black leading-none text-slate-900 tracking-tight">{user?.firstName} {user?.lastName}</p>
              <CheckCircle2 className="h-3 w-3 text-primary" />
            </div>
            <p className="text-[8px] font-black leading-none text-primary uppercase tracking-[0.2em]">
              Verified Account
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-slate-50 mx-1" />
        <DropdownMenuGroup className="space-y-0.5">
          <DropdownMenuItem
            onSelect={() => handleNavigate('/settings')}
            className="rounded-xl px-3 py-2.5 font-bold hover:bg-slate-50 cursor-pointer transition-colors gap-2 text-xs"
          >
            <UserIcon className="h-4 w-4 text-slate-400" /> My Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleNavigate('/dashboard')}
            className="rounded-xl px-3 py-2.5 font-bold hover:bg-slate-50 cursor-pointer transition-colors gap-2 text-xs"
          >
            <ShieldCheck className="h-4 w-4 text-slate-400" /> Verification Status
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleNavigate('/billing')}
            className="rounded-xl px-3 py-2.5 font-bold hover:bg-slate-50 cursor-pointer transition-colors gap-2 text-xs"
          >
            <CreditCard className="h-4 w-4 text-slate-400" /> Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1 bg-slate-50 mx-1" />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="rounded-xl px-3 py-2.5 font-bold text-red-500 hover:bg-red-50 cursor-pointer transition-colors gap-2 text-xs"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
