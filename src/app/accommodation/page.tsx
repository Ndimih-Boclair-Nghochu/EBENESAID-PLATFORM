import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ShieldCheck, Search, Filter, Star, Home, Sparkles, Activity, ArrowUpRight, MessagesSquare } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
// import { generateAccommodationSummary } from "@/ai/flows/generate-accommodation-summary";
import { Input } from "@/components/ui/input";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussHousing } from "@/ai/flows/housing-specialist-flow";
import Link from "next/link";

const listings = [
  {
    id: "apt-1",
    title: "Premium Riga Center Studio",
    location: "K. Valdemāra iela, Riga",
    price: 380,
    type: "Studio",
    imgId: "apt-verified-1",
    details: "Luxury student studio in a historic building. Fully furnished, 24sqm. 5 mins walk from University of Latvia. Utilities average €80/mo. Verified high-trust landlord."
  },
  {
    id: "apt-2",
    title: "International Student Hub",
    location: "Zunda krastmala, Riga",
    price: 270,
    type: "Shared Room",
    imgId: "apt-verified-2",
    details: "Modern shared apartment near RTU. Large private bedroom. Sharing with 2 other masters students. All bills included. Excellent community vibes."
  }
];

  // Move userPreferences to client
  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Compact Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Marketplace • Verified
              </Badge>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Verified Housing</h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider">Scam-free, physically inspected student accommodation with legal protection.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto" asChild>
              <Link href="/dashboard">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                Saved Units
              </Link>
            </Button>
          </div>
        </div>

        {/* AI Specialist Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SpecialistChat 
              title="Housing Specialist"
              specialty="Accommodation & Neighborhood Expert"
              initialMessage="Welcome to the Housing Hub. I can explain our 12-point inspection process or help you find the best neighborhood for your university. What are you looking for today?"
              flow={discussHousing}
              icon={<Home className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Card className="rounded-[1.5rem] p-6 bg-slate-900 text-white shadow-xl border-none relative overflow-hidden flex-1 flex flex-col justify-center min-h-[120px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="flex items-center gap-2 text-primary mb-4 relative z-10">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Verification Shield</p>
              </div>
              <p className="text-xs font-medium text-slate-300 leading-relaxed italic relative z-10 border-l-2 border-primary/40 pl-4 py-1">
                "Every unit has been physically inspected by our field agents."
              </p>
            </Card>
            <Card className="rounded-[1.5rem] p-6 border-slate-100 shadow-sm bg-white h-fit flex flex-col justify-center">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Inventory Status</p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900">412 Units Verified</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active Inventory</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Listings Area - High Density Grid */}
          <div className="lg:col-span-12 space-y-5">
            {/* Search & Filter Bar - High Density */}
            <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
               <div className="flex-1 relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                 <Input placeholder="Search areas or universities..." className="h-10 pl-9 rounded-lg bg-slate-50 border-none focus:bg-white transition-all font-bold text-xs" />
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" className="h-10 rounded-lg font-black border-slate-200 gap-2 text-[10px] px-4 flex-1">
                   <Filter className="h-3.5 w-3.5" /> Filters
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
