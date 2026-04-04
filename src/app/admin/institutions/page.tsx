
'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Plus, 
  Search, 
  ExternalLink, 
  Users, 
  ShieldCheck, 
  Settings,
  MoreVertical,
  Globe,
  MapPin,
  CheckCircle2,
  Activity
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { UNIVERSITIES } from "@/lib/constants";

export default function InstitutionsManagementPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Compact Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-indigo-400/20 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Institutional Node • Partner Registry
              </Badge>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">University Partners</h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider">Manage formal partnerships and data-sharing protocols with global institutions.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700 gap-2 text-[10px] w-full sm:w-auto text-white border-none">
              <Plus className="h-3.5 w-3.5" /> Add New Institution
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
           <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
             <Input placeholder="Search partners, cities or status..." className="h-10 pl-9 rounded-lg bg-slate-50 border-none focus:bg-white transition-all font-bold text-xs" />
           </div>
           <Button variant="outline" className="h-10 rounded-lg font-black border-slate-200 gap-2 text-[10px] px-4">
             Export Registry
           </Button>
        </div>

        {/* Institutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {UNIVERSITIES.map((uni) => (
            <Card key={uni.id} className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden group hover:shadow-xl transition-all duration-500">
              <CardHeader className="p-6 pb-4 border-b border-slate-50">
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none text-[7px] font-black uppercase tracking-widest px-2 py-0.5">
                    Formal Partner
                  </Badge>
                </div>
                <div className="mt-4 space-y-1">
                  <CardTitle className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{uni.name}</CardTitle>
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase">
                    <MapPin className="h-2.5 w-2.5 text-indigo-600" /> Riga, Latvia
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Active Students</p>
                    <p className="text-xs font-black text-slate-700">1,240</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Housing Vacancy</p>
                    <p className="text-xs font-black text-slate-700">14%</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live API Sync</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-300 hover:text-indigo-600 hover:bg-indigo-50">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SidebarShell>
  );
}
