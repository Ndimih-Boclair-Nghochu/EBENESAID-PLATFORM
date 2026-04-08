'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Landmark, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  CreditCard, 
  Briefcase, 
  Zap, 
  Download, 
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Server,
  Receipt,
  ArrowRightLeft
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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const revenueData = [
  { name: 'Jan', volume: 45000, fees: 4500 },
  { name: 'Feb', volume: 52000, fees: 5200 },
  { name: 'Mar', volume: 48000, fees: 4800 },
  { name: 'Apr', volume: 61000, fees: 6100 },
  { name: 'May', volume: 75000, fees: 7500 },
  { name: 'Jun', volume: 89000, fees: 8900 },
  { name: 'Jul', volume: 102000, fees: 10200 },
];

const transactionVolumeData = [
  { name: 'Housing', volume: 65000 },
  { name: 'Premium', volume: 15000 },
  { name: 'Verification', volume: 12000 },
  { name: 'Other', volume: 10000 },
];

const feeDistributionData = [
  { name: 'Service Fees', value: 60 },
  { name: 'Subscriptions', value: 25 },
  { name: 'Commissions', value: 15 },
];

const COLORS = ['#0EA5E9', '#6366F1', '#F43F5E', '#10B981'];

const recentTransactions = [
  { id: "tx_9921", user: "Louis D.", type: "Housing Deposit", amount: "€380.00", status: "Succeeded", date: "2m ago" },
  { id: "tx_9922", user: "Sia LatProp", type: "Listing Fee", amount: "€45.00", status: "Succeeded", date: "15m ago" },
  { id: "tx_9923", user: "Kofi Mensah", type: "Premium Plan", amount: "€19.99", status: "Processing", date: "1h ago" },
  { id: "tx_9924", user: "TechBaltics", type: "Job Slot (Bulk)", amount: "€120.00", status: "Succeeded", date: "4h ago" },
  { id: "tx_9925", user: "Maria K.", type: "Airport Pickup", amount: "€25.00", status: "Succeeded", date: "6h ago" },
];

export default function FinancialAnalysisPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Professional Economic Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-emerald-400/20 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Financial Node • Root Audit Access
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Ledger Synchronized
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Financial <span className="text-primary">Analysis</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">High-fidelity visualization of platform revenue and transaction liquidity.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all">
              <Calendar className="h-3.5 w-3.5" /> Fiscal Q3 2025
            </Button>
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-primary/20 gap-2 text-[10px] bg-primary text-white border-none">
              <Download className="h-3.5 w-3.5" /> Export Ledger
            </Button>
          </div>
        </div>

        {/* TOP LEVEL FINANCIAL KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard icon={<DollarSign />} label="Gross Volume (30d)" value="€102,400" delta="+18.4%" />
          <KPICard icon={<Receipt />} label="Platform Fees" value="€10,240" delta="+12.2%" />
          <KPICard icon={<ArrowRightLeft />} label="Transaction Count" value="1,842" delta="+4.1%" />
          <KPICard icon={<CreditCard />} label="Premium Subs" value="412" delta="+22%" />
        </div>

        {/* MAIN CHART MATRIX */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Revenue Velocity - Large Area Chart */}
          <div className="lg:col-span-8">
            <ChartWrapper title="Revenue Velocity" sub="Monthly Gross Volume & Platform Fee Accrual" icon={<TrendingUp />}>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
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
                    <Area type="monotone" dataKey="volume" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                    <Area type="monotone" dataKey="fees" stroke="#6366f1" strokeWidth={3} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartWrapper>
          </div>

          {/* Fee Distribution - Pie Chart */}
          <div className="lg:col-span-4">
            <ChartWrapper title="Fee Allocation" sub="Revenue Mix by Category" icon={<ShieldCheck />}>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feeDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {feeDistributionData.map((entry, index) => (
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

          {/* Node Liquidity - Bar Chart */}
          <div className="lg:col-span-6">
            <ChartWrapper title="Node Liquidity" sub="Transaction Volume per Module" icon={<Server />}>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transactionVolumeData}>
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
                    <Bar dataKey="volume" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartWrapper>
          </div>

          {/* Audit Ledger - High Density Table */}
          <div className="lg:col-span-6">
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden h-full flex flex-col">
              <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                    <ArrowRightLeft className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black text-slate-900 leading-none">Audit Ledger</CardTitle>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Platform Transactions</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">View Full Log</Button>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-slate-50">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="p-4 px-6 group hover:bg-slate-50/50 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${tx.status === 'Succeeded' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-amber-500 shadow-amber-500/20'}`} />
                        <div className="space-y-0.5">
                          <p className="text-[12px] font-black text-slate-800 leading-none group-hover:text-primary transition-colors">{tx.type}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{tx.user} • {tx.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] font-black text-slate-900 italic leading-none">{tx.amount}</p>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
