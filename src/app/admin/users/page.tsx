'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight,
  UserCheck,
  UserX,
  Building,
  Activity,
  Fingerprint,
  ShieldAlert
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const users = [
  { id: "u1", name: "Louis D.", email: "louis@ebenesaid.com", type: "Student", status: "Verified", uni: "RTU", joined: "Jan 2025" },
  { id: "u2", name: "Sia LatProp", email: "sia@latprop.lv", type: "Landlord", status: "Verified", uni: "-", joined: "Dec 2024" },
  { id: "u3", name: "Kofi Mensah", email: "k.mensah@edu.rtu.lv", type: "Student", status: "Pending", uni: "RTU", joined: "Feb 2025" },
  { id: "u4", name: "TechBaltics", email: "hr@techbaltics.com", type: "Employer", status: "Verified", uni: "-", joined: "Nov 2024" },
  { id: "u5", name: "Maria K.", email: "maria@riseba.lv", type: "Student", status: "Expiring", uni: "RISEBA", joined: "Jan 2025" },
];

export default function UserDirectoryPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Compact Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Identity Node • Global Directory
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> Directory Live
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">User <span className="text-primary">Directory</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider">Comprehensive identity oversight of students, landlords, and corporate partners.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto">
              <Fingerprint className="h-3.5 w-3.5 text-primary" /> Identity Audit
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 space-y-5">
            {/* Search & Filter Bar - High Density */}
            <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
               <div className="flex-1 relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                 <Input placeholder="Search names, emails, or institutional IDs..." className="h-10 pl-9 rounded-lg bg-slate-50 border-none focus:bg-white transition-all font-bold text-xs" />
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" className="h-10 rounded-lg font-black border-slate-200 gap-2 text-[10px] px-4">
                   <Filter className="h-3.5 w-3.5" /> Advanced Filters
                 </Button>
               </div>
            </div>

            {/* User List - High Density Matrix */}
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
              <div className="divide-y divide-slate-50">
                {users.map((u) => (
                  <div key={u.id} className="p-4 px-6 group hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative">
                        <Avatar className="h-12 w-12 rounded-[1.25rem] border-2 border-slate-50 shadow-sm">
                          <AvatarImage src={`https://picsum.photos/seed/${u.id}/100/100`} />
                          <AvatarFallback className="bg-primary text-white font-black text-sm">{u.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {u.status === 'Verified' && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                            <ShieldCheck className="h-3.5 w-3.5 text-primary fill-primary/10" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors truncate leading-none">{u.name}</p>
                          <Badge variant="outline" className="text-[7px] font-black uppercase tracking-tighter px-1.5 py-0 h-3.5 border-slate-100 bg-slate-50 text-slate-500">
                            {u.type}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                            <Mail className="h-2.5 w-2.5 text-primary" /> {u.email}
                          </span>
                          {u.uni !== '-' && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                              <Building className="h-2.5 w-2.5" /> {u.uni}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[9px] font-bold text-slate-300 uppercase tracking-tight">
                            <Clock className="h-2.5 w-2.5" /> Joined {u.joined}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Security Status</p>
                        {u.status === 'Verified' ? (
                          <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 text-[7px] font-black uppercase tracking-widest">Verified Node</Badge>
                        ) : u.status === 'Pending' ? (
                          <Badge className="bg-amber-50 text-amber-600 border-none px-2 py-0.5 text-[7px] font-black uppercase tracking-widest">Pending Review</Badge>
                        ) : (
                          <Badge className="bg-red-50 text-red-400 border-none px-2 py-0.5 text-[7px] font-black uppercase tracking-widest">Identity Warning</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all">
                          <UserCheck className="h-4.5 w-4.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <UserX className="h-4.5 w-4.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all">
                          <MoreHorizontal className="h-4.5 w-4.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}
