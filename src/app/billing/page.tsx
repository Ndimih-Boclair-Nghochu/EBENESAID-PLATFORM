'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Landmark,
  RefreshCw,
  Save,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { useAuthContext } from "@/auth/provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type BillingProfile = {
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  billingCountry: string;
  billingCurrency: string;
  billingAddress: string;
  providerPreference: "stripe" | "flutterwave";
  stripeCustomerEmail: string;
  stripeCustomerId: string;
  stripePaymentMethodLabel: string;
  stripeCheckoutMode: string;
  flutterwaveCustomerEmail: string;
  flutterwaveCustomerId: string;
  flutterwavePaymentMethod: string;
  flutterwaveMobileMoneyProvider: string;
  flutterwaveReference: string;
  invoiceEmail: string;
  autoRenew: boolean;
};

const emptyBilling: BillingProfile = {
  billingName: "",
  billingEmail: "",
  billingPhone: "",
  billingCountry: "",
  billingCurrency: "EUR",
  billingAddress: "",
  providerPreference: "stripe",
  stripeCustomerEmail: "",
  stripeCustomerId: "",
  stripePaymentMethodLabel: "",
  stripeCheckoutMode: "card",
  flutterwaveCustomerEmail: "",
  flutterwaveCustomerId: "",
  flutterwavePaymentMethod: "card",
  flutterwaveMobileMoneyProvider: "",
  flutterwaveReference: "",
  invoiceEmail: "",
  autoRenew: false,
};

export default function BillingPage() {
  const { refreshUser } = useAuthContext();
  const [form, setForm] = useState<BillingProfile>(emptyBilling);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    fetch("/api/student/billing", { credentials: "include" })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load billing profile.");
        }
        setForm(data.billing ?? emptyBilling);
      })
      .catch(error => setStatus(error instanceof Error ? error.message : "Failed to load billing profile."))
      .finally(() => setLoading(false));
  }, []);

  function updateField<K extends keyof BillingProfile>(field: K, value: BillingProfile[K]) {
    setForm(current => ({ ...current, [field]: value }));
  }

  async function saveBilling() {
    setSaving(true);
    setStatus(null);

    const res = await fetch("/api/student/billing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setStatus(data.error || "Failed to save billing settings.");
      return;
    }

    setForm(data.billing ?? form);
    setStatus("Billing settings saved successfully.");
  }

  async function completePayment() {
    setIsPaying(true);
    setStatus(null);

    const res = await fetch("/api/student/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ providerPreference: form.providerPreference }),
    });
    const data = await res.json();
    setIsPaying(false);

    if (!res.ok) {
      setStatus(data.error || "Failed to complete payment.");
      return;
    }

    await refreshUser();
    setStatus(data.message || "Platform fee paid successfully.");
  }

  if (loading) {
    return (
      <SidebarShell>
        <div className="mx-auto max-w-7xl p-6 text-sm text-slate-500">Loading billing configuration...</div>
      </SidebarShell>
    );
  }

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
                Billing Node - Stripe & Flutterwave
              </Badge>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-emerald-600">
                <ShieldCheck className="h-2.5 w-2.5" /> Secure Billing Metadata
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900">Billing & Payments</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Manage your billing identity, preferred gateway, invoice delivery, and payment method metadata for Stripe and Flutterwave.
            </p>
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href="/settings">Back to Settings</Link>
            </Button>
            <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={saveBilling} disabled={saving}>
              <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Billing"}
            </Button>
          </div>
        </div>

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-8">
            <CardHeader>
              <CardTitle className="text-base font-black">Billing Identity</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Billing Name</Label>
                <Input value={form.billingName} onChange={event => updateField("billingName", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Billing Email</Label>
                <Input value={form.billingEmail} onChange={event => updateField("billingEmail", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Billing Phone</Label>
                <Input value={form.billingPhone} onChange={event => updateField("billingPhone", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Invoice Email</Label>
                <Input value={form.invoiceEmail} onChange={event => updateField("invoiceEmail", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Billing Country</Label>
                <Input value={form.billingCountry} onChange={event => updateField("billingCountry", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input value={form.billingCurrency} onChange={event => updateField("billingCurrency", event.target.value.toUpperCase())} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Billing Address</Label>
                <Textarea value={form.billingAddress} onChange={event => updateField("billingAddress", event.target.value)} className="min-h-[96px]" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none bg-slate-900 p-6 text-white shadow-xl lg:col-span-4">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">Payment Controls</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-black">Preferred Gateway</p>
                <p className="mt-1 text-xs text-slate-300">
                  Current provider: {form.providerPreference === "stripe" ? "Stripe" : "Flutterwave"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black">Auto Renew</p>
                    <p className="mt-1 text-xs text-slate-300">Let the next successful charge renew your platform access.</p>
                  </div>
                  <Switch checked={form.autoRenew} onCheckedChange={checked => updateField("autoRenew", checked)} />
                </div>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-xs leading-relaxed text-slate-200">
                Raw card, bank, and mobile money numbers should be collected through Stripe or Flutterwave secure hosted flows. This page stores only safe billing metadata and gateway preferences.
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className={`rounded-[2rem] border shadow-sm ${form.providerPreference === "stripe" ? "border-primary bg-primary/5" : "border-slate-100 bg-white"}`}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black">Stripe</CardTitle>
                    <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">Cards, wallets, secure checkout</p>
                  </div>
                </div>
                <Button variant={form.providerPreference === "stripe" ? "default" : "outline"} className="rounded-xl" onClick={() => updateField("providerPreference", "stripe")}>
                  Use Stripe
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Stripe Customer Email</Label>
                <Input value={form.stripeCustomerEmail} onChange={event => updateField("stripeCustomerEmail", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Stripe Customer ID</Label>
                <Input value={form.stripeCustomerId} onChange={event => updateField("stripeCustomerId", event.target.value)} placeholder="cus_..." />
              </div>
              <div className="space-y-2">
                <Label>Saved Payment Method Label</Label>
                <Input value={form.stripePaymentMethodLabel} onChange={event => updateField("stripePaymentMethodLabel", event.target.value)} placeholder="Visa ending in 4242" />
              </div>
              <div className="space-y-2">
                <Label>Checkout Mode</Label>
                <Input value={form.stripeCheckoutMode} onChange={event => updateField("stripeCheckoutMode", event.target.value)} placeholder="card, apple_pay, link" />
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                Stripe is ideal for card payments, Apple Pay, Google Pay, and secure subscription renewals.
              </div>
              <Button variant="outline" className="rounded-xl" asChild>
                <a href="https://stripe.com" target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Stripe Docs
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className={`rounded-[2rem] border shadow-sm ${form.providerPreference === "flutterwave" ? "border-primary bg-primary/5" : "border-slate-100 bg-white"}`}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black">Flutterwave</CardTitle>
                    <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">Cards, bank transfer, mobile money</p>
                  </div>
                </div>
                <Button variant={form.providerPreference === "flutterwave" ? "default" : "outline"} className="rounded-xl" onClick={() => updateField("providerPreference", "flutterwave")}>
                  Use Flutterwave
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Flutterwave Customer Email</Label>
                <Input value={form.flutterwaveCustomerEmail} onChange={event => updateField("flutterwaveCustomerEmail", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Flutterwave Customer ID</Label>
                <Input value={form.flutterwaveCustomerId} onChange={event => updateField("flutterwaveCustomerId", event.target.value)} placeholder="flw_..." />
              </div>
              <div className="space-y-2">
                <Label>Preferred Payment Method</Label>
                <Input value={form.flutterwavePaymentMethod} onChange={event => updateField("flutterwavePaymentMethod", event.target.value)} placeholder="card, bank_transfer, mobile_money" />
              </div>
              <div className="space-y-2">
                <Label>Mobile Money Provider</Label>
                <Input value={form.flutterwaveMobileMoneyProvider} onChange={event => updateField("flutterwaveMobileMoneyProvider", event.target.value)} placeholder="MTN, Airtel, M-Pesa" />
              </div>
              <div className="space-y-2">
                <Label>Reference / Beneficiary Label</Label>
                <Input value={form.flutterwaveReference} onChange={event => updateField("flutterwaveReference", event.target.value)} placeholder="Student wallet top-up" />
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                Flutterwave is useful for African cards, transfer rails, and mobile money collection across supported countries.
              </div>
              <Button variant="outline" className="rounded-xl" asChild>
                <a href="https://flutterwave.com" target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Flutterwave Docs
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="rounded-[2rem] border-primary/20 bg-primary/5 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <Wallet className="h-4 w-4 text-primary" /> Platform Fee
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-black text-slate-900">Amount due:</span> EUR 5
              </p>
              <p>
                <span className="font-black text-slate-900">Gateway:</span> {form.providerPreference === "stripe" ? "Stripe" : "Flutterwave"}
              </p>
              <p>Use your selected billing gateway to unlock the student platform after the trial period ends.</p>
              <Button className="w-full rounded-xl bg-green-700 hover:bg-green-800" onClick={completePayment} disabled={isPaying}>
                <Wallet className="mr-2 h-4 w-4" /> {isPaying ? "Processing..." : "Pay EUR 5 Now"}
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <Wallet className="h-4 w-4 text-primary" /> Billing Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p><span className="font-black text-slate-900">Default gateway:</span> {form.providerPreference === "stripe" ? "Stripe" : "Flutterwave"}</p>
              <p><span className="font-black text-slate-900">Invoice email:</span> {form.invoiceEmail || "Not set"}</p>
              <p><span className="font-black text-slate-900">Currency:</span> {form.billingCurrency || "EUR"}</p>
              <p><span className="font-black text-slate-900">Auto renew:</span> {form.autoRenew ? "Enabled" : "Disabled"}</p>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <RefreshCw className="h-4 w-4 text-primary" /> Next Integration Step
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-600">
              Connect your Stripe and Flutterwave secret keys in the deployment environment, then wire hosted checkout and webhook events to convert these saved billing preferences into live charges and subscription state.
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <Banknote className="h-4 w-4 text-primary" /> Payment Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-slate-600">
              Use Stripe Elements or hosted checkout for cards, and Flutterwave hosted flows for bank or mobile money. Keep only labels, IDs, and customer references in this app database.
              <div className="mt-3 flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Billing page ready for secure gateway integration.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarShell>
  );
}
