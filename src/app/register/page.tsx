'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  User,
  Lock,
  Globe,
  Home,
  Star,
  CheckCircle2,
  Phone,
  Mail,
  GraduationCap,
  MapPin,
  FileText,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useAuthContext } from "@/auth/provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Kofi Mensah",
    role: "RTU Riga · Class of 2025",
    text: "EBENESAID made my move so simple. I found verified housing before I even landed in Riga.",
    avatar: "https://picsum.photos/seed/reg-stu-1/100/100"
  },
  {
    name: "Ananya S.",
    role: "University of Latvia · Class of 2024",
    text: "The document storage saved me from a visa disaster. Everything is safe and easy to use.",
    avatar: "https://picsum.photos/seed/reg-stu-2/100/100"
  },
  {
    name: "John D.",
    role: "Turiba University · Class of 2025",
    text: "I found my flatmates and a great part-time job within a week of joining the platform.",
    avatar: "https://picsum.photos/seed/reg-stu-3/100/100"
  }
];

export default function RegisterPage() {
  const { user, register } = useAuthContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    // Client-side validation
    if (!firstName.trim() || !lastName.trim()) {
      setFormError('First name and last name are required.');
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setFormError('Email address is required.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const result = await register({
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      university,
      countryOfOrigin,
    });

    setIsLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setFormError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white selection:bg-primary/20 relative overflow-hidden">

      {/* Left Column — Benefits */}
      <div className="lg:w-[42%] xl:w-[46%] bg-slate-900 relative p-8 md:p-12 xl:p-16 flex flex-col justify-between overflow-hidden shrink-0">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full translate-x-1/2 -translate-y-1/3 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-500/5 rounded-full -translate-x-1/2 translate-y-1/3 blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="bg-green-700 p-2 rounded-xl shadow-lg shadow-green-700/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tighter text-white uppercase italic">EBENESAID</span>
          </Link>

          {/* Headline */}
          <div className="space-y-4">
            <Badge className="bg-primary/15 text-primary border-none font-bold px-3 py-1 text-xs rounded-full">
              For international students
            </Badge>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Your Student Journey,{' '}
              <span className="text-primary italic">Made Easy.</span>
            </h2>
            <p className="text-base text-slate-400 font-medium max-w-sm leading-relaxed">
              Join thousands of students who have turned a complex relocation into a smooth, organized experience.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <HighlightItem
              icon={<Home className="h-4 w-4" />}
              title="Verified Student Housing"
              desc="Browse physically inspected, scam-free accommodation listings."
            />
            <HighlightItem
              icon={<Lock className="h-4 w-4" />}
              title="Secure Document Storage"
              desc="Keep your visa, passport, and academic papers safe and organized."
            />
            <HighlightItem
              icon={<Globe className="h-4 w-4" />}
              title="Connect with Your Community"
              desc="Meet other international students from your university and country."
            />
            <HighlightItem
              icon={<FileText className="h-4 w-4" />}
              title="Guided Relocation Roadmap"
              desc="Step-by-step guidance from visa approval to your first day of class."
            />
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative z-10 mt-12 lg:mt-0">
          <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 4500 })]}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((t, i) => (
                <CarouselItem key={i}>
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/8 p-6 rounded-2xl shadow-xl">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-11 w-11 rounded-xl border border-white/15 shrink-0">
                        <AvatarImage src={t.avatar} />
                        <AvatarFallback className="bg-primary text-white font-black text-xs rounded-xl">{t.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2.5 flex-1 min-w-0">
                        <div className="flex gap-0.5 text-amber-400">
                          {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 fill-current" />)}
                        </div>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">
                          &quot;{t.text}&quot;
                        </p>
                        <div>
                          <p className="text-xs font-black text-white">{t.name}</p>
                          <p className="text-[10px] font-bold text-primary/80 uppercase tracking-wider mt-0.5">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Right Column — Registration Form */}
      <div className="flex-1 flex flex-col bg-slate-50/40 min-h-screen">
        {/* Top bar */}
        <header className="p-5 flex items-center justify-between shrink-0">
          <Button variant="ghost" asChild size="sm" className="gap-2 font-bold text-slate-500 hover:text-slate-900 hover:bg-white rounded-xl transition-all group px-3 h-9 bg-white shadow-sm border border-slate-100 text-xs">
            <Link href="/">
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Home
            </Link>
          </Button>
          <p className="text-sm text-slate-400 font-medium hidden sm:block">
            Already registered?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </p>
        </header>

        {/* Form */}
        <main className="flex-1 flex items-center justify-center p-5 lg:p-10">
          <div className="w-full max-w-[560px] space-y-5">

            <Card className="shadow-lg shadow-slate-200/50 border border-slate-100 rounded-3xl bg-white overflow-hidden">
              <CardHeader className="text-center pt-8 pb-4 px-8 sm:px-10">
                <div className="mx-auto h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-3">
                  <User className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
                  Create Your Account
                </CardTitle>
                <CardDescription className="text-slate-400 font-medium text-sm mt-1">
                  Fill in your details to get started — 1 month free trial included!
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleRegister}>
                <CardContent className="space-y-5 px-8 sm:px-10 pb-8">
                  {/* Error Message */}
                  {formError && (
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <p className="text-sm font-medium">{formError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="First Name" placeholder="John" icon={<User className="h-3.5 w-3.5" />} value={firstName} onChange={setFirstName} required />
                    <FormInput label="Last Name" placeholder="Doe" icon={<User className="h-3.5 w-3.5" />} value={lastName} onChange={setLastName} required />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="Phone Number" placeholder="+371 20 000 000" icon={<Phone className="h-3.5 w-3.5" />} value={phone} onChange={setPhone} />
                    <FormInput label="Email Address" placeholder="you@example.com" type="email" icon={<Mail className="h-3.5 w-3.5" />} value={email} onChange={setEmail} required />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="University" placeholder="e.g. RTU Riga" icon={<GraduationCap className="h-3.5 w-3.5" />} value={university} onChange={setUniversity} />
                    <FormInput label="Country of Origin" placeholder="e.g. Nigeria" icon={<MapPin className="h-3.5 w-3.5" />} value={countryOfOrigin} onChange={setCountryOfOrigin} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="Password" placeholder="Min. 6 characters" type="password" icon={<Lock className="h-3.5 w-3.5" />} value={password} onChange={setPassword} required />
                    <FormInput label="Confirm Password" placeholder="Confirm password" type="password" icon={<Lock className="h-3.5 w-3.5" />} value={confirmPassword} onChange={setConfirmPassword} required />
                  </div>

                  {/* Trial info */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    <p className="text-xs font-medium text-green-700">
                      Your account includes a <span className="font-black">1-month free trial</span>. After that, the platform fee is <span className="font-black">€100</span>.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all bg-green-700 hover:bg-green-800 text-white border-none group mt-2"
                  >
                    {isLoading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating Account...</>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </form>

              <CardFooter className="text-center flex-col pb-7 px-8 sm:px-10 border-t border-slate-50 pt-5">
                <p className="text-sm text-slate-400 font-medium">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary font-bold hover:underline decoration-2">
                    Sign in here
                  </Link>
                </p>
              </CardFooter>
            </Card>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 opacity-50">
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Your data is safe</span>
              </div>
              <div className="h-3 w-px bg-slate-300" />
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Privacy protected</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function FormInput({
  label,
  placeholder,
  type = "text",
  icon,
  value,
  onChange,
  required = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-slate-300">{icon}</span>}
        <Label className="font-bold text-xs text-slate-600">{label}</Label>
      </div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium px-4 text-sm placeholder:text-slate-300"
      />
    </div>
  );
}

function HighlightItem({
  icon,
  title,
  desc
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-3.5 group">
      <div className="h-9 w-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="text-white font-bold text-sm leading-tight">{title}</h4>
        <p className="text-slate-500 text-xs font-medium leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
