'use client';

import { useEffect, useState } from 'react';
import { Briefcase, Plus, Sparkles, Users } from 'lucide-react';

import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type JobRecord = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  category: string;
  requirements: string;
  status: string;
  applications: number;
};

type ApplicantRecord = {
  applicationId: number;
  jobTitle: string;
  studentName: string;
  email: string;
  country: string;
  status: string;
  appliedAt: string;
};

const emptyForm = {
  title: '',
  company: '',
  location: '',
  salary: '',
  type: 'Part-time',
  description: '',
  category: '',
  requirements: '',
  status: 'Open',
};

export default function JobPartnerJobsPage() {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    const res = await fetch('/api/job-partner/jobs', { credentials: 'include' });
    const body = await res.json();
    if (!res.ok) {
      throw new Error(body.error || 'Failed to load employer hiring data.');
    }
    setJobs(body.jobs ?? []);
    setApplicants(body.applicants ?? []);
  }

  useEffect(() => {
    loadData().catch((error) => setStatus(error instanceof Error ? error.message : 'Failed to load employer hiring data.'));
  }, []);

  async function createJob() {
    setSaving(true);
    setStatus(null);

    const res = await fetch('/api/job-partner/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });
    const body = await res.json();
    setSaving(false);

    if (!res.ok) {
      setStatus(body.error || 'Failed to create job.');
      return;
    }

    setJobs(body.jobs ?? []);
    setForm(emptyForm);
    setStatus('Job listing created successfully.');
  }

  async function updateJobStatus(job: JobRecord, nextStatus: string) {
    const res = await fetch('/api/job-partner/jobs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        listingId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: job.type,
        description: job.description,
        category: job.category,
        requirements: job.requirements,
        status: nextStatus,
      }),
    });
    const body = await res.json();
    if (!res.ok) {
      setStatus(body.error || 'Failed to update job status.');
      return;
    }

    setJobs(body.jobs ?? []);
    setStatus(`Job marked as ${nextStatus.toLowerCase()}.`);
  }

  async function updateApplicantStatus(applicationId: number, nextStatus: string) {
    const res = await fetch('/api/job-partner/jobs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        mode: 'application',
        applicationId,
        status: nextStatus,
      }),
    });
    const body = await res.json();
    if (!res.ok) {
      setStatus(body.error || 'Failed to update applicant status.');
      return;
    }

    setApplicants(body.applicants ?? []);
    setStatus(`Applicant moved to ${nextStatus.toLowerCase()}.`);
  }

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="space-y-1 border-b border-slate-100 pb-5">
          <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
            Employer Node - Hiring Console
          </Badge>
          <h1 className="text-xl font-black text-slate-900">Job Listings</h1>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Create employer roles, keep openings current, and move applicants through your hiring stages.
          </p>
        </div>

        {status && <p className="text-sm text-slate-600">{status}</p>}

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <Plus className="h-4 w-4 text-primary" /> Create Job Listing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Role Title"><Input value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} /></Field>
              <Field label="Company"><Input value={form.company} onChange={(e) => setForm((current) => ({ ...current, company: e.target.value }))} /></Field>
              <Field label="Location"><Input value={form.location} onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))} /></Field>
              <Field label="Salary"><Input value={form.salary} onChange={(e) => setForm((current) => ({ ...current, salary: e.target.value }))} /></Field>
              <Field label="Role Type">
                <Select value={form.type} onValueChange={(value) => setForm((current) => ({ ...current, type: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select role type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Category"><Input value={form.category} onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))} /></Field>
              <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} className="min-h-[96px]" /></Field>
              <Field label="Requirements"><Textarea value={form.requirements} onChange={(e) => setForm((current) => ({ ...current, requirements: e.target.value }))} className="min-h-[96px]" /></Field>
              <Button className="w-full rounded-xl bg-green-700 hover:bg-green-800" onClick={createJob} disabled={saving}>
                <Briefcase className="mr-2 h-4 w-4" /> {saving ? 'Creating...' : 'Create Job'}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-8">
            <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-black">Managed Openings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {jobs.length ? jobs.map((job) => (
                  <div key={job.id} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-black text-slate-900">{job.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                          {job.company} | {job.location} | {job.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{job.status}</Badge>
                        <span className="text-sm font-bold text-slate-600">{job.applications} applicants</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{job.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="outline" className="rounded-xl" onClick={() => updateJobStatus(job, job.status === 'Open' ? 'Closed' : 'Open')}>
                        {job.status === 'Open' ? 'Close Job' : 'Reopen Job'}
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                    No employer job listings have been created yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-black">
                  <Users className="h-4 w-4 text-primary" /> Applicant Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {applicants.length ? applicants.map((applicant) => (
                  <div key={applicant.applicationId} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-black text-slate-900">{applicant.studentName}</p>
                        <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                          {applicant.jobTitle} | {applicant.email} | {applicant.country || 'No country'}
                        </p>
                      </div>
                      <Badge variant="outline">{applicant.status}</Badge>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['Applied', 'Shortlisted', 'Interview', 'Accepted'].map((nextStatus) => (
                        <Button
                          key={nextStatus}
                          variant={applicant.status === nextStatus ? 'default' : 'outline'}
                          className={applicant.status === nextStatus ? 'rounded-xl bg-green-700 hover:bg-green-800' : 'rounded-xl'}
                          onClick={() => updateApplicantStatus(applicant.applicationId, nextStatus)}
                        >
                          {nextStatus === 'Shortlisted' && <Sparkles className="mr-2 h-4 w-4" />}
                          {nextStatus}
                        </Button>
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                    Applicants will appear here as students apply to your listed roles.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
