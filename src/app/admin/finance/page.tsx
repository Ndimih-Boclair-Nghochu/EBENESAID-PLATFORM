'use client';

import { useEffect, useState, type ReactNode } from "react";
import { Activity, Banknote, DollarSign, Receipt } from "lucide-react";

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SummaryResponse = {
  overview: {
    platformRevenue: number;
  };
  finance: {
    platformRevenue: number;
    totalPayments: number;
  };
};

type PricingSettings = {
  studentFeeEur: number;
  partnerDeductionPercent: number;
};

type FinanceLedger = {
  studentPayments: {
    id: number;
    studentName: string;
    studentEmail: string;
    provider: string;
    amountEur: number;
    status: string;
    reference: string;
    createdAt: string;
  }[];
  partnerTransactions: {
    id: number;
    partnerName: string;
    partnerEmail: string;
    partnerType: string;
    businessName: string;
    provider: string;
    grossAmountEur: number;
    deductionPercent: number;
    deductionAmountEur: number;
    netAmountEur: number;
    status: string;
    reference: string;
    createdAt: string;
  }[];
  totals: {
    studentRevenueEur: number;
    partnerGrossEur: number;
    partnerDeductionsEur: number;
    partnerNetEur: number;
    studentPaymentCount: number;
    partnerTransactionCount: number;
  };
};

export default function FinancialAnalysisPage() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [ledger, setLedger] = useState<FinanceLedger | null>(null);
  const [pricing, setPricing] = useState<PricingSettings>({ studentFeeEur: 5, partnerDeductionPercent: 10 });
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/summary", { credentials: "include" })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Failed to load finance data.");
        setData(body);
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : "Failed to load finance data."));

    fetch("/api/admin/finance", { credentials: "include" })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Failed to load finance ledger.");
        setLedger(body.ledger);
        setPricing(body.pricing);
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : "Failed to load finance ledger."));
  }, []);

  async function savePricing() {
    setSaving(true);
    setStatus(null);

    const res = await fetch("/api/admin/pricing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(pricing),
    });
    const body = await res.json();
    setSaving(false);

    if (!res.ok) {
      setStatus(body.error || "Failed to save pricing settings.");
      return;
    }

    setPricing(body.pricing);
    setStatus("Pricing settings updated.");
  }

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
          <MetricCard icon={<DollarSign className="h-5 w-5" />} label="Student Fee Revenue" value={formatCurrency(ledger?.totals.studentRevenueEur ?? data?.finance.platformRevenue ?? 0)} />
          <MetricCard icon={<Receipt className="h-5 w-5" />} label="Student Payments" value={String(ledger?.totals.studentPaymentCount ?? data?.finance.totalPayments ?? 0)} />
          <MetricCard icon={<Banknote className="h-5 w-5" />} label="Partner Deductions" value={formatCurrency(ledger?.totals.partnerDeductionsEur ?? 0)} />
        </div>

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black">Pricing Controls</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div className="space-y-2">
              <Label>Student fee amount (EUR)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={pricing.studentFeeEur}
                onChange={(event) => setPricing(current => ({ ...current, studentFeeEur: Number(event.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Partner deduction percentage</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={pricing.partnerDeductionPercent}
                onChange={(event) => setPricing(current => ({ ...current, partnerDeductionPercent: Number(event.target.value) }))}
              />
            </div>
            <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={savePricing} disabled={saving}>
              {saving ? "Saving..." : "Save Pricing"}
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard icon={<Activity className="h-5 w-5" />} label="Partner Gross Volume" value={formatCurrency(ledger?.totals.partnerGrossEur ?? 0)} />
          <MetricCard icon={<DollarSign className="h-5 w-5" />} label="Partner Net Earnings" value={formatCurrency(ledger?.totals.partnerNetEur ?? 0)} />
          <MetricCard icon={<Receipt className="h-5 w-5" />} label="Partner Transactions" value={String(ledger?.totals.partnerTransactionCount ?? 0)} />
        </div>

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black">Ledger Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <LedgerTable
              title="Recent Student Payments"
              empty="No student fee payments have been recorded yet."
              headers={["Student", "Provider", "Amount", "Status", "Reference", "Date"]}
              rows={(ledger?.studentPayments ?? []).map(payment => [
                <NameCell key="student" name={payment.studentName} detail={payment.studentEmail} />,
                providerLabel(payment.provider),
                formatCurrency(payment.amountEur),
                <StatusBadge key="status" status={payment.status} />,
                payment.reference,
                formatDate(payment.createdAt),
              ])}
            />

            <LedgerTable
              title="Recent Partner Transactions"
              empty="No partner transaction records have been generated yet."
              headers={["Partner", "Type", "Gross", "Deduction", "Net", "Status"]}
              rows={(ledger?.partnerTransactions ?? []).map(transaction => [
                <NameCell key="partner" name={transaction.businessName || transaction.partnerName} detail={transaction.partnerEmail} />,
                roleLabel(transaction.partnerType),
                formatCurrency(transaction.grossAmountEur),
                `${formatCurrency(transaction.deductionAmountEur)} (${transaction.deductionPercent}%)`,
                formatCurrency(transaction.netAmountEur),
                <StatusBadge key="status" status={transaction.status} />,
              ])}
            />
          </CardContent>
        </Card>
      </div>
    </SidebarShell>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" }).format(value);
}

function formatDate(value: string) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function providerLabel(value: string) {
  return value === "flutterwave" ? "Flutterwave" : value === "stripe" ? "Stripe" : value;
}

function roleLabel(value: string) {
  const labels: Record<string, string> = {
    university: "School",
    agent: "Housing",
    job_partner: "Jobs",
    supplier: "Food",
    transport: "Transport",
  };
  return labels[value] ?? value;
}

function StatusBadge({ status }: { status: string }) {
  const completed = status.toLowerCase() === "completed";
  return (
    <Badge variant="outline" className={completed ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}>
      {status}
    </Badge>
  );
}

function NameCell({ name, detail }: { name: string; detail: string }) {
  return (
    <div>
      <p className="font-bold text-slate-800">{name || "Unnamed account"}</p>
      <p className="text-[11px] text-slate-400">{detail}</p>
    </div>
  );
}

function LedgerTable({ title, empty, headers, rows }: { title: string; empty: string; headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-black text-slate-900">{title}</h2>
      <div className="overflow-hidden rounded-2xl border border-slate-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              {headers.map(header => (
                <TableHead key={header} className="text-[10px] font-black uppercase tracking-wider text-slate-400">{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} className="py-8 text-center text-sm text-slate-500">{empty}</TableCell>
              </TableRow>
            ) : rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="text-xs font-medium text-slate-600">{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
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
