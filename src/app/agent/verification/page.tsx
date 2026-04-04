
'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  Download, 
  Lock, 
  Activity, 
  ArrowUpRight,
  Clock,
  AlertCircle,
  Building2,
  Server,
  Zap,
  Fingerprint
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussDocuments } from "@/ai/flows/document-specialist-flow";

const agentDocs = [
  { id: 1, name: "Agency License / Business Cert", status: "Verified", date: "Jan 10, 2025", type: "Legal" },
  { id: 2, name: "Property Ownership Proof (Samples)", status: "Verified", date: "Jan 10, 2025", type: "Asset" },
  { id: 3, name: "Agent Identity Verification", status: "Verified", date: "Jan 10, 2025", type: "Identity" },
  { id: 4, name: "VAT / Tax ID Certificate", status: "Pending", date: "Feb 15, 2025", type: "Finance" },
  { id: 5, name: "Professional Indemnity Insurance", status: "Not Uploaded", date: "-", type: "Risk" },
  { id: 6, name: "Bank Account Verification", status: "Not Uploaded", date: "-", type: "Finance" },
];

export default function AgentVerificationPage() {
  const verifiedCount = agentDocs.filter(d => d.status === "Verified").length;
  const auditScore = Math.round((verifiedCount / agentDocs.length) * 100);

  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-sky-400/20 bg-sky-50 text-sky-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Compliance Node • Agent Audit
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <ShieldCheck className="h-2.5 w-2.5" /> Trust Level: Accredited
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Agent <span className="text-sky-600">Verification</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">Maintain your professional credentials for Super Admin audit and platform marketplace integrity.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-sky-600/20 bg-sky-600 hover:bg-sky-700 gap-2 text-[10px] w-full sm:w-auto text-white border-none">
              <Upload className="h-3.5 w-3.5" /> Update Credentials
            </Button>
          </div>
        </div>

        {/* TOP LEVEL STATUS NODES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusCard icon={<Fingerprint />} label="Identity Status" value="Verified" sub="Bio-Sync Active" />
          <StatusCard icon={<Server />} label="Node Security" value="AES-256" sub="Active" />
          <StatusCard icon={<Clock />} label="Audit Cycle" value="Quarterly" sub="Q1 2025" />
          <StatusCard icon={<CheckCircle2 />} label="Trust Status" value="Level 4" sub="High Trust" />
        </div>

        {/* AI Specialist Console */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SpecialistChat 
              title="Compliance Specialist"
              specialty="Security & Asset Protocol Expert"
              initialMessage="Hello Agent. I can help you understand the documents required for formal EBENESAID listing authorization. Are you updating your Agency License or VAT credentials today?"
              flow={discussDocuments}
              icon={<Lock className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[1.5rem] bg-slate-900 text-white p-6 relative overflow-hidden shadow-xl border-none h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="flex items-center gap-2 text-sky-400 mb-4 relative z-10">
                <Activity className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Audit Health</p>
              </div>
              <div className="space-y-4 bg-white/5 p-5 rounded-xl border border-white/10 relative z-10">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                  <span className="text-2xl font-black text-sky-400 tracking-tighter italic">{auditScore}%</span>
                </div>
                <Progress value={auditScore} className="h-2 rounded-full bg-white/10" />
              </div>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Document Inventory */}
          <div className="lg:col-span-12 space-y-6">
            <Card className="shadow-sm border-slate-100 rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shadow-inner">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <CardTitle className="text-base font-black text-slate-900 leading-none tracking-tight uppercase">Accreditation Vault</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {agentDocs.map((doc) => (
                    <div key={doc.id} className="group flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-all cursor-pointer">
                      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-inner shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-black text-slate-800 leading-none group-hover:text-sky-600 transition-colors">{doc.name}</p>
                          <Badge variant="outline" className="text-[7px] h-3.5 px-1.5 border-sky-50 text-sky-400 font-bold uppercase tracking-widest">{doc.type}</Badge>
                        </div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-2 tracking-widest">{doc.status === 'Not Uploaded' ? 'Submission Required' : `Verified: ${doc.date}`}</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {doc.status === "Verified" ? (
                          <Badge className="bg-emerald-50 text-emerald-600 border-none font-black px-3 py-1 rounded-full text-[7px] uppercase tracking-[0.2em]">Verified</Badge>
                        ) : doc.status === "Pending" ? (
                          <Badge className="bg-amber-50 text-amber-600 border-none font-black px-3 py-1 rounded-full text-[7px] uppercase tracking-[0.2em]">Auditing</Badge>
                        ) : (
                          <Badge className="bg-red-50 text-red-400 border-none font-black px-3 py-1 rounded-full text-[7px] uppercase tracking-[0.2em]">Action Required</Badge>
                        )}
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 hover:text-sky-600 hover:bg-white shadow-inner transition-all border border-transparent hover:border-sky-100">
                          {doc.status === 'Not Uploaded' ? <Upload className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                        </Button>
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

function StatusCard({ icon, label, value, sub }: any) {
  return (
    <Card className="p-4 rounded-2xl border-slate-100 shadow-sm bg-white group hover:border-sky-200 transition-all">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-sky-600 group-hover:text-white transition-all flex items-center justify-center shadow-inner shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 truncate">{label}</p>
          <p className="text-sm font-black text-slate-900 leading-none italic">{value}</p>
          <p className="text-[7px] font-bold text-sky-600 uppercase tracking-widest mt-1">{sub}</p>
        </div>
      </div>
    </Card>
  );
}
