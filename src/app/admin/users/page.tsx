'use client';

import { useEffect, useMemo, useState } from "react";
import { Activity, Mail, Search, ShieldCheck, UserCheck, UserPlus, UserX } from "lucide-react";

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DirectoryUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  university: string;
  countryOfOrigin: string;
  userType: string;
  isActive: boolean;
  trialStartDate: string;
  trialEndDate: string;
  hasPaid: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  partnerProfile?: {
    partnerType: string;
    businessName: string;
    contactPerson: string;
    commissionPercent: number | null;
    metadata: Record<string, unknown>;
  } | null;
};

type RoleOption = {
  value: string;
  label: string;
};

type UserDirectoryResponse = {
  users?: DirectoryUser[];
  roleOptions?: RoleOption[];
  emailDelivery?: {
    status: 'sent' | 'failed' | 'skipped';
    message?: string;
  };
  error?: string;
};

const emptyCreateForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  university: "",
  countryOfOrigin: "",
  userType: "student",
  businessName: "",
  contactPerson: "",
  commissionPercent: "",
  partnerNotes: "",
  isActive: true,
};

function isPartnerRole(role: string) {
  return role === "university" || role === "agent" || role === "job_partner" || role === "supplier" || role === "transport";
}

export default function UserDirectoryPage() {
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);

  async function loadUsers() {
    const res = await fetch("/api/admin/users", { credentials: "include" });
    const data: UserDirectoryResponse = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to load user directory.");
    }
    setUsers(data.users ?? []);
    setRoleOptions(data.roleOptions ?? []);
  }

  useEffect(() => {
    loadUsers()
      .catch(error => setStatus(error instanceof Error ? error.message : "Failed to load user directory."))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.userType.toLowerCase().includes(query) ||
      user.university.toLowerCase().includes(query)
    );
  }, [search, users]);

  async function createPlatformUser() {
    setCreating(true);
    setStatus(null);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(createForm),
    });
    const data: UserDirectoryResponse = await res.json();
    setCreating(false);

    if (!res.ok) {
      setStatus(data.error || "Failed to create user.");
      return;
    }

    setUsers(data.users ?? []);
    setCreateForm(emptyCreateForm);
    setStatus(
      data.emailDelivery?.status === "failed"
        ? `Platform user created successfully. ${data.emailDelivery.message ?? "Credential email could not be sent."}`
        : data.emailDelivery?.status === "sent"
          ? "Platform user created successfully. Credential email sent."
          : "Platform user created successfully."
    );
  }

  async function toggleUser(userId: number, isActive: boolean) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId, isActive }),
    });
    const data: UserDirectoryResponse = await res.json();

    if (!res.ok) {
      setStatus(data.error || "Failed to update account status.");
      return;
    }

    setUsers(data.users ?? []);
    setStatus(isActive ? "User activated." : "User deactivated.");
  }

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
                Identity Node - Real Directory
              </Badge>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-emerald-600">
                <Activity className="h-2.5 w-2.5" /> Admin Controlled
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900">User Directory</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Create students, staff, investors, and partner accounts with the business details each role needs.
            </p>
          </div>
        </div>

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <UserPlus className="h-4 w-4 text-primary" /> Create Platform User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                <Field label="First Name">
                  <Input value={createForm.firstName} onChange={e => setCreateForm(current => ({ ...current, firstName: e.target.value }))} />
                </Field>
                <Field label="Last Name">
                  <Input value={createForm.lastName} onChange={e => setCreateForm(current => ({ ...current, lastName: e.target.value }))} />
                </Field>
              </div>
              <Field label="Email">
                <Input value={createForm.email} onChange={e => setCreateForm(current => ({ ...current, email: e.target.value }))} />
              </Field>
              <Field label="Temporary Password">
                <Input type="text" value={createForm.password} onChange={e => setCreateForm(current => ({ ...current, password: e.target.value }))} />
              </Field>
              <Field label="Role / Title">
                <Select value={createForm.userType} onValueChange={(value) => setCreateForm(current => ({ ...current, userType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Phone">
                <Input value={createForm.phone} onChange={e => setCreateForm(current => ({ ...current, phone: e.target.value }))} />
              </Field>
              <Field label="University / Organization">
                <Input value={createForm.university} onChange={e => setCreateForm(current => ({ ...current, university: e.target.value }))} />
              </Field>
              <Field label="Country">
                <Input value={createForm.countryOfOrigin} onChange={e => setCreateForm(current => ({ ...current, countryOfOrigin: e.target.value }))} />
              </Field>
              {isPartnerRole(createForm.userType) && (
                <>
                  <Field label="Business / Institution Name">
                    <Input value={createForm.businessName} onChange={e => setCreateForm(current => ({ ...current, businessName: e.target.value }))} />
                  </Field>
                  <Field label="Contact Person">
                    <Input value={createForm.contactPerson} onChange={e => setCreateForm(current => ({ ...current, contactPerson: e.target.value }))} />
                  </Field>
                  <Field label="Commission Override (%)">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={createForm.commissionPercent}
                      onChange={e => setCreateForm(current => ({ ...current, commissionPercent: e.target.value }))}
                    />
                  </Field>
                  <Field label="Partner Notes">
                    <Input value={createForm.partnerNotes} onChange={e => setCreateForm(current => ({ ...current, partnerNotes: e.target.value }))} />
                  </Field>
                </>
              )}
              <Field label="Account Status">
                <Select value={createForm.isActive ? "active" : "inactive"} onValueChange={(value) => setCreateForm(current => ({ ...current, isActive: value === "active" }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Button className="w-full rounded-xl bg-green-700 hover:bg-green-800" onClick={createPlatformUser} disabled={creating}>
                <UserPlus className="mr-2 h-4 w-4" /> {creating ? "Creating..." : "Create User"}
              </Button>
              <p className="text-xs text-slate-500">
                Created accounts log in with the email and password you set here. Partner roles also store their business profile so the right dashboard modules can be activated later.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-5 lg:col-span-8">
            <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-1.5 shadow-sm sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search users, emails, roles, or institutions..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-10 border-none bg-slate-50 pl-9 text-xs font-bold"
                />
              </div>
            </div>

            <Card className="overflow-hidden rounded-[2rem] border-slate-100 bg-white shadow-sm">
              <div className="divide-y divide-slate-50">
                {loading ? (
                  <div className="p-8 text-center text-sm text-slate-500">Loading users...</div>
                ) : filteredUsers.length > 0 ? filteredUsers.map((user) => {
                  const fullName = `${user.firstName} ${user.lastName}`.trim();
                  return (
                    <div key={user.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-4">
                        <Avatar className="h-12 w-12 rounded-[1.25rem] border-2 border-slate-50 shadow-sm">
                          <AvatarFallback className="bg-primary text-sm font-black text-white">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-black text-slate-900">{fullName || user.email}</p>
                            <Badge variant="outline" className="border-slate-100 bg-slate-50 text-[9px] uppercase tracking-wider text-slate-500">
                              {formatRole(user.userType)}
                            </Badge>
                            <Badge className={user.isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}>
                              {user.isActive ? "Active" : "Disabled"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-primary" /> {user.email}
                            </span>
                            {user.university && <span>{user.university}</span>}
                            <span>Joined {new Date(user.createdAt).toLocaleDateString("en-GB")}</span>
                          </div>
                          {user.partnerProfile && (
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                              <Badge variant="outline" className="border-green-100 bg-green-50 text-[9px] uppercase tracking-wider text-green-700">
                                {formatPartnerType(user.partnerProfile.partnerType)}
                              </Badge>
                              <span>{user.partnerProfile.businessName}</span>
                              <span>Contact: {user.partnerProfile.contactPerson}</span>
                              {user.partnerProfile.commissionPercent !== null && <span>Commission {user.partnerProfile.commissionPercent}%</span>}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.isActive ? (
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-50 text-red-500 hover:bg-red-50" onClick={() => toggleUser(user.id, false)}>
                            <UserX className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-50 text-emerald-600 hover:bg-emerald-50" onClick={() => toggleUser(user.id, true)}>
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                        {user.isActive && <ShieldCheck className="h-4 w-4 text-primary" />}
                      </div>
                    </div>
                  );
                }) : (
                  <div className="p-8 text-center text-sm text-slate-500">No platform users matched your search.</div>
                )}
              </div>
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

function formatRole(role: string) {
  switch (role) {
    case "job_partner":
      return "Job Supplier";
    case "agent":
      return "House Agent";
    case "supplier":
      return "Food Supplier";
    case "transport":
      return "Transport Partner";
    case "university":
      return "School Partner";
    case "investor":
      return "Investor";
    case "staff":
      return "Staff";
    case "admin":
      return "Admin";
    default:
      return "Student";
  }
}

function formatPartnerType(role: string) {
  switch (role) {
    case "university":
      return "Educational Institution";
    case "agent":
      return "Housing Provider";
    case "job_partner":
      return "Employer";
    case "supplier":
      return "Catering Provider";
    case "transport":
      return "Transport Provider";
    default:
      return role.replace(/_/g, " ");
  }
}
