'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car, Users, Clock, DollarSign, ArrowUpRight, CheckCircle2,
  PlaneTakeoff, MapPin, Navigation, Star, Zap, TrendingUp,
  ShieldCheck, MessageSquare
} from "lucide-react";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussTransit } from "@/ai/flows/transit-specialist-flow";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import Link from "next/link";

const pickupData = [
  { month: 'Feb', pickups: 45, revenue: 810 },
  { month: 'Mar', pickups: 58, revenue: 1044 },
  { month: 'Apr', pickups: 52, revenue: 936 },
  { month: 'May', pickups: 74, revenue: 1332 },
  { month: 'Jun', pickups: 89, revenue: 1602 },
  { month: 'Jul', pickups: 112, revenue: 2016 },
];

const upcomingPickups = [
  { student: 'Louis D.', flight: 'RYR 8142', arrival: 'Today 14:30', destination: 'K. Valdemāra 21', status: 'Confirmed', flag: '🇳🇬' },
  { student: 'Chen W.', flight: 'AY 1179', arrival: 'Today 16:45', destination: 'Maskavas iela 44', status: 'Confirmed', flag: '🇨🇳' },
  { student: 'Amara S.', flight: 'FR 7832', arrival: 'Tomorrow 09:15', destination: 'Brīvības 104', status: 'Pending', flag: '🇸🇳' },
  { student: 'Maria K.', flight: 'BT 401', arrival: 'Tomorrow 11:00', destination: 'Čaka iela 18', status: 'Pending', flag: '🇺🇦' },
];

const fleet = [
  { vehicle: 'VW Transporter T6', plate: 'LV-2847', seats: 8, status: 'Active', trips: 312 },
  { vehicle: 'Mercedes Vito', plate: 'LV-5531', seats: 6, status: 'Active', trips: 247 },
  { vehicle: 'Ford Transit', plate: 'LV-9104', seats: 9, status: 'Maintenance', trips: 189 },
];

const statusStyle: Record<string, string> = {
  Confirmed: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Active: 'bg-emerald-50 text-emerald-700',
  Maintenance: 'bg-rose-50 text-rose-700',
};

export default function TransportDashboardPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">

        <PageHeader
          title="Fleet Dashboard"
          subtitle="Transport Partner · RIX Airport Specialist"
          actions={
            <>
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-xs hover:bg-slate-50" asChild>
                <Link href="/transport/fleet"><Car className="h-3.5 w-3.5" /> Fleet Status</Link>
              </Button>
              <Button size="sm" className="h-9 px-4 rounded-xl font-bold shadow-md gap-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-none" asChild>
                <Link href="/transport/pickups"><Zap className="h-3.5 w-3.5" /> Upcoming Pickups</Link>
              </Button>
            </>
          }
        />

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={<PlaneTakeoff className="h-5 w-5" />} label="Pickups Today" value="8" delta="+2 from yesterday" positive href="/transport/pickups" bg="bg-sky-50" color="text-sky-600" />
          <KpiCard icon={<Users className="h-5 w-5" />} label="Arriving Students" value="14" delta="+4 this week" positive href="/transport/pickups" bg="bg-emerald-50" color="text-emerald-600" />
          <KpiCard icon={<DollarSign className="h-5 w-5" />} label="Daily Revenue" value="€240" delta="+15%" positive href="/transport/pickups" bg="bg-green-50" color="text-green-600" />
          <KpiCard icon={<Star className="h-5 w-5" />} label="Driver Rating" value="4.9★" delta="High Trust" positive href="/transport/pickups" bg="bg-amber-50" color="text-amber-600" />
        </div>

        {/* Chart + Upcoming Pickups */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Transfer Velocity Chart */}
          <Card className="lg:col-span-8 rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="p-5 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-black text-slate-900 leading-none">Transfer Velocity</CardTitle>
                  <p className="text-xs text-slate-400 font-medium mt-1">Monthly pickups vs. revenue — 2025</p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 border font-bold text-[10px] px-2.5 py-1">
                  +26% MoM
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={pickupData}>
                  <defs>
                    <linearGradient id="transGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="transGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 600 }} />
                  <Area type="monotone" dataKey="pickups" stroke="#10b981" strokeWidth={2} fill="url(#transGrad1)" name="Pickups" />
                  <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fill="url(#transGrad2)" name="Revenue (€)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Upcoming Pickups */}
          <Card className="lg:col-span-4 rounded-2xl border-slate-100 shadow-sm bg-white flex flex-col">
            <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                  <PlaneTakeoff className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-black text-slate-900">Upcoming Pickups</CardTitle>
              </div>
              <Button variant="outline" size="sm" className="h-7 rounded-lg text-[10px] font-bold border-slate-200" asChild>
                <Link href="/transport/pickups">All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-slate-50">
                {upcomingPickups.map((pickup, i) => (
                  <div key={i} className="px-4 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{pickup.flag}</span>
                        <p className="text-xs font-bold text-slate-800">{pickup.student}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusStyle[pickup.status] ?? 'bg-slate-50 text-slate-500'}`}>
                        {pickup.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <PlaneTakeoff className="h-2.5 w-2.5 shrink-0" />
                      <span>{pickup.flight} · {pickup.arrival}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <Navigation className="h-2.5 w-2.5 shrink-0 text-emerald-500" />
                      <span className="truncate">{pickup.destination}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fleet Status + AI + Quick Access */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Fleet Table */}
          <Card className="lg:col-span-5 rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black text-slate-900 leading-none">Fleet Status</CardTitle>
                <p className="text-xs text-slate-400 font-medium mt-1">Vehicle readiness & trip count</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs font-bold border-slate-200" asChild>
                <Link href="/transport/fleet">Manage</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {fleet.map((v, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50/60 transition-colors">
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                      <Car className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{v.vehicle}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{v.plate} · {v.seats} seats</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusStyle[v.status] ?? 'bg-slate-50 text-slate-500'}`}>
                        {v.status}
                      </span>
                      <p className="text-[9px] text-slate-400 font-medium mt-1">{v.trips} trips</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Transit Specialist */}
          <div className="lg:col-span-4">
            <SpecialistChat
              title="Transit Specialist"
              specialty="Airport Transfers & Logistics"
              initialMessage="Fleet online. I can help with pickup scheduling, route optimisation, or arrival cohort planning for the student intake. What do you need?"
              flow={discussTransit}
              icon={<Car className="h-4 w-4" />}
            />
          </div>

          {/* Quick Access */}
          <div className="lg:col-span-3">
            <Card className="rounded-2xl border-slate-100 shadow-sm bg-slate-900 text-white p-5 h-full">
              <div className="flex items-center gap-2 text-emerald-400 mb-4">
                <Navigation className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Quick Access</p>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Pickup Jobs', href: '/transport/pickups', icon: PlaneTakeoff },
                  { label: 'Fleet', href: '/transport/fleet', icon: Car },
                  { label: 'Arrivals', href: '/arrival', icon: MapPin },
                  { label: 'Messages', href: '/messages', icon: MessageSquare },
                ].map(link => (
                  <Link key={link.label} href={link.href}>
                    <div className="flex items-center gap-2.5 p-3 bg-white/8 hover:bg-white/15 rounded-xl transition-all cursor-pointer group">
                      <link.icon className="h-3.5 w-3.5 text-emerald-400 group-hover:text-white transition-colors shrink-0" />
                      <span className="text-[10px] font-bold text-slate-300 group-hover:text-white transition-colors">{link.label}</span>
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
      <Card className="rounded-2xl border-slate-100 shadow-sm bg-white p-5 hover:shadow-md hover:border-emerald-100 transition-all group cursor-pointer">
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
