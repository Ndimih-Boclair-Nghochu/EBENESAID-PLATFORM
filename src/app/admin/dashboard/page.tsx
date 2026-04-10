'use client';

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Activity, Briefcase, Building2, CheckCircle2, DollarSign, Home, ShieldCheck, Users } from "lucide-react";

import { discussOps } from "@/ai/flows/admin-ops-flow";
import { SpecialistChat } from "@/components/SpecialistChat";
import { PageHeader } from "@/components/layout/page-header";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type SummaryResponse = {
  overview: {
    totalStudents: number;
    totalUsers: number;
    partnerUniversities: number;
    activeJobs: number;
    verifiedListings: number;
    pendingVerifications: number;
    platformRevenue: number;
    complianceRate: number;
    platformHealth: number;
  };
  modules: Array<{ name: string; active: number; total: number; href: string }>;
  recentActivity: Array<{ type: string; message: string; timeLabel: string }>;
  topUniversities: Array<{ name: string; students: number }>;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/summary", { credentials: "include" })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          throw new Error(body.error || "Failed to load admin dashboard.");
        }
        setData(body);
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : "Failed to load admin dashboard."));
  }, []);

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <PageHeader
          title="Operations Dashboard"
          subtitle="System Administrator - Full Access"
          actions={
            <>
              <Button variant="outline" size="sm" className="rounded-xl" asChild>
                <Link href="/admin/reports">Reports</Link>
              </Button>
              <Button size="sm" className="rounded-xl bg-green-700 hover:bg-green-800" asChild>
                <Link href="/admin/verification">Verification Queue</Link>
              </Button>
            </>
          }
        />

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard icon={<Users className="h-5 w-5" />} label="Total Students" value={String(data?.overview.totalStudents ?? 0)} href="/admin/users" />
          <KpiCard icon={<Home className="h-5 w-5" />} label="Verified Listings" value={String(data?.overview.verifiedListings ?? 0)} href="/accommodation" />
          <KpiCard icon={<Briefcase className="h-5 w-5" />} label="Active Jobs" value={String(data?.overview.activeJobs ?? 0)} href="/jobs" />
          <KpiCard icon={<Building2 className="h-5 w-5" />} label="Partner Universities" value={String(data?.overview.partnerUniversities ?? 0)} href="/admin/institutions" />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard icon={<ShieldCheck className="h-5 w-5" />} label="Pending Verifications" value={String(data?.overview.pendingVerifications ?? 0)} href="/admin/verification" />
          <KpiCard icon={<DollarSign className="h-5 w-5" />} label="Platform Revenue" value={`EUR ${data?.overview.platformRevenue ?? 0}`} href="/admin/finance" />
          <KpiCard icon={<CheckCircle2 className="h-5 w-5" />} label="Compliance" value={`${data?.overview.complianceRate ?? 0}%`} href="/admin/statistics" />
          <KpiCard icon={<Activity className="h-5 w-5" />} label="Platform Health" value={`${data?.overview.platformHealth ?? 0}%`} href="/admin/statistics" />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SpecialistChat
              title="Operations Specialist"
              specialty="Platform KPI & Strategy"
              initialMessage="I can help you interpret the live platform numbers, partner activity, and verification workload."
              flow={discussOps}
              icon={<Activity className="h-4 w-4" />}
            />
          </div>
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-base font-black">Module Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(data?.modules ?? []).map((module) => {
                const pct = module.total > 0 ? Math.round((module.active / module.total) * 100) : 0;
                return (
                  <Link key={module.name} href={module.href} className="block">
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="font-bold text-slate-700">{module.name}</span>
                      <span className="text-xs text-slate-400">{module.active}/{module.total}</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-7">
            <CardHeader>
              <CardTitle className="text-base font-black">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(data?.recentActivity ?? []).length > 0 ? data?.recentActivity.map((item, index) => (
                <div key={`${item.type}-${index}`} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="outline">{item.type}</Badge>
                    <span className="text-xs text-slate-400">{item.timeLabel}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{item.message}</p>
                </div>
              )) : <p className="text-sm text-slate-500">No live activity yet.</p>}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-5">
            <CardHeader>
              <CardTitle className="text-base font-black">Top Universities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(data?.topUniversities ?? []).length > 0 ? data?.topUniversities.map((uni) => (
                <div key={uni.name} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                  <p className="font-bold text-slate-800">{uni.name}</p>
                  <Badge>{uni.students} students</Badge>
                </div>
              )) : <p className="text-sm text-slate-500">No university-linked students yet.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarShell>
  );
}

function KpiCard({ icon, label, value, href }: { icon: ReactNode; label: string; value: string; href: string }) {
  return (
    <Link href={href}>
      <Card className="rounded-2xl border-slate-100 bg-white p-5 shadow-sm transition hover:border-green-100 hover:shadow-md">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">{icon}</div>
        <p className="text-xl font-black text-slate-900">{value}</p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      </Card>
    </Link>
  );
}
