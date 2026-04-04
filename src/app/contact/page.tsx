'use client';

import { useState } from 'react';
import Link from "next/link";
import { 
  ShieldCheck, 
  Mail, 
  MessageSquare, 
  MapPin, 
  ArrowRight,
  Menu,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useUser } from "@/firebase";

export default function ContactPage() {
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
            <Link href="/how-it-works" className="text-sm font-bold text-white/80 hover:text-white transition-colors">Platform</Link>
            <Link href="/how-it-works" className="text-sm font-bold text-white/80 hover:text-white transition-colors">How it Works</Link>
            <Link href="/about" className="text-sm font-bold text-white/80 hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="text-sm font-bold text-white border-b-2 border-white pb-1 transition-colors">Contact</Link>
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

      {/* Main Content */}
      <main className="flex-1 pt-32 pb-24 md:pt-48 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            {/* Left Content */}
            <div className="space-y-12">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary font-black px-6 py-2 rounded-full border-none uppercase tracking-[0.3em] text-[10px]">
                  Contact Specialists
                </Badge>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                  We're Here to <span className="text-primary italic">Help.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                  Whether you're a student starting your journey or a university partner looking to collaborate, our team is ready to assist.
                </p>
              </div>

              <div className="space-y-8">
                <ContactItem 
                  icon={<Mail className="h-6 w-6" />} 
                  title="Email Support" 
                  desc="support@ebenesaid.com" 
                />
                <ContactItem 
                  icon={<MessageSquare className="h-6 w-6" />} 
                  title="AI Concierge" 
                  desc="Available 24/7 on your dashboard" 
                />
                <ContactItem 
                  icon={<MapPin className="h-6 w-6" />} 
                  title="Main Office" 
                  desc="K. Valdemāra iela 21, Riga, LV-1010" 
                />
              </div>

              <div className="pt-8 border-t border-slate-100 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Response time: Under 2 hours
              </div>
            </div>

            {/* Form Card */}
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <Card className="rounded-[3rem] border-none shadow-2xl p-6 sm:p-10 bg-white relative z-10">
                <CardHeader className="p-0 mb-10">
                  <CardTitle className="text-3xl font-black text-slate-900">Send a Message</CardTitle>
                  <CardDescription className="text-slate-500 font-medium mt-2">Our specialists will review your request immediately.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">First Name</Label>
                      <Input placeholder="John" className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Last Name</Label>
                      <Input placeholder="Doe" className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white transition-all font-medium" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Email Address</Label>
                    <Input type="email" placeholder="john@university.edu" className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Topic</Label>
                    <Input placeholder="How can we help?" className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Message</Label>
                    <Textarea placeholder="Detail your inquiry..." className="min-h-[150px] rounded-[2rem] bg-slate-50 border-none focus:bg-white transition-all font-medium p-6" />
                  </div>
                  <Button className="w-full h-16 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all">
                    Submit Inquiry <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
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
                <li><Link href="/contact" className="hover:text-primary transition-colors text-primary">Contact Us</Link></li>
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

function ContactItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-6 items-start group">
      <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-black text-xl text-slate-900">{title}</h4>
        <p className="text-slate-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}
