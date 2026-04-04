'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  TrendingUp, 
  Activity, 
  Users, 
  Clock, 
  CheckCircle2, 
  Zap, 
  DollarSign,
  ArrowUpRight,
  Plus,
  Settings,
  MoreVertical,
  MapPin,
  Building2,
  ShieldCheck,
  BarChart3
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import Link from "next/link";

const occupancyData = [
  { name: 'Feb', rate: 65 },
  { name: 'Mar', rate: 72 },
  { name: 'Apr', rate: 68 },
  { name: 'May', rate: 81 },
  { name: 'Jun', rate: 85 },
  { name: 'Jul', rate: 94 },
];

export default function AgentDashboardPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Agent Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-sky-400/20 bg-sky-50 text-sky-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Housing Node • Verified Agent
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Inventory Secure
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Property <span className="text-sky-600">Console</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">Operational oversight of student accommodation liquidity and verification status.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto" asChild>
              <Link href="/agent/listings">
                <Home className="h-3.5 w-3.5" /> Manage Listings
              </Link>
            </Button>
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-sky-600/20 bg-sky-600 text-white border-none w-full sm:w-auto" asChild>
              <Link href="/agent/listings">
                <Plus className="h-3.5 w-3.5" /> Add New Listing
              </Link>
            </Button>
          </div>
        </div>

        {/* TOP LEVEL KPIS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard icon={<Home />} label="Active Listings" value="12" delta="+2" color="sky" />
          <KPICard icon={<Users />} label="Booking Leads" value="48" delta="+12" color="sky" />
          <KPICard icon={<ShieldCheck />} label="Verified Units" value="10" delta="100%" color="sky" />
          <KPICard icon={<Clock />} label="Avg. Response" value="4h" delta="-1h" color="sky" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Occupancy Velocity Chart */}
          <div className="lg:col-span-8">
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden h-full flex flex-col min-h-[350px]">
              <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-black text-slate-900">Occupancy Velocity</CardTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cohort enrollment demand telemetry</p>
                </div>
                <Badge variant="outline" className="hidden sm:inline-flex text-[8px] font-black uppercase">Live Node</Badge>
              </CardHeader>
              <CardContent className="p-6 flex-1">
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={occupancyData}>
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 800}} />
                      <Area type="monotone" dataKey="rate" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel: Compliance & Quick Actions */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="rounded-[2rem] bg-slate-900 text-white p-6 relative overflow-hidden shadow-xl border-none min-h-[180px] flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]" />
              <div className="flex items-center gap-2 text-sky-400 mb-6 relative z-10">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Agent Verification</p>
              </div>
              <p className="text-xs font-medium text-slate-300 leading-relaxed italic relative z-10 border-l-2 border-sky-500/40 pl-4 py-1">
                "Your agency profile is fully verified for the 2025 student intake."
              </p>
            </Card>

            <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white p-5 flex flex-col justify-between group hover:shadow-lg transition-all border-l-4 border-l-sky-600">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Inventory Status</p>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-inner shrink-0">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Listing Views</p>
                  <p className="text-lg font-black text-slate-900 tracking-tighter truncate">1,240 <span className="text-[8px] text-emerald-500 ml-1 font-bold">+14%</span></p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function KPICard({ icon, label, value, delta, color }: any) {
  return (
    <Card className="p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border-slate-100 shadow-sm bg-white group hover:shadow-lg transition-all relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-sky-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-sky-50 transition-colors" />
      <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-sky-600 group-hover:text-white transition-all flex items-center justify-center shadow-inner shrink-0">
          {icon}
        </div>
        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] sm:text-[8px] uppercase tracking-widest shrink-0">
          {delta}
        </Badge>
      </div>
      <div className="relative z-10 min-w-0">
        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-none mb-1 truncate">{label}</p>
        <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter leading-none italic truncate">{value}</p>
      </div>
    </Card>
  );
}
