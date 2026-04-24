'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  Euro,
  FileText,
  Home,
  Loader2,
  LogOut,
  MapPin,
  PartyPopper,
  PlaneTakeoff,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";

import { useAuthContext } from "@/auth/provider";
import { PageHeader } from "@/components/layout/page-header";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

type DashboardTask = {
  id: number;
  title: string;
  desc: string;
  done: boolean;
  category: string;
  href: string;
};

async function readJsonSafely<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

type DashboardResponse = {
  tasks?: DashboardTask[];
  guidance?: string;
  error?: string;
  detail?: string;
  source?: string;
  onboarding?: {
    programDurationBand: "under_3_months" | "over_3_months" | null;
    onboardingCompleted: boolean;
  };
};

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
  const { user, isLoading, isFirstLogin, clearFirstLogin, logout, refreshUser } = useAuthContext();
  const router = useRouter();
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [guidance, setGuidance] = useState("");
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProgramSetup, setShowProgramSetup] = useState(false);
  const [isSavingProgram, setIsSavingProgram] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && isFirstLogin) {
      setShowWelcome(true);
    }
  }, [user, isFirstLogin]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!user) {
        if (isMounted) {
          setTasks([]);
          setGuidance("");
          setDashboardError(null);
          setIsDashboardLoading(false);
        }
        return;
      }

      try {
        setIsDashboardLoading(true);
        const res = await fetch("/api/dashboard", { credentials: "include" });
        const data = await readJsonSafely<DashboardResponse>(res);

        if (!res.ok) {
          const pieces = [
            data?.error || "Failed to load dashboard.",
            data?.source ? `Source: ${data.source}.` : "",
            data?.detail ? `Detail: ${data.detail}` : "",
          ].filter(Boolean);
          throw new Error(pieces.join(" "));
        }

        if (isMounted) {
          setTasks(data?.tasks ?? []);
          setGuidance(data?.guidance ?? "");
          setDashboardError(null);
          setShowProgramSetup(Boolean(user && !data?.onboarding?.onboardingCompleted));
        }
      } catch (error) {
        if (isMounted) {
          setDashboardError(error instanceof Error ? error.message : "Failed to load dashboard.");
        }
      } finally {
        if (isMounted) {
          setIsDashboardLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    clearFirstLogin();
  };

  const handleProgramSelection = async (programDurationBand: "under_3_months" | "over_3_months") => {
    setIsSavingProgram(true);
    setDashboardError(null);

    try {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ programDurationBand }),
      });
      const data = await readJsonSafely<DashboardResponse>(res);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save your program setup.");
      }

      setTasks(data?.tasks ?? []);
      setGuidance(data?.guidance ?? "");
      setShowProgramSetup(false);
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : "Failed to save your program setup.");
    } finally {
      setIsSavingProgram(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push("/login");
  };

  const handlePayment = () => {
    router.push("/billing");
  };

  const toggleTask = async (id: number) => {
    const currentTask = tasks.find(task => task.id === id);
    if (!currentTask) return;

    const nextDone = !currentTask.done;
    setTasks(prev => prev.map(task => task.id === id ? { ...task, done: nextDone } : task));
    setDashboardError(null);

    try {
      const res = await fetch("/api/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ taskId: id, done: nextDone }),
      });
      const data = await readJsonSafely<DashboardResponse>(res);

      if (!res.ok) {
        const pieces = [
          data?.error || "Failed to update task.",
          data?.source ? `Source: ${data.source}.` : "",
          data?.detail ? `Detail: ${data.detail}` : "",
        ].filter(Boolean);
        throw new Error(pieces.join(" "));
      }

      setTasks(data?.tasks ?? []);
      setGuidance(data?.guidance ?? "");
    } catch (error) {
      setTasks(prev => prev.map(task => task.id === id ? { ...task, done: !nextDone } : task));
      setDashboardError(error instanceof Error ? error.message : "Failed to update task.");
    }
  };

  if (isLoading || !user || isDashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-green-700" />
          <p className="text-sm font-medium text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const trialEndDate = new Date(user.trialEndDate);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const trialActive = daysLeft > 0 && !user.hasPaid;
  const trialExpiredUnpaid = !trialActive && !user.hasPaid;

  const completedCount = tasks.filter(task => task.done).length;
  const progressPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const pendingCount = tasks.length - completedCount;
  const pendingTasks = tasks.filter(task => !task.done);
  const doneTasks = tasks.filter(task => task.done);
  const totalModules = new Set(tasks.map(task => task.category)).size;
  const activeModules = new Set(tasks.filter(task => task.done).map(task => task.category)).size;

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        {showWelcome && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-300">
              <div className="relative bg-gradient-to-br from-green-700 to-green-800 p-8 text-center">
                <button
                  onClick={handleCloseWelcome}
                  className="absolute right-4 top-4 rounded-lg p-1 text-white/60 transition-colors hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                  <PartyPopper className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white">Welcome, {user.firstName}!</h2>
                <p className="mt-2 text-sm font-medium text-green-100">Your EBENESAID account is ready</p>
              </div>

              <div className="space-y-5 p-8">
                <p className="text-center text-sm leading-relaxed text-slate-600">
                  We&apos;re thrilled to have you on board! Your relocation journey just got a whole lot easier.
                </p>

                <div className="space-y-3 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">1 Month Free Trial</p>
                      <p className="text-xs font-medium text-slate-500">
                        Your trial ends on {trialEndDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-amber-200/60" />

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                      <Euro className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Platform Fee: EUR 5</p>
                      <p className="text-xs font-medium text-slate-500">After your free trial, pay EUR 5 once to continue using all features</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-green-100 bg-green-50 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <p className="text-xs font-medium leading-relaxed text-green-700">
                    Enjoy full access to housing search, document storage, airport transfers, community, career board, and all platform features during your trial.
                  </p>
                </div>

                <Button
                  onClick={handleCloseWelcome}
                  className="h-12 w-full rounded-xl border-none bg-green-700 text-sm font-black text-white shadow-lg shadow-green-700/20 hover:bg-green-800"
                >
                  Let&apos;s Get Started!
                </Button>
              </div>
            </div>
          </div>
        )}

        {!showWelcome && showProgramSetup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Program Setup</p>
              <h2 className="mt-3 text-2xl font-black text-slate-900">How long is your study journey?</h2>
              <p className="mt-2 text-sm text-slate-600">
                Choose your program length so the admin-defined checklist for your stay period can be applied to your account automatically.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 p-5 text-left transition hover:border-primary hover:bg-primary/5"
                  onClick={() => handleProgramSelection("under_3_months")}
                  disabled={isSavingProgram}
                >
                  <p className="text-sm font-black text-slate-900">Under 3 Months</p>
                  <p className="mt-2 text-sm text-slate-600">Short course, exchange, or other short-stay academic journey.</p>
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 p-5 text-left transition hover:border-primary hover:bg-primary/5"
                  onClick={() => handleProgramSelection("over_3_months")}
                  disabled={isSavingProgram}
                >
                  <p className="text-sm font-black text-slate-900">3 Months Or More</p>
                  <p className="mt-2 text-sm text-slate-600">Degree program, long exchange, or extended academic relocation.</p>
                </button>
              </div>
              {isSavingProgram && (
                <p className="mt-4 text-sm text-slate-500">Saving your setup and applying your default checklist...</p>
              )}
            </div>
          </div>
        )}

        {trialExpiredUnpaid && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Payment Required</p>
              <h2 className="mt-3 text-2xl font-black text-slate-900">Your free trial has ended</h2>
              <p className="mt-2 text-sm text-slate-600">
                Complete the EUR 5 platform fee payment to keep using your student tools, relocation checklist, and support modules.
              </p>
              {paymentStatus && <p className="mt-3 text-sm text-slate-600">{paymentStatus}</p>}
              <div className="mt-6 flex gap-3">
                <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={handlePayment}>
                  Make Payment
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={async () => {
                    await refreshUser();
                    setPaymentStatus("Account payment status refreshed.");
                  }}
                >
                  Refresh Status
                </Button>
              </div>
            </div>
          </div>
        )}

        <PageHeader
          title={`Welcome, ${user.firstName}!`}
          subtitle={`${user.university || "Student Portal"} | ${user.email}`}
          actions={
            <>
              {trialActive && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-xs font-bold text-amber-700">{daysLeft} days left in trial</span>
                </div>
              )}
              <Button size="sm" variant="outline" className="h-9 rounded-xl border-slate-200 px-4 text-xs font-bold" asChild>
                <Link href="/arrival">
                  <PlaneTakeoff className="h-3.5 w-3.5" /> Arrival
                </Link>
              </Button>
              <Button size="sm" className="h-9 rounded-xl border-none bg-green-700 px-4 text-xs font-bold text-white shadow-md shadow-green-700/20 hover:bg-green-800" asChild>
                <Link href="/docs">
                  <Wallet className="h-3.5 w-3.5" /> My Wallet
                </Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="h-9 rounded-xl px-3 text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600"
              >
                {isLoggingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          }
        />

        {dashboardError && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-sm font-medium">{dashboardError}</p>
          </div>
        )}

        {trialActive && (
          <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900">Free Trial Active - {daysLeft} days remaining</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  After your trial ends, pay the platform fee of <span className="font-bold text-slate-700">EUR 5</span> to continue.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Tasks Done" value={`${completedCount}/${tasks.length}`} icon={<CheckCircle2 className="h-4 w-4" />} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard label="Tasks Pending" value={String(pendingCount)} icon={<Clock className="h-4 w-4" />} color="text-green-700" bg="bg-green-50" />
          <StatCard label="Compliance" value={`${progressPercent}%`} icon={<TrendingUp className="h-4 w-4" />} color="text-violet-600" bg="bg-violet-50" />
          <StatCard label="Modules Active" value={`${activeModules}/${totalModules || 0}`} icon={<Zap className="h-4 w-4" />} color="text-amber-600" bg="bg-amber-50" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Card className="h-full rounded-2xl border-slate-100 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3 border-b border-slate-50 p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Compass className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm font-black leading-none text-slate-900">Your Relocation Roadmap</CardTitle>
                  <p className="mt-1 text-xs font-medium text-slate-400">Profile-based guidance powered by your account data</p>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <blockquote className="rounded-r-xl border-l-4 border-primary/30 bg-primary/3 py-1 pl-4 text-sm font-medium italic leading-relaxed text-slate-600">
                  &quot;{guidance || "Your personalized relocation guidance will appear here as your account data loads."}&quot;
                </blockquote>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    <BookOpen className="h-3 w-3" /> University: {user.university || "Not set"}
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" /> Account: Active
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="h-full rounded-2xl border-slate-100 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-50 p-5 pb-3">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-400">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <StatusItem label="Name" value={`${user.firstName} ${user.lastName}`} icon={<MapPin className="h-4 w-4" />} status="default" />
                <StatusItem label="Account Type" value={user.userType.charAt(0).toUpperCase() + user.userType.slice(1)} icon={<ShieldCheck className="h-4 w-4" />} status="active" />
                <StatusItem label="Trial Status" value={trialActive ? `${daysLeft} days left` : (user.hasPaid ? "Paid" : "Expired")} icon={<Zap className="h-4 w-4" />} status={trialActive || user.hasPaid ? "active" : "default"} />
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm">
          <CardHeader className="flex flex-col items-start justify-between gap-3 border-b border-slate-50 p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-black leading-none text-slate-900">Relocation Checklist</CardTitle>
                <p className="mt-1 text-[11px] font-medium text-slate-400">
                  {completedCount} of {tasks.length} tasks completed
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Default tasks are assigned by admin based on your selected stay period.
                </p>
              </div>
            </div>
            <div className="flex w-full items-center gap-3 sm:w-auto">
              <div className="text-left sm:text-right">
                <p className="text-xl font-black leading-none text-primary">{progressPercent}%</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-400">Complete</p>
              </div>
              <Progress value={progressPercent} className="h-2 flex-1 rounded-full bg-slate-100 sm:w-28 sm:flex-none" />
            </div>
          </CardHeader>

            <CardContent className="p-0">
              {pendingTasks.length > 0 && (
                <div>
                <div className="border-b border-slate-50 bg-slate-50/60 px-5 py-2.5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">To Do - {pendingTasks.length} remaining</p>
                </div>
                <div className="divide-y divide-slate-50">
                  {pendingTasks.map(task => (
                    <TaskRow key={task.id} task={task} onToggle={toggleTask} />
                  ))}
                </div>
                </div>
              )}
              {doneTasks.length > 0 && (
                <div>
                <div className="border-y border-emerald-50 bg-emerald-50/40 px-5 py-2.5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Completed - {doneTasks.length}</p>
                </div>
                <div className="divide-y divide-slate-50">
                  {doneTasks.map(task => (
                    <TaskRow key={task.id} task={task} onToggle={toggleTask} />
                  ))}
                </div>
                </div>
              )}
              {!pendingTasks.length && !doneTasks.length && (
                <div className="p-8 text-center text-sm text-slate-500">
                  No checklist items have been assigned to this account yet. Once an admin publishes defaults for your stay period, they will appear here automatically.
                </div>
              )}
            </CardContent>
          </Card>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
  onToggle,
}: {
  task: DashboardTask;
  onToggle: (id: number) => void | Promise<void>;
}) {
  return (
    <div
      className={`group flex cursor-pointer flex-col items-start gap-3 px-4 py-3.5 transition-all hover:bg-slate-50/60 sm:flex-row sm:items-center sm:gap-4 sm:px-5 ${task.done ? "opacity-60" : ""}`}
      onClick={() => onToggle(task.id)}
    >
      <Checkbox
        checked={task.done}
        onCheckedChange={() => onToggle(task.id)}
        className="h-4 w-4 shrink-0 rounded-md border-slate-300"
        onClick={e => e.stopPropagation()}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={`text-sm font-bold leading-none transition-colors ${task.done ? "line-through text-slate-400" : "text-slate-800 group-hover:text-primary"}`}>
            {task.title}
          </p>
          <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${categoryColors[task.category] ?? "border-slate-100 bg-slate-50 text-slate-500"}`}>
            {task.category}
          </span>
        </div>
        <p className="mt-1 text-[11px] font-medium text-slate-400 sm:line-clamp-1">{task.desc}</p>
      </div>
      <Link
        href={task.href}
        onClick={e => e.stopPropagation()}
        className="self-end shrink-0 rounded-lg p-1.5 text-slate-300 transition-all hover:bg-primary/10 hover:text-primary sm:self-auto"
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
  bg,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <Card className="rounded-2xl border-slate-100 bg-white p-4 shadow-sm">
      <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-xl ${bg} ${color}`}>
        {icon}
      </div>
      <p className="text-xl font-black leading-none text-slate-900">{value}</p>
      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    </Card>
  );
}

function QuickLauncher({
  title,
  sub,
  icon,
  href,
}: {
  title: string;
  sub: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="group flex cursor-pointer flex-col items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-400 shadow-inner transition-all group-hover:bg-green-700 group-hover:text-white">
          {icon}
        </div>
        <div>
          <h4 className="text-xs font-black text-slate-900 transition-colors group-hover:text-primary">{title}</h4>
          <p className="mt-0.5 text-[10px] font-medium text-slate-400">{sub}</p>
        </div>
      </div>
    </Link>
  );
}

function StatusItem({
  label,
  value,
  icon,
  status,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  status?: "active" | "default";
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${status === "active" ? "bg-primary/10 text-primary" : "bg-slate-50 text-slate-400"}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide leading-none text-slate-400">{label}</p>
          <p className="mt-1 truncate text-xs font-bold leading-none text-slate-800">{value}</p>
        </div>
      </div>
      {status === "active" && <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />}
    </div>
  );
}
