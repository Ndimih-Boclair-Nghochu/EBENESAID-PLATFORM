'use client';

import { useEffect, useState } from "react";
import { Activity, Navigation, PlaneTakeoff, Save } from "lucide-react";

import { discussTransit } from "@/ai/flows/transit-specialist-flow";
import { SpecialistChat } from "@/components/SpecialistChat";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ArrivalTransitPage() {
  const [destination, setDestination] = useState("");
  const [notes, setNotes] = useState("");
  const [pickupBooked, setPickupBooked] = useState(false);
  const [status, setStatus] = useState("Not booked");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/student/arrival", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setDestination(data.booking?.destination || "");
        setNotes(data.booking?.notes || "");
        setPickupBooked(Boolean(data.booking?.pickupBooked));
        setStatus(data.booking?.pickupStatus || "Not booked");
      })
      .catch(() => setMessage("Failed to load arrival settings."))
      .finally(() => setLoading(false));
  }, []);

  async function saveArrival(nextPickupBooked: boolean) {
    const res = await fetch("/api/student/arrival", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        destination,
        notes,
        pickupBooked: nextPickupBooked,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to save arrival booking.");
    }
    setPickupBooked(Boolean(data.booking?.pickupBooked));
    setStatus(data.booking?.pickupStatus || "Not booked");
    setMessage("Arrival plan updated successfully.");
  }

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading arrival data...</div>;
  }

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
                Logistics Node - RIX Airport
              </Badge>
              <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-blue-600">
                <Navigation className="h-2.5 w-2.5" /> Live Plan
              </div>
            </div>
            <h1 className="text-xl font-black leading-none tracking-tight text-slate-900">Arrival & Transit</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Manage your airport transfer and first-day logistics with real saved data.
            </p>
          </div>
          <Button
            size="sm"
            className="h-9 rounded-xl bg-green-700 px-5 text-[10px] font-black text-white shadow-lg shadow-green-700/20 hover:bg-green-800"
            onClick={() => saveArrival(true)}
          >
            <PlaneTakeoff className="mr-2 h-3.5 w-3.5" /> Book Airport Pickup
          </Button>
        </div>

        {message && <p className="text-sm font-medium text-slate-600">{message}</p>}

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SpecialistChat
              title="Transit Specialist"
              specialty="Logistics & Navigation Expert"
              initialMessage="I can help you plan your airport transfer, bus routes, or first arrival steps in Riga."
              flow={discussTransit}
              icon={<PlaneTakeoff className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="h-full rounded-[1.5rem] border-none bg-slate-900 p-6 text-white shadow-xl">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Activity className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Pickup Status</p>
              </div>
              <p className="text-2xl font-black text-white">{status}</p>
              <p className="mt-2 text-xs text-slate-300">
                Destination: {destination || "Not set"}
              </p>
            </Card>
          </div>
        </div>

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black text-slate-900">Arrival Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destination</Label>
              <Input value={destination} onChange={e => setDestination(e.target.value)} className="h-11 rounded-xl bg-slate-50 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Arrival Notes</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="min-h-[120px] rounded-2xl bg-slate-50 text-sm" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl" onClick={() => saveArrival(false)}>Mark as Not Booked</Button>
              <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={() => saveArrival(pickupBooked)}>
                <Save className="mr-2 h-4 w-4" /> Save Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarShell>
  );
}
