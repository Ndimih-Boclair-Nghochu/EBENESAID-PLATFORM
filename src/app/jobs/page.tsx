'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, Building2, MapPin, MessagesSquare, Search, ShieldCheck, Sparkles } from "lucide-react";

import { discussCareers } from "@/ai/flows/career-specialist-flow";
import { useAuthContext } from "@/auth/provider";
import { SpecialistChat } from "@/components/SpecialistChat";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type StudentJob = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  logo: string;
  description: string;
  applied: boolean;
};

export default function JobsPage() {
  const { user } = useAuthContext();
  const [jobs, setJobs] = useState<StudentJob[]>([]);
  const [query, setQuery] = useState("");

  async function loadJobs() {
    const res = await fetch("/api/jobs", { credentials: "include" });
    const data = await res.json();
    if (res.ok) setJobs(data.jobs ?? []);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function apply(jobId: number) {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ jobId }),
    });
    const data = await res.json();
    if (res.ok) setJobs(data.jobs ?? []);
  }

  const visibleJobs = jobs.filter(job =>
    `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(query.toLowerCase())
  );
  const recommendedJob = useMemo(() => {
    return visibleJobs.find(job => !job.applied && /part|flex|student/i.test(`${job.type} ${job.title}`))
      ?? visibleJobs.find(job => !job.applied && /riga|remote/i.test(job.location))
      ?? visibleJobs.find(job => !job.applied)
      ?? null;
  }, [visibleJobs]);
  const recommendedReason = recommendedJob
    ? `EBENESAID AI recommends ${recommendedJob.title} at ${recommendedJob.company}${user?.firstName ? ` for ${user.firstName}` : ""} because it fits a student-friendly work pattern and keeps you close to the live opportunities already listed in the platform.`
    : null;

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
              Career Node - Vetted Partners
            </Badge>
            <h1 className="text-xl font-black text-slate-900">Employment Bridge</h1>
          </div>
          <Button variant="outline" className="rounded-xl" asChild>
            <Link href="/messages">My Applications</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SpecialistChat
              title="Career Specialist"
              specialty="Employment & Labor Law Expert"
              initialMessage="Ask me about student jobs, CV positioning, or work rules in Latvia."
              flow={discussCareers}
              icon={<Briefcase className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[1.5rem] border-none bg-slate-900 p-6 text-white shadow-xl">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">Compliance Shield</p>
              <p className="mt-4 text-sm text-slate-300">Live job records and per-user application status are now active.</p>
            </Card>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Roles, companies or industries..." className="h-10 rounded-lg bg-slate-50 pl-9" />
        </div>

        {recommendedJob && recommendedReason && (
          <Card className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/80 shadow-sm">
            <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  EBENESAID AI Recommends This
                </p>
                <p className="mt-2 text-base font-black text-slate-900">
                  {recommendedJob.title} - {recommendedJob.company}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {recommendedReason}
                </p>
              </div>
              <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={() => apply(recommendedJob.id)} disabled={recommendedJob.applied}>
                {recommendedJob.applied ? "Applied" : "Apply To Recommended Role"}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {visibleJobs.map(job => (
            <Card key={job.id} className="rounded-[2rem] border-none bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <CardTitle className="text-base font-black text-slate-900">{job.title}</CardTitle>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-1"><Building2 className="h-3 w-3 text-primary" /> {job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                    </div>
                  </div>
                  <Badge>{job.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{job.description}</p>
                <p className="text-sm font-black text-primary">{job.salary}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-xl" asChild>
                    <Link href="/messages"><MessagesSquare className="h-4 w-4" /></Link>
                  </Button>
                  <Button variant="outline" className="rounded-xl" asChild>
                    <Link href="/settings"><ShieldCheck className="mr-2 h-4 w-4" /> Settings</Link>
                  </Button>
                  <Button className="rounded-xl bg-green-700 hover:bg-green-800" disabled={job.applied} onClick={() => apply(job.id)}>
                    {job.applied ? "Applied" : "Apply Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!visibleJobs.length && (
            <Card className="rounded-[2rem] border border-dashed border-slate-200 bg-white shadow-sm md:col-span-2">
              <CardContent className="p-8 text-center text-sm text-slate-500">
                No real job listings are available yet.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SidebarShell>
  );
}
