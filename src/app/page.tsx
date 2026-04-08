'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Home,
  FileText,
  Sparkles,
  Star,
  Menu,
  Quote,
  Briefcase,
  Globe,
  GraduationCap,
  Users,
  CheckCircle2,
  Plane,
  ArrowRightLeft,
  Mail,
  Lock,
  ExternalLink,
  MapPin,
  Utensils,
  Navigation,
  ChevronRight,
  Building2
} from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuthContext } from "@/auth/provider";

const partners = [
  { name: "RTU RIGA", abbr: "RT" },
  { name: "UNIVERSITY OF LATVIA", abbr: "UL" },
  { name: "TURIBA UNIVERSITY", abbr: "TU" },
  { name: "RSU", abbr: "RS" },
  { name: "RISEBA", abbr: "RI" },
];

const ecosystemPartners = [
  { name: "WOLT", type: "Careers" },
  { name: "ACCENTURE", type: "Careers" },
  { name: "SIA LATPROP", type: "Housing" },
  { name: "RIGA RENTALS", type: "Housing" },
  { name: "PRINTFUL", type: "Careers" },
  { name: "BOLT", type: "Logistics" },
];

const testimonials = [
  {
    name: "Kofi Mensah",
    university: "RTU Riga",
    content: "EBENESAID turned my relocation nightmare into a structured plan. The verified housing was an absolute lifesaver.",
    avatar: "https://picsum.photos/seed/stu-1/100/100",
    flag: "🇬🇭"
  },
  {
    name: "Ananya S.",
    university: "University of Latvia",
    content: "The document vault and AI concierge made the visa process so much less stressful. Truly a platform every international student needs.",
    avatar: "https://picsum.photos/seed/stu-2/100/100",
    flag: "🇮🇳"
  },
  {
    name: "John D.",
    university: "Turiba University",
    content: "Found my flatmates and my first part-time job through the platform. It's the only tool you need as an international student in Latvia.",
    avatar: "https://picsum.photos/seed/stu-3/100/100",
    flag: "🇳🇬"
  },
  {
    name: "Maria K.",
    university: "RISEBA",
    content: "The cultural guides helped me settle in faster than expected. Precision guidance at every single step of the journey.",
    avatar: "https://picsum.photos/seed/stu-4/100/100",
    flag: "🇨🇲"
  }
];

const platformFeatures = [
  {
    icon: <Home className="h-6 w-6" />,
    title: "Verified Housing",
    desc: "Scam-free, physically inspected accommodation. Every listing is legally verified before it appears on our platform.",
    badge: "Most Popular",
    href: "/accommodation"
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Document Wallet",
    desc: "Store your visa, passport, residence permit, and all academic documents in one encrypted, accessible place.",
    badge: null,
    href: "/docs"
  },
  {
    icon: <Briefcase className="h-6 w-6" />,
    title: "Career Bridge",
    desc: "Verified part-time jobs and internships vetted for international students and work-permit compliance.",
    badge: null,
    href: "/jobs"
  },
  {
    icon: <Navigation className="h-6 w-6" />,
    title: "Arrival & Transit",
    desc: "Book your airport-to-city transfer in advance and get guided through your first days in Latvia.",
    badge: null,
    href: "/arrival"
  },
  {
    icon: <Utensils className="h-6 w-6" />,
    title: "Food & Dining",
    desc: "Order familiar and local food from our verified supplier network, delivered to your door.",
    badge: null,
    href: "/food"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Student Community",
    desc: "Connect with students from your university and country. Build your social network before you even arrive.",
    badge: null,
    href: "/community"
  },
];

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { user } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 80) {
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProtectedLink = (e: React.MouseEvent, title: string) => {
    if (!user) {
      e.preventDefault();
      setSelectedService(title);
      setShowAuthDialog(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white overflow-x-hidden">

      {/* ── Auth Dialog ───────────────────────────────────────────── */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="rounded-3xl border-none shadow-2xl p-8 bg-white max-w-[380px]">
          <DialogHeader className="text-center space-y-3">
            <div className="mx-auto bg-green-50 p-4 rounded-2xl w-fit text-green-700">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
              Sign In Required
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm leading-relaxed">
              Create a free account to access the{' '}
              <span className="font-bold text-slate-800">{selectedService}</span> module.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2.5 pt-4">
            <Button className="h-12 rounded-xl font-bold shadow-lg shadow-green-700/20 text-sm bg-green-700 hover:bg-green-800" asChild onClick={() => setShowAuthDialog(false)}>
              <Link href="/register">Create Free Account</Link>
            </Button>
            <Button variant="ghost" className="h-11 rounded-xl font-medium text-slate-500 text-sm hover:text-slate-900 hover:bg-slate-50" asChild onClick={() => setShowAuthDialog(false)}>
              <Link href="/login">Already have an account? Sign in</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Navigation ────────────────────────────────────────────── */}
      <header className={`fixed top-0 z-50 w-full border-b border-white/10 bg-green-900/95 backdrop-blur-xl transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto flex h-16 md:h-18 items-center justify-between px-5 sm:px-6 max-w-7xl">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="bg-white p-1.5 rounded-lg shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5 text-green-700" />
            </div>
            <span className="text-base md:text-lg font-black tracking-tighter text-white uppercase italic">EBENESAID</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Platform", href: "/how-it-works" },
              { label: "How it Works", href: "/how-it-works" },
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map(link => (
              <Link key={link.label} href={link.href} className="px-4 py-2 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Link href="/login" className="hidden sm:block text-sm font-semibold text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
              Sign In
            </Link>
            <Button asChild className="rounded-full px-5 md:px-7 h-9 md:h-10 font-bold bg-white text-green-800 hover:bg-green-50 border-none text-xs md:text-sm shadow-md hover:shadow-lg transition-all">
              <Link href="/register">Get Started</Link>
            </Button>

            {/* Mobile menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10 rounded-lg h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-green-900 border-none text-white p-0 w-72 sm:w-80">
                <SheetHeader className="p-6 border-b border-white/10 text-left">
                  <SheetTitle className="text-white flex items-center gap-2.5 font-black italic tracking-tighter uppercase">
                    <ShieldCheck className="h-5 w-5" /> EBENESAID
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-6 gap-1">
                  {[
                    { label: "Platform", href: "/how-it-works" },
                    { label: "How it Works", href: "/how-it-works" },
                    { label: "About Us", href: "/about" },
                    { label: "Contact", href: "/contact" },
                  ].map(link => (
                    <Link key={link.label} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all">
                      {link.label}
                    </Link>
                  ))}
                  <div className="h-px bg-white/10 my-4" />
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all">
                    Sign In
                  </Link>
                  <Button asChild className="mt-2 h-12 rounded-xl font-bold bg-white text-green-800 hover:bg-green-50 border-none">
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Create Free Account</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">

        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-green-950 to-slate-900" />

        {/* Decorative glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-700/8 rounded-full blur-[140px] pointer-events-none" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating accent shapes */}
        <div className="absolute top-20 right-12 md:right-24 w-20 h-20 md:w-28 md:h-28 bg-green-500/10 border border-green-400/20 rounded-3xl rotate-12 blur-sm pointer-events-none" />
        <div className="absolute bottom-32 left-8 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-400/10 border border-blue-300/20 rounded-2xl -rotate-6 blur-sm pointer-events-none" />
        <div className="absolute top-1/3 right-8 md:right-16 w-10 h-10 bg-green-400/20 rounded-xl rotate-45 pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-6 max-w-5xl relative z-10 text-center py-20 md:py-28">
          <div className="space-y-7 md:space-y-9 animate-in fade-in zoom-in-95 duration-700">

            {/* Top badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-500/15 border border-green-400/25 px-5 py-2 text-xs font-bold text-green-300 uppercase tracking-widest backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-green-400" />
                <span>The Smart Relocation Platform for Latvia</span>
              </div>
            </div>

            {/* Social proof pill */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-2.5 shadow-xl">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="h-7 w-7 border-2 border-slate-900 shadow-lg">
                      <AvatarImage src={`https://picsum.photos/seed/stu-presence-${i}/100/100`} />
                      <AvatarFallback className="bg-green-700 text-white text-[8px] font-black">ST</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">2,840+ students</span>
                  <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Live</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-[3.5vw] sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white whitespace-nowrap sm:whitespace-normal">
                From Arrival to{' '}
                <br className="hidden sm:block" />
                Settlement.{' '}
                <span className="text-green-400 italic">Simplified.</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-slate-300 leading-relaxed font-medium max-w-2xl mx-auto">
                The trusted platform for international students relocating to Latvia and the Baltics. Housing, documents, jobs, and community — all in one place.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-2">
              <Button size="lg" className="w-full sm:w-auto h-13 md:h-14 px-8 md:px-10 text-sm md:text-base font-bold rounded-full bg-green-500 hover:bg-green-500 text-white shadow-xl shadow-green-600/30 hover:-translate-y-0.5 transition-all border-none group" asChild>
                <Link href="/register">
                  Get Started — It's Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-13 md:h-14 px-8 md:px-10 text-sm md:text-base font-semibold rounded-full border border-white/20 bg-white/8 text-white hover:bg-white/15 hover:border-white/30 backdrop-blur-sm transition-all" asChild>
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 pt-2 opacity-70">
              {[
                { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: "Verified Listings" },
                { icon: <Lock className="h-3.5 w-3.5" />, label: "Secure & Private" },
                { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Free to Join" },
              ].map(chip => (
                <div key={chip.label} className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  {chip.icon}
                  {chip.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── UNIVERSITY PARTNERS ───────────────────────────────────── */}
      {/* White background — clear break from dark hero */}
      <section className="pt-4 pb-14 md:pb-20 bg-white overflow-hidden">
        <div className="container mx-auto px-5 mb-8 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Trusted by students at Latvia's top universities
          </p>
        </div>
        <div className="flex overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="animate-marquee flex items-center gap-10 md:gap-20 whitespace-nowrap">
            {partners.concat(partners).map((partner, i) => (
              <div key={i} className="flex items-center gap-5 md:gap-8 cursor-default group shrink-0">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-slate-100 group-hover:bg-green-50 border border-slate-200 group-hover:border-green-200 flex items-center justify-center transition-all shadow-sm shrink-0">
                  <span className="text-sm font-black text-slate-400 group-hover:text-green-700 transition-colors">{partner.abbr}</span>
                </div>
                <span className="text-lg md:text-2xl font-black text-slate-300 group-hover:text-slate-600 tracking-tight transition-colors">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM FEATURES ─────────────────────────────────────── */}
      {/* Light slate background — distinct from white sections */}
      <section className="py-20 md:py-28 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <div className="text-center mb-14 md:mb-18">
            <Badge className="bg-green-50 text-green-700 border border-green-100 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-5">
              Everything You Need
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              One Platform. <span className="text-green-700 italic">Every Step.</span>
            </h2>
            <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              From your first housing search to landing your first job in Latvia — EBENESAID covers every stage of your student journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {platformFeatures.map((feature, i) => (
              <Link
                key={i}
                href={feature.href}
                onClick={(e) => handleProtectedLink(e, feature.title)}
                className="group relative bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-lg hover:border-green-100 hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-4"
              >
                {feature.badge && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {feature.badge}
                  </span>
                )}
                <div className="h-12 w-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center group-hover:bg-green-700 group-hover:text-white transition-all duration-300 shadow-sm">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-green-700 transition-colors mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-green-600 text-xs font-bold mt-auto pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore module <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM PARTNERS ────────────────────────────────────── */}
      {/* White background — alternating from slate-50 */}
      <section className="py-14 md:py-20 bg-white border-b border-slate-100 overflow-hidden">
        <div className="container mx-auto px-5 mb-8 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Verified Ecosystem Partners</p>
          <p className="text-[11px] font-medium text-slate-300 uppercase tracking-wider">Housing · Careers · Logistics</p>
        </div>
        <div className="flex overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="animate-marquee flex items-center gap-10 md:gap-20 whitespace-nowrap" style={{ animationDirection: 'reverse' }}>
            {ecosystemPartners.concat(ecosystemPartners).map((partner, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-default shrink-0">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-green-100 flex items-center justify-center transition-all">
                  <span className="text-[9px] font-black text-slate-300 group-hover:text-green-600 transition-colors">{partner.name.slice(0, 2)}</span>
                </div>
                <div>
                  <p className="text-sm md:text-base font-black text-slate-400 group-hover:text-slate-700 transition-colors uppercase tracking-tight">{partner.name}</p>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{partner.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISA GUIDANCE ─────────────────────────────────────────── */}
      {/* Sky-tinted very light background */}
      <section className="py-20 md:py-28 lg:py-32" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)' }}>
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <div className="text-center mb-14 md:mb-18">
            <Badge className="bg-green-50 text-green-700 border border-green-100 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-5">
              Visa & Travel Guidance
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Know Your <span className="text-green-700 italic">Visa Requirements.</span>
            </h2>
            <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Clear guidance on travel and visa requirements based on how long you plan to stay in Latvia.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Short Term */}
            <div className="bg-white rounded-3xl p-7 md:p-10 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500 group flex flex-col gap-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 bg-green-700 text-white rounded-2xl flex items-center justify-center shadow-md shadow-green-700/20 shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Option 01</p>
                    <h3 className="text-xl font-black text-slate-900">Short-Term Stay</h3>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-xs px-3 py-1 shrink-0 mt-1">
                  Under 3 Months
                </Badge>
              </div>

              <div className="flex items-center justify-between py-7 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-100">
                    <span className="text-base font-black text-slate-700">CM</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Cameroon</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 px-4">
                  <div className="w-full h-px border-t-2 border-dashed border-green-200" />
                  <Plane className="h-5 w-5 text-green-600 animate-float" />
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-green-100">Direct</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-slate-900 shadow-md flex items-center justify-center">
                    <span className="text-base font-black text-white">LV</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase text-slate-700 tracking-wider">Latvia</p>
                </div>
              </div>

              <div className="space-y-2.5 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <p className="text-sm font-bold text-slate-800">Schengen C Visa — Short-Stay</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  For stays under 3 months (exchanges, visits). Direct entry permitted under Schengen protocols for eligible academic guests.
                </p>
              </div>
            </div>

            {/* Long Term */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-7 md:p-10 border border-white/5 shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col gap-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-[80px] pointer-events-none" />

              <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 bg-white text-slate-900 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                    <ArrowRightLeft className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Option 02</p>
                    <h3 className="text-xl font-black text-white">Long-Term Stay</h3>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-300 border border-green-400/30 font-bold text-xs px-3 py-1 shrink-0 mt-1 animate-pulse">
                  3+ Months
                </Badge>
              </div>

              <div className="flex items-center justify-between py-7 px-4 bg-white/5 rounded-2xl border border-white/10 relative z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <span className="text-sm font-black text-white">CM</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Cameroon</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-3">
                  <div className="w-full h-px border-t border-dashed border-green-500/30" />
                  <span className="text-[9px] font-bold text-green-400 mt-1 bg-slate-900/60 px-2 py-0.5 rounded-full">via Cairo</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                    <span className="text-sm font-black text-green-300">EG</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase text-green-400">Egypt</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-3">
                  <div className="w-full h-px border-t border-dashed border-green-500/30" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center">
                    <span className="text-sm font-black text-slate-900">LV</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase text-white">Latvia</p>
                </div>
              </div>

              <div className="space-y-2.5 p-5 bg-white/5 rounded-2xl border border-white/10 relative z-10">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-green-400 shrink-0" />
                  <p className="text-sm font-bold text-white">National D Visa — Long-Stay Student</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Required for stays over 3 months. Since there is no Latvian Embassy in Cameroon, students must transit via the <strong className="text-slate-200">Latvian Embassy in Cairo, Egypt</strong> for visa processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW TO GET STARTED ────────────────────────────────────── */}
      {/* Dark background — strong contrast break */}
      <section className="py-20 md:py-28 lg:py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-700/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-5 sm:px-6 max-w-7xl relative z-10">
          <div className="text-center mb-14 md:mb-18">
            <Badge className="bg-green-500/15 text-green-400 border border-green-500/25 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-5">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Get Started in <span className="text-green-400 italic">Two Steps.</span>
            </h2>
          </div>

          <div className="grid gap-5 md:gap-6">
            {/* Step 1 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-7 md:p-10 border border-white/10 hover:border-green-500/30 hover:bg-white/8 transition-all duration-500 group">
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                <div className="lg:w-1/3 space-y-5 shrink-0">
                  <div className="h-14 w-14 bg-green-500 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-green-600/20">
                    01
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    Apply to a Partner <span className="text-green-400 italic">University</span>
                  </h3>
                  <p className="text-slate-400 font-medium leading-relaxed text-sm md:text-base">
                    Your journey begins with academic excellence. Choose a certified Latvian institution and start your application directly.
                  </p>
                </div>
                <div className="lg:w-2/3 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {partners.map((uni, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/8 hover:bg-white/10 hover:border-green-500/30 transition-all group/uni">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-green-500/15 border border-green-500/25 flex items-center justify-center text-[10px] font-black text-green-400 shrink-0">
                          {uni.abbr}
                        </div>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-tight truncate">{uni.name}</span>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-[10px] font-bold uppercase border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all shrink-0 ml-3" asChild>
                        <Link href="/register">Apply</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-green-700 rounded-3xl p-7 md:p-10 border border-green-500/40 shadow-xl shadow-green-900/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-[80px] pointer-events-none" />
              <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10">
                <div className="lg:w-1/2 space-y-5">
                  <div className="h-14 w-14 bg-white text-green-700 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                    02
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    Set Up Your <span className="italic">EBENESAID Account</span>
                  </h3>
                  <p className="text-green-100 font-medium leading-relaxed text-sm md:text-base">
                    Once your admission is confirmed, register on EBENESAID to unlock your personalized relocation plan and manage every step of your move.
                  </p>
                </div>
                <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
                  <Button size="lg" className="h-14 px-10 rounded-full font-bold text-base bg-white text-green-700 hover:bg-green-50 shadow-xl hover:-translate-y-0.5 transition-all group border-none w-full sm:w-auto" asChild>
                    <Link href="/register">
                      Create My Account <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STUDENT TESTIMONIALS ──────────────────────────────────── */}
      {/* Back to white — clean, light section */}
      <section className="py-20 md:py-28 bg-white overflow-hidden border-t border-slate-100">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl mb-12 md:mb-16 text-center">
          <div className="inline-flex items-center gap-2 text-green-700 font-bold uppercase tracking-widest text-xs mb-4">
            <Quote className="h-4 w-4" />
            Student Reviews
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Trusted by Ambitious <span className="text-green-700 italic">Students Worldwide.</span>
          </h2>
        </div>

        <div className="flex overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="animate-marquee flex items-stretch gap-5 md:gap-7 whitespace-nowrap">
            {testimonials.concat(testimonials).map((t, i) => (
              <div key={i} className="w-[300px] sm:w-[360px] md:w-[420px] shrink-0 bg-white p-7 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-green-100 transition-all duration-500 flex flex-col gap-5 group whitespace-normal">
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-amber-400" />)}
                </div>
                <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed flex-1">
                  "{t.content}"
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                      <img src={t.avatar} alt={t.name} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-none">{t.flag} {t.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.university}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-[10px] px-2.5 py-1">
                    Verified
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      {/* Sky blue gradient — brand color section, maximum impact */}
      <section className="py-20 md:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 70%, #16a34a 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="container mx-auto px-5 sm:px-6 max-w-4xl relative z-10">
          <div className="text-center space-y-8">
            <div className="h-16 w-16 md:h-20 md:w-20 mx-auto bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-xl">
              <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Start Your Journey to{' '}
                <span className="italic opacity-90">Latvia Today.</span>
              </h2>
              <p className="text-green-100 text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto">
                Join thousands of international students who chose EBENESAID for a smooth, safe, and supported relocation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Button size="lg" className="w-full sm:w-auto h-13 md:h-14 px-10 md:px-12 text-sm md:text-base font-bold rounded-full bg-white text-green-800 hover:bg-green-50 shadow-xl hover:-translate-y-0.5 transition-all border-none" asChild>
                <Link href="/register">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-13 md:h-14 px-10 md:px-12 text-sm md:text-base font-semibold rounded-full border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 transition-all" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8 pt-2 opacity-70">
              {[
                <><CheckCircle2 className="h-4 w-4" /> Free to join</>,
                <><ShieldCheck className="h-4 w-4" /> Verified listings</>,
                <><Lock className="h-4 w-4" /> Privacy protected</>,
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-green-100 text-xs font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      {/* White — clean ending */}
      <footer className="bg-white border-t border-slate-100 py-14 md:py-20">
        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">

            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-2 space-y-5">
              <Link href="/" className="flex items-center gap-2.5 group w-fit">
                <div className="bg-green-700 p-2 rounded-xl shadow-md shadow-green-700/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">EBENESAID</span>
              </Link>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">
                The relocation platform for international students in Latvia and the Baltics. Housing, documents, jobs, and community — all in one place.
              </p>
              <div className="flex items-center gap-3">
                <Link href="/register" className="inline-flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
                  Get Started Free <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/login" className="text-xs font-semibold text-slate-500 hover:text-green-700 px-4 py-2.5 rounded-xl hover:bg-green-50 transition-colors">
                  Sign In
                </Link>
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h4 className="font-black text-slate-900 mb-5 uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                {[
                  { label: "Verified Housing", href: "/accommodation", title: "Verified Housing" },
                  { label: "Job Board", href: "/jobs", title: "Job Board" },
                  { label: "Document Wallet", href: "/docs", title: "Document Wallet" },
                  { label: "Order Food", href: "/food", title: "Food" },
                  { label: "Arrival & Transit", href: "/arrival", title: "Arrival & Transit" },
                ].map(link => (
                  <li key={link.label}>
                    <Link href={link.href} onClick={(e) => handleProtectedLink(e, link.title)} className="hover:text-green-700 transition-colors flex items-center gap-1.5 group">
                      {link.label}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4 className="font-black text-slate-900 mb-5 uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                {[
                  { label: "How It Works", href: "/how-it-works" },
                  { label: "About Us", href: "/about" },
                  { label: "Contact", href: "/contact" },
                  { label: "Support", href: "/support" },
                  { label: "Sign In", href: "/login" },
                ].map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-green-700 transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3 text-xs font-medium text-slate-400">
            <p>© 2026 EBENESAID. All rights reserved.</p>
            <p>Built for international students in Latvia and the Baltics.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
