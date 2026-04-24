'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';

import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type StudentTaskDurationBand = 'under_3_months' | 'over_3_months';

type StudentTaskTemplate = {
  id: number;
  title: string;
  description: string;
  category: string;
  href: string;
  sortOrder: number;
  durationBand: StudentTaskDurationBand;
  isActive: boolean;
};

type TemplatesResponse = {
  templates?: Record<StudentTaskDurationBand, StudentTaskTemplate[]>;
  error?: string;
};

const emptyTemplate = {
  durationBand: 'under_3_months' as StudentTaskDurationBand,
  title: '',
  description: '',
  category: 'Legal',
  href: '/docs',
  sortOrder: 0,
  isActive: true,
};

export default function AdminStudentTaskTemplatesPage() {
  const [templates, setTemplates] = useState<Record<StudentTaskDurationBand, StudentTaskTemplate[]>>({
    under_3_months: [],
    over_3_months: [],
  });
  const [createForm, setCreateForm] = useState(emptyTemplate);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadTemplates() {
    const res = await fetch('/api/admin/task-templates', { credentials: 'include' });
    const data: TemplatesResponse = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load task templates.');
    }
    setTemplates(data.templates ?? { under_3_months: [], over_3_months: [] });
  }

  useEffect(() => {
    loadTemplates()
      .catch(error => setStatus(error instanceof Error ? error.message : 'Failed to load task templates.'))
      .finally(() => setLoading(false));
  }, []);

  const totalTemplates = useMemo(
    () => templates.under_3_months.length + templates.over_3_months.length,
    [templates]
  );

  async function createTemplate() {
    setStatus(null);
    const res = await fetch('/api/admin/task-templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(createForm),
    });
    const data: TemplatesResponse = await res.json();
    if (!res.ok) {
      setStatus(data.error || 'Failed to create template.');
      return;
    }
    setTemplates(data.templates ?? templates);
    setCreateForm({
      ...emptyTemplate,
      durationBand: createForm.durationBand,
      category: createForm.category,
      href: createForm.href,
      sortOrder: createForm.sortOrder + 1,
    });
    setStatus('Student checklist template created.');
  }

  async function saveTemplate(template: StudentTaskTemplate) {
    const res = await fetch('/api/admin/task-templates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(template),
    });
    const data: TemplatesResponse = await res.json();
    if (!res.ok) {
      setStatus(data.error || 'Failed to update template.');
      return;
    }
    setTemplates(data.templates ?? templates);
    setStatus('Student checklist template updated.');
  }

  async function deleteTemplate(id: number) {
    const res = await fetch('/api/admin/task-templates', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });
    const data: TemplatesResponse = await res.json();
    if (!res.ok) {
      setStatus(data.error || 'Failed to delete template.');
      return;
    }
    setTemplates(data.templates ?? templates);
    setStatus('Student checklist template deleted.');
  }

  function updateTemplateInState(
    durationBand: StudentTaskDurationBand,
    id: number,
    patch: Partial<StudentTaskTemplate>
  ) {
    setTemplates(current => ({
      ...current,
      [durationBand]: current[durationBand].map(template =>
        template.id === id ? { ...template, ...patch } : template
      ),
    }));
  }

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
              Student Checklist Control
            </Badge>
            <h1 className="text-xl font-black text-slate-900">Student Task Templates</h1>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Admin-defined checklist items now drive what students receive after they select their stay period.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm">
            {totalTemplates} default checklist items
          </div>
        </div>

        {status ? <p className="text-sm font-medium text-slate-600">{status}</p> : null}

        <div className="grid gap-6 xl:grid-cols-12">
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm xl:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <Plus className="h-4 w-4 text-primary" /> Add Default Checklist Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TemplateFields value={createForm} onChange={patch => setCreateForm(current => ({ ...current, ...patch }))} />
              <Button className="w-full rounded-xl bg-green-700 hover:bg-green-800" onClick={createTemplate}>
                <Plus className="mr-2 h-4 w-4" /> Create Template
              </Button>
              <p className="text-xs text-slate-500">
                These items are copied into each student account after the student selects the stay period that matches the journey length.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6 xl:col-span-8">
            {loading ? (
              <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
                <CardContent className="p-8 text-center text-sm text-slate-500">Loading task templates...</CardContent>
              </Card>
            ) : (
              (['under_3_months', 'over_3_months'] as StudentTaskDurationBand[]).map((band) => (
                <Card key={band} className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
                  <CardHeader className="border-b border-slate-50">
                    <CardTitle className="text-base font-black text-slate-900">
                      {band === 'under_3_months' ? 'Under 3 Months' : '3 Months Or More'}
                    </CardTitle>
                    <p className="text-sm text-slate-500">
                      Students in this stay band will receive these checklist defaults automatically.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6">
                    {templates[band].length ? (
                      templates[band].map(template => (
                        <div key={template.id} className="rounded-3xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5">
                          <TemplateFields
                            value={template}
                            onChange={patch => updateTemplateInState(band, template.id, patch)}
                          />
                          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                            <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={() => saveTemplate(template)}>
                              <Save className="mr-2 h-4 w-4" /> Save
                            </Button>
                            <Button variant="outline" className="rounded-xl text-red-600" onClick={() => deleteTemplate(template.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                        No templates published for this stay period yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function TemplateFields({
  value,
  onChange,
}: {
  value: {
    durationBand: StudentTaskDurationBand;
    title: string;
    description: string;
    category: string;
    href: string;
    sortOrder: number;
    isActive: boolean;
  };
  onChange: (patch: Partial<{
    durationBand: StudentTaskDurationBand;
    title: string;
    description: string;
    category: string;
    href: string;
    sortOrder: number;
    isActive: boolean;
  }>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field label="Stay Period">
        <Select value={value.durationBand} onValueChange={(next) => onChange({ durationBand: next as StudentTaskDurationBand })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="under_3_months">Under 3 Months</SelectItem>
            <SelectItem value="over_3_months">3 Months Or More</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field label="Task Title">
        <Input value={value.title} onChange={(event) => onChange({ title: event.target.value })} />
      </Field>

      <Field label="Description">
        <Textarea value={value.description} onChange={(event) => onChange({ description: event.target.value })} className="min-h-[96px]" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <Input value={value.category} onChange={(event) => onChange({ category: event.target.value })} />
        </Field>
        <Field label="Route">
          <Input value={value.href} onChange={(event) => onChange({ href: event.target.value })} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sort Order">
          <Input
            type="number"
            value={value.sortOrder}
            onChange={(event) => onChange({ sortOrder: Number(event.target.value) || 0 })}
          />
        </Field>
        <Field label="Status">
          <Select value={value.isActive ? 'active' : 'inactive'} onValueChange={(next) => onChange({ isActive: next === 'active' })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
    </div>
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
