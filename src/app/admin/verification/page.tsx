'use client';

import { useEffect, useState } from 'react';

import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type VerificationData = {
  housing: Array<{ id: number; title: string; location: string; status: string; createdAt: string }>;
  partnerDocuments: Array<{
    id: number;
    name: string;
    type: string;
    fileUrl: string;
    status: string;
    notes: string;
    partnerName: string;
    partnerEmail: string;
    businessName: string;
    partnerType: string;
    createdAt: string;
  }>;
  jobs: Array<{ id: number }>;
  identities: Array<{ id: number }>;
  institutions: Array<{ id: number }>;
  communities: Array<{ id: number; name: string; description: string; createdBy: string; createdAt: string; status: string; rejectionReason: string }>;
};

export default function VerificationQueuePage() {
  const [data, setData] = useState<VerificationData | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function loadVerification() {
    const res = await fetch('/api/admin/verification', { credentials: 'include' });
    const payload = await res.json();
    if (!res.ok) {
      throw new Error(payload.error || 'Failed to load verification queue.');
    }
    setData(payload);
  }

  useEffect(() => {
    loadVerification().catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load verification queue.'));
  }, []);

  async function reviewCommunityRequest(circleId: number, decision: 'approved' | 'rejected') {
    try {
      const res = await fetch('/api/admin/community-circles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          circleId,
          decision,
          rejectionReason: decision === 'rejected' ? 'Rejected from admin verification queue.' : '',
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || 'Failed to review community request.');
      }
      await loadVerification();
      setStatus(`Community request ${decision}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to review community request.');
    }
  }

  async function reviewPartnerDocument(documentId: number, decision: 'approved' | 'rejected') {
    try {
      const res = await fetch('/api/admin/verification', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          documentId,
          decision,
          notes: decision === 'approved' ? 'Credential approved for partner operations.' : 'Please upload a clearer or corrected credential.',
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || 'Failed to review partner credential.');
      }
      setData(payload);
      setStatus(`Partner credential ${decision}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to review partner credential.');
    }
  }

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="border-b border-slate-100 pb-5">
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-[8px] font-black uppercase tracking-widest text-primary">
            Verification Queue
          </Badge>
          <h1 className="mt-3 text-xl font-black text-slate-900">Admin Verification</h1>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            This queue now shows only real backend records and empty states where no live data exists.
          </p>
        </div>

        {status ? <p className="text-sm text-slate-600">{status}</p> : null}

        <Tabs defaultValue="housing">
          <TabsList className="h-auto rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
            <TabsTrigger value="housing" className="rounded-xl">Housing</TabsTrigger>
            <TabsTrigger value="partner-documents" className="rounded-xl">Partner Docs</TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-xl">Jobs</TabsTrigger>
            <TabsTrigger value="identities" className="rounded-xl">Identities</TabsTrigger>
            <TabsTrigger value="institutions" className="rounded-xl">Institutions</TabsTrigger>
            <TabsTrigger value="communities" className="rounded-xl">Communities</TabsTrigger>
          </TabsList>

          <TabsContent value="housing" className="mt-6">
            <QueueCard
              title="Pending Housing Listings"
              emptyText="No real pending housing listings exist right now."
              items={
                data?.housing?.map(item => (
                  <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-black text-slate-900">{item.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                        {item.location} | {item.status}
                      </p>
                    </div>
                    <Badge variant="outline">{new Date(item.createdAt).toLocaleString()}</Badge>
                  </div>
                )) ?? []
              }
            />
          </TabsContent>

          <TabsContent value="partner-documents" className="mt-6">
            <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-black">Partner Credential Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.partnerDocuments?.length ? (
                  data.partnerDocuments.map(item => (
                    <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-black text-slate-900">{item.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                            {item.businessName} | {item.partnerType} | {item.type}
                          </p>
                          <p className="mt-2 text-sm text-slate-600">{item.partnerName} - {item.partnerEmail}</p>
                          {item.notes ? <p className="mt-2 text-sm text-slate-500">{item.notes}</p> : null}
                        </div>
                        <Badge variant="outline" className={item.status === 'Approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : item.status === 'Rejected' ? 'border-red-200 bg-red-50 text-red-700' : 'border-amber-200 bg-amber-50 text-amber-700'}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button asChild variant="outline" className="rounded-xl">
                          <a href={item.fileUrl} target="_blank" rel="noreferrer">Open document</a>
                        </Button>
                        <Button variant="outline" className="rounded-xl" onClick={() => reviewPartnerDocument(item.id, 'rejected')}>
                          Reject
                        </Button>
                        <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={() => reviewPartnerDocument(item.id, 'approved')}>
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                    No partner credentials are waiting for review right now.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="mt-6">
            <QueueCard title="Pending Jobs" emptyText="There is no real job verification queue in the backend yet." items={[]} />
          </TabsContent>

          <TabsContent value="identities" className="mt-6">
            <QueueCard title="Identity Reviews" emptyText="There is no real identity verification queue in the backend yet." items={[]} />
          </TabsContent>

          <TabsContent value="institutions" className="mt-6">
            <QueueCard title="Institution Reviews" emptyText="There is no real institution verification queue in the backend yet." items={[]} />
          </TabsContent>

          <TabsContent value="communities" className="mt-6">
            <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-black">Community Approvals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.communities?.length ? (
                  data.communities.map(item => (
                    <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                      <p className="font-black text-slate-900">{item.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                        Requested by {item.createdBy} | {item.createdAt}
                      </p>
                      <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" className="rounded-xl" onClick={() => reviewCommunityRequest(item.id, 'rejected')}>
                          Reject
                        </Button>
                        <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={() => reviewCommunityRequest(item.id, 'approved')}>
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                    No pending community approvals exist right now.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarShell>
  );
}

function QueueCard({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: React.ReactNode[];
  emptyText: string;
}) {
  return (
    <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-black">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length ? items : <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">{emptyText}</div>}
      </CardContent>
    </Card>
  );
}
