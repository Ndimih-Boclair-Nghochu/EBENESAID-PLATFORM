'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';

import { BrandLogo } from '@/components/brand-logo';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Reset email not sent',
          description: data.error || 'Please try again.',
        });
        setStatus(data.error || 'Please try again.');
        return;
      }

      setStatus(data.message || 'If an account exists for that email, a reset link has been sent.');
      toast({
        title: 'Check your inbox',
        description: 'If the address is registered, a secure reset link is on the way.',
      });
    } catch {
      setStatus('Please try again.');
      toast({
        variant: 'destructive',
        title: 'Reset email not sent',
        description: 'A network error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/40 px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" asChild className="rounded-xl bg-white/80 px-3 shadow-sm">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
          <LanguageSwitcher tone="light" compact />
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <Card className="w-full max-w-md rounded-[2rem] border-slate-100 bg-white shadow-xl shadow-slate-200/60">
            <CardHeader className="space-y-4 px-8 pt-8 text-center">
              <Link href="/" className="mx-auto inline-flex">
                <BrandLogo imageClassName="w-28" priority />
              </Link>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-black text-slate-900">Forgot your password?</CardTitle>
                <CardDescription className="text-sm font-medium text-slate-500">
                  Enter your account email and we will send a secure password reset link.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11 rounded-xl"
                  />
                </div>

                {status ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                    {status}
                  </div>
                ) : null}

                <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl bg-green-700 text-sm font-black hover:bg-green-800">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
