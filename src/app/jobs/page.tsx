'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Briefcase, 
  MapPin, 
  Building2, 
  Clock, 
  DollarSign, 
  Filter, 
  Search, 
  Sparkles, 
  Activity, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  MessagesSquare
} from "lucide-react";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussCareers } from "@/ai/flows/career-specialist-flow";
import Link from "next/link";

const jobs = [
  { id: 1, title: "Part-time Delivery Associate", company: "Wolt Latvia", location: "Riga, Latvia", salary: "€800 - €1,200", type: "Flexible", logo: "WL" },
  { id: 2, title: "Junior IT Support (Internship)", company: "Accenture Baltics", location: "Teika, Riga", salary: "€600 stipend", type: "Part-time", logo: "AC" },
  { id: 3, title: "English Tutor for Kids", company: "Language Hub", location: "Remote/Riga", salary: "€15/hour", type: "Hourly", logo: "LH" }
];

export default function JobsPage() {
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Compact Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Career Node • Vetted Partners
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <Activity className="h-2.5 w-2.5" /> 20h Work Permit Active
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Employment Bridge</h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider">Verified part-time roles and internships for international talent.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto" asChild>
              <Link href="/dashboard">My Applications</Link>
            </Button>
          </div>
        </div>

        {/* AI Specialist Console */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SpecialistChat 
              title="Career Specialist"
              specialty="Employment & Labor Law Expert"
              initialMessage="I specialize in student employment in Latvia. I can help you understand the 20-hour weekly work limit, adapt your CV for the Baltic market, or highlight vetted partners like Accenture. How can I accelerate your career today?"
              flow={discussCareers}
              icon={<Briefcase className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[1.5rem] bg-slate-900 text-white p-6 relative overflow-hidden shadow-xl border-none h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="flex items-center gap-2 text-primary mb-4 relative z-10">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Compliance Shield</p>
              </div>
              <p className="text-xs font-medium text-slate-300 leading-relaxed italic relative z-10 border-l-2 border-primary/40 pl-4 py-1">
                "Your D-Visa allows 20 hours of work per week during term time."
              </p>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-12 space-y-5">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
               <div className="flex-1 relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                 <Input placeholder="Roles, companies or industries..." className="h-10 pl-9 rounded-lg bg-slate-50 border-none focus:bg-white transition-all font-bold text-xs" />
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" className="h-10 rounded-lg font-black border-slate-200 gap-2 text-[10px] px-4"><Filter className="h-3.5 w-3.5" /> Filters</Button>
                 <Button className="h-10 rounded-lg font-black px-6 text-[10px]">Find Roles</Button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <Card key={job.id} className="overflow-hidden border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-xl transition-all flex flex-col sm:flex-row">
                  <div className="p-5 flex-1 flex flex-col sm:flex-row items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-lg text-primary shadow-inner group-hover:bg-primary group-hover:text-white transition-all shrink-0">{job.logo}</div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <CardTitle className="text-base font-black text-slate-900 group-hover:text-primary transition-colors leading-none truncate">{job.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400">
                        <span className="flex items-center gap-1.5"><Building2 className="h-3 w-3 text-primary" /> {job.company}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {job.location}</span>
                      </div>
                    </div>
                    <div className="text-center sm:text-right shrink-0">
                      <p className="text-lg font-black text-primary tracking-tighter leading-none italic">{job.salary}</p>
                      <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Monthly</p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-stretch border-t sm:border-t-0 sm:border-l border-slate-50">
                    <Button variant="ghost" className="h-full sm:h-1/3 flex-1 sm:w-12 rounded-none hover:bg-primary hover:text-white p-0" asChild>
                      <Link href="/messages"><MessagesSquare className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" className="h-full sm:h-1/3 flex-1 sm:w-12 rounded-none hover:bg-primary hover:text-white p-0" asChild>
                      <Link href="/dashboard"><Zap className="h-4 w-4" /></Link>
                    </Button>
                    <Button className="h-full sm:h-1/3 flex-1 sm:w-12 rounded-none shadow-none p-0" asChild>
                      <Link href="/dashboard"><ArrowUpRight className="h-4 w-4" /></Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}
