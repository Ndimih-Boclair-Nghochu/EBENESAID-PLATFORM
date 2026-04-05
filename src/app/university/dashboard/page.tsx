'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users, GraduationCap, CheckCircle2, ShieldCheck,
  ArrowUpRight, Clock, Globe, Zap, Activity,
  Building2, FileText, UserCheck, AlertTriangle, BookOpen, MessageSquare
} from "lucide-react";
import { SpecialistChat } from "@/components/SpecialistChat";
import { ebenesaidInfo } from "@/ai/flows/ebenesaid-info-flow";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import Link from "next/link";

const arrivalData = [
  { month: 'Feb', enrolled: 45, arrived: 38 },
  { month: 'Mar', enrolled: 52, arrived: 47 },
  { month: 'Apr', enrolled: 68, arrived: 59 },
  { month: 'May', enrolled: 91, arrived: 82 },
  { month: 'Jun', enrolled: 124, arrived: 108 },
  { month: 'Jul', enrolled: 210, arrived: 186 },
];

const studentRegistry = [
  { name: 'Louis D.', origin: 'Nigeria', status: 'Arrived', compliance: 100, program: 'Computer Eng.', flag: '🇳🇬' },
  { name: 'Maria K.', origin: 'Ukraine', status: 'In Transit', compliance: 88, program: 'Business Admin', flag: '🇺🇦' },
  { name: 'Kofi M.', origin: 'Ghana', status: 'Arrived', compliance: 96, program: 'Medicine', flag: '🇬🇭' },
  { name: 'Amara S.', origin: 'Senegal', status: 'Pre-Arrival', compliance: 74, program: 'Architecture', flag: '🇸🇳' },
  { name: 'Chen W.', origin: 'China', status: 'Arrived', compliance: 100, program: 'Data Science', flag: '🇨🇳' },
];

const complianceModules = [
  { name: 'Visa Documentation', pct: 96, status: 'healthy' },
  { name: 'Housing Confirmed', pct: 88, status: 'healthy' },
  { name: 'Academic Registration', pct: 92, status: 'healthy' },
  { name: 'Health Insurance', pct: 78, status: 'warning' },
  { name: 'Language Assessment', pct: 65, status: 'warning' },
];

const statusColor: Record<string, string> = {
  Arrived: 'bg-emerald-50 text-emerald-700',
  'In Transit': 'bg-sky-50 text-sky-700',
  'Pre-Arrival': 'bg-amber-50 text-amber-700',
};

export default function UniversityDashboardPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">

        <PageHeader
          title="Partner Dashboard"
          subtitle="University Partner · RTU Riga"
          actions={
            <>
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-xs hover:bg-slate-50" asChild>
                <Link href="/university/sync"><Globe className="h-3.5 w-3.5" /> Sync Portal</Link>
              </Button>
              <Button size="sm" className="h-9 px-4 rounded-xl font-bold shadow-md gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white border-none" asChild>
                <Link href="/university/students"><Zap className="h-3.5 w-3.5" /> Student Registry</Link>
              </Button>
            </>
          }
        />

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={<Users className="h-5 w-5" />} label="Total Students" value="1,240" delta="+12%" positive href="/university/students" bg="bg-indigo-50" color="text-indigo-600" />
          <KpiCard icon={<Clock className="h-5 w-5" />} label="In Transit" value="412" delta="+8%" positive href="/university/students" bg="bg-sky-50" color="text-sky-600" />
          <KpiCard icon={<CheckCircle2 className="h-5 w-5" />} label="Arrived & Settled" value="828" delta="+4%" positive href="/university/students" bg="bg-emerald-50" color="text-emerald-600" />
          <KpiCard icon={<ShieldCheck className="h-5 w-5" />} label="Compliance Rate" value="94.2%" delta="+1.4%" positive href="/university/verification" bg="bg-violet-50" color="text-violet-600" />
        </div>

        {/* Chart + Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Arrival Velocity Chart */}
          <Card className="lg:col-span-8 rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="p-5 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-black text-slate-900 leading-none">Arrival Velocity</CardTitle>
                  <p className="text-xs text-slate-400 font-medium mt-1">Enrolled vs. arrived students — 2025 cohort</p>
                </div>
                <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 border font-bold text-[10px] px-2.5 py-1">
                  Live Data
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={arrivalData}>
                  <defs>
                    <linearGradient id="uniGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="uniGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 600 }} />
                  <Area type="monotone" dataKey="enrolled" stroke="#6366f1" strokeWidth={2} fill="url(#uniGrad1)" name="Enrolled" />
                  <Area type="monotone" dataKey="arrived" stroke="#10b981" strokeWidth={2} fill="url(#uniGrad2)" name="Arrived" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Compliance Modules */}
          <Card className="lg:col-span-4 rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="p-5 border-b border-slate-50">
              <CardTitle className="text-sm font-black text-slate-900 leading-none">Compliance Checklist</CardTitle>
              <p className="text-xs text-slate-400 font-medium mt-1">Cohort readiness by module</p>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {complianceModules.map((mod) => (
                <div key={mod.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700">{mod.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400">{mod.pct}%</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${mod.status === 'healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {mod.status}
                      </span>
                    </div>
                  </div>
                  <Progress value={mod.pct} className={`h-1.5 rounded-full ${mod.status === 'healthy' ? '[&>div]:bg-indigo-500' : '[&>div]:bg-amber-500'}`} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Student Registry + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Student Registry */}
          <Card className="lg:col-span-8 rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black text-slate-900 leading-none">Student Registry</CardTitle>
                <p className="text-xs text-slate-400 font-medium mt-1">Live relocation status per student</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs font-bold border-slate-200" asChild>
                <Link href="/university/students">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {studentRegistry.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <span className="text-xl shrink-0">{s.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-800">{s.name}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusColor[s.status] ?? 'bg-slate-50 text-slate-500'}`}>
                          {s.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">{s.program} · {s.origin}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-black text-indigo-600">{s.compliance}%</p>
                      <p className="text-[9px] text-slate-400 font-medium">compliance</p>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions + Sync Status */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Card className="rounded-2xl border-slate-100 shadow-sm bg-slate-900 text-white p-5 flex-1">
              <div className="flex items-center gap-2 text-indigo-400 mb-4">
                <Globe className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Quick Access</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Students', href: '/university/students', icon: Users },
                  { label: 'Verification', href: '/university/verification', icon: ShieldCheck },
                  { label: 'Sync Portal', href: '/university/sync', icon: Globe },
                  { label: 'AI Advisor', href: '/university/chat', icon: MessageSquare },
                  { label: 'Documents', href: '/docs', icon: FileText },
                  { label: 'Reports', href: '/university/verification', icon: BookOpen },
                ].map(link => (
                  <Link key={link.label} href={link.href}>
                    <div className="flex items-center gap-2 p-3 bg-white/8 hover:bg-white/15 rounded-xl transition-all cursor-pointer group">
                      <link.icon className="h-3.5 w-3.5 text-indigo-400 group-hover:text-white transition-colors shrink-0" />
                      <span className="text-[10px] font-bold text-slate-300 group-hover:text-white transition-colors leading-tight">{link.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl border-slate-100 shadow-sm bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institutional Sync</p>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-emerald-600">Active</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">API Handshake</span>
                  <span className="font-bold text-emerald-600">Secure</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Last Sync</span>
                  <span className="font-bold text-slate-700">2 min ago</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Records Synced</span>
                  <span className="font-bold text-slate-700">1,240</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* AI Advisor */}
        <SpecialistChat
          title="Academic Advisor"
          specialty="Student Enrollment & Compliance"
          initialMessage="Partner portal online. I can assist with student compliance tracking, enrollment velocity analysis, or institutional sync diagnostics. How can I help?"
          flow={ebenesaidInfo}
          icon={<GraduationCap className="h-4 w-4" />}
        />
      </div>
    </SidebarShell>
  );
}

function KpiCard({ icon, label, value, delta, positive, href, bg, color }: {
  icon: React.ReactNode; label: string; value: string; delta: string;
  positive: boolean; href: string; bg: string; color: string;
}) {
  return (
    <Link href={href}>
      <Card className="rounded-2xl border-slate-100 shadow-sm bg-white p-5 hover:shadow-md hover:border-indigo-100 transition-all group cursor-pointer">
        <div className={`h-10 w-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
        <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 mb-2">{label}</p>
        <div className={`flex items-center gap-1 text-[10px] font-bold ${positive ? 'text-emerald-600' : 'text-rose-500'}`}>
          <ArrowUpRight className="h-3 w-3" />
          {delta}
        </div>
      </Card>
    </Link>
  );
}
