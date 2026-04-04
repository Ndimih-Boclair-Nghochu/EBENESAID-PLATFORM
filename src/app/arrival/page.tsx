'use client';

import { SidebarShell } from "@/components/layout/sidebar-shell";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PlaneTakeoff, 
  MapPin, 
  Clock, 
  Navigation, 
  Bus, 
  Car, 
  Info, 
  Wifi, 
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Activity,
  Map as MapIcon,
  ChevronRight
} from "lucide-react";
import { SpecialistChat } from "@/components/SpecialistChat";
import { discussTransit } from "@/ai/flows/transit-specialist-flow";

export default function ArrivalTransitPage() {
  const airportCode = "RIX";
  const destination = "K. Valdemāra iela 21, Centrs";

  return (
    <SidebarShell>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Compact Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                Logistics Node • RIX Airport
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest">
                <Navigation className="h-2.5 w-2.5" /> GPS Linked
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Arrival & Transit</h1>
            <p className="text-slate-400 text-[10px] font-medium max-w-lg uppercase tracking-wider">Secure navigation from Riga Airport to your verified apartment.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 font-bold gap-2 text-[10px] hover:bg-slate-50 transition-all w-full sm:w-auto">
              Book Airport Pickup
            </Button>
          </div>
        </div>

        {/* AI Specialist Console */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SpecialistChat 
              title="Transit Specialist"
              specialty="Logistics & Navigation Expert"
              initialMessage="Welcome to Riga! I can help you find Bus 22, advise on official taxi ranks at RIX, or explain how the local e-talons ticketing system works. Where are you headed?"
              flow={discussTransit}
              icon={<PlaneTakeoff className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-4">
            <Card className="rounded-[1.5rem] bg-slate-900 text-white p-6 relative overflow-hidden shadow-xl border-none h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="flex items-center gap-2 text-primary mb-4 relative z-10">
                <Navigation className="h-4 w-4" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Active Route Protocol</p>
              </div>
              <p className="text-xs font-medium text-slate-300 leading-relaxed italic relative z-10 border-l-2 border-primary/40 pl-4 py-1">
                "Real-time GPS synchronization active from RIX Terminal to your destination."
              </p>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Navigation Area */}
          <div className="lg:col-span-12 space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden flex flex-col h-auto sm:h-[600px]">
              <div className="relative flex-1 flex flex-col sm:block">
                {/* Map Container */}
                <div className="h-[350px] sm:h-full w-full bg-slate-100 shrink-0">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d34828.44144144144!2d23.9734141!3d56.9226102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x46eec90725b6f809%3A0x29f60293d0d31ef!2sRiga%20International%20Airport%20(RIX)!3m2!1d56.9226102!2d23.9734141!4m5!1s0x46eecf90725b6f809%3A0x29f60293d0d31ef!2sK.%20Valdem%C4%81ra%20iela%2021%2C%20Riga!3m2!1d56.955!2d24.11!5e0!3m2!1sen!2slv!4v1710000000000!5m2!1sen!2slv" 
                    className="w-full h-full grayscale-[0.2] contrast-[1.1]"
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                
                {/* Directions Overlay */}
                <div className="p-4 sm:p-0 sm:absolute sm:top-4 sm:left-4 sm:right-auto sm:w-72 z-10">
                  <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl sm:shadow-2xl border border-slate-100 sm:border-white shadow-slate-900/5 sm:shadow-slate-900/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg">
                        <Navigation className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-900 leading-none">Route to Home</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">~18 min transit</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <TransitStep icon={<PlaneTakeoff className="h-3 w-3" />} label="Terminal 1" desc="Exit via official taxi rank" active />
                      <TransitStep icon={<Car className="h-3 w-3" />} label="A10 Highway" desc="Main route to City Center" />
                      <TransitStep icon={<MapPin className="h-3 w-3" />} label="Valdemāra 21" desc="Verified Arrival Zone" />
                    </div>
                  </div>
                </div>
              </div>
              <CardFooter className="bg-slate-900 p-4 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Updates Active</span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <p className="text-[10px] font-medium text-slate-400">Next Bus 22: <span className="text-white font-bold">12 mins</span></p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black text-white hover:bg-white/10 uppercase tracking-widest gap-2 w-full sm:w-auto">
                  View Public Transport Schedule <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <LogisticsCard icon={<Wifi className="h-4 w-4" />} title="Airport WiFi" status="Free / RIX-Guest" />
              <LogisticsCard icon={<Smartphone className="h-4 w-4" />} title="Local SIM" status="LMT / Tele2 Kiosk" />
              <LogisticsCard icon={<ShieldCheck className="h-4 w-4" />} title="Official Taxi" status="Red/Green License" />
            </div>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function TransitStep({ icon, label, desc, active }: any) {
  return (
    <div className={`flex items-start gap-3 ${active ? 'opacity-100' : 'opacity-40'}`}>
      <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-900 leading-none mb-0.5">{label}</p>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">{desc}</p>
      </div>
    </div>
  );
}

function LogisticsCard({ icon, title, status }: any) {
  return (
    <Card className="p-4 rounded-[1.5rem] border-slate-100 shadow-sm flex items-center gap-4 bg-white group hover:shadow-md transition-all">
      <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
        <p className="text-[11px] font-black text-slate-900 leading-none">{status}</p>
      </div>
    </Card>
  );
}
