'use client';

import { useEffect, useState } from 'react';
import { Activity, Briefcase, Building2, DollarSign, Home, Users } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type InvestorSummary = {
  metrics: {
    students: number;
    partners: number;
    listings: number;
    jobs: number;
    foodItems: number;
    transportBookings: number;
    studentRevenueEur: number;
    partnerNetEur: number;
  };
  updates: Array<{ title: string; body: string }>;
  recentActivity: Array<{ label: string; timeLabel: string }>;
};

export default function InvestorDashboardPage() {
  const [data, setData] = useState<InvestorSummary | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/investor/summary', { credentials: 'include' })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Failed to load investor dashboard.');
        setData(body);
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : 'Failed to load investor dashboard.'));
  }, []);

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <PageHeader
          title="Investor Dashboard"
          subtitle="Business overview, partner growth, service activity, and platform performance."
          actions={<Badge className="rounded-xl bg-green-50 px-4 py-2 font-black text-green-700">Read-only investor view</Badge>}
        />

        {status && <p className="text-sm text-slate-600">{status}</p>}

        <div id="metrics" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Students" value={data?.metrics.students ?? 0} icon={<Users className="h-4 w-4" />} />
          <MetricCard label="Partners" value={data?.metrics.partners ?? 0} icon={<Building2 className="h-4 w-4" />} />
          <MetricCard label="Student Revenue" value={`EUR ${Number(data?.metrics.studentRevenueEur ?? 0).toFixed(0)}`} icon={<DollarSign className="h-4 w-4" />} />
          <MetricCard label="Partner Net Volume" value={`EUR ${Number(data?.metrics.partnerNetEur ?? 0).toFixed(0)}`} icon={<Activity className="h-4 w-4" />} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Housing Records" value={data?.metrics.listings ?? 0} icon={<Home className="h-4 w-4" />} />
          <MetricCard label="Job Listings" value={data?.metrics.jobs ?? 0} icon={<Briefcase className="h-4 w-4" />} />
          <MetricCard label="Food Items" value={data?.metrics.foodItems ?? 0} icon={<Activity className="h-4 w-4" />} />
          <MetricCard label="Arrival Bookings" value={data?.metrics.transportBookings ?? 0} icon={<Activity className="h-4 w-4" />} />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card id="updates" className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-7">
            <CardHeader>
              <CardTitle className="text-base font-black">Business Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(data?.updates ?? []).map((update) => (
                <div key={update.title} className="rounded-2xl border border-slate-100 p-4">
                  <p className="font-black text-slate-900">{update.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{update.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-5">
            <CardHeader>
              <CardTitle className="text-base font-black">Recent Platform Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(data?.recentActivity ?? []).length ? data?.recentActivity.map((activity, index) => (
                <div key={`${activity.label}-${index}`} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                  <p className="text-sm font-bold text-slate-700">{activity.label}</p>
                  <span className="text-xs text-slate-400">{activity.timeLabel}</span>
                </div>
              )) : (
                <p className="text-sm text-slate-500">No live activity has been recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarShell>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <Card className="rounded-[1.5rem] border-slate-100 bg-white shadow-sm">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
        </div>
        <div className="rounded-xl bg-green-50 p-3 text-green-700">{icon}</div>
      </CardContent>
    </Card>
  );
}
