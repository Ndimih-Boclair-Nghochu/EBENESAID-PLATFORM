'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
  phone: string;
  email: string;
  country: string;
};

export default function PickupRegistryPage() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  async function loadPickups() {
    const res = await fetch('/api/transport/pickups', { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load pickup jobs.');
    }
    setPickups(data.pickups ?? []);
  }

  useEffect(() => {
    loadPickups().catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load pickup jobs.'));
  }, []);

  async function updateStatus(bookingId: number, pickupStatus: string) {
    setSavingId(bookingId);
    setStatus(null);
    try {
      const res = await fetch('/api/transport/pickups', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookingId, pickupStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update pickup status.');
      }
      setPickups(data.pickups ?? []);
      setStatus(`Booking #${bookingId} updated to ${pickupStatus}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to update pickup status.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="border-b border-slate-100 pb-5">
          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-[8px] font-black uppercase tracking-widest text-blue-600">
            Pickup Registry
          </Badge>
          <h1 className="mt-3 text-xl font-black text-slate-900">Transport Jobs</h1>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            These jobs are loaded from real arrival bookings saved by students.
          </p>
        </div>

        {status ? <p className="text-sm text-slate-600">{status}</p> : null}

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-black">Real Pickup Jobs</CardTitle>
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href="/messages">Platform Messages</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {pickups.length ? (
              pickups.map(pickup => (
                <div key={pickup.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-black text-slate-900">{pickup.studentName}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                        {pickup.country || 'No country'} | {pickup.airportCode} | {pickup.destination}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{pickup.email} {pickup.phone ? `| ${pickup.phone}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{pickup.pickupStatus}</Badge>
                      <Badge>{pickup.pickupBooked ? 'Booked' : 'Not booked'}</Badge>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" className="rounded-xl" disabled={savingId === pickup.id} onClick={() => updateStatus(pickup.id, 'Assigned')}>
                      Assign
                    </Button>
                    <Button variant="outline" className="rounded-xl" disabled={savingId === pickup.id} onClick={() => updateStatus(pickup.id, 'In Transit')}>
                      In Transit
                    </Button>
                    <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700" disabled={savingId === pickup.id} onClick={() => updateStatus(pickup.id, 'Completed')}>
                      Complete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                No real arrival bookings exist yet, so there are no pickup jobs to dispatch.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarShell>
  );
}
