'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

import { ebenesaidInfo } from '@/ai/flows/ebenesaid-info-flow';
import { SpecialistChat } from '@/components/SpecialistChat';
import { PageHeader } from '@/components/layout/page-header';
import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type UniversityStudent = {
  id: number;
  name: string;
  email: string;
  country: string;
  isActive: boolean;
  hasPaid: boolean;
  onboardingCompleted: boolean;
  totalTasks: number;
  completedTasks: number;
};

type UniversitySummary = {
  students: UniversityStudent[];
  universityName: string;
  metrics: {
    totalStudents: number;
    paidStudents: number;
    activeStudents: number;
    onboardingCompleted: number;
  };
};

export default function UniversityDashboardPage() {
  const [data, setData] = useState<UniversitySummary | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/university/summary', { credentials: 'include' })
      .then(async res => {
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Failed to load university dashboard.');
        setData(payload);
      })
      .catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load university dashboard.'));
  }, []);

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <PageHeader
          title="University Dashboard"
          subtitle={data?.universityName || 'Partner university operations'}
          actions={
            <>
              <Button variant="outline" size="sm" className="rounded-xl" asChild>
                <Link href="/university/students">Students</Link>
              </Button>
              <Button size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-700" asChild>
                <Link href="/university/chat">Chat</Link>
              </Button>
            </>
          }
        />

        {status ? <p className="text-sm text-slate-600">{status}</p> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Students" value={data?.metrics.totalStudents ?? 0} />
          <MetricCard label="Active" value={data?.metrics.activeStudents ?? 0} />
          <MetricCard label="Paid" value={data?.metrics.paidStudents ?? 0} />
          <MetricCard label="Onboarded" value={data?.metrics.onboardingCompleted ?? 0} />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-black">Linked Students</CardTitle>
              <Button variant="outline" className="rounded-xl" asChild>
                <Link href="/university/students">Open Registry</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.students?.length ? (
                data.students.slice(0, 6).map(student => (
                  <div key={student.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-black text-slate-900">{student.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                        {student.country || 'No country'} | {student.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{student.isActive ? 'Active' : 'Inactive'}</Badge>
                      <Badge>{student.hasPaid ? 'Paid' : 'Unpaid'}</Badge>
                      <span className="text-sm font-bold text-slate-600">
                        {student.completedTasks}/{student.totalTasks} tasks
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  No real students are linked to this university account yet.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-5">
            <SpecialistChat
              title="Academic Advisor"
              specialty="Student Enrollment & Compliance"
              initialMessage="I can help you interpret the real student records and onboarding status now loaded from the backend."
              flow={ebenesaidInfo}
              icon={<GraduationCap className="h-4 w-4" />}
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
