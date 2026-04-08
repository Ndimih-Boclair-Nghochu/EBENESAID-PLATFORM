'use client';

import { useState, useEffect } from "react";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  Briefcase,
  Users,
  ArrowUpRight,
  MapPin,
  Wallet,
  Compass,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  TrendingUp,
  BookOpen,
  Utensils,
  PlaneTakeoff,
  X,
  PartyPopper,
  CalendarDays,
  Euro,
  LogOut,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/auth/provider";
import { useRouter } from "next/navigation";

const initialTasks = [
  { id: 1, title: "Finalize Housing", desc: "Confirm verified accommodation before arrival.", done: false, category: "Housing", href: "/accommodation" },
  { id: 2, title: "Plan Airport Transfer", desc: "Book airport-to-city transport in advance.", done: false, category: "Logistics", href: "/arrival" },
  { id: 3, title: "University Enrollment", desc: "Prepare documents for orientation day.", done: false, category: "Academic", href: "/docs" },
  { id: 4, title: "Residence Permit", desc: "OCMA registration appointment booked.", done: true, category: "Legal", href: "/docs" },
  { id: 5, title: "Get a Local SIM Card", desc: "Set up your Latvian phone number.", done: false, category: "Setup", href: "/dashboard" },
  { id: 6, title: "Open a Bank Account", desc: "Open a local IBAN for transactions.", done: false, category: "Finance", href: "/dashboard" },
  { id: 7, title: "Register for e-talons", desc: "Public transport card registration.", done: false, category: "Logistics", href: "/arrival" },
  { id: 8, title: "Explore Career Services", desc: "Browse verified part-time roles.", done: false, category: "Career", href: "/jobs" },
  { id: 9, title: "Cultural Orientation", desc: "Review local laws and customs guide.", done: false, category: "Culture", href: "/community" },
];

const categoryColors: Record<string, string> = {
  Housing: "bg-green-50 text-green-700 border-green-100",
  Logistics: "bg-violet-50 text-violet-700 border-violet-100",
  Academic: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Legal: "bg-amber-50 text-amber-700 border-amber-100",
  Setup: "bg-slate-50 text-slate-600 border-slate-100",
  Finance: "bg-green-50 text-green-700 border-green-100",
  Career: "bg-blue-50 text-blue-700 border-blue-100",
  Culture: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function DashboardPage() {
  const { user, isLoading, isFirstLogin, clearFirstLogin, logout } = useAuthContext();
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Show welcome popup on first login or registration
  useEffect(() => {
    if (user && isFirstLogin) {
      setShowWelcome(true);
    }
  }, [user, isFirstLogin]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    clearFirstLogin();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push('/login');
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Show loading while checking auth
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-green-700" />
          <p className="text-sm font-medium text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate trial info
  const trialEndDate = new Date(user.trialEndDate);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const trialActive = daysLeft > 0 && !user.hasPaid;

  const completedCount = tasks.filter(t => t.done).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const pendingTasks = tasks.filter(t => !t.done);
  const doneTasks = tasks.filter(t => t.done);

  return (
    <SidebarShell>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">

        {/* Welcome Modal */}
        {showWelcome && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 fade-in duration-300">
              {/* Header */}
              <div className="bg-gradient-to-br from-green-700 to-green-800 p-8 text-center relative">
                <button
                  onClick={handleCloseWelcome}
                  className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-1 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PartyPopper className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Welcome, {user.firstName}!
                </h2>
                <p className="text-green-100 text-sm font-medium mt-2">
                  Your EBENESAID account is ready
                </p>
              </div>

              {/* Body */}
              <div className="p-8 space-y-5">
                <p className="text-slate-600 text-sm leading-relaxed text-center">
                  We&apos;re thrilled to have you on board! Your relocation journey just got a whole lot easier.
                </p>

                {/* Trial info card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">1 Month Free Trial</p>
                      <p className="text-xs text-slate-500 font-medium">Your trial ends on {trialEndDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="h-px bg-amber-200/60" />

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                      <Euro className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Platform Fee: €100</p>
                      <p className="text-xs text-slate-500 font-medium">After your free trial, pay once to continue using all features</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-green-50 border border-green-100">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-green-700 font-medium leading-relaxed">
                    Enjoy full access to housing search, document storage, airport transfers, community, career board, and all platform features during your trial.
                  </p>
                </div>

                <Button
                  onClick={handleCloseWelcome}
                  className="w-full h-12 rounded-xl font-black text-sm bg-green-700 hover:bg-green-800 text-white border-none shadow-lg shadow-green-700/20"
                >
                  Let&apos;s Get Started!
                </Button>
              </div>
            </div>
          </div>
        )}

        <PageHeader
          title={`Welcome, ${user.firstName}!`}
          subtitle={`${user.university || 'Student Portal'} · ${user.email}`}
          actions={
            <>
              {trialActive && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-xs font-bold text-amber-700">{daysLeft} days left in trial</span>
                </div>
              )}
              <Button size="sm" variant="outline" className="rounded-xl font-bold h-9 px-4 gap-2 text-xs border-slate-200" asChild>
                <Link href="/arrival"><PlaneTakeoff className="h-3.5 w-3.5" /> Arrival</Link>
              </Button>
              <Button size="sm" className="rounded-xl font-bold h-9 px-4 shadow-md shadow-green-700/20 gap-2 text-xs bg-green-700 hover:bg-green-800 text-white border-none" asChild>
                <Link href="/docs"><Wallet className="h-3.5 w-3.5" /> My Wallet</Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-xl font-bold h-9 px-3 gap-2 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50"
              >
                {isLoggingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          }
        />

        {/* Trial Banner */}
        {trialActive && (
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900">Free Trial Active — {daysLeft} days remaining</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">After your trial ends, pay the platform fee of <span className="font-bold text-slate-700">€100</span> to continue.</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Tasks Done" value={`${completedCount}/${tasks.length}`} icon={<CheckCircle2 className="h-4 w-4" />} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard label="Days Until Start" value="47" icon={<Clock className="h-4 w-4" />} color="text-green-700" bg="bg-green-50" />
          <StatCard label="Compliance" value={`${progressPercent}%`} icon={<TrendingUp className="h-4 w-4" />} color="text-violet-600" bg="bg-violet-50" />
          <StatCard label="Modules Active" value="4/9" icon={<Zap className="h-4 w-4" />} color="text-amber-600" bg="bg-amber-50" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Personalized Roadmap */}
          <div className="lg:col-span-8">
            <Card className="rounded-2xl border-slate-100 shadow-sm bg-white h-full">
              <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Compass className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-black text-slate-900 leading-none">Your Relocation Roadmap</CardTitle>
                  <p className="text-xs text-slate-400 font-medium mt-1">AI-generated guidance based on your profile</p>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <blockquote className="text-sm leading-relaxed text-slate-600 font-medium border-l-4 border-primary/30 pl-4 py-1 italic bg-primary/3 rounded-r-xl">
                  &quot;Your next priority is confirming verified housing. Once confirmed, your airport-to-city transfer details will be unlocked and we&apos;ll guide you through the e-talons registration process.&quot;
                </blockquote>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3" /> University: {user.university || 'Not set'}
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" /> Account: Active
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <div className="lg:col-span-4">
            <Card className="border-slate-100 shadow-sm rounded-2xl bg-white h-full">
              <CardHeader className="p-5 pb-3 border-b border-slate-50">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-400">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <StatusItem label="Name" value={`${user.firstName} ${user.lastName}`} icon={<MapPin className="h-4 w-4" />} status="default" />
                <StatusItem label="Account Type" value={user.userType.charAt(0).toUpperCase() + user.userType.slice(1)} icon={<ShieldCheck className="h-4 w-4" />} status="active" />
                <StatusItem label="Trial Status" value={trialActive ? `${daysLeft} days left` : (user.hasPaid ? 'Paid' : 'Expired')} icon={<Zap className="h-4 w-4" />} status={trialActive || user.hasPaid ? "active" : "default"} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Relocation Blueprint */}
        <Card className="shadow-sm border-slate-100 rounded-2xl bg-white overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-black text-slate-900 leading-none">Relocation Checklist</CardTitle>
                <p className="text-[11px] text-slate-400 font-medium mt-1">{completedCount} of {tasks.length} tasks completed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="text-right">
                <p className="text-xl font-black text-primary leading-none">{progressPercent}%</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Complete</p>
              </div>
              <Progress value={progressPercent} className="h-2 w-28 rounded-full bg-slate-100 hidden sm:block" />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {pendingTasks.length > 0 && (
              <div>
                <div className="px-5 py-2.5 bg-slate-50/60 border-b border-slate-50">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">To Do · {pendingTasks.length} remaining</p>
                </div>
                <div className="divide-y divide-slate-50">
                  {pendingTasks.map((task) => (
                    <TaskRow key={task.id} task={task} onToggle={toggleTask} />
                  ))}
                </div>
              </div>
            )}
            {doneTasks.length > 0 && (
              <div>
                <div className="px-5 py-2.5 bg-emerald-50/40 border-y border-emerald-50">
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Completed · {doneTasks.length}</p>
                </div>
                <div className="divide-y divide-slate-50">
                  {doneTasks.map((task) => (
                    <TaskRow key={task.id} task={task} onToggle={toggleTask} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Launchers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickLauncher title="Housing" sub="Find accommodation" icon={<Home className="h-5 w-5" />} href="/accommodation" />
          <QuickLauncher title="Documents" sub="Secure wallet" icon={<FileText className="h-5 w-5" />} href="/docs" />
          <QuickLauncher title="Jobs" sub="Career board" icon={<Briefcase className="h-5 w-5" />} href="/jobs" />
          <QuickLauncher title="Community" sub="Student circle" icon={<Users className="h-5 w-5" />} href="/community" />
        </div>
      </div>
    </SidebarShell>
  );
}

function TaskRow({
  task,
  onToggle
}: {
  task: typeof initialTasks[number];
  onToggle: (id: number) => void;
}) {
  return (
    <div
      className={`group flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-all cursor-pointer ${task.done ? 'opacity-60' : ''}`}
      onClick={() => onToggle(task.id)}
    >
      <Checkbox
        checked={task.done}
        onCheckedChange={() => onToggle(task.id)}
        className="h-4 w-4 rounded-md border-slate-300 shrink-0"
        onClick={e => e.stopPropagation()}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm font-bold leading-none transition-colors ${task.done ? 'line-through text-slate-400' : 'text-slate-800 group-hover:text-primary'}`}>
            {task.title}
          </p>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${categoryColors[task.category] ?? 'bg-slate-50 text-slate-500 border-slate-100'}`}>
            {task.category}
          </span>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-1 line-clamp-1">{task.desc}</p>
      </div>
      <Link
        href={task.href}
        onClick={e => e.stopPropagation()}
        className="shrink-0 p-1.5 rounded-lg hover:bg-primary/10 text-slate-300 hover:text-primary transition-all"
      >
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  bg
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm bg-white p-4">
      <div className={`h-8 w-8 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">{label}</p>
    </Card>
  );
}

function QuickLauncher({
  title,
  sub,
  icon,
  href
}: {
  title: string;
  sub: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="group p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex flex-col items-center text-center gap-2.5 cursor-pointer">
        <div className="h-11 w-11 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-green-700 group-hover:text-white transition-all flex items-center justify-center shadow-inner">
          {icon}
        </div>
        <div>
          <h4 className="text-xs font-black text-slate-900 group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-[10px] font-medium text-slate-400 mt-0.5">{sub}</p>
        </div>
      </div>
    </Link>
  );
}

function StatusItem({
  label,
  value,
  icon,
  status
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  status?: 'active' | 'default';
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${status === 'active' ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none">{label}</p>
          <p className="text-xs font-bold text-slate-800 leading-none mt-1 truncate">{value}</p>
        </div>
      </div>
      {status === 'active' && (
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
      )}
    </div>
  );
}
