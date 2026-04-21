'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, ChevronDown, LifeBuoy, LogOut, MessageSquare, Settings, User } from 'lucide-react';

import { useAuthContext } from '@/auth/provider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function getProfileHref(userType?: string) {
  if (userType === 'admin' || userType === 'staff') return '/admin/dashboard';
  if (userType === 'agent') return '/agent/dashboard';
  if (userType === 'supplier') return '/supplier/dashboard';
  if (userType === 'transport') return '/transport/dashboard';
  if (userType === 'university') return '/university/dashboard';
  return '/dashboard';
}

function getSupportHref(userType?: string) {
  if (userType === 'admin' || userType === 'staff') return '/admin/support';
  if (userType === 'university') return '/university/chat';
  return '/support';
}

function getMessagesHref(userType?: string) {
  if (userType === 'university') return '/university/chat';
  return '/messages';
}

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
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = useMemo(() => {
    if (!user) return 'EB';
    return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'EB';
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  if (!mounted || !user) {
    return (
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1.5">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
          <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
      <div className="min-w-0 flex-1">
        {subtitle ? (
          <p className="mb-1 hidden text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:block">
            {subtitle}
          </p>
        ) : null}
        <h1 className="truncate text-xl font-black leading-none tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {actions ? <div className="hidden items-center gap-2 sm:flex">{actions}</div> : null}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-xl text-slate-500 transition-colors hover:bg-slate-100"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 overflow-hidden rounded-2xl border border-slate-100 p-0 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-900">Notifications</p>
              <Badge className="border-none bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                Live
              </Badge>
            </div>
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No real notifications are available for this account yet.
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-xl border border-slate-100 transition-colors hover:bg-slate-100"
            >
              <Avatar className="h-8 w-8 rounded-xl border border-white/20 shadow-sm">
                <AvatarFallback className="bg-green-50 text-xs font-black text-green-700">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="ml-1 h-3 w-3 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="mb-2 w-64 rounded-2xl border-none p-2 shadow-2xl"
          >
            <DropdownMenuLabel className="p-3 font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-black leading-none tracking-tight text-slate-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">
                  {user.userType}
                </p>
                <p className="text-[10px] text-slate-500">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-1 my-1 bg-slate-50" />
            <DropdownMenuItem asChild className="cursor-pointer gap-2 rounded-xl px-3 py-2.5 text-xs font-bold hover:bg-slate-50">
              <Link href={getProfileHref(user.userType)}>
                <User className="h-4 w-4 text-slate-400" /> My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer gap-2 rounded-xl px-3 py-2.5 text-xs font-bold hover:bg-slate-50">
              <Link href="/settings">
                <Settings className="h-4 w-4 text-slate-400" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer gap-2 rounded-xl px-3 py-2.5 text-xs font-bold hover:bg-slate-50">
              <Link href={getMessagesHref(user.userType)}>
                <MessageSquare className="h-4 w-4 text-slate-400" /> Messages
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer gap-2 rounded-xl px-3 py-2.5 text-xs font-bold hover:bg-slate-50">
              <Link href={getSupportHref(user.userType)}>
                <LifeBuoy className="h-4 w-4 text-slate-400" /> Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-1 my-1 bg-slate-50" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
