import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  FileText, 
  Briefcase, 
  Users, 
  ChevronRight,
  ArrowUpRight,
  Activity,
  MapPin,
  Wallet,
  Compass,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const blueprintTasks = [
    { title: "Finalize Housing", desc: "Confirm verified accommodation.", done: false, category: "Housing" },
    { title: "Travel Itinerary", desc: "Plan airport-to-city transport.", done: false, category: "Logistics" },
    { title: "University Enrollment", desc: "Prepare docs for orientation.", done: false, category: "Academic" },
    { title: "Residence Permit", desc: "OCMA registration appointment.", done: true, category: "Legal" },
    { title: "Local SIM Card", desc: "Latvian number setup.", done: false, category: "Comm" },
    { title: "Bank Account", desc: "Open local IBAN.", done: false, category: "Finance" },
    { title: "Public Transport", desc: "Register for e-talons.", done: false, category: "Logistics" },
    { title: "Career Services", desc: "Explore part-time roles.", done: false, category: "Career" },
    { title: "Cultural Onboarding", desc: "Local laws & customs guide.", done: false, category: "Culture" },
  ];

  const completedCount = blueprintTasks.filter(t => t.done).length;
  const progressPercent = (completedCount / blueprintTasks.length) * 100;

  return (
    <SidebarShell>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
        
        {/* Compact Professional Header */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                RTU 2025 • Verified
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> On Track
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              Welcome back, <span className="text-primary italic">Louis.</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">
              Relocation to <span className="text-slate-900 font-bold">Riga Technical University</span> is progressing optimally.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button size="sm" className="rounded-xl font-black h-9 px-5 shadow-lg shadow-primary/20 gap-2 text-[10px] w-full sm:w-auto">
              <Wallet className="h-3.5 w-3.5" /> Wallet
            </Button>
          </div>
        </section>

        {/* Status & Guidance Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white p-6 sm:p-8 relative overflow-hidden h-full flex flex-col justify-center">
              <div className="flex items-center gap-2 text-primary mb-6">
                <Compass className="h-5 w-5" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-none">Personalized Roadmap</p>
              </div>
              <div className="space-y-4">
                <p className="text-base sm:text-lg leading-relaxed text-slate-700 font-medium italic border-l-4 border-primary/40 pl-4 sm:pl-6 py-1">
                  "Focus on finalizing your verified housing. Once confirmed, our logistics node will unlock your airport-to-city transit protocol."
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target University: RTU Riga</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Node: Visa Approved</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-4">
            <Card className="border-slate-100 shadow-sm rounded-[2rem] bg-white overflow-hidden h-full flex flex-col">
              <CardHeader className="p-6 pb-2 border-b border-slate-50">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">System Integrity</p>
              </CardHeader>
              <CardContent className="p-6 space-y-6 flex-1 flex flex-col justify-center">
                <LogisticsItem label="Destination" value="Riga, Latvia" icon={<MapPin />} />
                <LogisticsItem label="Institutional Sync" value="Verified (RTU)" icon={<ShieldCheck />} status="active" />
                <LogisticsItem label="Alert Link" value="Email & SMS Active" icon={<Zap />} status="active" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Core Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 space-y-6">
            <Card className="shadow-sm border-slate-100 rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Compass className="h-4.5 w-4.5" />
                  </div>
                  <CardTitle className="text-base font-black text-slate-900 leading-none tracking-tight">Relocation Blueprint</CardTitle>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="text-right">
                    <p className="text-lg font-black text-primary italic leading-none">{Math.round(progressPercent)}%</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Compliance</p>
                  </div>
                  <Progress value={progressPercent} className="h-1.5 w-24 rounded-full bg-slate-100" />
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {blueprintTasks.map((task, idx) => (
                    <div key={idx} className="group flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50/50 transition-all cursor-pointer">
                      <Checkbox checked={task.done} className="h-5 w-5 rounded-md border-slate-200" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] sm:text-[14px] font-black text-slate-800 leading-none group-hover:text-primary transition-colors tracking-tight truncate">{task.title}</p>
                          <Badge variant="outline" className="text-[7px] h-3.5 px-1.5 border-slate-100 text-slate-400 font-bold uppercase tracking-tighter shrink-0">
                            {task.category}
                          </Badge>
                        </div>
                        <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-1.5 line-clamp-1">{task.desc}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-200 group-hover:text-primary transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CompactLauncher title="Housing" sub="Market" icon={<Home />} href="/accommodation" />
              <CompactLauncher title="Wallet" sub="Docs" icon={<FileText />} href="/docs" />
              <CompactLauncher title="Jobs" sub="Career" icon={<Briefcase />} href="/jobs" />
              <CompactLauncher title="Circle" sub="Social" icon={<Users />} href="/community" />
            </div>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function CompactLauncher({ title, sub, icon, href }: { title: string, sub: string, icon: React.ReactNode, href: string }) {
  return (
    <Link href={href}>
      <div className="group p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all flex flex-col items-center text-center gap-2">
        <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center shadow-inner shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <h4 className="text-[10px] sm:text-[11px] font-black text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight truncate">{title}</h4>
          <p className="text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{sub}</p>
        </div>
      </div>
    </Link>
  );
}

function LogisticsItem({ label, value, icon, status }: { label: string, value: string, icon: React.ReactNode, status?: string }) {
  return (
    <div className="flex items-center justify-between group/item gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${status === 'active' ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 truncate">{label}</p>
          <p className="text-xs font-black text-slate-900 tracking-tight leading-none truncate">{value}</p>
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-slate-200 group-hover/item:text-primary transition-all shrink-0" />
    </div>
  );
}
