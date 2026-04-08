import Link from "next/link";
import { Activity, Filter, Home, Search, ShieldCheck, Star } from "lucide-react";

import { discussHousing } from "@/ai/flows/housing-specialist-flow";
import { AccommodationListings } from "@/app/accommodation/AccommodationListings";
import { SpecialistChat } from "@/components/SpecialistChat";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AccommodationPage() {
  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary"
              >
                Marketplace • Verified
              </Badge>
            </div>
            <h1 className="text-xl font-black leading-none tracking-tight text-slate-900">
              Verified Housing
            </h1>
            <p className="max-w-lg text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Scam-free, physically inspected student accommodation with legal
              protection.
            </p>
          </div>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-full gap-2 rounded-xl border-slate-200 px-4 text-[10px] font-bold transition-all hover:bg-slate-50 sm:w-auto"
              asChild
            >
              <Link href="/dashboard">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                Saved Units
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SpecialistChat
              title="Housing Specialist"
              specialty="Accommodation & Neighborhood Expert"
              initialMessage="Welcome to the Housing Hub. I can explain our 12-point inspection process or help you find the best neighborhood for your university. What are you looking for today?"
              flow={discussHousing}
              icon={<Home className="h-4 w-4" />}
            />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-4">
            <Card className="relative flex min-h-[120px] flex-1 flex-col justify-center overflow-hidden rounded-[1.5rem] border-none bg-slate-900 p-6 text-white shadow-xl">
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-2xl" />
              <div className="relative z-10 mb-4 flex items-center gap-2 text-primary">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">
                  Verification Shield
                </p>
              </div>
              <p className="relative z-10 border-l-2 border-primary/40 py-1 pl-4 text-xs italic leading-relaxed text-slate-300">
                "Every unit has been physically inspected by our field agents."
              </p>
            </Card>
            <Card className="flex h-fit flex-col justify-center rounded-[1.5rem] border-slate-100 bg-white p-6 shadow-sm">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                Inventory Status
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900">
                    412 Units Verified
                  </p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                    Active Inventory
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-12">
            <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-1.5 shadow-sm sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search areas or universities..."
                  className="h-10 rounded-lg border-none bg-slate-50 pl-9 text-xs font-bold transition-all focus:bg-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-10 flex-1 gap-2 rounded-lg border-slate-200 px-4 text-[10px] font-black"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filters
                </Button>
              </div>
            </div>

            <AccommodationListings />
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}
