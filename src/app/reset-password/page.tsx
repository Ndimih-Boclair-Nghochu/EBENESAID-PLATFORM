'use client';

import { Suspense, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { BrandLogo } from '@/components/brand-logo';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordPageFallback />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus(null);

    if (!token) {
      setStatus('This reset link is missing or invalid.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error || 'Please try again.');
        toast({
          variant: 'destructive',
          title: 'Password reset failed',
          description: data.error || 'Please try again.',
        });
        return;
      }

      toast({
        title: 'Password reset successful',
        description: 'Your password has been updated and you are now signed in.',
      });
      router.push('/dashboard');
    } catch {
      setStatus('A network error occurred. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Password reset failed',
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
                <Lock className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-black text-slate-900">Set a new password</CardTitle>
                <CardDescription className="text-sm font-medium text-slate-500">
                  Choose a strong password for your EBENESAID account.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <PasswordField
                  id="new-password"
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  visible={showPassword}
                  onToggle={() => setShowPassword(current => !current)}
                />
                <PasswordField
                  id="confirm-password"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  visible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(current => !current)}
                />

                {status ? (
                  <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {status}
                  </div>
                ) : null}

                <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl bg-green-700 text-sm font-black hover:bg-green-800">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
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

function ResetPasswordPageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/40 px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <Card className="w-full max-w-md rounded-[2rem] border-slate-100 bg-white shadow-xl shadow-slate-200/60">
          <CardContent className="flex items-center justify-center px-8 py-12">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading secure reset form...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={event => onChange(event.target.value)}
          minLength={6}
          required
          className="h-11 rounded-xl pr-12"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition-colors hover:text-slate-700"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
