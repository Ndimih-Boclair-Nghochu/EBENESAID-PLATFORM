'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Home, Users, ShieldCheck, Clock, DollarSign, ArrowUpRight,
  Plus, MapPin, Eye, Star, TrendingUp, MessageSquare, BarChart3
} from "lucide-react";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussHousing } from "@/ai/flows/housing-specialist-flow";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import Link from "next/link";

const occupancyData = [
  { month: 'Feb', rate: 65, leads: 12 },
  { month: 'Mar', rate: 72, leads: 18 },
  { month: 'Apr', rate: 68, leads: 15 },
  { month: 'May', rate: 81, leads: 24 },
  { month: 'Jun', rate: 85, leads: 31 },
  { month: 'Jul', rate: 94, leads: 48 },
];

const activeListings = [
  { id: 'L-001', address: 'K. Valdemāra iela 21', type: 'Studio', price: '€380/mo', status: 'Occupied', views: 142, rating: 4.9 },
  { id: 'L-002', address: 'Brīvības 104, Apt 3B', type: '1-Bedroom', price: '€460/mo', status: 'Available', views: 87, rating: 4.7 },
  { id: 'L-003', address: 'Maskavas iela 44', type: 'Studio', price: '€340/mo', status: 'Pending', views: 203, rating: 4.8 },
  { id: 'L-004', address: 'Čaka iela 18, Apt 1', type: '2-Bedroom', price: '€620/mo', status: 'Available', views: 56, rating: 5.0 },
];

const recentLeads = [
  { name: 'Louis D.', origin: 'Nigeria', interest: 'Studio · K. Valdemāra', time: '5m ago', flag: '🇳🇬' },
  { name: 'Maria K.', origin: 'Ukraine', interest: '1-Bed · Brīvības', time: '1h ago', flag: '🇺🇦' },
  { name: 'Chen W.', origin: 'China', interest: 'Studio · Maskavas', time: '3h ago', flag: '🇨🇳' },
  { name: 'Amara S.', origin: 'Senegal', interest: '2-Bed · Čaka', time: '5h ago', flag: '🇸🇳' },
];

const statusStyle: Record<string, string> = {
  Occupied: 'bg-emerald-50 text-emerald-700',
  Available: 'bg-sky-50 text-sky-700',
  Pending: 'bg-amber-50 text-amber-700',
};

export default function AgentDashboardPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">

        <PageHeader
          title="Property Dashboard"
          subtitle="Housing Agent · Riga Properties"
          actions={
            <>
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-xs hover:bg-slate-50" asChild>
                <Link href="/agent/listings"><Home className="h-3.5 w-3.5" /> Listings</Link>
              </Button>
              <Button size="sm" className="h-9 px-4 rounded-xl font-bold shadow-md gap-2 text-xs bg-sky-600 hover:bg-sky-700 text-white border-none" asChild>
                <Link href="/agent/listings"><Plus className="h-3.5 w-3.5" /> Add Listing</Link>
              </Button>
            </>
          }
        />

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={<Home className="h-5 w-5" />} label="Active Listings" value="12" delta="+2 this month" positive href="/agent/listings" bg="bg-sky-50" color="text-sky-600" />
          <KpiCard icon={<Users className="h-5 w-5" />} label="Booking Leads" value="48" delta="+12 this week" positive href="/agent/leads" bg="bg-violet-50" color="text-violet-600" />
          <KpiCard icon={<ShieldCheck className="h-5 w-5" />} label="Verified Units" value="10/12" delta="83% verified" positive href="/agent/verification" bg="bg-emerald-50" color="text-emerald-600" />
          <KpiCard icon={<DollarSign className="h-5 w-5" />} label="Monthly Revenue" value="€4.8k" delta="+14%" positive href="/agent/listings" bg="bg-green-50" color="text-green-600" />
        </div>

        {/* Chart + Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Occupancy Chart */}
          <Card className="lg:col-span-8 rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="p-5 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-black text-slate-900 leading-none">Occupancy & Lead Velocity</CardTitle>
                  <p className="text-xs text-slate-400 font-medium mt-1">Occupancy rate vs. inbound leads — 2025</p>
                </div>
                <Badge className="bg-sky-50 text-sky-700 border-sky-100 border font-bold text-[10px] px-2.5 py-1">
                  +14% MoM
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={occupancyData}>
                  <defs>
                    <linearGradient id="agentGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="agentGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 600 }} />
                  <Area type="monotone" dataKey="rate" stroke="#0ea5e9" strokeWidth={2} fill="url(#agentGrad1)" name="Occupancy %" />
                  <Area type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={2} fill="url(#agentGrad2)" name="Leads" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card className="lg:col-span-4 rounded-2xl border-slate-100 shadow-sm bg-white flex flex-col">
            <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black text-slate-900 leading-none">New Leads</CardTitle>
              <Button variant="outline" size="sm" className="h-7 rounded-lg text-[10px] font-bold border-slate-200" asChild>
                <Link href="/agent/leads">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-slate-50">
                {recentLeads.map((lead, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <span className="text-lg shrink-0">{lead.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800">{lead.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{lead.interest}</p>
                    </div>
                    <span className="text-[9px] text-slate-300 shrink-0">{lead.time}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Listings + AI + Quick Access */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Listings Table */}
          <Card className="lg:col-span-8 rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black text-slate-900 leading-none">Active Listings</CardTitle>
                <p className="text-xs text-slate-400 font-medium mt-1">Current property inventory status</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs font-bold border-slate-200" asChild>
                <Link href="/agent/listings">Manage All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {activeListings.map((listing) => (
                  <div key={listing.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <div className="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                      <Home className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-800 truncate">{listing.address}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${statusStyle[listing.status] ?? 'bg-slate-50 text-slate-500'}`}>
                          {listing.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">{listing.type} · {listing.price}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 justify-end">
                        <Eye className="h-3 w-3 text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-500">{listing.views}</span>
                      </div>
                      <div className="flex items-center gap-0.5 justify-end mt-0.5">
                        <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                        <span className="text-[9px] font-bold text-slate-500">{listing.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Card className="rounded-2xl border-slate-100 shadow-sm bg-slate-900 text-white p-5 flex-1">
              <div className="flex items-center gap-2 text-sky-400 mb-4">
                <BarChart3 className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Quick Access</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'My Listings', href: '/agent/listings', icon: Home },
                  { label: 'Leads', href: '/agent/leads', icon: Users },
                  { label: 'Verification', href: '/agent/verification', icon: ShieldCheck },
                  { label: 'Messages', href: '/messages', icon: MessageSquare },
                  { label: 'Analytics', href: '/agent/listings', icon: TrendingUp },
                  { label: 'Accommodation', href: '/accommodation', icon: MapPin },
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

        {/* AI Housing Specialist */}
        <SpecialistChat
          title="Housing Specialist"
          specialty="Property & Tenant Management"
          initialMessage="Property dashboard live. I can assist with vacancy analysis, lead qualification, pricing strategy, or compliance verification. What do you need?"
          flow={discussHousing}
          icon={<Home className="h-4 w-4" />}
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
      <Card className="rounded-2xl border-slate-100 shadow-sm bg-white p-5 hover:shadow-md hover:border-sky-100 transition-all group cursor-pointer">
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
