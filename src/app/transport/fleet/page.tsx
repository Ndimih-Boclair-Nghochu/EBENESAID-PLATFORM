
'use client';

import { useEffect, useState } from "react";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Plus, 
  Search, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight,
  Settings,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  FileText,
  Wrench,
  Gauge
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const fleetData: { id: number; model: string; plate: string; capacity: string; status: string; service: string; img: string }[] = [];

type FleetVehicle = {
  id: number;
  model: string;
  plate: string;
  capacity: string;
  status: string;
  serviceStatus: string;
  imageUrl: string;
  lastServiceDate: string;
  insuranceStatus: string;
};

const emptyVehicleForm = {
  model: "",
  plate: "",
  capacity: "",
  imageUrl: "",
  lastServiceDate: "",
};

export default function FleetManagerPage() {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [form, setForm] = useState(emptyVehicleForm);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadVehicles() {
    const res = await fetch("/api/transport/fleet", { credentials: "include" });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to load fleet vehicles.");
    }
    setVehicles(data.vehicles ?? []);
  }

  useEffect(() => {
    loadVehicles().catch(error => setStatus(error instanceof Error ? error.message : "Failed to load fleet vehicles."));
  }, []);

  async function registerVehicle() {
    setSaving(true);
    setStatus(null);
    const res = await fetch("/api/transport/fleet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setStatus(data.error || "Failed to register vehicle.");
      return;
    }

    setVehicles(data.vehicles ?? []);
    setForm(emptyVehicleForm);
    setStatus("Vehicle registered successfully.");
  }

  async function updateVehicleStatus(vehicleId: number, nextStatus: string) {
    const res = await fetch("/api/transport/fleet", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ vehicleId, status: nextStatus }),
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus(data.error || "Failed to update vehicle.");
      return;
    }

    setVehicles(data.vehicles ?? []);
    setStatus(`Vehicle marked as ${nextStatus.toLowerCase()}.`);
  }

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-blue-400/20 bg-blue-50 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-blue-600">
                Asset Node - Fleet Protocol
              </Badge>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-emerald-600">
                <ShieldCheck className="h-2.5 w-2.5" /> Safety Certified
              </div>
            </div>
            <h1 className="text-xl font-black uppercase italic leading-none tracking-tight text-slate-900">Fleet <span className="text-blue-600">Manager</span></h1>
            <p className="max-w-lg text-[10px] font-medium uppercase tracking-widest text-slate-400">Register vehicles, control availability, and assign trusted capacity to student pickups.</p>
          </div>
        </div>

        {status && <p className="text-sm text-slate-600">{status}</p>}

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <Plus className="h-4 w-4 text-blue-600" /> Register Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input value={form.model} onChange={e => setForm(current => ({ ...current, model: e.target.value }))} placeholder="Vehicle model" />
              <Input value={form.plate} onChange={e => setForm(current => ({ ...current, plate: e.target.value }))} placeholder="License plate" />
              <Input value={form.capacity} onChange={e => setForm(current => ({ ...current, capacity: e.target.value }))} placeholder="Capacity, e.g. 4 seats" />
              <Input value={form.lastServiceDate} onChange={e => setForm(current => ({ ...current, lastServiceDate: e.target.value }))} placeholder="Last service date" />
              <Input value={form.imageUrl} onChange={e => setForm(current => ({ ...current, imageUrl: e.target.value }))} placeholder="Image URL (optional)" />
              <Button size="sm" className="h-10 w-full rounded-xl border-none bg-blue-600 font-black text-white shadow-lg shadow-blue-600/20" onClick={registerVehicle} disabled={saving}>
                <Plus className="h-3.5 w-3.5" /> {saving ? "Registering..." : "Register Vehicle"}
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm lg:col-span-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-black">Registered Fleet</CardTitle>
              <Badge variant="outline" className="border-blue-100 text-blue-600">{vehicles.length} vehicles</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {vehicles.length ? vehicles.map(vehicle => (
                <div key={vehicle.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <Car className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{vehicle.model}</p>
                        <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                          {vehicle.plate} | {vehicle.capacity} | Service {vehicle.serviceStatus}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={vehicle.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}>{vehicle.status}</Badge>
                      <Button variant="outline" className="rounded-xl" onClick={() => updateVehicleStatus(vehicle.id, vehicle.status === "Active" ? "Maintenance" : "Active")}>
                        {vehicle.status === "Active" ? "Maintenance" : "Activate"}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Insurance</p>
                      <p className="mt-1 text-sm font-black text-emerald-600">{vehicle.insuranceStatus}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Last Service</p>
                      <p className="mt-1 text-sm font-black text-slate-700">{vehicle.lastServiceDate || "Not recorded"}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Dispatch Status</p>
                      <p className="mt-1 text-sm font-black text-slate-700">{vehicle.status}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Car className="mb-4 h-10 w-10 text-slate-200" />
                  <p className="text-sm font-black uppercase tracking-widest text-slate-400">No vehicles registered</p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-300">Register your first vehicle using the form.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarShell>
  );

  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-10">
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-blue-400/20 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Asset Node • Fleet Protocol
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                <ShieldCheck className="h-2.5 w-2.5" /> Safety Certified
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Fleet <span className="text-blue-600">Manager</span></h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-widest">Maintain vehicle credentials and logistics capacity for student arrivals.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button size="sm" className="h-9 px-5 rounded-xl font-black shadow-lg shadow-blue-600/20 bg-blue-600 text-white border-none gap-2 text-[10px] w-full sm:w-auto transition-all">
              <Plus className="h-3.5 w-3.5" /> Register Vehicle
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
           <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
             <Input placeholder="Search by model, plate or status..." className="h-10 pl-9 rounded-lg bg-slate-50 border-none focus:bg-white transition-all font-bold text-xs" />
           </div>
           <Button variant="outline" className="h-10 rounded-lg font-black border-slate-200 gap-2 text-[10px] px-4">
             Maintenance Logs
           </Button>
        </div>

        {/* Fleet Grid */}
        {fleetData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Car className="h-10 w-10 text-slate-200 mb-4" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No vehicles registered</p>
            <p className="text-[10px] text-slate-300 uppercase tracking-widest mt-1">Register your first vehicle using the button above.</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleetData.map((v) => (
            <Card key={v.id} className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="relative aspect-video overflow-hidden">
                <Image src={v.img} alt={v.model} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-4 left-4">
                  <Badge className={`border-none font-black text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-lg shadow-lg ${v.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                    {v.status}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="h-8 w-8 rounded-lg bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-blue-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <CardHeader className="p-6 pb-2">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 min-w-0">
                    <CardTitle className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">{v.model}</CardTitle>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      <Car className="h-3 w-3 text-blue-600" /> License: {v.plate}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant="outline" className="text-blue-600 border-blue-100 text-[7px] font-black uppercase">{v.capacity}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-6 py-4 space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Compliance Status</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${v.service === 'Passed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                    <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">{v.service}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Last Service</p>
                    <p className="text-xs font-black text-slate-700 italic">Jan 2025</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Insurance</p>
                    <p className="text-xs font-black text-emerald-600 italic uppercase">Verified</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button variant="ghost" className="w-full h-10 rounded-xl font-black text-[9px] uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all">
                  Manage Credentials <ArrowUpRight className="h-3 w-3 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </SidebarShell>
  );
}
