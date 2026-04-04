'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Users, 
  Home, 
  Briefcase, 
  Zap, 
  Download, 
  Calendar,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Server
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const mobilityData = [
  { name: 'Jan', students: 400, verification: 240 },
  { name: 'Feb', students: 600, verification: 320 },
  { name: 'Mar', students: 800, verification: 480 },
  { name: 'Apr', students: 1200, verification: 600 },
  { name: 'May', students: 1500, verification: 850 },
  { name: 'Jun', students: 2100, verification: 1100 },
  { name: 'Jul', students: 2840, verification: 1400 },
];

const moduleLiquidityData = [
  { name: 'Housing', supply: 412, demand: 850 },
  { name: 'Jobs', supply: 86, demand: 240 },
  { name: 'Buddies', supply: 120, demand: 180 },
  { name: 'Docs', supply: 950, demand: 1100 },
];

const regionalDensityData = [
  { name: 'Centrs', density: 45 },
  { name: 'Agenskalns', density: 25 },
  { name: 'Teika', density: 15 },
  { name: 'Old Town', density: 10 },
  { name: 'Purvciems', density: 5 },
];

const verificationLoadData = [
  { name: 'Verified', value: 70 },
  { name: 'Pending', value: 20 },
  { name: 'Rejected', value: 10 },
];

const COLORS = ['#0EA5E9', '#6366F1', '#F43F5E', '#10B981'];

export default function StatisticsPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Professional Intelligence Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Global Telemetry • Real-time Nodes
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Engine Online
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Platform <span className="text-primary">Statistics</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">High-fidelity visualization of student mobility and resource liquidity.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all">
              <Calendar className="h-3.5 w-3.5" /> Past 30 Days
            </Button>
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-primary/20 gap-2 text-[10px] bg-primary text-white border-none">
              <Download className="h-3.5 w-3.5" /> Export Data
            </Button>
          </div>
        </div>

        {/* TOP LEVEL KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard icon={<Users />} label="Total Active Students" value="2,840" delta="+12%" />
          <KPICard icon={<Home />} label="Verified Housing" value="412" delta="+8%" />
          <KPICard icon={<Briefcase />} label="Live Job Roles" value="86" delta="+4%" />
          <KPICard icon={<ShieldCheck />} label="Compliance Rate" value="94.2%" delta="+1.2%" />
        </div>

        {/* MAIN CHART MATRIX */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Network Growth - Large Area Chart */}
          <div className="lg:col-span-8">
            <ChartWrapper title="Network Growth Velocity" sub="Monthly Student Enrollment & Verification" icon={<TrendingUp />}>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mobilityData}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 800}}
                    />
                    <Area type="monotone" dataKey="students" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                    <Area type="monotone" dataKey="verification" stroke="#6366f1" strokeWidth={3} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartWrapper>
          </div>

          {/* Module Liquidity - Bar Chart */}
          <div className="lg:col-span-4">
            <ChartWrapper title="Node Liquidity" sub="Supply vs Demand per Module" icon={<Zap />}>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moduleLiquidityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 800}}
                    />
                    <Bar dataKey="supply" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="demand" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartWrapper>
          </div>

          {/* Regional Density - Line Chart */}
          <div className="lg:col-span-6">
            <ChartWrapper title="Regional Density" sub="Student Distribution by District" icon={<Server />}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={regionalDensityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 800}}
                    />
                    <Line type="monotone" dataKey="density" stroke="#0EA5E9" strokeWidth={4} dot={{ r: 6, fill: '#0EA5E9', strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartWrapper>
          </div>

          {/* Verification Allocation - Pie Chart */}
          <div className="lg:col-span-6">
            <ChartWrapper title="Verification Allocation" sub="Compliance Engine Task Load" icon={<ShieldCheck />}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={verificationLoadData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {verificationLoadData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 800}}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value) => <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartWrapper>
          </div>

        </div>
      </div>
    </SidebarShell>
  );
}

function KPICard({ icon, label, value, delta }: any) {
  return (
    <Card className="p-5 rounded-[2rem] border-slate-100 shadow-sm bg-white group hover:shadow-lg transition-all relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/5 transition-colors" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center shadow-inner">
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

function ChartWrapper({ title, sub, icon, children }: any) {
  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col h-full">
      <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div>
            <CardTitle className="text-base font-black text-slate-900 leading-none">{title}</CardTitle>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sub}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-300 hover:text-primary transition-all">
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex items-center justify-center">
        {children}
      </CardContent>
    </Card>
  );
}
