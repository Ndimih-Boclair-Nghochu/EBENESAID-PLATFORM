
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  Quote,
  Star,
  CheckCircle2,
  Phone,
  Mail,
  GraduationCap,
  MapPin
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
import { useAuth, initiateAnonymousSignIn, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const testimonials = [
  {
    name: "Kofi Mensah",
    role: "RTU 2025 • Student",
    text: "EBENESAID made my move so simple. I found my housing before I even landed in Riga.",
    avatar: "https://picsum.photos/seed/reg-stu-1/100/100"
  },
  {
    name: "Ananya S.",
    role: "LU 2024 • Student",
    text: "The document storage saved me from a visa disaster. Everything is very safe and easy to use.",
    avatar: "https://picsum.photos/seed/reg-stu-2/100/100"
  },
  {
    name: "John D.",
    role: "Turiba 2025 • Student",
    text: "I found my flatmates and a great part-time job within a week of joining.",
    avatar: "https://picsum.photos/seed/reg-stu-3/100/100"
  }
];

export default function RegisterPage() {
  const auth = useAuth();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleRegister = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eb_demo_role', 'student');
    }
    initiateAnonymousSignIn(auth);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white selection:bg-primary/20 relative overflow-hidden">
      
      {/* Left Column: Why Join Us? */}
      <div className="lg:w-[40%] xl:w-[45%] bg-slate-900 relative p-8 md:p-12 xl:p-16 flex flex-col justify-between overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-full h-full bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-[120px]" />
        
        <div className="relative z-10 space-y-10 md:space-y-16">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="bg-primary p-2 rounded-xl shadow-2xl shadow-primary/20 transition-transform group-hover:scale-110">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">EBENESAID</span>
          </Link>

          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary border-none font-black px-4 py-1 text-[10px] uppercase tracking-[0.3em]">
                Everything you need for your move
              </Badge>
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tighter">
                Your Student Journey, <br />
                <span className="text-primary italic">Made Easy.</span>
              </h2>
              <p className="text-base text-slate-400 font-medium max-w-sm leading-relaxed">
                Join thousands of students who have traded relocation stress for a simple, safe, and organized move to Latvia.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <HighlightItem 
                icon={<Home className="h-4 w-4" />} 
                title="Safe Student Housing" 
                desc="Browse housing that we have checked ourselves for your safety." 
              />
              <HighlightItem 
                icon={<Lock className="h-4 w-4" />} 
                title="Private Document Storage" 
                desc="Keep your visa, passport, and school papers in a safe, private place." 
              />
              <HighlightItem 
                icon={<Globe className="h-4 w-4" />} 
                title="Connect with Others" 
                desc="Meet other students from your school and your home country." 
              />
            </div>
          </div>
        </div>

        {/* Rotating Testimonial Node */}
        <div className="relative z-10 mt-12 lg:mt-0">
          <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 4000 })]}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((t, i) => (
                <CarouselItem key={i}>
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 rounded-[2rem] shadow-2xl">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 rounded-xl border-2 border-primary/20 shrink-0">
                        <AvatarImage src={t.avatar} />
                        <AvatarFallback className="bg-primary text-white font-black text-xs">{t.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-3 flex-1 min-w-0">
                        <div className="flex gap-0.5 text-amber-400">
                          {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 fill-current" />)}
                        </div>
                        <p className="text-sm text-slate-200 font-medium leading-relaxed italic line-clamp-3">
                          "{t.text}"
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <p className="text-xs font-black text-white truncate">{t.name}</p>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{t.role}</p>
                          </div>
                          <Quote className="h-8 w-8 text-white/5 shrink-0" />
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

      {/* Right Column: Enrollment Form */}
      <div className="flex-1 flex flex-col relative bg-slate-50/50 min-h-screen">
        <header className="p-6 flex justify-start items-center relative z-10 shrink-0">
          <Button variant="ghost" asChild size="sm" className="gap-2 font-black text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all group px-4 h-9 bg-white shadow-sm border-none">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
              <span className="uppercase tracking-widest text-[10px]">Back to Home</span>
            </Link>
          </Button>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 lg:p-10 relative z-10">
          <div className="w-full max-w-[580px] space-y-6">
            <Card className="shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border-none p-0 rounded-[2.5rem] bg-white overflow-hidden relative">
              <CardHeader className="text-center pt-10 pb-6 px-8 sm:px-12">
                <div className="space-y-3">
                  <div className="mx-auto h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
                    <User className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic tracking-tight leading-none">
                    Student <span className="text-primary">Registration</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-bold uppercase tracking-[0.1em] text-xs">
                    Tell us about yourself to get started
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 px-8 sm:px-12 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormInput label="First Name" placeholder="e.g. John" icon={<User className="h-3.5 w-3.5" />} />
                  <FormInput label="Last Name" placeholder="e.g. Doe" icon={<User className="h-3.5 w-3.5" />} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormInput label="Latvian Phone No." placeholder="+371 ..." icon={<Phone className="h-3.5 w-3.5" />} />
                  <FormInput label="Personal Email Address" placeholder="e.g. yourname@gmail.com" icon={<Mail className="h-3.5 w-3.5" />} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormInput label="University Name" placeholder="Where will you study?" icon={<GraduationCap className="h-3.5 w-3.5" />} />
                  <FormInput label="Your Country" placeholder="Where are you from?" icon={<MapPin className="h-3.5 w-3.5" />} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormInput label="Password" placeholder="Create a password" type="password" icon={<Lock className="h-3.5 w-3.5" />} />
                  <FormInput label="Confirm Password" placeholder="Type it again" type="password" icon={<Lock className="h-3.5 w-3.5" />} />
                </div>

                <Button onClick={handleRegister} className="w-full h-14 rounded-2xl text-base font-black shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95 bg-primary text-white border-none uppercase tracking-widest group mt-4">
                  Start My Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
              
              <CardFooter className="text-center flex flex-col gap-4 pb-10 px-8 sm:px-12 border-t border-slate-50 pt-8">
                <p className="text-sm text-slate-400 font-medium">
                  Already have an account? <Link href="/login" className="text-primary font-black hover:underline decoration-2">Login here</Link>
                </p>
              </CardFooter>
            </Card>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 opacity-50">
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Your data is safe</p>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Privacy protected</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function FormInput({ label, placeholder, type = "text", icon }: { label: string, placeholder: string, type?: string, icon?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 ml-1">
        {icon && <span className="text-slate-300">{icon}</span>}
        <Label className="font-black text-[10px] uppercase tracking-wider text-slate-400">{label}</Label>
      </div>
      <Input 
        type={type}
        placeholder={placeholder} 
        className="h-12 rounded-xl bg-slate-100/50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold px-4 text-sm placeholder:text-slate-300" 
      />
    </div>
  );
}

function HighlightItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner shrink-0">
        {icon}
      </div>
      <div className="space-y-1 min-w-0">
        <h4 className="text-white font-black text-sm uppercase italic leading-none truncate">{title}</h4>
        <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">{desc}</p>
      </div>
    </div>
  );
}
