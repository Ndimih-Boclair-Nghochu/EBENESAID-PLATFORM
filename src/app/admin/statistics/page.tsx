'use client';

import { useEffect, useState, type ReactNode } from "react";
import { Activity, Briefcase, Home, ShieldCheck, Users } from "lucide-react";

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SummaryResponse = {
  statistics: {
    totalStudents: number;
    verifiedListings: number;
    activeJobs: number;
    complianceRate: number;
  };
};

export default function StatisticsPage() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/summary", { credentials: "include" })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Failed to load statistics.");
        setData(body);
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : "Failed to load statistics."));
  }, []);

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="space-y-1 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
              Telemetry Node - Live Platform Stats
            </Badge>
          </div>
          <h1 className="text-xl font-black text-slate-900">Platform Statistics</h1>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Live statistics calculated from the current backend records.</p>
        </div>

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard icon={<Users className="h-5 w-5" />} label="Total Students" value={String(data?.statistics.totalStudents ?? 0)} />
          <MetricCard icon={<Home className="h-5 w-5" />} label="Verified Listings" value={String(data?.statistics.verifiedListings ?? 0)} />
          <MetricCard icon={<Briefcase className="h-5 w-5" />} label="Active Jobs" value={String(data?.statistics.activeJobs ?? 0)} />
          <MetricCard icon={<ShieldCheck className="h-5 w-5" />} label="Compliance" value={`${data?.statistics.complianceRate ?? 0}%`} />
        </div>

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black">Statistics Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>These values are loaded from live backend records. They come from users, listings, jobs, and dashboard task completion in the database.</p>
            <p>If a figure is low or zero, it means the backend currently has little or no real data for that module.</p>
          </CardContent>
        </Card>
      </div>
    </SidebarShell>
  );
}

function MetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Card className="rounded-2xl border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">{icon}</div>
      <p className="text-xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    </Card>
  );
}

