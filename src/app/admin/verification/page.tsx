'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldAlert, 
  MapPin, 
  ShieldCheck, 
  XCircle, 
  Camera, 
  FileText, 
  ExternalLink,
  ArrowUpRight,
  Clock,
  Home,
  CheckCircle2,
  Users,
  Briefcase,
  Building2,
  Fingerprint,
  FileSearch,
  Activity
} from "lucide-react";
import Image from "next/image";

const housingQueue = [
  { 
    id: "h1", 
    type: "Housing", 
    title: "Old Town Historic Studio", 
    owner: "Sia LatProp", 
    location: "Kalku iela 12, Riga",
    date: "2h ago",
    priority: "High",
    img: "https://picsum.photos/seed/h1/400/300",
    meta: { photos: "12 Photos", docs: "Lease Verified", trust: "Lvl 4" }
  },
  { 
    id: "h2", 
    type: "Housing", 
    title: "RTU Shared Flat", 
    owner: "Anna K. (Ambassador)", 
    location: "Zunda krastmala, Riga",
    date: "1d ago",
    priority: "Standard",
    img: "https://picsum.photos/seed/h2/400/300",
    meta: { photos: "8 Photos", docs: "Pending", trust: "Lvl 5" }
  }
];

const jobsQueue = [
  { 
    id: "j1", 
    type: "Job", 
    title: "IT Sales Associate", 
    owner: "TechBaltics", 
    location: "Remote/Riga",
    date: "5h ago",
    priority: "Medium",
    img: "https://picsum.photos/seed/j1/400/300",
    meta: { type: "Part-time", permit: "20h Compatible", vetted: "Known Partner" }
  }
];

const identitiesQueue = [
  { 
    id: "u1", 
    type: "Identity", 
    title: "Louis D. (Student)", 
    owner: "Identity Verification", 
    location: "RTU Enrollment",
    date: "10m ago",
    priority: "Critical",
    img: "https://picsum.photos/seed/u1/400/300",
    meta: { passport: "Uploaded", uni_sync: "Confirmed", risk: "Low" }
  },
  { 
    id: "u2", 
    type: "Identity", 
    title: "Latvian Rentals SIA", 
    owner: "Corporate Partner", 
    location: "Commercial Registry",
    date: "4h ago",
    priority: "High",
    img: "https://picsum.photos/seed/u2/400/300",
    meta: { reg_num: "Verified", bank: "Swedbank Link", vat: "Active" }
  }
];

const institutionsQueue = [
  { 
    id: "i1", 
    type: "Institution", 
    title: "SSE Riga Partner Node", 
    owner: "Platform Integration", 
    location: "Strēlnieku iela 4a",
    date: "2d ago",
    priority: "Standard",
    img: "https://picsum.photos/seed/i1/400/300",
    meta: { api: "REST Active", protocol: "Formal", nodes: "3 Shards" }
  }
];

export default function VerificationQueuePage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Compact Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-400/20 bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Compliance Engine • Root Audit Access
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Engine Latency: 12ms
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Verification <span className="text-primary">Station</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider">Type-segregated vetting of housing, careers, identities, and institutional nodes.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto">
              <FileSearch className="h-3.5 w-3.5 text-primary" /> Export Audit Log
            </Button>
          </div>
        </div>

        {/* MAIN VERIFICATION INTERFACE - SEGREGATED TABS */}
        <Tabs defaultValue="housing" className="w-full">
          <div className="flex items-center justify-between mb-6 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
            <TabsList className="bg-transparent gap-1">
              <TabsTrigger value="housing" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest h-9 px-5 transition-all">
                <Home className="h-3.5 w-3.5 mr-2" /> Housing Units
              </TabsTrigger>
              <TabsTrigger value="jobs" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest h-9 px-5 transition-all">
                <Briefcase className="h-3.5 w-3.5 mr-2" /> Job Roles
              </TabsTrigger>
              <TabsTrigger value="identities" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest h-9 px-5 transition-all">
                <Fingerprint className="h-3.5 w-3.5 mr-2" /> User Identities
              </TabsTrigger>
              <TabsTrigger value="institutions" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest h-9 px-5 transition-all">
                <Building2 className="h-3.5 w-3.5 mr-2" /> Partners
              </TabsTrigger>
            </TabsList>
            <div className="hidden md:flex items-center gap-4 px-4 border-l border-slate-100">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-900 leading-none">Total Pending</p>
                <p className="text-[8px] font-bold text-primary uppercase mt-1">12 Objects Found</p>
              </div>
            </div>
          </div>

          <TabsContent value="housing" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {housingQueue.map((item) => (
              <VerificationCard key={item.id} item={item} />
            ))}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {jobsQueue.map((item) => (
              <VerificationCard key={item.id} item={item} />
            ))}
          </TabsContent>

          <TabsContent value="identities" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {identitiesQueue.map((item) => (
              <VerificationCard key={item.id} item={item} />
            ))}
          </TabsContent>

          <TabsContent value="institutions" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {institutionsQueue.map((item) => (
              <VerificationCard key={item.id} item={item} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarShell>
  );
}

function VerificationCard({ item }: any) {
  return (
    <Card className="overflow-hidden border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-xl transition-all duration-500 flex flex-col lg:flex-row">
      <div className="relative w-full lg:w-72 aspect-video lg:aspect-auto shrink-0 overflow-hidden">
        <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge className={`font-black px-2.5 py-1 rounded-xl border-none shadow-2xl text-[8px] uppercase tracking-widest ${
            item.priority === 'Critical' ? 'bg-red-600 text-white animate-pulse' :
            item.priority === 'High' ? 'bg-orange-500 text-white' : 
            item.priority === 'Medium' ? 'bg-amber-500 text-white' : 'bg-slate-900/80 backdrop-blur text-white'
          }`}>
            {item.priority} Priority
          </Badge>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div className="space-y-1.5">
            <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight leading-none italic">{item.title}</h3>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {item.location}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> In Queue: {item.date}</span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Origin Source</p>
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 font-black text-[9px] px-3 py-1 uppercase tracking-tighter rounded-full">
              {item.owner}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(item.meta).map(([key, value]: any) => (
            <div key={key} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col gap-1 hover:bg-white hover:border-primary/20 transition-all shadow-inner">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">{key.replace('_', ' ')}</span>
              <p className="text-[11px] font-black text-slate-900 leading-none mt-1 uppercase italic">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto flex flex-col sm:flex-row gap-3">
          <Button variant="ghost" className="flex-1 h-12 rounded-2xl font-black text-[10px] text-red-500 hover:bg-red-50 uppercase tracking-widest gap-2 border border-red-100 transition-all">
            <XCircle className="h-4 w-4" /> Reject Credentials
          </Button>
          <Button className="flex-1 h-12 rounded-2xl font-black text-[10px] shadow-xl shadow-primary/20 uppercase tracking-widest gap-2 bg-primary transition-all hover:scale-[1.02] active:scale-[0.98]">
            <CheckCircle2 className="h-4 w-4" /> Certify & Finalize
          </Button>
        </div>
      </div>
    </Card>
  );
}
