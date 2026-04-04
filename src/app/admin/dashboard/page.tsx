'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Home, 
  Briefcase, 
  Activity, 
  BarChart3, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Globe,
  Fingerprint,
  Server,
  Zap,
  HardDrive
} from "lucide-react";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussOps } from "@/ai/flows/admin-ops-flow";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const chartData = [
  { name: 'Mon', mobility: 400, verification: 240 },
  { name: 'Tue', mobility: 300, verification: 139 },
  { name: 'Wed', mobility: 200, verification: 980 },
  { name: 'Thu', mobility: 278, verification: 390 },
  { name: 'Fri', mobility: 189, verification: 480 },
  { name: 'Sat', mobility: 239, verification: 380 },
  { name: 'Sun', mobility: 349, verification: 430 },
];

export default function AdminDashboardPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Professional Command Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                System Administrator • Root Access
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Platform Health: 100%
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Ops Command <span className="text-primary">Center</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">High-fidelity oversight of student mobility and platform integrity.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all flex-1 md:flex-none">
              <HardDrive className="h-3.5 w-3.5" /> Logs
            </Button>
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-primary/20 gap-2 text-[10px] bg-primary text-white border-none flex-1 md:flex-none">
              <Zap className="h-3.5 w-3.5" /> Audit
            </Button>
          </div>
        </div>

        {/* TOP LEVEL INTELLIGENCE GRID - EXCLUSIVE AI PRESENCE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SpecialistChat 
              title="Operations Specialist"
              specialty="Platform KPI & Strategy"
              initialMessage="Systems online. I can provide real-time analysis on vacancy rates, verification bottlenecks, or institutional sync health. What is our focus today?"
              flow={discussOps}
              icon={<BarChart3 className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="rounded-[2.5rem] bg-slate-900 text-white p-6 relative overflow-hidden shadow-xl border-none flex-1 flex flex-col justify-center min-h-[200px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]" />
              <div className="flex items-center gap-2 text-primary mb-6 relative z-10">
                <TrendingUp className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Growth Telemetry</p>
              </div>
              <div className="space-y-5 relative z-10">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Enrollment</p>
                    <p className="text-2xl sm:text-3xl font-black text-white tracking-tighter italic">+14% <span className="text-primary text-xs sm:text-sm not-italic">MoM</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Target</p>
                    <p className="text-xs sm:text-sm font-black text-slate-200 italic">5,000</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-primary w-[70%] shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
                </div>
                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-500">
                  <span>Current: 2,840</span>
                  <span>Gap: 2,160</span>
                </div>
              </div>
            </Card>

            <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white p-5 flex flex-col justify-between group hover:shadow-lg transition-all border-l-4 border-l-primary">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Security Node</p>
                <Badge className="bg-emerald-50 text-emerald-600 border-none text-[7px] font-black uppercase">AES-256</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  <Fingerprint className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Encrypted Sessions</p>
                  <p className="text-lg font-black text-slate-900 tracking-tighter">1,102 <span className="text-[8px] text-emerald-500 ml-1">Live</span></p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* INFRASTRUCTURE STATUS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusNode icon={<Home />} label="Housing" status="Online" color="sky" />
          <StatusNode icon={<Briefcase />} label="Career" status="Optimal" color="emerald" />
          <StatusNode icon={<Server />} label="Wallet" status="Secure" color="indigo" />
          <StatusNode icon={<Users />} label="Circle" status="Active" color="purple" />
        </div>

        {/* MAIN OPERATIONS MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Telemetry & Charts */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm sm:text-base font-black text-slate-900 leading-none">Network Traffic</CardTitle>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Daily Mobility Velocity</p>
                  </div>
                </div>
                <div className="hidden sm:flex gap-2">
                  <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-100">Weekly</Badge>
                  <Badge className="bg-primary text-white text-[8px] font-black uppercase">Live</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorMob" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 9, fontWeight: 800, fill: '#94a3b8'}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 9, fontWeight: 800, fill: '#94a3b8'}}
                      />
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 800, fontSize: '10px'}}
                      />
                      <Area type="monotone" dataKey="mobility" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorMob)" />
                      <Area type="monotone" dataKey="verification" stroke="#6366f1" strokeWidth={3} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<Users />} label="Students" value="2,840" delta="+122" positive />
              <StatCard icon={<Home />} label="Units" value="412" delta="+18" positive />
              <StatCard icon={<Briefcase />} label="Jobs" value="86" delta="-4" />
              <StatCard icon={<Globe />} label="Unis" value="12" delta="0" />
            </div>
          </div>

          {/* Right Column: Integrity Feed */}
          <div className="lg:col-span-4">
            <Card className="shadow-sm border-slate-100 rounded-[2.5rem] bg-white overflow-hidden h-full flex flex-col min-h-[400px]">
              <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                    <Activity className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm sm:text-base font-black text-slate-900 leading-none">Integrity Feed</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-slate-50">
                  <ActivityItem title="New Housing" sub="Apt #882 - Maskavas" time="2m" type="housing" />
                  <ActivityItem title="Sync Success" sub="RTU Institutional" time="15m" type="system" />
                  <ActivityItem title="User Dispute" sub="ID: stu_9921" time="1h" type="alert" />
                  <ActivityItem title="Audit Done" sub="Job Board Partners" time="4h" type="career" />
                  <ActivityItem title="GDPR Rotation" sub="EU-Central-1 Node" time="6h" type="system" />
                </div>
              </CardContent>
              <div className="p-4 border-t border-slate-50 bg-slate-50/50">
                <Button className="w-full h-10 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10" variant="secondary">
                  System Audit Logs
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function StatCard({ icon, label, value, delta, positive }: any) {
  return (
    <Card className="p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border-slate-100 shadow-sm bg-white group hover:shadow-lg transition-all overflow-hidden relative">
      <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/5 transition-colors" />
      <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center shadow-inner">
          {icon}
        </div>
        <Badge className={`border-none font-black text-[7px] uppercase tracking-widest ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-400'}`}>
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

function ActivityItem({ title, sub, time, type }: any) {
  return (
    <div className="p-4 px-6 group hover:bg-slate-50/50 transition-all cursor-pointer flex items-center justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`h-2 w-2 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)] ${
          type === 'housing' ? 'bg-sky-500' : 
          type === 'alert' ? 'bg-red-500' : 
          type === 'career' ? 'bg-emerald-500' : 
          'bg-indigo-500'
        }`} />
        <div className="space-y-0.5 min-w-0">
          <p className="text-[11px] font-black text-slate-800 leading-none group-hover:text-primary transition-colors truncate">{title}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1 truncate">{sub}</p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{time}</p>
      </div>
    </div>
  );
}

function StatusNode({ icon, label, status, color }: any) {
  const colorMap: any = {
    sky: 'text-sky-600 bg-sky-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    indigo: 'text-indigo-600 bg-indigo-50',
    purple: 'text-purple-600 bg-purple-50'
  };

  return (
    <Card className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border-slate-100 shadow-sm bg-white flex items-center gap-3 group hover:border-primary/20 transition-all">
      <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-inner ${colorMap[color] || colorMap.sky}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[8px] sm:text-[9px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1 truncate">{label}</p>
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-widest">{status}</p>
        </div>
      </div>
    </Card>
  );
}
