
'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Navigation, 
  TrendingUp, 
  Activity, 
  Users, 
  Clock, 
  CheckCircle2, 
  Zap, 
  DollarSign,
  ArrowUpRight,
  Car,
  MapPin,
  PlaneTakeoff,
  BarChart3,
  ShieldCheck
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

const pickupVolumeData = [
  { name: 'Feb', rate: 45 },
  { name: 'Mar', rate: 58 },
  { name: 'Apr', rate: 52 },
  { name: 'May', rate: 74 },
  { name: 'Jun', rate: 89 },
  { name: 'Jul', rate: 112 },
];

export default function TransportDashboardPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
        
        {/* Logistics Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-blue-400/20 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Logistics Node • RIX Specialist
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Fleet Online
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Logistics <span className="text-blue-600">Console</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">Operational oversight of student airport transfers and shift availability.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto" asChild>
              <Link href="/transport/pickups">
                <Clock className="h-3.5 w-3.5" /> Active Jobs
              </Link>
            </Button>
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-blue-600/20 bg-blue-600 text-white border-none w-full sm:w-auto">
              <Zap className="h-3.5 w-3.5" /> Set Available
            </Button>
          </div>
        </div>

        {/* TOP LEVEL KPIS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard icon={<PlaneTakeoff />} label="Pickups Today" value="8" delta="+2" color="blue" />
          <KPICard icon={<Users />} label="Arriving Students" value="14" delta="+4" color="blue" />
          <KPICard icon={<CheckCircle2 />} label="Rating" value="4.9" sub="High Trust" color="blue" />
          <KPICard icon={<DollarSign />} label="Daily Revenue" value="€240" delta="+15%" color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pickup Velocity Chart */}
          <div className="lg:col-span-8">
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden h-full flex flex-col min-h-[350px]">
              <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-black text-slate-900">Transfer Velocity</CardTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cohort arrival telemetry</p>
                </div>
                <Badge variant="outline" className="hidden sm:inline-flex text-[8px] font-black uppercase">Live Node</Badge>
              </CardHeader>
              <CardContent className="p-6 flex-1">
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={pickupVolumeData}>
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 800}} />
                      <Area type="monotone" dataKey="rate" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel: Fleet & Status */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="rounded-[2rem] bg-slate-900 text-white p-6 relative overflow-hidden shadow-xl border-none min-h-[180px] flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]" />
              <div className="flex items-center gap-2 text-blue-400 mb-6 relative z-10">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Fleet Verification</p>
              </div>
              <p className="text-xs font-medium text-slate-300 leading-relaxed italic relative z-10 border-l-2 border-blue-500/40 pl-4 py-1">
                "Your primary vehicle (VW Transporter) is certified for the 2025 arrival cohort."
              </p>
            </Card>

            <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white p-5 flex flex-col justify-between group hover:shadow-lg transition-all border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Node Connectivity</p>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner shrink-0">
                  <Navigation className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">GPS Handshake</p>
                  <p className="text-lg font-black text-slate-900 tracking-tighter truncate">Active <span className="text-[8px] text-emerald-500 ml-1 font-bold">STABLE</span></p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function KPICard({ icon, label, value, delta, sub, color }: any) {
  return (
    <Card className="p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border-slate-100 shadow-sm bg-white group hover:shadow-lg transition-all relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-50 transition-colors" />
      <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center shadow-inner shrink-0">
          {icon}
        </div>
        {delta && (
          <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] sm:text-[8px] uppercase tracking-widest shrink-0">
            {delta}
          </Badge>
        )}
      </div>
      <div className="relative z-10 min-w-0">
        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-none mb-1 truncate">{label}</p>
        <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter leading-none italic truncate">{value}</p>
        {sub && <p className="text-[7px] font-bold text-blue-600 uppercase tracking-widest mt-1">{sub}</p>}
      </div>
    </Card>
  );
}
