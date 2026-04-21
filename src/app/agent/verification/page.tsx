'use client';

import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Lock, Upload } from 'lucide-react';
import { SpecialistChat } from '@/components/SpecialistChat';
import { discussDocuments } from '@/ai/flows/document-specialist-flow';

export default function AgentVerificationPage() {
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
              This page no longer shows placeholder credentials. It will display only real verification records once backend support is added.
            </p>
          </div>
          <Button size="sm" className="rounded-xl bg-green-700 hover:bg-green-800">
            <Upload className="mr-2 h-4 w-4" /> Upload Credential
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SpecialistChat
              title="Compliance Specialist"
              specialty="Security & Credential Guidance"
              initialMessage="I can explain which verification documents are typically required, but this page will stay empty until real credentials are uploaded and tracked by the backend."
              flow={discussDocuments}
              icon={<Lock className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-black">Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>No real agent verification records exist in the backend for this account yet.</p>
                <p>When document tracking is connected server-side, uploaded credentials will appear here for admin review.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black">Verification Vault</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
              <FileText className="mx-auto mb-4 h-8 w-8 text-slate-300" />
              No real credentials have been uploaded yet.
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarShell>
  );
}

