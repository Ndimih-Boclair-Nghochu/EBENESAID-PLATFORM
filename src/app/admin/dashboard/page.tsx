'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users, Home, Briefcase, Activity, BarChart3, ShieldCheck,
  ArrowUpRight, ArrowDownRight, TrendingUp, Globe, Zap,
  HardDrive, AlertTriangle, CheckCircle2, Clock, Flag,
  Building2, FileText, UserCheck, DollarSign, Server
} from "lucide-react";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussOps } from "@/ai/flows/admin-ops-flow";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import Link from "next/link";

const enrollmentData = [
  { month: 'Jan', students: 320, verified: 280 },
  { month: 'Feb', students: 480, verified: 390 },
  { month: 'Mar', students: 620, verified: 540 },
  { month: 'Apr', students: 890, verified: 760 },
  { month: 'May', students: 1240, verified: 1050 },
  { month: 'Jun', students: 1680, verified: 1420 },
  { month: 'Jul', students: 2840, verified: 2480 },
];

const recentActivity = [
  { type: 'verification', msg: 'Kofi Mensah · Residence permit approved', time: '2m ago', icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50' },
  { type: 'housing', msg: 'New verified listing added · K. Valdemāra iela', time: '14m ago', icon: Home, color: 'text-sky-500 bg-sky-50' },
  { type: 'alert', msg: 'Verification queue · 12 pending documents', time: '1h ago', icon: AlertTriangle, color: 'text-amber-500 bg-amber-50' },
  { type: 'career', msg: 'Printful internship posted · 3 applicants', time: '2h ago', icon: Briefcase, color: 'text-violet-500 bg-violet-50' },
  { type: 'report', msg: 'Incident report filed · Housing dispute resolved', time: '4h ago', icon: Flag, color: 'text-rose-500 bg-rose-50' },
  { type: 'institution', msg: 'RTU Riga · Admissions sync completed', time: '6h ago', icon: Building2, color: 'text-indigo-500 bg-indigo-50' },
];

const platformModules = [
  { name: 'Verified Housing', active: 412, total: 500, pct: 82, status: 'healthy', href: '/accommodation' },
  { name: 'Career Board', active: 86, total: 100, pct: 86, status: 'healthy', href: '/jobs' },
  { name: 'Document Wallets', active: 2840, total: 3000, pct: 95, status: 'healthy', href: '/docs' },
  { name: 'Food Suppliers', active: 8, total: 10, pct: 80, status: 'warning', href: '/food' },
  { name: 'Transport Fleet', active: 14, total: 20, pct: 70, status: 'warning', href: '/arrival' },
  { name: 'Student Circles', active: 24, total: 24, pct: 100, status: 'healthy', href: '/community' },
];

const topUniversities = [
  { name: 'RTU Riga', students: 840, compliance: 96, flag: '🇱🇻' },
  { name: 'University of Latvia', students: 620, compliance: 94, flag: '🇱🇻' },
  { name: 'Turiba University', students: 480, compliance: 91, flag: '🇱🇻' },
  { name: 'RSU', students: 560, compliance: 98, flag: '🇱🇻' },
  { name: 'RISEBA', students: 340, compliance: 89, flag: '🇱🇻' },
];

export default function AdminDashboardPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">

        <PageHeader
          title="Operations Dashboard"
          subtitle="System Administrator · Full Access"
          actions={
            <>
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-xs hover:bg-slate-50" asChild>
                <Link href="/admin/reports"><HardDrive className="h-3.5 w-3.5" /> System Logs</Link>
              </Button>
              <Button size="sm" className="h-9 px-4 rounded-xl font-bold shadow-md gap-2 text-xs bg-sky-600 hover:bg-sky-700 text-white border-none" asChild>
                <Link href="/admin/verification"><Zap className="h-3.5 w-3.5" /> Verification Queue</Link>
              </Button>
            </>
          }
        />

        {/* Top KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={<Users className="h-5 w-5" />} label="Total Students" value="2,840" delta="+14%" positive href="/admin/users" bg="bg-sky-50" color="text-sky-600" />
          <KpiCard icon={<Home className="h-5 w-5" />} label="Verified Listings" value="412" delta="+8%" positive href="/accommodation" bg="bg-emerald-50" color="text-emerald-600" />
          <KpiCard icon={<Briefcase className="h-5 w-5" />} label="Active Jobs" value="86" delta="+22%" positive href="/jobs" bg="bg-violet-50" color="text-violet-600" />
          <KpiCard icon={<Building2 className="h-5 w-5" />} label="Partner Unis" value="12" delta="+2" positive href="/admin/institutions" bg="bg-amber-50" color="text-amber-600" />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={<UserCheck className="h-5 w-5" />} label="Pending Verifications" value="48" delta="Action required" positive={false} href="/admin/verification" bg="bg-rose-50" color="text-rose-600" />
          <KpiCard icon={<DollarSign className="h-5 w-5" />} label="Platform Revenue" value="€24.8k" delta="+31% MoM" positive href="/admin/finance" bg="bg-green-50" color="text-green-600" />
          <KpiCard icon={<CheckCircle2 className="h-5 w-5" />} label="Avg Compliance" value="94.2%" delta="+1.8%" positive href="/admin/statistics" bg="bg-indigo-50" color="text-indigo-600" />
          <KpiCard icon={<Server className="h-5 w-5" />} label="Platform Health" value="100%" delta="All systems up" positive href="/admin/statistics" bg="bg-slate-50" color="text-slate-600" />
        </div>

        {/* Charts + AI Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Enrollment Chart */}
          <Card className="lg:col-span-8 rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="p-5 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-black text-slate-900 leading-none">Student Enrollment Growth</CardTitle>
                  <p className="text-xs text-slate-400 font-medium mt-1">Total enrolled vs. verified students — 2025</p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 border font-bold text-[10px] px-2.5 py-1">
                  +14% MoM
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={enrollmentData}>
                  <defs>
                    <linearGradient id="adminGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="adminGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 600 }} />
                  <Area type="monotone" dataKey="students" stroke="#0ea5e9" strokeWidth={2} fill="url(#adminGrad1)" name="Total Students" />
                  <Area type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={2} fill="url(#adminGrad2)" name="Verified" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Health */}
          <Card className="lg:col-span-4 rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="p-5 border-b border-slate-50">
              <CardTitle className="text-sm font-black text-slate-900 leading-none">Platform Modules</CardTitle>
              <p className="text-xs text-slate-400 font-medium mt-1">Live capacity across all services</p>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {platformModules.map((mod) => (
                <Link key={mod.name} href={mod.href} className="block group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700 group-hover:text-sky-600 transition-colors">{mod.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400">{mod.active}/{mod.total}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${mod.status === 'healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {mod.status}
                      </span>
                    </div>
                  </div>
                  <Progress value={mod.pct} className={`h-1.5 rounded-full ${mod.status === 'healthy' ? '[&>div]:bg-emerald-500' : '[&>div]:bg-amber-500'}`} />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Activity + Universities Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Recent Activity */}
          <Card className="lg:col-span-7 rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black text-slate-900 leading-none">Recent Activity</CardTitle>
                <p className="text-xs text-slate-400 font-medium mt-1">Live platform event stream</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs font-bold border-slate-200" asChild>
                <Link href="/admin/reports">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{item.msg}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">{item.time}</p>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Universities */}
          <Card className="lg:col-span-5 rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black text-slate-900 leading-none">Partner Universities</CardTitle>
                <p className="text-xs text-slate-400 font-medium mt-1">Student count & compliance</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs font-bold border-slate-200" asChild>
                <Link href="/admin/institutions">Manage</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {topUniversities.map((uni, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <span className="text-xl shrink-0">{uni.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{uni.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{uni.students} students</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-black text-emerald-600">{uni.compliance}%</p>
                      <p className="text-[9px] text-slate-400 font-medium">compliance</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Ops + Quick Access */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SpecialistChat
              title="Operations Specialist"
              specialty="Platform KPI & Strategy"
              initialMessage="Systems online. I can provide real-time analysis on vacancy rates, verification bottlenecks, financial performance, or institutional sync health. What is our focus today?"
              flow={discussOps}
              icon={<BarChart3 className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Card className="rounded-2xl border-slate-100 shadow-sm bg-slate-900 text-white p-5 flex-1">
              <div className="flex items-center gap-2 text-sky-400 mb-4">
                <Globe className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Admin Quick Access</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Verifications', href: '/admin/verification', icon: ShieldCheck },
                  { label: 'User Directory', href: '/admin/users', icon: Users },
                  { label: 'Institutions', href: '/admin/institutions', icon: Building2 },
                  { label: 'Finance', href: '/admin/finance', icon: DollarSign },
                  { label: 'Reports', href: '/admin/reports', icon: Flag },
                  { label: 'Support', href: '/admin/support', icon: Activity },
                ].map(link => (
                  <Link key={link.label} href={link.href}>
                    <div className="flex items-center gap-2 p-3 bg-white/8 hover:bg-white/15 rounded-xl transition-all cursor-pointer group">
                      <link.icon className="h-3.5 w-3.5 text-sky-400 group-hover:text-white transition-colors shrink-0" />
                      <span className="text-[10px] font-bold text-slate-300 group-hover:text-white transition-colors leading-tight">{link.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
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
      <Card className="rounded-2xl border-slate-100 shadow-sm bg-white p-5 hover:shadow-md hover:border-sky-100 transition-all group cursor-pointer">
        <div className={`h-10 w-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
        <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 mb-2">{label}</p>
        <div className={`flex items-center gap-1 text-[10px] font-bold ${positive ? 'text-emerald-600' : 'text-rose-500'}`}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {delta}
        </div>
      </Card>
    </Link>
  );
}
