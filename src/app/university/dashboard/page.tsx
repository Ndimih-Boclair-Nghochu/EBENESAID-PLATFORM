'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Activity, 
  GraduationCap, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Globe
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

const recruitmentData = [
  { name: 'Feb', students: 45 },
  { name: 'Mar', students: 52 },
  { name: 'Apr', students: 48 },
  { name: 'May', students: 61 },
  { name: 'Jun', students: 75 },
  { name: 'Jul', students: 120 },
];

export default function UniversityDashboardPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Institutional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-indigo-400/20 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Academic Node • RTU Riga Hub
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Sync Health: 100%
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Partner <span className="text-indigo-600">Portal</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">Administrative oversight of student relocation and institutional compliance.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto">
              <Zap className="h-3.5 w-3.5" /> Trigger Bulk Sync
            </Button>
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-indigo-600/20 gap-2 text-[10px] bg-indigo-600 text-white border-none w-full sm:w-auto">
              <MessageSquare className="h-3.5 w-3.5" /> Broadcast Update
            </Button>
          </div>
        </div>

        {/* TOP LEVEL METRICS - Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard icon={<Users />} label="Total Students" value="1,240" delta="+12%" />
          <KPICard icon={<Clock />} label="In Transit" value="412" delta="+8%" />
          <KPICard icon={<CheckCircle2 />} label="Arrived & Settled" value="828" delta="+4%" />
          <KPICard icon={<ShieldCheck />} label="Compliance Rate" value="98.2%" delta="+0.5%" />
        </div>

        {/* MAIN INSIGHTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden h-full flex flex-col">
              <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-black text-slate-900 leading-none">Arrival Velocity</CardTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Student Enrollment Trend (2025)</p>
                </div>
                <Badge variant="outline" className="hidden sm:inline-flex text-[8px] font-black uppercase">Live Data</Badge>
              </CardHeader>
              <CardContent className="p-6 flex-1 min-h-[300px]">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={recruitmentData}>
                      <defs>
                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 800}} />
                      <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panels */}
          <div className="lg:col-span-4 flex flex-col gap-6 order-1 lg:order-2">
            <Card className="rounded-[2rem] bg-slate-900 text-white p-6 relative overflow-hidden shadow-xl border-none min-h-[180px] flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]" />
              <div className="flex items-center gap-2 text-indigo-400 mb-6 relative z-10">
                <GraduationCap className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Academic Roadmap</p>
              </div>
              <p className="text-xs font-medium text-slate-300 leading-relaxed italic relative z-10 border-l-2 border-indigo-500/40 pl-4 py-1">
                "Relocation compliance has reached optimal levels for the 2025 cohort."
              </p>
            </Card>

            <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white p-5 flex flex-col justify-between group hover:shadow-lg transition-all border-l-4 border-l-indigo-600">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Institutional Sync</p>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">API Handshake</p>
                  <p className="text-lg font-black text-slate-900 tracking-tighter">Active <span className="text-[8px] text-emerald-500 ml-1 font-bold">SECURE</span></p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function KPICard({ icon, label, value, delta }: any) {
  return (
    <Card className="p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border-slate-100 shadow-sm bg-white group hover:shadow-lg transition-all relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-50 transition-colors" />
      <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center shadow-inner">
          {icon}
        </div>
        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] sm:text-[8px] uppercase tracking-widest">
          {delta}
        </Badge>
      </div>
      <div className="relative z-10">
        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-none mb-1">{label}</p>
        <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter leading-none italic">{value}</p>
      </div>
    </Card>
  );
}
