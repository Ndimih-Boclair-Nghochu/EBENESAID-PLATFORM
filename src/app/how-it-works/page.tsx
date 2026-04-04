'use client';

import { useState } from 'react';
import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowRight, 
  ClipboardCheck, 
  Search, 
  CloudUpload, 
  PlaneTakeoff,
  Sparkles,
  Menu,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useUser } from "@/firebase";

export default function HowItWorksPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const { user } = useUser();

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
            <span className="text-lg md:text-xl font-black tracking-tighter text-white font-headline uppercase italic">EBENESAID</span>
          </Link>

          <nav className="hidden lg:flex gap-8 xl:gap-10">
            <Link href="/how-it-works" className="text-sm font-bold text-white transition-colors border-b-2 border-white pb-1">Platform</Link>
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
      <main className="flex-1 pt-32 pb-24 md:pt-48 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="space-y-16 md:space-y-32">
            
            {/* Header Content */}
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <Badge className="bg-primary/10 text-primary font-black px-6 py-2 rounded-full border-none uppercase tracking-[0.4em] text-[10px] animate-in fade-in slide-in-from-bottom-2 duration-700">
                The Architecture of Mobility
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Your Journey, <br /><span className="text-primary italic">Systematized.</span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
                We've broken down the complex international student relocation process into four clear, verified modules.
              </p>
            </div>

            {/* Steps Section */}
            <div className="grid gap-24 md:gap-40">
              <StepItem 
                num="01"
                icon={<ClipboardCheck className="h-full w-full" />}
                title="Profile & Admission Verification"
                desc="Start by connecting your university credentials. Our system instantly syncs with your admission status to generate your personalized relocation roadmap."
                points={["University Credential Sync", "Automated Roadmap Generation", "Language Proficiency Check"]}
                imgSeed="admission-verification"
              />
              <StepItem 
                num="02"
                icon={<CloudUpload className="h-full w-full" />}
                title="Secure Document Management"
                desc="Upload your visa, residence permit, and identity documents to our bank-grade encrypted vault. Receive proactive alerts for expirations."
                points={["EU Data Protection Compliant", "AI-Powered Doc Scanning", "Expiration Deadlines Notifications"]}
                reversed
                imgSeed="document-vault"
              />
              <StepItem 
                num="03"
                icon={<Search className="h-full w-full" />}
                title="Verified Housing Search"
                desc="Access a curated marketplace of physically inspected housing. Forget scams—every unit is vetted by our local field agents for quality and safety."
                points={["Physically Vetted Units", "Verified Rental Contracts", "Secure Deposit Handling"]}
                imgSeed="housing-search"
              />
              <StepItem 
                num="04"
                icon={<PlaneTakeoff className="h-full w-full" />}
                title="Arrival & Settlement Support"
                desc="From airport transfers to SIM card activation and bank account opening, our OS handles the 'last mile' of your relocation."
                points={["Vetted Airport Transfers", "Local Administrative Setup", "Buddy Circle Connection"]}
                reversed
                imgSeed="airport-transfer"
              />
            </div>

            {/* CTA Section */}
            <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl border border-white/5">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-10">
                <div className="h-24 w-24 bg-primary/20 rounded-[2rem] flex items-center justify-center text-primary shadow-2xl shadow-primary/20 animate-pulse">
                  <Sparkles className="h-12 w-12" />
                </div>
                <h2 className="text-3xl md:text-6xl font-black tracking-tight max-w-3xl leading-[1.2]">
                  Ready to experience the <br /><span className="text-primary italic">next generation</span> of student mobility?
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                  <Button size="lg" className="h-16 px-12 rounded-full font-black text-xl shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all" asChild>
                    <Link href="/register">Join the Platform <ArrowRight className="ml-2 h-6 w-6" /></Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-16 px-12 rounded-full font-black text-xl border-2 border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all" asChild>
                    <Link href="/about">Learn our Story</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-16 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24 mb-20">
            <div className="lg:col-span-2 space-y-10">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2.5 rounded-2xl shadow-xl shadow-primary/20">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <span className="text-3xl font-black text-slate-900 uppercase italic text-primary">EBENESAID</span>
              </div>
              <p className="text-slate-500 text-lg max-w-md font-medium leading-relaxed">
                The global operating system for international student mobility. Founded in Riga, serving the world's most ambitious students.
              </p>
            </div>
            <div>
              <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-[11px]">Platform</h4>
              <ul className="space-y-5 text-base text-slate-600 font-bold">
                <li><Link href="/accommodation" onClick={(e) => handleProtectedLink(e, "Verified Housing", "/accommodation")} className="hover:text-primary transition-colors flex items-center gap-2">Verified Housing <ExternalLink className="h-3 w-3 opacity-20" /></Link></li>
                <li><Link href="/jobs" onClick={(e) => handleProtectedLink(e, "Job Board", "/jobs")} className="hover:text-primary transition-colors flex items-center gap-2">Job Board <ExternalLink className="h-3 w-3 opacity-20" /></Link></li>
                <li><Link href="/docs" onClick={(e) => handleProtectedLink(e, "Secure Wallet", "/docs")} className="hover:text-primary transition-colors flex items-center gap-2">Secure Wallet <ExternalLink className="h-3 w-3 opacity-20" /></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-[11px]">Support</h4>
              <ul className="space-y-5 text-base text-slate-600 font-bold">
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/how-it-works" className="hover:text-primary transition-colors">Resources</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">The Team</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 text-center md:text-left">
            <p>© 2025 EBENESAID. ALL RIGHTS RESERVED. UNIVERSITY PARTNER TOOL.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepItem({ num, icon, title, desc, points, reversed, imgSeed }: any) {
  return (
    <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 md:gap-24 lg:gap-32`}>
      <div className="lg:w-1/2 space-y-10">
        <div className="flex items-center gap-8">
          <span className="text-6xl md:text-9xl font-black text-slate-100 tracking-tighter leading-none select-none">{num}</span>
          <div className="h-16 w-16 md:h-20 md:w-20 bg-primary/10 text-primary rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner">
            <div className="h-8 w-8 md:h-10 md:w-10">{icon}</div>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">{title}</h2>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium">{desc}</p>
          <ul className="grid gap-5">
            {points.map((p: string, i: number) => (
              <li key={i} className="flex items-center gap-4 text-slate-700 font-bold text-base md:text-lg bg-slate-50 p-4 rounded-2xl border border-slate-100/50 hover:bg-white hover:shadow-md transition-all cursor-default">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="lg:w-1/2 w-full">
        <div className="aspect-[4/3] md:aspect-video relative rounded-[3.5rem] overflow-hidden bg-slate-50 border-8 border-slate-50 shadow-2xl group">
          <img 
            src={`https://picsum.photos/seed/${imgSeed}/1200/800`} 
            alt={title} 
            className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-700" />
          <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-white/20 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
             <p className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-1">Module Status</p>
             <p className="text-lg font-bold text-slate-900">Verified System Infrastructure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
