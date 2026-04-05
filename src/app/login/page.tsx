
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  BarChart3,
  GraduationCap,
  Soup,
  Hotel,
  Navigation,
  User
} from "lucide-react";
import Link from "next/link";
import { useAuth, initiateAnonymousSignIn, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { user } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

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

  const handleSignIn = async () => {
    setIsLoading(true);
    setLoadingRole('student');
    if (typeof window !== 'undefined') {
      localStorage.setItem('eb_demo_role', 'student');
    }
    await initiateAnonymousSignIn(auth);
  };

  const handleDemoLogin = async (role: string) => {
    setIsLoading(true);
    setLoadingRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eb_demo_role', role);
    }
    await initiateAnonymousSignIn(auth);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-green-50/30 p-4 sm:p-6 overflow-x-hidden">

      {/* Back Button */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
        <Button variant="ghost" asChild size="sm" className="gap-2 font-bold text-slate-500 hover:text-slate-900 hover:bg-white rounded-xl transition-all group px-3 h-9 shadow-sm bg-white/80 backdrop-blur-sm border border-slate-100">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline text-xs">Back to Home</span>
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-[420px] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="bg-green-700 p-2.5 rounded-xl shadow-lg shadow-green-700/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">EBENESAID</span>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Sign in to continue your relocation journey
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl shadow-slate-200/60 border border-slate-100 rounded-3xl bg-white overflow-hidden">
          <CardHeader className="pt-7 pb-2 px-7">
            <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Sign In to Your Account
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-4 px-7">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-bold text-xs text-slate-600 flex items-center gap-1.5">
                <Mail className="h-3 w-3" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@university.edu"
                className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium px-4 text-sm placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="font-bold text-xs text-slate-600 flex items-center gap-1.5">
                  <Lock className="h-3 w-3" /> Password
                </Label>
                <Link href="#" className="text-xs text-primary font-bold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium px-4 pr-12 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-black text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all bg-green-700 hover:bg-green-800 text-white border-none"
            >
              {isLoading && loadingRole === 'student' ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </Button>
          </CardContent>

          <div className="px-7 pb-2">
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Demo Access</span>
              <Separator className="flex-1" />
            </div>
          </div>

          <CardContent className="pt-3 px-7 pb-6">
            <p className="text-[11px] text-slate-400 font-medium mb-3 text-center">
              Explore a role without an account
            </p>
            <div className="grid grid-cols-2 gap-2">
              <DemoButton
                label="Student"
                icon={<User className="h-3.5 w-3.5" />}
                colorClass="bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                onClick={() => handleDemoLogin('student')}
                isLoading={isLoading && loadingRole === 'student'}
              />
              <DemoButton
                label="Admin"
                icon={<BarChart3 className="h-3.5 w-3.5" />}
                colorClass="bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                onClick={() => handleDemoLogin('admin')}
                isLoading={isLoading && loadingRole === 'admin'}
              />
              <DemoButton
                label="University"
                icon={<GraduationCap className="h-3.5 w-3.5" />}
                colorClass="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
                onClick={() => handleDemoLogin('university')}
                isLoading={isLoading && loadingRole === 'university'}
              />
              <DemoButton
                label="Supplier"
                icon={<Soup className="h-3.5 w-3.5" />}
                colorClass="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
                onClick={() => handleDemoLogin('supplier')}
                isLoading={isLoading && loadingRole === 'supplier'}
              />
              <DemoButton
                label="Agent"
                icon={<Hotel className="h-3.5 w-3.5" />}
                colorClass="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                onClick={() => handleDemoLogin('agent')}
                isLoading={isLoading && loadingRole === 'agent'}
              />
              <DemoButton
                label="Transport"
                icon={<Navigation className="h-3.5 w-3.5" />}
                colorClass="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                onClick={() => handleDemoLogin('transport')}
                isLoading={isLoading && loadingRole === 'transport'}
              />
            </div>
          </CardContent>

          <CardFooter className="border-t border-slate-50 pt-5 pb-6 px-7 flex-col gap-0">
            <p className="text-sm text-slate-500 font-medium text-center">
              New to EBENESAID?{' '}
              <Link href="/register" className="text-primary font-black hover:underline decoration-2">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 opacity-60">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Secure & Private</span>
          </div>
          <div className="h-3 w-px bg-slate-300" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <Lock className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoButton({
  label,
  icon,
  colorClass,
  onClick,
  isLoading
}: {
  label: string;
  icon: React.ReactNode;
  colorClass: string;
  onClick: () => void;
  isLoading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 h-10 rounded-xl font-bold text-xs border transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${colorClass}`}
    >
      {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : icon}
      {label}
    </button>
  );
}
