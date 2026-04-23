'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowRight, 
  Target, 
  Rocket, 
  Globe, 
  Heart,
  Menu,
  Linkedin,
  Twitter,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/brand-logo";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuthContext } from "@/auth/provider";

export default function AboutPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 80) setHeaderVisible(true);
      else if (currentScrollY > lastScrollY.current) setHeaderVisible(false);
      else setHeaderVisible(true);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const { user } = useAuthContext();

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
      <header className={`fixed top-0 z-50 w-full border-b border-green-400/30 bg-green-900 backdrop-blur-xl transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 max-w-7xl">
          <Link href="/" className="flex items-center gap-2 group">
            <BrandLogo
              frameClassName="border border-white/20 bg-white/95 p-1.5 shadow-lg shadow-black/15 transition-transform group-hover:scale-105"
              imageClassName="w-12 md:w-14"
              priority
            />
          </Link>

          <nav className="hidden lg:flex gap-8 xl:gap-10">
            <Link href="/how-it-works" className="text-sm font-bold text-white/80 hover:text-white transition-colors">Platform</Link>
            <Link href="/how-it-works" className="text-sm font-bold text-white/80 hover:text-white transition-colors">How it Works</Link>
            <Link href="/about" className="text-sm font-bold text-white border-b-2 border-white pb-1 transition-colors">About Us</Link>
            <Link href="/contact" className="text-sm font-bold text-white/80 hover:text-white transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/login" className="text-sm font-bold text-white hidden sm:block hover:text-white/80">Log In</Link>
            <Button asChild className="rounded-full px-6 md:px-8 h-10 md:h-12 font-black shadow-xl bg-white text-green-800 hover:bg-green-50 border-none text-xs md:text-sm">
              <Link href="/register">Get Started</Link>
            </Button>
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10 rounded-full h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-green-900 border-none text-white p-0 w-72">
                <SheetHeader className="p-8 border-b border-white/10 text-left">
                  <SheetTitle className="text-white">
                    <BrandLogo frameClassName="border border-white/10 bg-white p-1.5 shadow-lg shadow-black/15" imageClassName="w-12" />
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

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="space-y-12 md:space-y-20">
            {/* Hero Section - Compacted */}
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <Badge className="bg-primary/10 text-primary font-black px-6 py-2 rounded-full border-none uppercase tracking-[0.3em] text-[10px]">
                The EBENESAID Story
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Building the <br /><span className="text-primary italic">Global OS</span> for Students.
              </h1>
              <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed">
                EBENESAID was founded in Riga, Latvia, by international students who experienced the chaos of relocation. We've built the infrastructure we wish we had.
              </p>
            </div>

            {/* Mission & Vision Grid */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="p-8 md:p-12 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 group transition-all hover:shadow-xl">
                <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black mb-4">Our Mission</h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                  To orchestrate the international student journey through technology, providing a secure, centralized operating system that replaces uncertainty with structure and trust.
                </p>
              </div>
              <div className="p-8 md:p-12 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]" />
                <div className="h-14 w-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-primary group-hover:text-white transition-all">
                  <Rocket className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black mb-4 relative z-10">Our Vision</h3>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium relative z-10">
                  A world where borders are not barriers to potential. We envision a seamless global education landscape where every student can thrive regardless of their origin.
                </p>
              </div>
            </div>

            {/* Founders Section */}
            <div className="space-y-12">
              <div className="text-center space-y-3">
                <Badge className="bg-primary/5 text-primary border-none font-black px-4 py-1 text-[9px] uppercase tracking-widest">Operating Model</Badge>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900">How the Platform Operates</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <FounderCard 
                  name="Platform Strategy" role="Leadership Pillar" img="https://picsum.photos/seed/platform-strategy/400/400" bio="Defines the operating model for student onboarding, relocation guidance, and long-term platform direction."
                />
                <FounderCard 
                  name="Technology & Security" role="Leadership Pillar" img="https://picsum.photos/seed/platform-technology/400/400" bio="Owns secure account infrastructure, data protection, and the backend systems that connect platform modules."
                />
                <FounderCard 
                  name="Operations & Partnerships" role="Leadership Pillar" img="https://picsum.photos/seed/platform-operations/400/400" bio="Coordinates housing workflows, student support operations, and institutional collaboration across the platform."
                />
              </div>
            </div>

            {/* Values Section */}
            <div className="space-y-12">
              <div className="text-center space-y-3">
                <Badge className="bg-primary/5 text-primary border-none font-black px-4 py-1 text-[9px] uppercase tracking-widest">Guiding Principles</Badge>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900">Our Core Values</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <ValueItem 
                   icon={<ShieldCheck />} 
                   title="Trust First" 
                   desc="We physically verify every housing unit to ensure student safety is never compromised." 
                 />
                 <ValueItem 
                   icon={<Heart />} 
                   title="Empathy Driven" 
                   desc="Built by students, for students. Every feature is born from shared lived experiences." 
                 />
                 <ValueItem 
                   icon={<Globe />} 
                   title="Radical Inclusivity" 
                   desc="Our platform adapts to your culture, making the world feel like home." 
                 />
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary/5 rounded-[3rem] p-10 md:p-16 text-center space-y-8 border border-primary/10 relative overflow-hidden">
              <div className="absolute -top-20 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              
              <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight">Ready to join the <span className="text-primary italic">ecosystem?</span></h2>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
                <Button size="lg" className="h-14 px-10 rounded-full font-black text-lg shadow-xl shadow-primary/30" asChild>
                  <Link href="/register">Get Started Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-full font-black text-lg border-2" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 mb-16">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <BrandLogo imageClassName="w-28" />
              </div>
              <p className="text-slate-500 text-base max-w-md font-medium leading-relaxed">
                The global operating system for international student mobility. Founded in Riga, serving the world's most ambitious students.
              </p>
            </div>
            <div>
              <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-[10px]">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-600 font-bold">
                <li><Link href="/accommodation" onClick={(e) => handleProtectedLink(e, "Verified Housing", "/accommodation")} className="hover:text-primary transition-colors flex items-center gap-2">Verified Housing <ExternalLink className="h-3 w-3 opacity-20" /></Link></li>
                <li><Link href="/jobs" onClick={(e) => handleProtectedLink(e, "Job Board", "/jobs")} className="hover:text-primary transition-colors flex items-center gap-2">Job Board <ExternalLink className="h-3 w-3 opacity-20" /></Link></li>
                <li><Link href="/docs" onClick={(e) => handleProtectedLink(e, "Secure Wallet", "/docs")} className="hover:text-primary transition-colors flex items-center gap-2">Secure Wallet <ExternalLink className="h-3 w-3 opacity-20" /></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-[10px]">Support</h4>
              <ul className="space-y-4 text-sm text-slate-600 font-bold">
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/how-it-works" className="hover:text-primary transition-colors">Resources</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">The Team</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 text-center md:text-left">
            <p>© 2025 EBENESAID. ALL RIGHTS RESERVED. UNIVERSITY PARTNER TOOL.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FounderCard({ name, role, img, bio }: any) {
  return (
    <div className="group bg-white rounded-[2.5rem] border border-slate-100 p-6 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="relative mb-6">
        <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-100">
          <img src={img} alt={name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
        </div>
        <div className="absolute -bottom-4 right-4 flex gap-2">
          <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl shadow-lg hover:bg-primary hover:text-white transition-all">
            <Linkedin className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-black text-slate-900">{name}</h4>
        <p className="text-xs font-black text-primary uppercase tracking-widest">{role}</p>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">{bio}</p>
      </div>
    </div>
  );
}

function ValueItem({ icon, title, desc }: any) {
  return (
    <div className="group space-y-4 p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-xl transition-all duration-300">
      <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-primary border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        <div className="h-6 w-6">{icon}</div>
      </div>
      <h4 className="font-black text-lg text-slate-900">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

