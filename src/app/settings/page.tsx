'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, LogOut, Save, Settings as SettingsIcon, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { discussSettings } from "@/ai/flows/settings-specialist-flow";
import { useAuthContext } from "@/auth/provider";
import { SpecialistChat } from "@/components/SpecialistChat";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  university: string;
  countryOfOrigin: string;
};

const emptyForm: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  university: "",
  countryOfOrigin: "",
};

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuthContext();
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        university: user.university ?? "",
        countryOfOrigin: user.countryOfOrigin ?? "",
      });
      return;
    }

    fetch("/api/student/profile", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          return;
        }
        setForm({
          firstName: data.user.firstName ?? "",
          lastName: data.user.lastName ?? "",
          email: data.user.email ?? "",
          phone: data.user.phone ?? "",
          university: data.user.university ?? "",
          countryOfOrigin: data.user.countryOfOrigin ?? "",
        });
      })
      .catch(() => setStatus("Failed to load profile settings."));
  }, [user]);

  async function saveProfile() {
    setSaving(true);
    setStatus(null);

    const res = await fetch("/api/student/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setStatus(data.error || "Failed to update profile.");
      return;
    }

    await refreshUser();
    setStatus("Profile updated successfully.");
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  function updateField<K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) {
    setForm(current => ({ ...current, [field]: value }));
  }

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
                System Node - Real Profile
              </Badge>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-emerald-600">
                <ShieldCheck className="h-2.5 w-2.5" /> Session Active
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900">Account Settings</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Update the real student profile used across dashboard, jobs, messages, food delivery, and support.
            </p>
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={saveProfile} disabled={saving}>
              <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SpecialistChat
              title="Settings Specialist"
              specialty="Security & Profile Expert"
              initialMessage="I can help you understand profile settings, privacy, and how your account data flows across the platform."
              flow={discussSettings}
              icon={<SettingsIcon className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[1.5rem] border-none bg-slate-900 p-6 text-white shadow-xl">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">Account Actions</p>
              <p className="mt-4 text-sm text-slate-300">
                Signed in as {form.email || "student account"}.
              </p>
              <Button variant="outline" className="mt-4 w-full rounded-xl border-white/10 text-white hover:bg-white hover:text-green-900" asChild>
                <Link href="/billing">
                  <CreditCard className="mr-2 h-4 w-4" /> Open Billing
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout} className="mt-6 w-full rounded-xl border-red-900/20 text-red-400 hover:bg-red-50 hover:text-red-500">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </Card>
          </div>
        </div>

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black">Student Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={form.firstName} onChange={event => updateField("firstName", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={form.lastName} onChange={event => updateField("lastName", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={event => updateField("email", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={event => updateField("phone", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>University</Label>
              <Input value={form.university} onChange={event => updateField("university", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Country of Origin</Label>
              <Input value={form.countryOfOrigin} onChange={event => updateField("countryOfOrigin", event.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarShell>
  );
}
