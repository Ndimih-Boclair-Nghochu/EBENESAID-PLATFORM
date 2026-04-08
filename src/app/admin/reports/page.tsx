
'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Flag, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Activity,
  UserX,
  FileSearch,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const reports = [
  { 
    id: "r1", 
    type: "Housing", 
    subject: "Unresponsive Landlord", 
    reporter: "Louis D. (Student)", 
    target: "Sia LatProp",
    status: "Pending", 
    date: "45m ago", 
    priority: "High",
    desc: "Landlord hasn't replied to booking request for 72 hours despite verified status."
  },
  { 
    id: "r2", 
    type: "Career", 
    subject: "Suspicious Job Post", 
    reporter: "Maria K. (Student)", 
    target: "Unknown Employer",
    status: "In Review", 
    date: "3h ago", 
    priority: "High",
    desc: "The 'Customer Service' role seems to be asking for passport scans outside the platform wallet."
  },
  { 
    id: "r3", 
    type: "Technical", 
    subject: "Document Sync Delay", 
    reporter: "RTU Admissions", 
    target: "System Node",
    status: "Resolved", 
    date: "1d ago", 
    priority: "Standard",
    desc: "API handshake between RTU and EBENESAID timed out during bulk import."
  },
  { 
    id: "r4", 
    type: "Circle", 
    subject: "Community Policy Violation", 
    reporter: "Anonymous", 
    target: "ID: stu_8821",
    status: "Pending", 
    date: "5h ago", 
    priority: "Medium",
    desc: "Inappropriate language and solicitation in the RTU International Circle."
  }
];

export default function ReportsManagementPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-red-400/20 bg-red-50 text-red-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Incident Command • Priority Alerting
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Safety Level: Stable
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Incident <span className="text-primary">Reports</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider">Centralized oversight of user disputes, safety flags, and technical failures.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto">
              <FileSearch className="h-3.5 w-3.5 text-primary" /> Incident Logs
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
           <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
             <Input placeholder="Search by reporter, subject or ID..." className="h-10 pl-9 rounded-lg bg-slate-50 border-none focus:bg-white transition-all font-bold text-xs" />
           </div>
           <div className="flex gap-2">
             <Button variant="outline" className="h-10 rounded-lg font-black border-slate-200 gap-2 text-[10px] px-4">
               <Filter className="h-3.5 w-3.5" /> Priority Filter
             </Button>
           </div>
        </div>

        {/* Reports Matrix */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm mb-6 h-auto">
            <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-black text-[10px] uppercase h-8 px-6">Pending Review</TabsTrigger>
            <TabsTrigger value="review" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-black text-[10px] uppercase h-8 px-6">Active Investigations</TabsTrigger>
            <TabsTrigger value="resolved" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-black text-[10px] uppercase h-8 px-6">Resolved Cases</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {reports.filter(r => r.status === 'Pending').map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </TabsContent>
          <TabsContent value="review" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {reports.filter(r => r.status === 'In Review').map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </TabsContent>
          <TabsContent value="resolved" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {reports.filter(r => r.status === 'Resolved').map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarShell>
  );
}

function ReportCard({ report }: any) {
  return (
    <Card className={`rounded-[2rem] border-slate-100 shadow-sm bg-white overflow-hidden group hover:shadow-lg transition-all border-l-4 ${
      report.priority === 'High' ? 'border-l-red-500' : report.status === 'Resolved' ? 'border-l-emerald-500' : 'border-l-amber-500'
    }`}>
      <div className="p-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={`border-none font-black text-[8px] uppercase tracking-widest ${
              report.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'
            }`}>
              <AlertTriangle className="h-2.5 w-2.5 mr-1" /> {report.priority} Priority
            </Badge>
            <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-100 text-slate-400">
              {report.type} Node
            </Badge>
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 ml-auto lg:ml-0">
              <Clock className="h-3 w-3" /> Received {report.date}
            </span>
          </div>

          <div>
            <h3 className="text-base font-black text-slate-900 group-hover:text-primary transition-colors leading-tight italic">
              {report.subject}
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2 italic border-l-2 border-slate-100 pl-4 py-1">
              "{report.desc}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center gap-3 group/reporter transition-all hover:bg-white">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Reporter</p>
                <p className="text-[10px] font-black text-slate-700 uppercase truncate">{report.reporter}</p>
              </div>
            </div>
            <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center gap-3 group/target transition-all hover:bg-white">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-red-400 shadow-sm">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Target Account</p>
                <p className="text-[10px] font-black text-slate-700 uppercase truncate">{report.target}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col gap-2 shrink-0 justify-end lg:justify-start lg:w-48 lg:border-l lg:border-slate-50 lg:pl-6">
          <Button className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
            Open Case
          </Button>
          <Button variant="ghost" className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 gap-2 border border-red-50 transition-all">
            <UserX className="h-3.5 w-3.5" /> Suspend
          </Button>
          <Button variant="ghost" className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
            Dismiss
          </Button>
        </div>
      </div>
    </Card>
  );
}
