
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowRight, 
  LayoutDashboard, 
  Home, 
  FileText, 
  Sparkles,
  Star,
  Menu,
  Quote,
  Building2,
  Briefcase,
  Zap,
  Globe,
  GraduationCap,
  UserPlus,
  Users,
  CheckCircle2,
  Plane,
  MapPin,
  Clock,
  ArrowRightLeft,
  Navigation,
  Mail,
  Lock,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";

const partners = [
  { name: "RTU RIGA", logo: "https://picsum.photos/seed/uni1/240/240" },
  { name: "UNIVERSITY OF LATVIA", logo: "https://picsum.photos/seed/uni2/240/240" },
  { name: "TURIBA UNIVERSITY", logo: "https://picsum.photos/seed/uni3/240/240" },
  { name: "RSU", logo: "https://picsum.photos/seed/uni4/240/240" },
  { name: "RISEBA", logo: "https://picsum.photos/seed/uni5/240/240" },
];

const ecosystemPartners = [
  { name: "WOLT", logo: "https://picsum.photos/seed/wolt/240/240", type: "Careers" },
  { name: "ACCENTURE", logo: "https://picsum.photos/seed/accenture/240/240", type: "Careers" },
  { name: "SIA LATPROP", logo: "https://picsum.photos/seed/housing1/240/240", type: "Housing" },
  { name: "RIGA RENTALS", logo: "https://picsum.photos/seed/housing2/240/240", type: "Housing" },
  { name: "PRINTFUL", logo: "https://picsum.photos/seed/printful/240/240", type: "Careers" },
  { name: "BOLT", logo: "https://picsum.photos/seed/bolt/240/240", type: "Logistics" },
];

const testimonials = [
  {
    name: "Kofi Mensah",
    university: "RTU Riga",
    content: "EBENESAID turned my relocation nightmare into a structured plan. The verified housing was an absolute lifesaver.",
    avatar: "https://picsum.photos/seed/stu-1/100/100"
  },
  {
    name: "Ananya S.",
    university: "University of Latvia",
    content: "The document vault and AI concierge made the visa process so much less stressful. Truly a global OS for students.",
    avatar: "https://picsum.photos/seed/stu-2/100/100"
  },
  {
    name: "John D.",
    university: "Turiba University",
    content: "Found my flatmates and my first part-time job through the platform. It's the only tool you need in Latvia.",
    avatar: "https://picsum.photos/seed/stu-3/100/100"
  },
  {
    name: "Maria K.",
    university: "RISEBA",
    content: "The cultural guides helped me settle in faster than I expected. Precision guidance at every single step.",
    avatar: "https://picsum.photos/seed/stu-4/100/100"
  }
];

export default function LandingPage() {
  const heroBg = PlaceHolderImages.find(img => img.id === "hero-bg");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const { user } = useUser();
  const router = useRouter();

  const handleProtectedLink = (e: React.MouseEvent, title: string, href: string) => {
    if (!user) {
      e.preventDefault();
      setSelectedService(title);
      setShowAuthDialog(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white overflow-x-hidden">
      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="rounded-[2.5rem] sm:rounded-[3rem] border-none shadow-2xl p-8 bg-white max-w-[400px]">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto bg-primary/10 p-4 rounded-2xl w-fit text-primary">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight leading-none italic">Authorized Access <span className="text-primary">Required</span></DialogTitle>
            <DialogDescription className="text-slate-500 font-medium text-sm leading-relaxed px-4">
              Register to <span className="text-primary font-bold italic">EBENESAID</span> to explore the <span className="font-bold text-slate-900">{selectedService}</span> module.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button className="h-14 rounded-2xl font-black shadow-xl shadow-primary/20 text-base" asChild onClick={() => setShowAuthDialog(false)}>
              <Link href="/register">Register to EBENESAID</Link>
            </Button>
            <Button variant="ghost" className="h-12 rounded-2xl font-bold text-slate-400 text-sm" asChild onClick={() => setShowAuthDialog(false)}>
              <Link href="/login">Log in to existing node</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header - Unified Professional Sky Blue */}
      <header className="fixed top-0 z-50 w-full border-b border-sky-400/30 bg-sky-600 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 max-w-7xl">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-white p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-sky-600" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tighter text-white font-headline uppercase italic leading-none">EBENESAID</span>
          </Link>

          <nav className="hidden lg:flex gap-8 xl:gap-10">
            <Link href="/how-it-works" className="text-sm font-bold text-white hover:text-white/80 transition-colors">Platform</Link>
            <Link href="/how-it-works" className="text-sm font-bold text-white/80 hover:text-white transition-colors">How it Works</Link>
            <Link href="/about" className="text-sm font-bold text-white/80 hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="text-sm font-bold text-white/80 hover:text-white transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/login" className="text-sm font-bold text-white hidden sm:block hover:text-white/80">Log In</Link>
            <Button asChild className="rounded-full px-6 md:px-8 h-10 md:h-12 font-black shadow-xl bg-white text-sky-600 hover:bg-sky-50 border-none text-xs md:text-sm">
              <Link href="/register">Get Started</Link>
            </Button>
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10 rounded-full h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-sky-600 border-none text-white p-0 w-72">
                <SheetHeader className="p-8 border-b border-white/10 text-left">
                  <SheetTitle className="text-white flex items-center gap-2 font-black italic tracking-tighter uppercase">
                    <ShieldCheck className="h-6 w-6" />
                    EBENESAID
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-8 gap-6">
                  <Link href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold hover:text-white/70 transition-colors">Platform</Link>
                  <Link href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold hover:text-white/70 transition-colors">How it Works</Link>
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold hover:text-white/70 transition-colors">About Us</Link>
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold hover:text-white/70 transition-colors">Contact</Link>
                  <div className="h-px bg-white/10 my-4" />
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold hover:text-white/70 transition-colors">Log In</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroBg && (
            <Image
              src={heroBg.imageUrl}
              alt={heroBg.description}
              fill
              className="object-cover"
              data-ai-hint={heroBg.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10 text-center">
          <div className="space-y-6 md:space-y-10 animate-in fade-in zoom-in-95 duration-1000">
            <div className="flex flex-col items-center gap-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-4 py-2 md:px-6 md:py-2.5 text-[10px] md:text-xs font-black text-white uppercase tracking-[0.25em] backdrop-blur-md">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                <span>The Smart Relocation Platform</span>
              </div>

              {/* Student Presence Node */}
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 md:p-3 pr-6 animate-in slide-in-from-bottom-4 duration-1000">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="h-8 w-8 md:h-10 md:w-10 border-2 border-slate-900 shadow-xl">
                      <AvatarImage src={`https://picsum.photos/seed/stu-presence-${i}/100/100`} />
                      <AvatarFallback className="bg-primary text-white text-[8px] font-black">ST</AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary flex items-center justify-center text-white border-2 border-slate-900 shadow-xl text-[8px] md:text-[10px] font-black">
                    +
                  </div>
                </div>
                <div className="text-left space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm md:text-lg font-black text-white leading-none">2,840+ Students</span>
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  </div>
                  <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em]">Active Students</p>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-white">
              From Arrival to <br />
              Settlement. <span className="text-primary italic">Simplified.</span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-slate-200 leading-relaxed font-medium max-w-2xl mx-auto px-4">
              The trusted infrastructure for international students. Secure your housing, documents, and community with a unified platform designed for the Baltics.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 pt-4">
              <Button size="lg" className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 text-base md:text-lg font-black rounded-full bg-primary text-white shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all" asChild>
                <Link href="/register">Join EBENESAID <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 text-base md:text-lg font-black rounded-full border-2 border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20" asChild>
                <Link href="/how-it-works">Explore Platform</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee - Universities */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100 overflow-hidden">
        <div className="container mx-auto px-4 mb-10 text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Trusted by Students at These Universities</p>
          <div className="h-0.5 w-12 bg-primary/20 mx-auto rounded-full" />
        </div>
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-16 md:gap-32 whitespace-nowrap">
            {partners.concat(partners).map((partner, i) => (
              <div key={i} className="flex items-center gap-6 md:gap-10 hover:scale-105 transition-transform duration-500 cursor-pointer group">
                <div className="h-20 w-20 md:h-28 md:w-28 relative overflow-hidden rounded-2xl md:rounded-3xl bg-white shadow-xl p-3 md:p-5 border border-slate-100 group-hover:border-primary/30 transition-colors">
                  <img src={partner.logo} alt={partner.name} className="object-contain w-full h-full grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <span className="text-2xl md:text-4xl font-black text-slate-800 tracking-tighter group-hover:text-primary transition-colors">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Partners Marquee - Housing & Jobs */}
      <section className="py-12 md:py-20 bg-slate-50 border-b border-slate-100 overflow-hidden">
        <div className="container mx-auto px-4 mb-8 text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">Verified Ecosystem Partners</p>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Housing · Careers · Logistics</p>
        </div>
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-12 md:gap-24 whitespace-nowrap">
            {ecosystemPartners.concat(ecosystemPartners).map((partner, i) => (
              <div key={i} className="flex items-center gap-4 md:gap-8 group cursor-pointer">
                <div className="h-14 w-14 md:h-20 md:w-20 relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-sm hover:shadow-md p-2.5 md:p-4 border border-slate-100 group-hover:border-primary/20 transition-all">
                  <img src={partner.logo} alt={partner.name} className="object-contain w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm md:text-xl font-black text-slate-600 tracking-tighter group-hover:text-primary transition-colors italic uppercase leading-none">{partner.name}</span>
                  <p className="text-[7px] md:text-[8px] font-black text-slate-300 group-hover:text-slate-400 transition-colors uppercase tracking-[0.2em]">{partner.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa & Transit Protocols Section */}
      <section className="py-20 md:py-28 lg:py-36 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <div className="text-center mb-14 md:mb-20">
            <Badge className="bg-primary/10 text-primary font-bold px-5 py-1.5 rounded-full border-none uppercase tracking-widest text-xs mb-5">
              Visa & Travel Guidance
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
              Understand Your <span className="text-primary italic">Visa Requirements.</span>
            </h2>
            <p className="text-slate-500 font-medium text-base md:text-lg max-w-2xl mx-auto">
              Clear guidance on travel and visa requirements based on how long you plan to stay in Latvia.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Scenario 01 - Short Term */}
            <Card className="rounded-[3rem] p-8 md:p-12 border-none bg-slate-50 shadow-sm group hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Option 01</p>
                      <h3 className="text-xl font-black text-slate-900 uppercase">Short-Term Stay</h3>
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] px-3 py-1 uppercase tracking-widest">&lt; 3 Months</Badge>
                </div>

                <div className="flex items-center justify-between py-10 px-4 border-y border-slate-200/60 relative">
                  <div className="flex flex-col items-center gap-2 relative z-10">
                    <div className="h-14 w-14 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-primary/10">
                      <span className="text-xl font-black text-slate-900">CM</span>
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Cameroon</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2 relative">
                    <div className="w-full h-px border-t-2 border-dashed border-primary/20 absolute top-1/2 -translate-y-1/2" />
                    <Plane className="h-6 w-6 text-primary relative z-10 animate-float" />
                    <p className="text-[9px] font-black uppercase text-primary tracking-[0.3em] mt-8 bg-slate-50 px-3 py-1 rounded-full border border-primary/10">Direct Flight</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 relative z-10">
                    <div className="h-14 w-14 rounded-full bg-slate-900 shadow-xl flex items-center justify-center">
                      <span className="text-xl font-black text-white">LV</span>
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Latvia</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <p className="text-sm font-black text-slate-900 uppercase italic">Protocol: <span className="text-primary">Short-Stay (C)</span></p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Optimized for stays &lt; 3 months (exchanges, visits). Direct entry is permitted under standardized Schengen protocols for eligible academic guests.
                </p>
              </div>
            </Card>

            {/* Scenario 02 - Long Term */}
            <Card className="rounded-[3rem] p-8 md:p-12 border-none bg-slate-900 text-white shadow-2xl relative overflow-hidden group hover:shadow-primary/10 transition-all duration-500 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-[80px]" />
              
              <div>
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-white text-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                      <ArrowRightLeft className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Option 02</p>
                      <h3 className="text-xl font-black text-white uppercase">Long-Term Stay</h3>
                    </div>
                  </div>
                  <Badge className="bg-primary text-white border-none font-black text-[10px] px-3 py-1 uppercase tracking-widest animate-pulse">3+ Months</Badge>
                </div>

                <div className="flex items-center justify-between py-8 relative z-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <span className="text-lg font-black text-white">CM</span>
                    </div>
                    <p className="text-[9px] font-bold uppercase text-slate-400">Cameroon</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-px bg-gradient-to-r from-primary/50 to-transparent border-t border-dashed border-primary/30" />
                    <Badge variant="outline" className="text-[7px] text-primary border-primary/30 px-1 py-0 uppercase">Cairo Visit</Badge>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border-2 border-primary/40">
                      <span className="text-lg font-black text-primary">EG</span>
                    </div>
                    <p className="text-[9px] font-bold uppercase text-primary">Egypt</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-px bg-gradient-to-r from-transparent to-primary/50 border-t border-dashed border-primary/30" />
                    <Badge variant="outline" className="text-[7px] text-primary border-primary/30 px-1 py-0 uppercase">Latvia</Badge>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-2xl">
                      <span className="text-lg font-black text-slate-900">LV</span>
                    </div>
                    <p className="text-[9px] font-bold uppercase text-white">Latvia</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-4 bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                  <Navigation className="h-5 w-5 text-primary" />
                  <p className="text-sm font-black text-white uppercase italic">Protocol: <span className="text-primary">National Student (D)</span></p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Mandatory for stays &gt; 3 months. Since there is no Latvian Embassy in Cameroon, students must transit via Egypt to visit the <strong>Latvian Embassy in Cairo</strong> for visa processing before arrival.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Get Started Section */}
      <section className="py-20 md:py-28 lg:py-36 bg-slate-50 relative overflow-hidden border-y border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <div className="text-center mb-14 md:mb-20">
            <Badge className="bg-primary/10 text-primary font-bold px-5 py-1.5 rounded-full border-none uppercase tracking-widest text-xs mb-5">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Get Started in <span className="text-primary italic">Two Steps.</span>
            </h2>
          </div>

          <div className="grid gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
              <div className="flex flex-col lg:flex-row gap-12 items-start relative z-10">
                <div className="lg:w-1/3 space-y-6">
                  <div className="h-16 w-16 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/20">
                    01
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight italic">Apply to a Partner <br /><span className="text-primary">University</span></h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Your journey begins with academic excellence. Select a certified institution to start your application process directly.
                  </p>
                </div>
                <div className="lg:w-2/3 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {partners.map((uni, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group/uni hover:bg-white hover:border-primary/20 transition-all duration-300">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-white border border-slate-100 p-1.5 shadow-sm shrink-0">
                          <img src={uni.logo} alt={uni.name} className="object-contain w-full h-full grayscale group-hover/uni:grayscale-0 transition-all" />
                        </div>
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight leading-none truncate pr-2">{uni.name}</span>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-[8px] font-black uppercase tracking-widest border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shrink-0" asChild>
                        <Link href="/register">Apply</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white border border-white/5 shadow-2xl relative overflow-hidden group hover:shadow-primary/10 transition-all duration-500">
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-1/4 translate-y-1/4 blur-[100px]" />
              <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                <div className="lg:w-1/3 space-y-6">
                  <div className="h-16 w-16 bg-white text-slate-900 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl">
                    02
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight italic">Set Up Your <br /><span className="text-primary">EBENESAID Account</span></h3>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Once your admission is confirmed, register on EBENESAID to unlock your personalized relocation plan and manage every step of your move.
                  </p>
                </div>
                <div className="lg:w-2/3 flex justify-center lg:justify-end">
                  <Button size="lg" className="h-16 px-12 rounded-full font-black text-lg bg-primary text-white shadow-2xl shadow-primary/40 hover:-translate-y-1 transition-all group border-none" asChild>
                    <Link href="/register">
                      Register <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Settled Benefits Section */}
      <section className="py-20 md:py-28 lg:py-36 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <div className="text-center mb-14 md:mb-20">
            <Badge className="bg-primary/10 text-primary font-bold px-5 py-1.5 rounded-full border-none uppercase tracking-widest text-xs mb-5">
              Everything You Need
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
              Your Life in Latvia, <span className="text-primary italic">Supported.</span>
            </h2>
            <p className="text-slate-500 font-medium text-base md:text-lg max-w-2xl mx-auto">
              Your journey doesn't end at the airport. EBENESAID supports you throughout your entire student life in Latvia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <BenefitCard 
              icon={<Briefcase className="h-6 w-6" />}
              title="Career Bridge"
              desc="Access verified part-time jobs and internships specifically vetted for international students and work-permit compliance."
            />
            <BenefitCard 
              icon={<Home className="h-6 w-6" />}
              title="Verified Housing"
              desc="Move between verified units with ease. Our marketplace ensures your housing transitions are always scam-free and legal."
            />
            <BenefitCard 
              icon={<Users className="h-6 w-6" />}
              title="Student Circles"
              desc="Join origin-based or interest-led communities. Connect with peers who share your journey and build your network in the Baltics."
            />
            <BenefitCard 
              icon={<Mail className="h-6 w-6" />}
              title="Document Wallet"
              desc="Receive real-time alerts for residence permit renewals and manage all your institutional correspondence in one secure node."
            />
            <BenefitCard 
              icon={<GraduationCap className="h-6 w-6" />}
              title="Academic Sync"
              desc="Stay synchronized with your university's orientation, exams, and milestones through your personalized roadmap."
            />
            <BenefitCard 
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Local Essentials"
              desc="From opening a bank account to getting your e-talons, we provide the protocol for every essential local service."
            />
          </div>
        </div>
      </section>

      {/* Student Voices Section */}
      <section className="py-20 md:py-28 lg:py-36 bg-slate-50 overflow-hidden relative border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10 text-center mb-16 md:mb-24">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
               <Quote className="h-4 w-4 fill-primary/20" />
               Student Voices
             </div>
             <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Trusted by the World's <br /><span className="text-primary italic">Most Ambitious Students.</span></h2>
          </div>
        </div>

        <div className="flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-6 md:gap-10 whitespace-nowrap hover:pause">
            {testimonials.concat(testimonials).map((t, i) => (
              <div key={i} className="w-[300px] md:w-[450px] shrink-0 bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 flex flex-col gap-6 md:gap-8 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                      <img src={t.avatar} alt={t.name} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <p className="text-lg md:text-xl font-black text-slate-900 group-hover:text-primary transition-colors">{t.name}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.university}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-none font-bold text-[10px] px-3 py-1">Verified User</Badge>
                </div>
                <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed italic whitespace-normal">
                  "{t.content}"
                </p>
                <div className="flex gap-1 text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-28 lg:py-36 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="bg-slate-900 rounded-[3rem] md:rounded-[4rem] p-10 md:p-20 relative overflow-hidden border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-12">
              <div className="h-20 w-20 md:h-24 md:w-24 bg-primary/20 rounded-[2rem] flex items-center justify-center text-primary shadow-2xl shadow-primary/20">
                <Sparkles className="h-10 w-10 md:h-12 md:w-12" />
              </div>
              
              <div className="space-y-6 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                  Start Your Journey to <span className="text-primary italic">Latvia Today.</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                  Join thousands of students who chose EBENESAID for a smooth, safe, and supported relocation to Latvia.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-lg">
                <Button size="lg" className="w-full sm:w-1/2 h-16 md:h-20 px-10 text-lg md:text-xl font-black rounded-full bg-primary text-white shadow-2xl shadow-primary/40 hover:-translate-y-1 transition-all group border-none" asChild>
                  <Link href="/register">
                    Register
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-1/2 h-16 md:h-20 px-10 text-lg md:text-xl font-black rounded-full border-2 border-white/20 bg-white/5 text-white backdrop-blur-md hover:bg-white/10 transition-all" asChild>
                  <Link href="/login">
                    Login
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-4 pt-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Free to join · No hidden fees
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 mb-14">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-sky-600 p-2.5 rounded-2xl shadow-lg shadow-sky-600/20">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">EBENESAID</span>
              </div>
              <p className="text-slate-500 text-base max-w-sm font-medium leading-relaxed">
                The relocation platform for international students in Latvia and the Baltics. Secure housing, documents, jobs, and community — all in one place.
              </p>
              <div className="flex items-center gap-3">
                <Link href="/register" className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm">
                  Get Started Free <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors px-4 py-2.5">
                  Sign In
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-black text-slate-900 mb-5 uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-3.5 text-sm text-slate-500 font-medium">
                <li><Link href="/accommodation" onClick={(e) => handleProtectedLink(e, "Verified Housing", "/accommodation")} className="hover:text-primary transition-colors flex items-center gap-1.5">Verified Housing <ExternalLink className="h-3 w-3 opacity-30" /></Link></li>
                <li><Link href="/jobs" onClick={(e) => handleProtectedLink(e, "Job Board", "/jobs")} className="hover:text-primary transition-colors flex items-center gap-1.5">Job Board <ExternalLink className="h-3 w-3 opacity-30" /></Link></li>
                <li><Link href="/docs" onClick={(e) => handleProtectedLink(e, "Secure Wallet", "/docs")} className="hover:text-primary transition-colors flex items-center gap-1.5">Document Wallet <ExternalLink className="h-3 w-3 opacity-30" /></Link></li>
                <li><Link href="/food" onClick={(e) => handleProtectedLink(e, "Food", "/food")} className="hover:text-primary transition-colors flex items-center gap-1.5">Order Food <ExternalLink className="h-3 w-3 opacity-30" /></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-slate-900 mb-5 uppercase tracking-widest text-xs">Support</h4>
              <ul className="space-y-3.5 text-sm text-slate-500 font-medium">
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400 text-center md:text-left">
            <p>© 2026 EBENESAID. All rights reserved.</p>
            <p>Built for international students in Latvia and the Baltics.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PillarCard({ icon, title, desc, badge }: { icon: React.ReactNode, title: string, desc: string, badge?: string }) {
  return (
    <div className="group bg-white p-8 md:p-12 lg:p-14 rounded-3xl md:rounded-[3.5rem] shadow-sm hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-700 border border-slate-100 flex flex-col items-start gap-8 md:gap-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-2xl md:rounded-[2rem] bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-inner">
        <div className="h-6 w-6 md:h-8 md:w-8 lg:h-10 md:w-10">{icon}</div>
      </div>

      <div className="space-y-4 md:space-y-5">
        <div className="flex flex-col gap-2 md:gap-3">
          {badge && (
            <span className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.3em]">{badge}</span>
          )}
          <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">{title}</h3>
        </div>
        <p className="text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-primary/20 transition-all duration-500 flex flex-col gap-6">
      <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight italic">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}
