'use client';

import { useState } from "react";
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
  PlaneTakeoff
} from "lucide-react";
import Link from "next/link";

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
  Housing: "bg-sky-50 text-sky-700 border-sky-100",
  Logistics: "bg-violet-50 text-violet-700 border-violet-100",
  Academic: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Legal: "bg-amber-50 text-amber-700 border-amber-100",
  Setup: "bg-slate-50 text-slate-600 border-slate-100",
  Finance: "bg-green-50 text-green-700 border-green-100",
  Career: "bg-blue-50 text-blue-700 border-blue-100",
  Culture: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const pendingTasks = tasks.filter(t => !t.done);
  const doneTasks = tasks.filter(t => t.done);

  return (
    <SidebarShell>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">

        <PageHeader
          title="My Dashboard"
          subtitle="Student Portal · RTU Riga 2025"
          actions={
            <>
              <Button size="sm" variant="outline" className="rounded-xl font-bold h-9 px-4 gap-2 text-xs border-slate-200" asChild>
                <Link href="/arrival"><PlaneTakeoff className="h-3.5 w-3.5" /> Arrival</Link>
              </Button>
              <Button size="sm" className="rounded-xl font-bold h-9 px-4 shadow-md shadow-sky-600/20 gap-2 text-xs bg-sky-600 hover:bg-sky-700 text-white border-none" asChild>
                <Link href="/docs"><Wallet className="h-3.5 w-3.5" /> My Wallet</Link>
              </Button>
            </>
          }
        />

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Tasks Done" value={`${completedCount}/${tasks.length}`} icon={<CheckCircle2 className="h-4 w-4" />} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard label="Days Until Start" value="47" icon={<Clock className="h-4 w-4" />} color="text-sky-600" bg="bg-sky-50" />
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
                  "Your next priority is confirming verified housing. Once confirmed, your airport-to-city transfer details will be unlocked and we'll guide you through the e-talons registration process."
                </blockquote>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3" /> University: RTU Riga
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" /> Status: Visa Approved
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
                <StatusItem label="Destination" value="Riga, Latvia" icon={<MapPin className="h-4 w-4" />} status="default" />
                <StatusItem label="Institutional Sync" value="Verified (RTU)" icon={<ShieldCheck className="h-4 w-4" />} status="active" />
                <StatusItem label="Notifications" value="Email & SMS Active" icon={<Zap className="h-4 w-4" />} status="active" />
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
        <div className="h-11 w-11 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-sky-600 group-hover:text-white transition-all flex items-center justify-center shadow-inner">
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
