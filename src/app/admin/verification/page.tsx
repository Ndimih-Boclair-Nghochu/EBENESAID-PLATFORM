'use client';

import { useEffect, useState } from "react";
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

const housingQueue: { id: string; type: string; title: string; owner: string; location: string; date: string; priority: string; img: string; meta: Record<string, string> }[] = [];
const jobsQueue: typeof housingQueue = [];
const identitiesQueue: typeof housingQueue = [];
const institutionsQueue: typeof housingQueue = [];

export default function VerificationQueuePage() {
  const [communityRequests, setCommunityRequests] = useState<any[]>([]);
  const [communityStatus, setCommunityStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/community-circles", { credentials: "include" })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load community approvals.");
        }
        setCommunityRequests(data.requests ?? []);
      })
      .catch(error => setCommunityStatus(error instanceof Error ? error.message : "Failed to load community approvals."));
  }, []);

  async function reviewCommunityRequest(circleId: number, decision: "approved" | "rejected") {
    const res = await fetch("/api/admin/community-circles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        circleId,
        decision,
        rejectionReason: decision === "rejected" ? "Rejected from admin verification queue." : "",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setCommunityStatus(data.error || "Failed to review community request.");
      return;
    }
    setCommunityRequests(data.requests ?? []);
    setCommunityStatus(`Community request ${decision === "approved" ? "approved" : "rejected"} successfully.`);
  }

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
              <TabsTrigger value="communities" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest h-9 px-5 transition-all">
                <Users className="h-3.5 w-3.5 mr-2" /> Student Circles
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

          <TabsContent value="communities" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {communityStatus && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                {communityStatus}
              </div>
            )}
            {communityRequests.length > 0 ? communityRequests.map((item) => (
              <Card key={item.id} className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-black">{item.name}</CardTitle>
                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Requested by {item.createdBy} • {item.createdAt}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{item.description}</p>
                  <div className="flex gap-3">
                    <Button variant="ghost" className="rounded-xl text-red-600 hover:bg-red-50" onClick={() => reviewCommunityRequest(item.id, "rejected")}>
                      <XCircle className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={() => reviewCommunityRequest(item.id, "approved")}>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
                <CardContent className="p-8 text-center text-sm text-slate-500">
                  No pending community requests right now.
                </CardContent>
              </Card>
            )}
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
