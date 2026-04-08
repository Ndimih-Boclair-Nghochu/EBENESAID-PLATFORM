'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  ShieldCheck, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  Lock, 
  Activity, 
  ShieldAlert, 
  ArrowUpRight,
  Clock,
  CircleDashed
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussDocuments } from "@/ai/flows/document-specialist-flow";

const requiredDocs = [
  { id: 1, name: "Passport (Data Page)", status: "Verified", date: "Jan 12, 2025", type: "Identity" },
  { id: 2, name: "University Acceptance Letter", status: "Verified", date: "Dec 15, 2024", type: "Education" },
  { id: 3, name: "Student Visa (Long Stay)", status: "Expiring Soon", date: "Feb 01, 2025", type: "Legal" },
  { id: 4, name: "Proof of Financial Means", status: "Pending", date: "Jan 20, 2025", type: "Finance" },
  { id: 5, name: "International Health Insurance", status: "Not Uploaded", date: "-", type: "Health" },
  { id: 6, name: "Lease Agreement (Certified)", status: "Not Uploaded", date: "-", type: "Housing" },
  { id: 7, name: "Criminal Record Clearance", status: "Pending", date: "Jan 21, 2025", type: "Legal" },
  { id: 8, name: "Previous Academic Diploma", status: "Verified", date: "Dec 10, 2024", type: "Education" },
  { id: 9, name: "PMLP Residence Permit Application", status: "Not Uploaded", date: "-", type: "Legal" },
  { id: 10, name: "Airport Transfer Voucher", status: "Not Uploaded", date: "-", type: "Logistics" },
];

export default function DocumentWalletPage() {
  const verifiedCount = requiredDocs.filter(d => d.status === "Verified").length;
  const auditScore = Math.round((verifiedCount / requiredDocs.length) * 100);

  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Compact Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Security Node • Encryption Active
              </Badge>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Document Wallet</h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider">Bank-grade encrypted storage for critical mobility paperwork.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-primary/20 gap-2 text-[10px] w-full sm:w-auto">
              <Upload className="h-3.5 w-3.5" /> Bulk Upload
            </Button>
          </div>
        </div>

        {/* AI Specialist Console */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SpecialistChat 
              title="Compliance Specialist"
              specialty="Security & Visa Protocol Expert"
              initialMessage="Your Document Wallet is protected by AES-256 encryption. I can help you understand PMLP requirements for residence permits or guide you through verifying your health insurance. What documents are we auditing today?"
              flow={discussDocuments}
              icon={<Lock className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[1.5rem] bg-slate-900 text-white p-6 relative overflow-hidden shadow-xl border-none h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="flex items-center gap-2 text-primary mb-4 relative z-10">
                <Activity className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Compliance Health</p>
              </div>
              <div className="space-y-4 bg-white/5 p-5 rounded-xl border border-white/10 relative z-10">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                  <span className="text-2xl font-black text-primary tracking-tighter italic">{auditScore}%</span>
                </div>
                <Progress value={auditScore} className="h-2 rounded-full bg-white/10" />
              </div>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Wallet Inventory */}
          <div className="lg:col-span-12 space-y-6">
            <Card className="shadow-sm border-slate-100 rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <CardTitle className="text-base font-black text-slate-900 leading-none tracking-tight">Compliance Inventory</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {requiredDocs.map((doc) => (
                    <div key={doc.id} className="group flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-all cursor-pointer">
                      <div className="h-9 w-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shadow-inner shrink-0">
                        <FileText className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-black text-slate-800 leading-none group-hover:text-primary transition-colors">{doc.name}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1.5 tracking-widest">{doc.status === 'Not Uploaded' ? 'Action Required' : `Updated ${doc.date}`}</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {doc.status === "Verified" ? (
                          <Badge className="bg-emerald-50 text-emerald-600 border-none font-black px-2 py-0.5 rounded-full text-[7px] uppercase tracking-widest">Verified</Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-500 border-none font-black px-2 py-0.5 rounded-full text-[7px] uppercase tracking-widest">{doc.status}</Badge>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg bg-slate-50 text-slate-400 hover:bg-primary hover:text-white shadow-inner">
                          {doc.status === 'Not Uploaded' ? <Upload className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
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
