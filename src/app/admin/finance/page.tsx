'use client';

import { useEffect, useState, type ReactNode } from "react";
import { Activity, DollarSign, Receipt } from "lucide-react";

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SummaryResponse = {
  overview: {
    platformRevenue: number;
  };
  finance: {
    platformRevenue: number;
    totalPayments: number;
  };
};

export default function FinancialAnalysisPage() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/summary", { credentials: "include" })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Failed to load finance data.");
        setData(body);
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : "Failed to load finance data."));
  }, []);

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="space-y-1 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-400/20 bg-emerald-50 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-emerald-600">
              Financial Node - Live Ledger
            </Badge>
          </div>
          <h1 className="text-xl font-black text-slate-900">Financial Analysis</h1>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Real platform payment totals pulled from backend records.</p>
        </div>

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard icon={<DollarSign className="h-5 w-5" />} label="Platform Revenue" value={`EUR ${data?.finance.platformRevenue ?? 0}`} />
          <MetricCard icon={<Receipt className="h-5 w-5" />} label="Completed Payments" value={String(data?.finance.totalPayments ?? 0)} />
          <MetricCard icon={<Activity className="h-5 w-5" />} label="Revenue Status" value={(data?.finance.totalPayments ?? 0) > 0 ? "Live" : "No payments yet"} />
        </div>

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black">Ledger Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>Total revenue is calculated from recorded entries in `student_platform_payments`.</p>
            <p>If this page shows zero, it means no real payment record has been saved yet in the backend.</p>
          </CardContent>
        </Card>
      </div>
    </SidebarShell>
  );
}

function MetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Card className="rounded-2xl border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">{icon}</div>
      <p className="text-xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    </Card>
  );
}
