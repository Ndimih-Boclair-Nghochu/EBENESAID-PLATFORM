'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Cloud, 
  RefreshCw, 
  FileUp, 
  Key, 
  ShieldCheck, 
  Activity, 
  History, 
  CheckCircle2, 
  AlertCircle,
  Server,
  Zap,
  Lock,
  ArrowUpRight,
  Database,
  Globe
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const syncHistory = [
  { id: "sync_9921", type: "Manual Upload", records: 124, status: "Success", time: "2h ago" },
  { id: "sync_9920", type: "API Webhook", records: 12, status: "Success", time: "5h ago" },
  { id: "sync_9919", type: "Bulk Sync", records: 450, status: "Warning", time: "1d ago" },
  { id: "sync_9918", type: "API Webhook", records: 8, status: "Success", time: "2d ago" },
];

export default function AdmissionsSyncPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
        
        {/* Professional Sync Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-indigo-400/20 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Data Integration Node • Secure
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Handshake: Optimal
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Admissions <span className="text-indigo-600">Sync</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider">Synchronize institutional admission records with the Global Relocation OS.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700 gap-2 text-[10px] w-full sm:w-auto text-white border-none">
              <RefreshCw className="h-3.5 w-3.5" /> Force Handshake
            </Button>
          </div>
        </div>

        {/* TOP LEVEL STATUS NODES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SyncStatusNode icon={<Database />} label="Synced Records" value="1,240" sub="Cohort 2025" />
          <SyncStatusNode icon={<Lock />} label="Node Security" value="AES-256" sub="Active" />
          <SyncStatusNode icon={<Server />} label="API Latency" value="14ms" sub="Excellent" />
          <SyncStatusNode icon={<ShieldCheck />} label="Integrity" value="100%" sub="Verified" />
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Sync Controls */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
              <Tabs defaultValue="manual" className="w-full">
                <CardHeader className="p-0 border-b border-slate-50">
                  <TabsList className="bg-transparent w-full justify-start h-auto p-0">
                    <TabsTrigger value="manual" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-indigo-50/30 font-black text-[10px] uppercase tracking-widest h-14 px-8 transition-all">
                      <FileUp className="h-3.5 w-3.5 mr-2" /> Manual Protocol
                    </TabsTrigger>
                    <TabsTrigger value="automated" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-indigo-50/30 font-black text-[10px] uppercase tracking-widest h-14 px-8 transition-all">
                      <Zap className="h-3.5 w-3.5 mr-2" /> Automated Node
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="p-8">
                  <TabsContent value="manual" className="space-y-8 mt-0 animate-in fade-in duration-500">
                    <div className="text-center space-y-4 py-10 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50 group hover:bg-white hover:border-indigo-200 transition-all cursor-pointer">
                      <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto shadow-sm group-hover:text-indigo-600 transition-colors">
                        <Cloud className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-900">Ingest Admission Data</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Supports CSV, JSON or Excel (.xlsx)</p>
                      </div>
                      <Button variant="outline" className="h-9 rounded-xl font-black text-[10px] uppercase tracking-widest border-slate-200">
                        Select Source File
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Validation Progress</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-700">
                          <span>Scanning records...</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-1.5 rounded-full bg-slate-100" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="automated" className="space-y-8 mt-0 animate-in fade-in duration-500">
                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institutional Endpoint (Webhook)</Label>
                        <div className="flex gap-2">
                          <Input readOnly defaultValue="https://api.ebenesaid.os/v1/sync/rtu_hub" className="h-12 rounded-xl bg-slate-50 border-none font-mono text-xs text-slate-500" />
                          <Button variant="outline" className="h-12 w-12 rounded-xl border-slate-200 shrink-0">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Access Token</Label>
                        <div className="flex gap-2">
                          <Input type="password" defaultValue="••••••••••••••••" className="h-12 rounded-xl bg-slate-50 border-none font-bold text-xs" />
                          <Button variant="outline" className="h-12 w-12 rounded-xl border-slate-200 shrink-0">
                            <Key className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-indigo-900 uppercase tracking-widest leading-none mb-2">Node Synchronization</p>
                        <p className="text-[10px] text-indigo-700/70 font-medium leading-relaxed uppercase tracking-wider">
                          Enable automated sync to instantly initialize the Relocation OS for every newly admitted student.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>

            {/* Sync Ledger */}
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                    <History className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-black text-slate-900">Sync Ledger</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">View Full Log</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {syncHistory.map((log) => (
                    <div key={log.id} className="p-4 px-8 group hover:bg-slate-50/50 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-2.5 w-2.5 rounded-full ${log.status === 'Success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'}`} />
                        <div className="space-y-0.5">
                          <p className="text-[12px] font-black text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">{log.type}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{log.records} Records • {log.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{log.time}</p>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-200 group-hover:text-indigo-600 transition-all ml-auto mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Telemetry */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[2.5rem] bg-slate-900 text-white p-8 relative overflow-hidden shadow-xl border-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]" />
              <div className="flex items-center gap-2 text-indigo-400 mb-8 relative z-10">
                <Zap className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Real-time Telemetry</p>
              </div>
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Sync Capacity</p>
                    <p className="text-3xl font-black text-white tracking-tighter italic">98.4%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                    <p className="text-sm font-black text-emerald-400 italic uppercase">Healthy</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-indigo-500 w-[98.4%] shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                </div>
                <p className="text-[9px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">
                  System handling 1.2k record handshakes per second. No bottlenecks detected in current node cluster.
                </p>
              </div>
            </Card>

            <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Protocol Audit</p>
              </div>
              <div className="space-y-4">
                <AuditItem label="Schema Validation" status="Passed" />
                <AuditItem label="Identity Encryption" status="Active" />
                <AuditItem label="Institutional Bridge" status="Optimal" />
              </div>
              <Button variant="ghost" className="w-full h-10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50">
                Download Audit Report
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function SyncStatusNode({ icon, label, value, sub }: any) {
  return (
    <Card className="p-4 rounded-2xl border-slate-100 shadow-sm bg-white group hover:border-indigo-200 transition-all">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center shadow-inner shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 truncate">{label}</p>
          <p className="text-sm font-black text-slate-900 leading-none">{value}</p>
          <p className="text-[7px] font-bold text-indigo-600 uppercase tracking-widest mt-1">{sub}</p>
        </div>
      </div>
    </Card>
  );
}

function AuditItem({ label, status }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{status}</span>
      </div>
    </div>
  );
}
