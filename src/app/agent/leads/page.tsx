'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, MessageSquare, Users } from 'lucide-react';

import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Listing = {
  id: number;
  title: string;
  location: string;
  status: string;
  leads: number;
};

export default function BookingLeadsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/agent/summary', { credentials: 'include' })
      .then(async res => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || 'Failed to load lead data.');
        }
        setListings(payload.listings ?? []);
      })
      .catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load lead data.'));
  }, []);

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="border-b border-slate-100 pb-5">
          <Badge variant="outline" className="border-green-200 bg-green-50 text-[8px] font-black uppercase tracking-widest text-green-700">
            Lead Tracking
          </Badge>
          <h1 className="mt-3 text-xl font-black text-slate-900">Lead Totals</h1>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            This page only shows real lead counts already stored on your listings.
          </p>
        </div>

        {status ? <p className="text-sm text-slate-600">{status}</p> : null}

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-black">Listings With Lead Totals</CardTitle>
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href="/agent/listings">Manage Listings</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {listings.length ? (
              listings.map(listing => (
                <div key={listing.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-black text-slate-900">{listing.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{listing.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{listing.status}</Badge>
                    <span className="font-black text-primary">{listing.leads} leads</span>
                    <Button variant="outline" className="rounded-xl" asChild>
                      <Link href="/messages">
                        <MessageSquare className="mr-2 h-4 w-4" /> Message
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                No individual lead records exist yet. When real lead counts are stored on listings, they will appear here.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard icon={<Users className="h-4 w-4" />} title="What is live here?" text="Lead counts attached to listings in the backend." />
          <InfoCard icon={<Home className="h-4 w-4" />} title="Where to update?" text="Use the listing manager for your property inventory." />
          <InfoCard icon={<MessageSquare className="h-4 w-4" />} title="Messaging" text="Use platform messages for direct follow-up with users." />
        </div>
      </div>
    </SidebarShell>
  );
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card className="rounded-[1.5rem] border-slate-100 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="mb-3 inline-flex rounded-xl bg-green-50 p-3 text-green-700">{icon}</div>
        <p className="font-black text-slate-900">{title}</p>
        <p className="mt-2 text-sm text-slate-500">{text}</p>
      </CardContent>
    </Card>
  );
}
