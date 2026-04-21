'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Car } from 'lucide-react';

import { discussTransit } from '@/ai/flows/transit-specialist-flow';
import { SpecialistChat } from '@/components/SpecialistChat';
import { PageHeader } from '@/components/layout/page-header';
import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Pickup = {
  id: number;
  studentName: string;
  airportCode: string;
  destination: string;
  pickupStatus: string;
  pickupBooked: boolean;
};

type TransportSummary = {
  pickups: Pickup[];
  metrics: {
    totalPickups: number;
    booked: number;
    completed: number;
    pending: number;
  };
};

export default function TransportDashboardPage() {
  const [data, setData] = useState<TransportSummary | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/transport/summary', { credentials: 'include' })
      .then(async res => {
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Failed to load transport dashboard.');
        setData(payload);
      })
      .catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load transport dashboard.'));
  }, []);

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <PageHeader
          title="Transport Dashboard"
          subtitle="Live arrival bookings and pickup status"
          actions={
            <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700" size="sm" asChild>
              <Link href="/transport/pickups">Open Pickups</Link>
            </Button>
          }
        />

        {status ? <p className="text-sm text-slate-600">{status}</p> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Bookings" value={data?.metrics.totalPickups ?? 0} />
          <MetricCard label="Booked" value={data?.metrics.booked ?? 0} />
          <MetricCard label="Completed" value={data?.metrics.completed ?? 0} />
          <MetricCard label="Pending" value={data?.metrics.pending ?? 0} />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-black">Recent Pickup Jobs</CardTitle>
              <Button variant="outline" className="rounded-xl" asChild>
                <Link href="/transport/pickups">Manage Jobs</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.pickups?.length ? (
                data.pickups.slice(0, 6).map(pickup => (
                  <div key={pickup.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-black text-slate-900">{pickup.studentName}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                        {pickup.airportCode} | {pickup.destination}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{pickup.pickupStatus}</Badge>
                      <Badge>{pickup.pickupBooked ? 'Booked' : 'Not booked'}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  No real transport bookings exist yet.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-5">
            <SpecialistChat
              title="Transit Specialist"
              specialty="Airport Transfers & Logistics"
              initialMessage="I can help you work through the actual pickup queue and logistics status in the backend."
              flow={discussTransit}
              icon={<Car className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="rounded-[1.5rem] border-slate-100 bg-white shadow-sm">
      <CardContent className="p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}
