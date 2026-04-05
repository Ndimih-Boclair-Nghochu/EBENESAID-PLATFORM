'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Utensils, ShoppingBag, Clock, CheckCircle2, DollarSign,
  ArrowUpRight, Plus, Flame, Navigation, Activity,
  TrendingUp, Package, Star, AlertTriangle
} from "lucide-react";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussKitchen } from "@/ai/flows/kitchen-specialist-flow";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import Link from "next/link";

const orderVolumeData = [
  { day: 'Mon', orders: 42 },
  { day: 'Tue', orders: 38 },
  { day: 'Wed', orders: 55 },
  { day: 'Thu', orders: 48 },
  { day: 'Fri', orders: 72 },
  { day: 'Sat', orders: 85 },
  { day: 'Sun', orders: 60 },
];

const liveOrders = [
  { id: 'ORD-102', student: 'Louis D.', dish: 'Jollof Rice x2', total: '€17.00', status: 'Preparing', time: '5m ago', type: 'Delivery', location: 'K. Valdemāra 21, Apt 4B' },
  { id: 'ORD-101', student: 'Maria K.', dish: 'Pelmeņi (L)', total: '€6.50', status: 'Out for Delivery', time: '12m ago', type: 'Pickup', location: 'Riga Center Counter' },
  { id: 'ORD-100', student: 'Kofi M.', dish: 'Chicken Tikka', total: '€9.00', status: 'Pending', time: '1m ago', type: 'Pickup', location: 'RTU Hub Counter' },
  { id: 'ORD-099', student: 'Amara S.', dish: 'Fufu & Soup', total: '€11.50', status: 'Preparing', time: '8m ago', type: 'Delivery', location: 'Maskavas 14, Apt 2' },
];

const topItems = [
  { name: 'Jollof Rice', orders: 142, revenue: '€852', trend: '+18%' },
  { name: 'Chicken Tikka', orders: 98, revenue: '€588', trend: '+12%' },
  { name: 'Pelmeņi (L)', orders: 87, revenue: '€348', trend: '+5%' },
  { name: 'Fufu & Soup', orders: 74, revenue: '€629', trend: '+22%' },
];

const statusStyle: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700',
  Preparing: 'bg-orange-50 text-orange-700',
  'Out for Delivery': 'bg-sky-50 text-sky-700',
};

export default function SupplierDashboardPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">

        <PageHeader
          title="Kitchen Dashboard"
          subtitle="Food Supplier · Western Kitchen"
          actions={
            <>
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-xs hover:bg-slate-50" asChild>
                <Link href="/supplier/menu"><Plus className="h-3.5 w-3.5" /> Add Menu Item</Link>
              </Button>
              <Button size="sm" className="h-9 px-4 rounded-xl font-bold shadow-md gap-2 text-xs bg-orange-600 hover:bg-orange-700 text-white border-none" asChild>
                <Link href="/supplier/orders"><Flame className="h-3.5 w-3.5" /> Live Orders</Link>
              </Button>
            </>
          }
        />

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={<ShoppingBag className="h-5 w-5" />} label="Active Orders" value="12" delta="+4 today" positive href="/supplier/orders" bg="bg-orange-50" color="text-orange-600" />
          <KpiCard icon={<DollarSign className="h-5 w-5" />} label="Daily Revenue" value="€412" delta="+18%" positive href="/supplier/orders" bg="bg-green-50" color="text-green-600" />
          <KpiCard icon={<CheckCircle2 className="h-5 w-5" />} label="Completed Today" value="86" delta="+12" positive href="/supplier/orders" bg="bg-emerald-50" color="text-emerald-600" />
          <KpiCard icon={<Clock className="h-5 w-5" />} label="Avg. Prep Time" value="18m" delta="-2m" positive href="/supplier/orders" bg="bg-sky-50" color="text-sky-600" />
        </div>

        {/* Chart + Live Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Order Volume Chart */}
          <Card className="lg:col-span-8 rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="p-5 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-black text-slate-900 leading-none">Weekly Order Volume</CardTitle>
                  <p className="text-xs text-slate-400 font-medium mt-1">Orders delivered per day — this week</p>
                </div>
                <Badge className="bg-orange-50 text-orange-700 border-orange-100 border font-bold text-[10px] px-2.5 py-1">
                  Live Data
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={orderVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 600 }} />
                  <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Live Orders */}
          <Card className="lg:col-span-4 rounded-2xl border-slate-100 shadow-sm bg-white flex flex-col">
            <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <Flame className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-black text-slate-900">Live Orders</CardTitle>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-bold text-orange-600">Live</span>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-slate-50">
                {liveOrders.map((ord) => (
                  <div key={ord.id} className="px-4 py-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-slate-800 truncate pr-2">{ord.dish}</p>
                      <p className="text-xs font-black text-slate-900 shrink-0">{ord.total}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400">{ord.student}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusStyle[ord.status] ?? 'bg-slate-50 text-slate-500'}`}>
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-300 font-medium">{ord.time}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Navigation className="h-2.5 w-2.5 text-orange-400 shrink-0" />
                      <span className="text-[9px] text-slate-400 truncate">{ord.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-3 border-t border-slate-50">
              <Button variant="ghost" className="w-full h-9 rounded-xl text-[10px] font-black text-orange-600 hover:bg-orange-50" asChild>
                <Link href="/supplier/orders">View All Orders</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Top Menu Items + AI + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Top Menu Items */}
          <Card className="lg:col-span-5 rounded-2xl border-slate-100 shadow-sm bg-white">
            <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black text-slate-900 leading-none">Top Menu Items</CardTitle>
                <p className="text-xs text-slate-400 font-medium mt-1">Best performing dishes this week</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs font-bold border-slate-200" asChild>
                <Link href="/supplier/menu">Edit Menu</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {topItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                      <span className="text-sm font-black">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{item.orders} orders</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-black text-slate-900">{item.revenue}</p>
                      <p className="text-[9px] font-bold text-emerald-600">{item.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Kitchen Specialist */}
          <div className="lg:col-span-4">
            <SpecialistChat
              title="Kitchen Specialist"
              specialty="Menu & Operations"
              initialMessage="Kitchen online. I can help with menu optimisation, order flow analysis, or demand forecasting for the student cohort. What's the focus?"
              flow={discussKitchen}
              icon={<Utensils className="h-4 w-4" />}
            />
          </div>

          {/* Quick Access */}
          <div className="lg:col-span-3">
            <Card className="rounded-2xl border-slate-100 shadow-sm bg-slate-900 text-white p-5 h-full">
              <div className="flex items-center gap-2 text-orange-400 mb-4">
                <Utensils className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Quick Access</p>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Live Orders', href: '/supplier/orders', icon: ShoppingBag },
                  { label: 'Menu Manager', href: '/supplier/menu', icon: Package },
                  { label: 'Student Orders', href: '/food', icon: Star },
                  { label: 'Analytics', href: '/supplier/orders', icon: TrendingUp },
                ].map(link => (
                  <Link key={link.label} href={link.href}>
                    <div className="flex items-center gap-2.5 p-3 bg-white/8 hover:bg-white/15 rounded-xl transition-all cursor-pointer group">
                      <link.icon className="h-3.5 w-3.5 text-orange-400 group-hover:text-white transition-colors shrink-0" />
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
      <Card className="rounded-2xl border-slate-100 shadow-sm bg-white p-5 hover:shadow-md hover:border-orange-100 transition-all group cursor-pointer">
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
