'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Home, MessageSquare, Plus, ShieldCheck, Users } from 'lucide-react';

import { discussHousing } from '@/ai/flows/housing-specialist-flow';
import { SpecialistChat } from '@/components/SpecialistChat';
import { PageHeader } from '@/components/layout/page-header';
import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Listing = {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  status: string;
  leads: number;
  trustScore: number;
};

type AgentSummary = {
  listings: Listing[];
  metrics: {
    activeListings: number;
    totalLeads: number;
    verifiedCount: number;
    pendingCount: number;
    revenueEstimate: number;
  };
  partnerProfile: { businessName: string; contactPerson: string; commissionPercent: number | null } | null;
  finance: { grossAmountEur: number; deductionAmountEur: number; netAmountEur: number };
  commissionPercent: number;
};

export default function AgentDashboardPage() {
  const [data, setData] = useState<AgentSummary | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/agent/summary', { credentials: 'include' })
      .then(async res => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || 'Failed to load agent dashboard.');
        }
        setData(payload);
      })
      .catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load agent dashboard.'));
  }, []);

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <PageHeader
          title="Property Dashboard"
          subtitle="Live housing operations"
          actions={
            <>
              <Button variant="outline" size="sm" className="rounded-xl" asChild>
                <Link href="/agent/listings">Manage Listings</Link>
              </Button>
              <Button size="sm" className="rounded-xl bg-green-700 hover:bg-green-800" asChild>
                <Link href="/agent/listings">
                  <Plus className="mr-2 h-4 w-4" /> Add Listing
                </Link>
              </Button>
            </>
          }
        />

        {status ? <p className="text-sm text-slate-600">{status}</p> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Listings" value={data?.metrics.activeListings ?? 0} href="/agent/listings" icon={<Home className="h-4 w-4" />} />
          <MetricCard label="Lead Count" value={data?.metrics.totalLeads ?? 0} href="/agent/leads" icon={<Users className="h-4 w-4" />} />
          <MetricCard label="Verified" value={data?.metrics.verifiedCount ?? 0} href="/agent/listings" icon={<ShieldCheck className="h-4 w-4" />} />
          <MetricCard
            label="Revenue Estimate"
            value={`EUR ${(data?.metrics.revenueEstimate ?? 0).toFixed(2)}`}
            href="/agent/listings"
            icon={<ArrowRight className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-black">My Real Listings</CardTitle>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                  Records are loaded from the property listings table.
                </p>
              </div>
              <Button variant="outline" className="rounded-xl" asChild>
                <Link href="/agent/listings">Open Listing Manager</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.listings?.length ? (
                data.listings.slice(0, 6).map(listing => (
                  <div key={listing.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-black text-slate-900">{listing.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                        {listing.location} | {listing.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{listing.status}</Badge>
                      <span className="text-sm font-bold text-slate-600">{listing.leads} leads</span>
                      <span className="font-black text-primary">EUR {listing.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  No real property listings exist yet for this agent account.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-4">
            <SpecialistChat
              title="Housing Specialist"
              specialty="Property & Tenant Management"
              initialMessage="I can help you analyze your real listings, compliance state, and demand patterns."
              flow={discussHousing}
              icon={<Home className="h-4 w-4" />}
            />
            <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-black">Business Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p className="font-black text-slate-900">{data?.partnerProfile?.businessName || 'Housing partner account'}</p>
                <p>Contact: {data?.partnerProfile?.contactPerson || 'Not set yet'}</p>
                <p>Commission deduction: {Number(data?.commissionPercent ?? 0).toFixed(2)}%</p>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-black text-slate-900">EUR {Number(data?.finance.grossAmountEur ?? 0).toFixed(0)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">Gross</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900">EUR {Number(data?.finance.deductionAmountEur ?? 0).toFixed(0)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">Deduction</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-green-700">EUR {Number(data?.finance.netAmountEur ?? 0).toFixed(0)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">Net</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-slate-100 bg-slate-900 p-6 text-white shadow-xl">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-green-300">Quick Access</p>
              <div className="mt-4 grid gap-2">
                <Button variant="secondary" className="justify-start rounded-xl" asChild>
                  <Link href="/agent/listings">Listings</Link>
                </Button>
                <Button variant="secondary" className="justify-start rounded-xl" asChild>
                  <Link href="/agent/leads">Lead Totals</Link>
                </Button>
                <Button variant="secondary" className="justify-start rounded-xl" asChild>
                  <Link href="/messages">
                    <MessageSquare className="mr-2 h-4 w-4" /> Messages
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function MetricCard({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: number | string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Card className="rounded-[1.5rem] border-slate-100 bg-white shadow-sm transition hover:border-green-200 hover:shadow-md">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
          </div>
          <div className="rounded-xl bg-green-50 p-3 text-green-700">{icon}</div>
        </CardContent>
      </Card>
    </Link>
  );
}
