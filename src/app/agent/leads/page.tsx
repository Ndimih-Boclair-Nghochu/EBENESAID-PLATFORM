
'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight,
  Activity,
  Phone,
  MessageSquare,
  Home,
  Mail,
  MoreVertical
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const bookingLeads = [
  { 
    id: "lead_992", 
    student: "Louis D.", 
    country: "Nigeria",
    university: "RTU",
    listing: "Premium Center Studio", 
    status: "Pending", 
    time: "15m ago", 
    email: "louis@ebenesaid.com",
    phone: "+371 20 123 456" 
  },
  { 
    id: "lead_991", 
    student: "Maria K.", 
    country: "Kazakhstan",
    university: "RISEBA",
    listing: "International Student Flat", 
    status: "Confirmed", 
    time: "2h ago", 
    email: "maria@riseba.lv",
    phone: "+371 20 987 654" 
  },
  { 
    id: "lead_990", 
    student: "Kofi M.", 
    country: "Ghana",
    university: "RTU",
    listing: "Premium Center Studio", 
    status: "Cancelled", 
    time: "1d ago", 
    email: "kofi@rtu.lv",
    phone: "+371 20 555 000" 
  }
];

export default function BookingLeadsPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-sky-400/20 bg-sky-50 text-sky-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Lead Node • Active Inquiries
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Funnel: Healthy
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Booking <span className="text-sky-600">Leads</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">Manage student inquiries and coordinate verified housing transitions.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto">
              Export Leads CSV
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
           <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
             <Input placeholder="Search leads by student, university or listing..." className="h-10 pl-9 rounded-lg bg-slate-50 border-none focus:bg-white transition-all font-bold text-xs" />
           </div>
           <Button variant="outline" className="h-10 rounded-lg font-black border-slate-200 gap-2 text-[10px] px-4">
             <Filter className="h-3.5 w-3.5" /> Advanced Filters
           </Button>
        </div>

        {/* Leads Matrix */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm mb-6 h-auto">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-sky-600 data-[state=active]:text-white font-black text-[10px] uppercase h-8 px-6">All Inquiries</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-sky-600 data-[state=active]:text-white font-black text-[10px] uppercase h-8 px-6">Action Required</TabsTrigger>
            <TabsTrigger value="confirmed" className="rounded-lg data-[state=active]:bg-sky-600 data-[state=active]:text-white font-black text-[10px] uppercase h-8 px-6">Converted Leads</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {bookingLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </TabsContent>
          <TabsContent value="pending" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {bookingLeads.filter(l => l.status === 'Pending').map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </TabsContent>
          <TabsContent value="confirmed" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {bookingLeads.filter(l => l.status === 'Confirmed').map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarShell>
  );
}

function LeadCard({ lead }: any) {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all">
      <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={`border-none font-black text-[8px] uppercase tracking-widest ${
              lead.status === 'Pending' ? 'bg-amber-50 text-amber-600 animate-pulse' : 
              lead.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 
              'bg-red-50 text-red-400'
            }`}>
              {lead.status}
            </Badge>
            <Badge variant="outline" className="border-slate-100 text-[7px] font-black uppercase tracking-widest gap-1 py-0 h-5">
              <Home className="h-3 w-3 text-sky-600" /> {lead.listing}
            </Badge>
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> {lead.time}
            </span>
            <span className="text-[9px] font-black text-slate-400 uppercase ml-auto lg:ml-0">{lead.id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 rounded-xl border-2 border-slate-50 shadow-sm">
                <AvatarImage src={`https://picsum.photos/seed/${lead.id}/100/100`} />
                <AvatarFallback className="bg-sky-600 text-white font-black text-xs">{lead.student.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 leading-none">{lead.student}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="outline" className="text-[7px] font-black border-slate-100 h-4">{lead.country}</Badge>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{lead.university}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="h-3.5 w-3.5" />
                <p className="text-[9px] font-black uppercase tracking-widest">Communication</p>
              </div>
              <p className="text-[11px] font-black text-slate-700">{lead.email}</p>
              <p className="text-[10px] font-bold text-slate-400">{lead.phone}</p>
            </div>

            <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-sky-600">
                <MessageSquare className="h-3.5 w-3.5" />
                <p className="text-[9px] font-black uppercase tracking-widest">Lead Intent</p>
              </div>
              <p className="text-[10px] font-medium text-slate-600 leading-relaxed italic">
                "Hi, I'm interested in viewing this property next week. Is it still available for RTU students?"
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col gap-2 shrink-0 lg:w-48 lg:border-l lg:border-slate-50 lg:pl-6">
          <Button className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-600/20">
            Accept Lead
          </Button>
          <Button variant="ghost" className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-100">
            Archive Inactive
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 lg:w-full rounded-xl text-slate-300 hover:text-sky-600">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
