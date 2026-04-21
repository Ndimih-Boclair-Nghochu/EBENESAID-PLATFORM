'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Activity,
  Edit3,
  Filter,
  Home,
  Loader2,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { useAuthContext } from "@/auth/provider";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Listing = {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  status: string;
  details: string;
  imageUrl: string;
  leads: number;
  trustScore: number;
};

type ListingForm = {
  id?: number;
  title: string;
  location: string;
  price: string;
  type: string;
  status: string;
  details: string;
  imageUrl: string;
};

const emptyForm: ListingForm = {
  title: "",
  location: "",
  price: "",
  type: "Studio",
  status: "Pending",
  details: "",
  imageUrl: "",
};

export default function ListingManagerPage() {
  const { user } = useAuthContext();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ListingForm>(emptyForm);

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    try {
      setLoading(true);
      const res = await fetch("/api/listings?includePending=true", { credentials: "include" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load listings.");
      }

      setListings(data.listings ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings.");
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(listing: Listing) {
    setForm({
      id: listing.id,
      title: listing.title,
      location: listing.location,
      price: String(listing.price),
      type: listing.type,
      status: listing.status,
      details: listing.details,
      imageUrl: listing.imageUrl,
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...form,
        price: Number(form.price),
      };

      const res = await fetch("/api/listings", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save listing.");
      }

      await loadListings();
      setDialogOpen(false);
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save listing.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setError(null);
      const res = await fetch(`/api/listings?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete listing.");
      }

      await loadListings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete listing.");
    }
  }

  const filteredListings = listings.filter(listing => {
    const haystack = `${listing.title} ${listing.location} ${listing.type} ${listing.status}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-400/20 bg-green-50 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-green-700">
                Inventory Node - Property Registry
              </Badge>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-emerald-600">
                <Activity className="h-2.5 w-2.5" /> Live Listings
              </div>
            </div>
            <h1 className="text-xl font-black uppercase italic leading-none tracking-tight text-slate-900">
              Inventory <span className="text-green-700">Manager</span>
            </h1>
            <p className="max-w-lg text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Maintain housing liquidity and verification standards for the student cohort.
            </p>
          </div>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={openCreateDialog}
                  className="h-9 w-full gap-2 rounded-xl border-none bg-green-700 px-5 text-[10px] font-black text-white shadow-lg shadow-green-700/20 transition-all hover:scale-105 sm:w-auto"
                >
                  <Plus className="h-3.5 w-3.5" /> Add New Unit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] max-w-[600px] overflow-hidden rounded-[2.5rem] border-none bg-white p-0 shadow-2xl">
                <div className="bg-green-700 p-6 text-white sm:p-8">
                  <DialogHeader className="text-left">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/20 backdrop-blur-md sm:h-12 sm:w-12">
                      <Home className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                    </div>
                    <DialogTitle className="text-xl font-black uppercase italic tracking-tight text-white sm:text-2xl">
                      {form.id ? "Edit Listing" : "Initialize Listing"}
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-[8px] font-bold uppercase tracking-[0.2em] text-green-100 sm:text-[10px]">
                      Housing inventory control for {user?.firstName || "agent"}
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <div className="max-h-[55vh] space-y-5 overflow-y-auto p-6 sm:p-8">
                  <Field label="Listing Title">
                    <Input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g. Modern Center Studio" className="h-11 rounded-xl border-none bg-slate-50 text-xs font-bold" />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Monthly Price (EUR)">
                      <Input value={form.price} onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))} type="number" placeholder="350" className="h-11 rounded-xl border-none bg-slate-50 text-xs font-bold" />
                    </Field>
                    <Field label="Unit Type">
                      <Select value={form.type} onValueChange={value => setForm(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="h-11 rounded-xl border-none bg-slate-50 text-xs font-bold">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl">
                          <SelectItem value="Studio" className="text-xs font-bold">Studio</SelectItem>
                          <SelectItem value="Shared Room" className="text-xs font-bold">Shared Room</SelectItem>
                          <SelectItem value="Whole Apartment" className="text-xs font-bold">Whole Apartment</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Status">
                      <Select value={form.status} onValueChange={value => setForm(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="h-11 rounded-xl border-none bg-slate-50 text-xs font-bold">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl">
                          <SelectItem value="Pending" className="text-xs font-bold">Pending</SelectItem>
                          <SelectItem value="Verified" className="text-xs font-bold">Verified</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Hero Image URL">
                      <Input value={form.imageUrl} onChange={e => setForm(prev => ({ ...prev, imageUrl: e.target.value }))} placeholder="https://..." className="h-11 rounded-xl border-none bg-slate-50 text-xs font-bold" />
                    </Field>
                  </div>

                  <Field label="Location / Address">
                    <Input value={form.location} onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))} placeholder="e.g. K. Valdemara iela 21, Riga" className="h-11 rounded-xl border-none bg-slate-50 text-xs font-bold" />
                  </Field>

                  <Field label="Description & Amenities">
                    <Textarea value={form.details} onChange={e => setForm(prev => ({ ...prev, details: e.target.value }))} placeholder="Detail the utilities, furniture, and neighborhood perks..." className="min-h-[120px] rounded-2xl border-none bg-slate-50 p-4 text-xs font-bold" />
                  </Field>

                  <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-green-700 shadow-sm">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-green-700/70">
                      Verified units appear in the student marketplace immediately. Pending units stay in your internal inventory view until approved.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50 p-6 sm:p-8">
                  <DialogFooter>
                    <Button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="h-14 w-full rounded-2xl bg-green-700 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-green-700/20 hover:bg-green-800"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (form.id ? "Update Listing" : "Initialize Listing Node")}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-1.5 shadow-sm sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search areas, unit types or status..."
              className="h-10 rounded-lg border-none bg-slate-50 pl-9 text-xs font-bold transition-all focus:bg-white"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-10 rounded-lg border-slate-200 px-4 text-[10px] font-black">
              <Filter className="h-3.5 w-3.5" /> Filters
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading inventory...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map(item => (
              <Card key={item.id} className="group overflow-hidden rounded-[2.5rem] border-none bg-white shadow-sm transition-all duration-500 hover:shadow-xl">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute left-4 top-4">
                    <Badge className={`rounded-lg border-none px-2 py-0.5 text-[7px] font-black uppercase tracking-widest shadow-lg ${item.status === "Verified" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                      {item.status}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="p-6 pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <CardTitle className="truncate text-sm font-black text-slate-900 transition-colors group-hover:text-green-700">
                        {item.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        <MapPin className="h-3 w-3 text-green-700" /> {item.location}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-base font-black italic leading-none tracking-tighter text-green-700">EUR {item.price}</p>
                      <p className="mt-1 text-[7px] font-black uppercase text-slate-400">/ Month</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 px-6 py-4">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Active Inventory</span>
                    </div>
                    <Badge variant="outline" className="h-5 border-green-100 px-2 text-[7px] font-black uppercase text-green-700">
                      {item.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-300">Total Leads</p>
                      <p className="text-xs font-black text-slate-700">{item.leads} Students</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-300">Trust Score</p>
                      <p className="text-xs font-black text-slate-700">{item.trustScore}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="secondary" className="h-9 flex-1 rounded-xl border-none bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm" onClick={() => openEditDialog(item)}>
                      <Edit3 className="mr-2 h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button variant="destructive" className="h-9 w-9 rounded-xl border-none shadow-xl" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SidebarShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</Label>
      {children}
    </div>
  );
}
