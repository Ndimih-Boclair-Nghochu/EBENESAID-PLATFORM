'use client';

import { useEffect, useState } from 'react';
import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Lock, ShieldCheck, Upload } from 'lucide-react';
import { SpecialistChat } from '@/components/SpecialistChat';
import { discussDocuments } from '@/ai/flows/document-specialist-flow';

type VerificationDocument = {
  id: number;
  name: string;
  type: string;
  fileUrl: string;
  status: string;
  notes: string;
  createdAt: string;
  reviewedAt: string | null;
};

export default function AgentVerificationPage() {
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [form, setForm] = useState({ name: '', type: 'Business registration', fileUrl: '' });
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadDocuments() {
    const res = await fetch('/api/agent/verification', { credentials: 'include' });
    const payload = await res.json();
    if (!res.ok) {
      throw new Error(payload.error || 'Failed to load verification documents.');
    }
    setDocuments(payload.documents ?? []);
  }

  useEffect(() => {
    loadDocuments().catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load verification documents.'));
  }, []);

  async function submitDocument() {
    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch('/api/agent/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || 'Failed to save verification document.');
      }
      setDocuments(payload.documents ?? []);
      setForm({ name: '', type: 'Business registration', fileUrl: '' });
      setStatus('Credential submitted for admin review.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to save verification document.');
    } finally {
      setSaving(false);
    }
  }

  const approvedCount = documents.filter(item => item.status.toLowerCase() === 'approved').length;
  const pendingCount = documents.filter(item => item.status.toLowerCase() === 'pending').length;

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <Badge variant="outline" className="border-green-200 bg-green-50 text-[8px] font-black uppercase tracking-widest text-green-700">
              Agent Verification
            </Badge>
            <h1 className="text-xl font-black text-slate-900">Compliance Records</h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Maintain the business credentials used to verify housing listings and partner trust status.
            </p>
          </div>
          <Button size="sm" className="rounded-xl bg-green-700 hover:bg-green-800" onClick={submitDocument} disabled={saving}>
            <Upload className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Submit Credential'}
          </Button>
        </div>

        {status ? <p className="text-sm font-medium text-slate-600">{status}</p> : null}

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SpecialistChat
              title="Compliance Specialist"
              specialty="Security & Credential Guidance"
              initialMessage="Hello, I am EBENESAID AI. I can help housing partners prepare clean compliance records, explain what a business registration or landlord authority document is used for, and guide you toward the right verification evidence for accommodation operations."
              flow={discussDocuments}
              icon={<Lock className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-black">Current Status</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-slate-600">
                <StatusMetric icon={<ShieldCheck className="h-4 w-4" />} label="Approved" value={approvedCount} />
                <StatusMetric icon={<FileText className="h-4 w-4" />} label="Pending Review" value={pendingCount} />
                <StatusMetric icon={<Lock className="h-4 w-4" />} label="Total Credentials" value={documents.length} />
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black">Verification Vault</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 md:grid-cols-[1fr_220px_1fr_auto] md:items-end">
              <div className="space-y-2">
                <Label>Document name</Label>
                <Input value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} placeholder="Company registration certificate" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={value => setForm(current => ({ ...current, type: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Business registration">Business registration</SelectItem>
                    <SelectItem value="Landlord authority">Landlord authority</SelectItem>
                    <SelectItem value="Property ownership">Property ownership</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Tax document">Tax document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Secure file link</Label>
                <Input value={form.fileUrl} onChange={event => setForm(current => ({ ...current, fileUrl: event.target.value }))} placeholder="https://..." />
              </div>
              <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={submitDocument} disabled={saving}>
                Submit
              </Button>
            </div>

            {documents.length ? (
              <div className="grid gap-3">
                {documents.map(document => (
                  <div key={document.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-black text-slate-900">{document.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                        {document.type} | Submitted {new Date(document.createdAt).toLocaleDateString('en-GB')}
                      </p>
                      {document.notes ? <p className="mt-2 text-sm text-slate-500">{document.notes}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm" className="rounded-xl">
                        <a href={document.fileUrl} target="_blank" rel="noreferrer">View file</a>
                      </Button>
                      <Badge variant="outline" className={document.status === 'Approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}>
                        {document.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
                <FileText className="mx-auto mb-4 h-8 w-8 text-slate-300" />
                Submit your first business credential so EBENESAID operations can review your housing partner account.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarShell>
  );
}

function StatusMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-3">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50 text-green-700">{icon}</span>
        <span className="text-xs font-bold text-slate-500">{label}</span>
      </div>
      <span className="text-lg font-black text-slate-900">{value}</span>
    </div>
  );
}
