'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/auth/provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { user, login } = useAuthContext();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Route based on user type
      if (user.userType === 'admin') router.push('/admin/dashboard');
      else if (user.userType === 'university') router.push('/university/dashboard');
      else if (user.userType === 'supplier') router.push('/supplier/dashboard');
      else if (user.userType === 'agent') router.push('/agent/dashboard');
      else if (user.userType === 'transport') router.push('/transport/dashboard');
      else router.push('/dashboard');
    }
  }, [user, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setFormError('Please enter your email and password.');
      setIsLoading(false);
      return;
    }

    const result = await login(email, password);
    setIsLoading(false);

    if (!result.success) {
      setFormError(result.error || 'Login failed. Please try again.');
    }
    // If successful, the useEffect above will handle redirect
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

          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-4 pt-4 px-7">
              {/* Error Message */}
              {formError && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">{formError}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-bold text-xs text-slate-600 flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl font-black text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all bg-green-700 hover:bg-green-800 text-white border-none"
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in...</>
                ) : (
                  'Sign In'
                )}
              </Button>
            </CardContent>
          </form>

          <div className="px-7 pb-2">
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Student Access</span>
              <Separator className="flex-1" />
            </div>
          </div>

          <CardContent className="pt-3 px-7 pb-6">
            <p className="text-[11px] text-slate-400 font-medium mb-3 text-center">
              Only students can create accounts from this page. Other roles are created by the admin.
            </p>
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
