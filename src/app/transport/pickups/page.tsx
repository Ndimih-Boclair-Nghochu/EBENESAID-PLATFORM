
'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Navigation, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight,
  Activity,
  PlaneTakeoff,
  Phone,
  MessageSquare,
  MessagesSquare,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const pickupJobs = [
  { 
    id: "job_882", 
    student: "Louis D.", 
    country: "Nigeria",
    flight: "TK1751",
    status: "In Transit", 
    time: "Arrived", 
    destination: "K. Valdemāra 21, Riga",
    phone: "+371 20 123 456",
    eta: "12 mins"
  },
  { 
    id: "job_881", 
    student: "Maria K.", 
    country: "Kazakhstan",
    flight: "BT422",
    status: "Assigned", 
    time: "14:20 PM", 
    destination: "Zunda krastmala 8, Riga",
    phone: "+371 20 987 654",
    eta: "2h 40m"
  },
  { 
    id: "job_880", 
    student: "Kofi Mensah", 
    country: "Ghana",
    flight: "BT602",
    status: "Completed", 
    time: "Today, 09:15 AM", 
    destination: "Lomonosova iela 1, Riga",
    phone: "+371 20 555 000",
    eta: "-"
  }
];

export default function PickupRegistryPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-blue-400/20 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Logistics Node • Pickup Ledger
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Dispatch Active
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Pickup <span className="text-blue-600">Registry</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">Manage assigned student transfers and coordinate arrival protocols.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto">
              Export manifest CSV
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
           <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
             <Input placeholder="Search jobs by student, flight or ID..." className="h-10 pl-9 rounded-lg bg-slate-50 border-none focus:bg-white transition-all font-bold text-xs" />
           </div>
           <Button variant="outline" className="h-10 rounded-lg font-black border-slate-200 gap-2 text-[10px] px-4">
             <Filter className="h-3.5 w-3.5" /> Filter by Status
           </Button>
        </div>

        {/* Jobs Matrix */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm mb-6 h-auto">
            <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white font-black text-[10px] uppercase h-8 px-6">Current Shifts</TabsTrigger>
            <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white font-black text-[10px] uppercase h-8 px-6">Upcoming Nodes</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white font-black text-[10px] uppercase h-8 px-6">History Ledger</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {pickupJobs.filter(j => j.status !== 'Completed').map((job) => (
              <PickupJobCard key={job.id} job={job} />
            ))}
          </TabsContent>
          <TabsContent value="upcoming" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {pickupJobs.filter(j => j.status === 'Assigned').map((job) => (
              <PickupJobCard key={job.id} job={job} />
            ))}
          </TabsContent>
          <TabsContent value="completed" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {pickupJobs.filter(j => j.status === 'Completed').map((job) => (
              <PickupJobCard key={job.id} job={job} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarShell>
  );
}

function PickupJobCard({ job }: any) {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all">
      <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={`border-none font-black text-[8px] uppercase tracking-widest ${
              job.status === 'In Transit' ? 'bg-blue-50 text-blue-600 animate-pulse' : 
              job.status === 'Assigned' ? 'bg-amber-50 text-amber-600' : 
              'bg-emerald-50 text-emerald-600'
            }`}>
              {job.status}
            </Badge>
            <Badge variant="outline" className="border-slate-100 text-[7px] font-black uppercase tracking-widest gap-1 py-0 h-5">
              <PlaneTakeoff className="h-3 w-3 text-blue-600" /> RIX • Flight {job.flight}
            </Badge>
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> {job.time}
            </span>
            <span className="text-[9px] font-black text-slate-400 uppercase ml-auto lg:ml-0">{job.id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 rounded-xl border-2 border-slate-50 shadow-sm">
                <AvatarImage src={`https://picsum.photos/seed/${job.id}/100/100`} />
                <AvatarFallback className="bg-blue-600 text-white font-black text-xs">{job.student.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 leading-none">{job.student}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="outline" className="text-[7px] font-black border-slate-100 h-4">{job.country}</Badge>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{job.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-blue-600">
                <MapPin className="h-3.5 w-3.5" />
                <p className="text-[9px] font-black uppercase tracking-widest">Destination Node</p>
              </div>
              <p className="text-[11px] font-black text-slate-700 leading-tight">{job.destination}</p>
              {job.eta !== '-' && (
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <p className="text-[8px] font-bold text-blue-600 uppercase tracking-widest">ETA: {job.eta}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center">
               <Button variant="ghost" className="h-full w-full rounded-xl hover:bg-primary/5 flex flex-col gap-1 text-slate-400 hover:text-primary transition-all group/msg" asChild>
                 <Link href="/messages">
                   <MessagesSquare className="h-5 w-5 group-hover/msg:scale-110 transition-transform" />
                   <span className="text-[8px] font-black uppercase tracking-widest">Direct Sync</span>
                 </Link>
               </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col gap-2 shrink-0 lg:w-48 lg:border-l lg:border-slate-50 lg:pl-6">
          {job.status === 'In Transit' ? (
            <Button className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20">
              Complete Transfer
            </Button>
          ) : job.status === 'Assigned' ? (
            <Button className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
              Start Shift
            </Button>
          ) : (
            <Button variant="outline" className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-100">
              Details
            </Button>
          )}
          <Button variant="ghost" className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-100">
            Log Issue
          </Button>
        </div>
      </div>
    </Card>
  );
}
