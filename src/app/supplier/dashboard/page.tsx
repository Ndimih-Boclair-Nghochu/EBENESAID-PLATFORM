
'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Utensils, 
  TrendingUp, 
  Activity, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Zap, 
  DollarSign,
  ArrowUpRight,
  Plus,
  Settings,
  MoreVertical,
  Flame,
  Soup,
  MapPin,
  Navigation
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import Link from "next/link";

const orderVolumeData = [
  { name: 'Mon', orders: 42 },
  { name: 'Tue', orders: 38 },
  { name: 'Wed', orders: 55 },
  { name: 'Thu', orders: 48 },
  { name: 'Fri', orders: 72 },
  { name: 'Sat', orders: 85 },
  { name: 'Sun', orders: 60 },
];

const liveOrders = [
  { id: "ord_102", student: "Louis D.", dish: "Jollof Rice x2", total: "€17.00", status: "Preparing", time: "5m ago", type: "Delivery", location: "K. Valdemāra 21, Apt 4B" },
  { id: "ord_101", student: "Maria K.", dish: "Pelmeņi (L)", total: "€6.50", status: "Out for Delivery", time: "12m ago", type: "Pickup", location: "Riga Center Counter" },
  { id: "ord_100", student: "Kofi M.", dish: "Chicken Tikka", total: "€9.00", status: "Pending", time: "1m ago", type: "Pickup", location: "RTU Hub Counter" },
];

export default function SupplierDashboardPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Supplier Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-orange-400/20 bg-orange-50 text-orange-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Kitchen Node • Active Status
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Node Healthy
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Kitchen <span className="text-orange-600">Console</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">Operational oversight of meal supply and delivery liquidity.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto" asChild>
              <Link href="/food">
                <ShoppingBag className="h-3.5 w-3.5 text-primary" /> Order Food
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto" asChild>
              <Link href="/supplier/menu">
                <Plus className="h-3.5 w-3.5" /> Add Menu Item
              </Link>
            </Button>
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-orange-600/20 bg-orange-600 text-white border-none w-full sm:w-auto">
              <Zap className="h-3.5 w-3.5" /> Toggle Kitchen Open
            </Button>
          </div>
        </div>

        {/* TOP LEVEL KPIS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard icon={<ShoppingBag />} label="Active Orders" value="12" delta="+4" color="orange" />
          <KPICard icon={<DollarSign />} label="Daily Revenue" value="€412.50" delta="+18%" color="orange" />
          <KPICard icon={<CheckCircle2 />} label="Completed Today" value="86" delta="+12" color="orange" />
          <KPICard icon={<Clock />} label="Avg. Prep Time" value="18m" delta="-2m" color="orange" />
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Order Velocity Chart */}
          <div className="lg:col-span-8">
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden h-full">
              <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-black text-slate-900">Delivery Velocity</CardTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Weekly supply demand telemetry</p>
                </div>
                <Badge variant="outline" className="text-[8px] font-black uppercase">Live Node</Badge>
              </CardHeader>
              <CardContent className="p-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} dy={10} />
                    <YAxis hide />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 800}} />
                    <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Live Orders Feed */}
          <div className="lg:col-span-4">
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden h-full flex flex-col">
              <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <Flame className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-black text-slate-900">Live Orders</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-slate-50">
                  {liveOrders.map((ord) => (
                    <div key={ord.id} className="p-4 px-6 group hover:bg-slate-50/50 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${ord.status === 'Pending' ? 'bg-amber-50 animate-pulse' : ord.status === 'Out for Delivery' ? 'bg-sky-500' : 'bg-orange-500'}`} />
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-[12px] font-black text-slate-800 leading-none group-hover:text-orange-600 transition-colors truncate">{ord.dish}</p>
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{ord.student}</p>
                              <Badge className="bg-slate-100 text-slate-500 text-[6px] font-black px-1 py-0 border-none">{ord.type}</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] font-black text-orange-600">
                              <Navigation className="h-2.5 w-2.5" />
                              <span className="truncate">{ord.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[12px] font-black text-slate-900 italic leading-none">{ord.total}</p>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">{ord.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t border-slate-50 bg-slate-50/50">
                <Button variant="ghost" className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-orange-600 hover:bg-orange-100" asChild>
                  <Link href="/supplier/orders">Order Management System</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function KPICard({ icon, label, value, delta, color }: any) {
  return (
    <Card className="p-5 rounded-[2rem] border-slate-100 shadow-sm bg-white group hover:shadow-lg transition-all relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-orange-50 transition-colors" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all flex items-center justify-center shadow-inner">
          {icon}
        </div>
        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase tracking-widest">
          {delta}
        </Badge>
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none italic">{value}</p>
      </div>
    </Card>
  );
}
