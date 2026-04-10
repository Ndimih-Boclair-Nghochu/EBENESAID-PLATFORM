'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ReportItem = {
  id: string;
  type: string;
  subject: string;
  reporter: string;
  target: string;
  status: string;
  desc: string;
  href: string;
  dateLabel: string;
};

export default function ReportsManagementPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/reports", { credentials: "include" })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Failed to load reports.");
        setReports(body.reports ?? []);
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : "Failed to load reports."));
  }, []);

  const filteredReports = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return reports;
    return reports.filter((report) =>
      `${report.subject} ${report.reporter} ${report.target} ${report.type}`.toLowerCase().includes(normalized)
    );
  }, [query, reports]);

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="space-y-1 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-red-400/20 bg-red-50 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-red-600">
              Incident Command - Live Reports
            </Badge>
          </div>
          <h1 className="text-xl font-black text-slate-900">Incident Reports</h1>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Real pending items from listings, community approvals, and support activity.</p>
        </div>

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search reports..." className="h-11 rounded-xl bg-white pl-9" />
        </div>

        <div className="space-y-4">
          {filteredReports.length > 0 ? filteredReports.map((report) => (
            <Card key={report.id} className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-black">{report.subject}</CardTitle>
                    <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{report.type} • {report.dateLabel}</p>
                  </div>
                  <Badge variant="outline">{report.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{report.desc}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 p-4 text-sm text-slate-600">
                    <span className="font-black text-slate-900">Reporter:</span> {report.reporter}
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-4 text-sm text-slate-600">
                    <span className="font-black text-slate-900">Target:</span> {report.target}
                  </div>
                </div>
                <Button className="rounded-xl bg-green-700 hover:bg-green-800" asChild>
                  <Link href={report.href}>
                    <ExternalLink className="mr-2 h-4 w-4" /> Open Related Queue
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )) : (
            <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <CardContent className="p-8 text-center text-sm text-slate-500">No live reports matched your search.</CardContent>
            </Card>
          )}
        </div>
      </div>
    </SidebarShell>
  );
}
