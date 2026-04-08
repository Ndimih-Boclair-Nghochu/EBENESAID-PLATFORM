'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  Activity, 
  FileText,
  MapPin,
  MoreVertical
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const students = [
  { id: "s1", name: "Louis D.", country: "Nigeria", node: "Visa Approved", compliance: "95%", joined: "Jan 2025" },
  { id: "s2", name: "Maria K.", country: "Kazakhstan", node: "Arrived", compliance: "100%", joined: "Dec 2024" },
  { id: "s3", name: "Kofi Mensah", country: "Ghana", node: "Admission Received", compliance: "45%", joined: "Feb 2025" },
  { id: "s4", name: "Ananya S.", country: "India", node: "Arrived", compliance: "100%", joined: "Jan 2025" },
  { id: "s5", name: "Chen W.", country: "China", node: "Visa Processing", compliance: "70%", joined: "Jan 2025" },
];

export default function StudentRegistryPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-indigo-400/20 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Student Registry • Follow-up Node
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Tracker Active
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Cohort <span className="text-indigo-600">Registry</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider">High-fidelity tracking of international student relocation milestones.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto">
              Export Cohort Data
            </Button>
          </div>
        </div>

        {/* Search & Filter - Responsive Bar */}
        <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
           <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
             <Input placeholder="Search students, countries or status nodes..." className="h-10 pl-9 rounded-lg bg-slate-50 border-none focus:bg-white transition-all font-bold text-xs" />
           </div>
           <div className="flex gap-2">
             <Button variant="outline" className="h-10 rounded-lg font-black border-slate-200 gap-2 text-[10px] px-4 flex-1 sm:flex-none">
               <Filter className="h-3.5 w-3.5" /> Filter
             </Button>
           </div>
        </div>

        {/* Student Matrix - Responsive Stack-first Layout */}
        <Card className="rounded-[1.5rem] sm:rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
          <div className="divide-y divide-slate-50">
            {students.map((s) => (
              <div key={s.id} className="p-4 sm:p-6 group hover:bg-slate-50/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 rounded-[1rem] sm:rounded-[1.25rem] border-2 border-slate-50 shadow-sm shrink-0">
                    <AvatarImage src={`https://picsum.photos/seed/${s.id}/100/100`} />
                    <AvatarFallback className="bg-indigo-600 text-white font-black text-sm">{s.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm sm:text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate leading-none">{s.name}</p>
                      <Badge variant="outline" className="text-[7px] font-black uppercase tracking-tighter px-1.5 py-0 h-3.5 border-indigo-100 bg-indigo-50/50 text-indigo-600">
                        {s.country}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                        <MapPin className="h-2.5 w-2.5 text-indigo-600" /> {s.node}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-slate-300 uppercase tracking-tight">
                        <Clock className="h-2.5 w-2.5" /> {s.joined}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Compliance Hub</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-black text-slate-900">{s.compliance}</p>
                      <Badge className={`border-none px-2 py-0.5 text-[7px] font-black uppercase tracking-widest ${s.compliance === '100%' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {s.compliance === '100%' ? 'Settled' : 'Audit'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                      <Link href="/university/chat"><MessageSquare className="h-4 sm:h-4.5 w-4 sm:w-4.5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all hidden sm:flex">
                      <FileText className="h-4.5 w-4.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all">
                      <MoreVertical className="h-4 sm:h-4.5 w-4 sm:w-4.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </SidebarShell>
  );
}
