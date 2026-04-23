'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Building2, CheckCircle2, Sparkles, Users } from 'lucide-react';

import { discussCareers } from '@/ai/flows/career-specialist-flow';
import { SpecialistChat } from '@/components/SpecialistChat';
import { PageHeader } from '@/components/layout/page-header';
import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DashboardResponse = {
  jobs: Array<{ id: number; title: string; company: string; location: string; status: string; applications: number }>;
  applicants: Array<{ applicationId: number; jobTitle: string; studentName: string; country: string; status: string; appliedAt: string }>;
  partnerProfile: { businessName: string; contactPerson: string; commissionPercent: number | null } | null;
  finance: { transactionCount: number; grossAmountEur: number; deductionAmountEur: number; netAmountEur: number };
  commissionPercent: number;
  metrics: { totalJobs: number; openJobs: number; totalApplicants: number; shortlistedApplicants: number };
};

export default function JobPartnerDashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/job-partner/summary', { credentials: 'include' })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          throw new Error(body.error || 'Failed to load employer dashboard.');
        }
        setData(body);
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : 'Failed to load employer dashboard.'));
  }, []);

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <PageHeader
          title="Employer Dashboard"
          subtitle={data?.partnerProfile?.businessName || 'Job supplier operations'}
          actions={
            <>
              <Button variant="outline" size="sm" className="rounded-xl" asChild>
                <Link href="/job-partner/jobs">Job Listings</Link>
              </Button>
              <Button size="sm" className="rounded-xl bg-green-700 hover:bg-green-800" asChild>
                <Link href="/job-partner/jobs">Create Job</Link>
              </Button>
            </>
          }
        />

        {status && <p className="text-sm text-slate-600">{status}</p>}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Job Listings" value={data?.metrics.totalJobs ?? 0} icon={<Briefcase className="h-4 w-4" />} />
          <MetricCard label="Open Roles" value={data?.metrics.openJobs ?? 0} icon={<CheckCircle2 className="h-4 w-4" />} />
          <MetricCard label="Applicants" value={data?.metrics.totalApplicants ?? 0} icon={<Users className="h-4 w-4" />} />
          <MetricCard label="Shortlisted" value={data?.metrics.shortlistedApplicants ?? 0} icon={<Sparkles className="h-4 w-4" />} />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-black">Latest Applicants</CardTitle>
              <Button variant="outline" className="rounded-xl" asChild>
                <Link href="/job-partner/jobs">Open Hiring Console</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.applicants?.length ? (
                data.applicants.slice(0, 6).map((applicant) => (
                  <div key={applicant.applicationId} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-black text-slate-900">{applicant.studentName}</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                        {applicant.jobTitle} | {applicant.country || 'No country'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{applicant.status}</Badge>
                      <span className="text-sm font-bold text-slate-600">{applicant.appliedAt}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  No student applications have reached this employer account yet.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-5">
            <SpecialistChat
              title="Career Specialist"
              specialty="Employer Hiring Support"
              initialMessage="I can help you review job demand, applicant flow, and student-friendly role positioning."
              flow={discussCareers}
              icon={<Briefcase className="h-4 w-4" />}
            />

            <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-black">Partner Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Building2 className="h-4 w-4 text-primary" />
                  {data?.partnerProfile?.businessName || 'Employer account'}
                </div>
                <p>Contact: {data?.partnerProfile?.contactPerson || 'Not set yet'}</p>
                <p>Commission deduction: {Number(data?.commissionPercent ?? 0).toFixed(2)}%</p>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Settlement Snapshot</p>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-black text-slate-900">EUR {Number(data?.finance.grossAmountEur ?? 0).toFixed(0)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">Gross</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900">EUR {Number(data?.finance.deductionAmountEur ?? 0).toFixed(0)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">Deductions</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-green-700">EUR {Number(data?.finance.netAmountEur ?? 0).toFixed(0)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">Net</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
