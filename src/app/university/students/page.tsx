'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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

export default function StudentRegistryPage() {
  const [students, setStudents] = useState<UniversityStudent[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/university/summary', { credentials: 'include' })
      .then(async res => {
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Failed to load students.');
        setStudents(payload.students ?? []);
      })
      .catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load students.'));
  }, []);

  const filteredStudents = useMemo(
    () =>
      students.filter(student =>
        `${student.name} ${student.email} ${student.country}`.toLowerCase().includes(query.toLowerCase())
      ),
    [students, query]
  );

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="border-b border-slate-100 pb-5">
          <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-[8px] font-black uppercase tracking-widest text-indigo-600">
            Student Registry
          </Badge>
          <h1 className="mt-3 text-xl font-black text-slate-900">University Students</h1>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            These student records come directly from the users table and linked onboarding data.
          </p>
        </div>

        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search students by name, email, or country..." className="h-11 rounded-xl bg-slate-50" />
        {status ? <p className="text-sm text-slate-600">{status}</p> : null}

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-black">Real Student Records</CardTitle>
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href="/university/chat">Open Chat</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredStudents.length ? (
              filteredStudents.map(student => (
                <div key={student.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-black text-slate-900">{student.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                      {student.country || 'No country'} | {student.email}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline">{student.isActive ? 'Active' : 'Inactive'}</Badge>
                    <Badge>{student.hasPaid ? 'Paid' : 'Unpaid'}</Badge>
                    <Badge>{student.onboardingCompleted ? 'Onboarded' : 'Not onboarded'}</Badge>
                    <span className="text-sm font-bold text-slate-600">
                      {student.completedTasks}/{student.totalTasks} tasks
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                No real students matched this university account or your search yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarShell>
  );
}
