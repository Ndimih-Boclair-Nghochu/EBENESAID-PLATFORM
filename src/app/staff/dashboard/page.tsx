'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, LifeBuoy, ShieldAlert, Users } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type StaffSummary = {
  metrics: {
    pendingVerifications: number;
    supportThreads: number;
    activeStudents: number;
    openPickups: number;
    activeOrders: number;
  };
  workQueues: Array<{ name: string; count: number; href: string }>;
};

export default function StaffDashboardPage() {
  const [data, setData] = useState<StaffSummary | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/staff/summary', { credentials: 'include' })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Failed to load staff dashboard.');
        setData(body);
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : 'Failed to load staff dashboard.'));
  }, []);

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <PageHeader
          title="Staff Operations"
          subtitle="Restricted operational workspace for verification, student support, and service queues."
          actions={
            <>
              <Button variant="outline" size="sm" className="rounded-xl" asChild>
                <Link href="/staff/support">Support Desk</Link>
              </Button>
              <Button size="sm" className="rounded-xl bg-green-700 hover:bg-green-800" asChild>
                <Link href="/staff/verification">Verification Queue</Link>
              </Button>
            </>
          }
        />

        {status && <p className="text-sm text-slate-600">{status}</p>}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Pending Verification" value={data?.metrics.pendingVerifications ?? 0} icon={<ShieldAlert className="h-4 w-4" />} />
          <MetricCard label="Support Threads" value={data?.metrics.supportThreads ?? 0} icon={<LifeBuoy className="h-4 w-4" />} />
          <MetricCard label="Active Students" value={data?.metrics.activeStudents ?? 0} icon={<Users className="h-4 w-4" />} />
          <MetricCard label="Open Service Tasks" value={(data?.metrics.openPickups ?? 0) + (data?.metrics.activeOrders ?? 0)} icon={<ClipboardList className="h-4 w-4" />} />
        </div>

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black">Work Queues</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {(data?.workQueues ?? []).map((queue) => (
              <Link key={queue.name} href={queue.href} className="rounded-2xl border border-slate-100 p-4 transition hover:border-green-100 hover:shadow-sm">
                <p className="text-sm font-black text-slate-900">{queue.name}</p>
                <p className="mt-2 text-2xl font-black text-green-700">{queue.count}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </SidebarShell>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
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
