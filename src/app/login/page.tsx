
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowLeft, Mail, Sparkles, Github, ShieldAlert, Lock, CheckCircle2, Building2, Utensils, Home, Navigation } from "lucide-react";
import Link from "next/link";
import { useAuth, initiateAnonymousSignIn, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const role = localStorage.getItem('eb_demo_role');
      if (role === 'admin') router.push('/admin/dashboard');
      else if (role === 'university') router.push('/university/dashboard');
      else if (role === 'supplier') router.push('/supplier/dashboard');
      else if (role === 'agent') router.push('/agent/dashboard');
      else if (role === 'transport') router.push('/transport/dashboard');
      else router.push('/dashboard');
    }
  }, [user, router]);

  const handleDemoAccess = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eb_demo_role', 'student');
    }
    initiateAnonymousSignIn(auth);
  };

  const handleAdminDemo = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eb_demo_role', 'admin');
    }
    initiateAnonymousSignIn(auth);
  };

  const handleUniversityDemo = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eb_demo_role', 'university');
    }
    initiateAnonymousSignIn(auth);
  };

  const handleSupplierDemo = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eb_demo_role', 'supplier');
    }
    initiateAnonymousSignIn(auth);
  };

  const handleAgentDemo = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eb_demo_role', 'agent');
    }
    initiateAnonymousSignIn(auth);
  };

  const handleTransportDemo = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eb_demo_role', 'transport');
    }
    initiateAnonymousSignIn(auth);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 sm:p-6 selection:bg-primary/20 overflow-x-hidden">
      <div className="fixed top-4 left-4 sm:top-8 sm:left-8 z-50">
        <Button variant="ghost" asChild size="sm" className="gap-2 font-black text-slate-500 hover:text-primary hover:bg-white rounded-full transition-all group px-3 h-9">
          <Link href="/"><ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Back to Home</span></Link>
        </Button>
      </div>
      
      <div className="w-full max-w-[440px] space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8 sm:mt-0">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="mx-auto bg-primary p-3 sm:p-4 rounded-2xl w-fit shadow-2xl shadow-primary/30 relative">
            <div className="absolute inset-0 bg-primary rounded-2xl blur-xl opacity-20 animate-pulse" />
            <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10 text-white relative z-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">Welcome <span className="text-primary italic">Back.</span></h1>
            <p className="text-slate-500 font-medium text-[10px] sm:text-sm uppercase tracking-widest">Global OS Authorization Protocol</p>
          </div>
        </div>

        <Card className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border-none p-0 rounded-[2.5rem] sm:rounded-[3rem] bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          
          <CardHeader className="pt-8 pb-4 text-center px-6 sm:px-10">
            <CardTitle className="text-lg sm:text-xl font-black text-slate-900 uppercase italic leading-none">Authentication Gateway</CardTitle>
            <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[8px] sm:text-[9px] mt-2 flex items-center justify-center gap-1.5">
              <Lock className="h-2.5 w-2.5" /> AES-256 Encrypted Session
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-5 sm:space-y-6 pt-4 px-6 sm:px-10">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
              <Input id="email" type="email" placeholder="name@university.edu" className="h-11 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium px-5 text-xs sm:text-sm" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400">Password</Label>
                <Link href="#" className="text-[9px] sm:text-xs text-primary font-black hover:underline uppercase tracking-widest">Forgot Password?</Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" className="h-11 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium px-5 text-xs sm:text-sm" />
            </div>
            
            <div className="flex flex-col gap-3 sm:gap-4">
              <Button onClick={handleDemoAccess} className="w-full h-12 sm:h-16 rounded-xl sm:rounded-2xl text-sm sm:text-lg font-black shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95 bg-primary text-white border-none uppercase tracking-widest">
                Authorize Login
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleDemoAccess} className="h-11 rounded-xl font-black border-slate-100 bg-slate-50 text-[8px] uppercase">
                  Student Demo
                </Button>
                <Button variant="outline" onClick={handleAgentDemo} className="h-11 rounded-xl font-black border-sky-100 bg-sky-50 text-sky-600 text-[8px] uppercase">
                  Agent Demo
                </Button>
                <Button variant="outline" onClick={handleSupplierDemo} className="h-11 rounded-xl font-black border-orange-100 bg-orange-50 text-orange-600 text-[8px] uppercase">
                  Supplier Demo
                </Button>
                <Button variant="outline" onClick={handleUniversityDemo} className="h-11 rounded-xl font-black border-indigo-100 bg-indigo-50 text-indigo-600 text-[8px] uppercase">
                  Partner Demo
                </Button>
                <Button variant="outline" onClick={handleTransportDemo} className="h-11 rounded-xl font-black border-blue-100 bg-blue-50 text-blue-600 text-[8px] uppercase col-span-2">
                  <Navigation className="h-3 w-3 mr-2" /> Logistics Demo (Transport)
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-6 sm:gap-8 text-center pb-8 sm:pb-10 px-6 sm:px-10 border-t border-slate-50 pt-8">
            <p className="text-[10px] sm:text-sm text-slate-500 font-medium">
              New to the platform? <Link href="/register" className="text-primary font-black hover:underline">Apply for Access</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
