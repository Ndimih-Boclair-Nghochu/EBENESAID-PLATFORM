'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Mail, Plus, Search, Users } from "lucide-react";

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Institution = {
  id: number;
  name: string;
  contactEmail: string;
  students: number;
  createdAt: string;
};

export default function InstitutionsManagementPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/institutions", { credentials: "include" })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Failed to load institutions.");
        setInstitutions(body.institutions ?? []);
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : "Failed to load institutions."));
  }, []);

  const filtered = institutions.filter((institution) =>
    `${institution.name} ${institution.contactEmail}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-indigo-400/20 bg-indigo-50 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-indigo-600">
                Institutional Node - Live Partners
              </Badge>
            </div>
            <h1 className="text-xl font-black text-slate-900">University Partners</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Real university partner accounts and linked student counts.</p>
          </div>
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700" asChild>
            <Link href="/admin/users">
              <Plus className="mr-2 h-4 w-4" /> Add University Partner
            </Link>
          </Button>
        </div>

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search institution or partner email..." className="h-11 rounded-xl bg-white pl-9" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? filtered.map((institution) => (
            <Card key={institution.id} className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <Badge variant="outline">Live Partner</Badge>
                </div>
                <CardTitle className="mt-4 text-base font-black">{institution.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-600" /> {institution.contactEmail}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-600" /> {institution.students} linked students
                </div>
                <p>Created {new Date(institution.createdAt).toLocaleDateString("en-GB")}</p>
              </CardContent>
            </Card>
          )) : (
            <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm md:col-span-2 lg:col-span-3">
              <CardContent className="p-8 text-center text-sm text-slate-500">No live university partners matched your search.</CardContent>
            </Card>
          )}
        </div>
      </div>
    </SidebarShell>
  );
}
