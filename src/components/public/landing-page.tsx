'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowRightLeft,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe,
  Home,
  Lock,
  Menu,
  Navigation,
  Plane,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Utensils,
} from 'lucide-react';

import { useAuthContext } from '@/auth/provider';
import { BrandLogo } from '@/components/brand-logo';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { defaultLocale, normalizeLocale, type SupportedLocale } from '@/lib/i18n';
import { getDefaultHomePageContent, type HomeFeatureIconKey, type HomePageContent } from '@/lib/public-site-content';

const featureIcons: Record<HomeFeatureIconKey, ReactNode> = {
  home: <Home className="h-6 w-6" />,
  fileText: <FileText className="h-6 w-6" />,
  briefcase: <Briefcase className="h-6 w-6" />,
  navigation: <Navigation className="h-6 w-6" />,
  utensils: <Utensils className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
};

const footerPlatformLinks = [
  { label: 'Verified Housing', href: '/accommodation', title: 'Verified Housing' },
  { label: 'Job Board', href: '/jobs', title: 'Job Board' },
  { label: 'Document Wallet', href: '/docs', title: 'Document Wallet' },
  { label: 'Order Food', href: '/food', title: 'Food' },
  { label: 'Arrival & Transit', href: '/arrival', title: 'Arrival & Transit' },
];

const footerCompanyLinks = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Support', href: '/support' },
  { label: 'Sign In', href: '/login' },
];

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [headerVisible, setHeaderVisible] = useState(true);
  const [locale, setLocale] = useState<SupportedLocale>(defaultLocale);
  const [content, setContent] = useState<HomePageContent>(getDefaultHomePageContent(defaultLocale));
  const lastScrollY = useRef(0);
  const { user } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 80) {
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function loadContent(nextLocale: SupportedLocale) {
      setLocale(nextLocale);
      document.documentElement.lang = nextLocale;

      try {
        const res = await fetch(`/api/public/content?page=home&locale=${nextLocale}`, { cache: 'no-store' });
        const body = await res.json();
        if (res.ok && body.content) {
          setContent(body.content);
          return;
        }
      } catch {
        // Fallback to bundled defaults.
      }

      setContent(getDefaultHomePageContent(nextLocale));
    }

    const savedLocale = normalizeLocale(window.localStorage.getItem('eb_locale'));
    void loadContent(savedLocale);

    const handleLocaleChange = (event: Event) => {
      const nextLocale = normalizeLocale((event as CustomEvent<{ locale?: string }>).detail?.locale);
      void loadContent(nextLocale);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'eb_locale') {
        void loadContent(normalizeLocale(event.newValue));
      }
    };

    window.addEventListener('eb-locale-change', handleLocaleChange as EventListener);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('eb-locale-change', handleLocaleChange as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  function handleProtectedLink(e: React.MouseEvent, title: string) {
    if (!user) {
      e.preventDefault();
      setSelectedService(title);
      setShowAuthDialog(true);
    }
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="max-w-[380px] rounded-3xl border-none bg-white p-8 shadow-2xl">
          <DialogHeader className="space-y-3 text-center">
            <div className="mx-auto w-fit rounded-2xl bg-green-50 p-4 text-green-700">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <DialogTitle className="text-xl font-black tracking-tight text-slate-900">Sign In Required</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-slate-500">
              Create a free account to access the <span className="font-bold text-slate-800">{selectedService}</span> module.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2.5 pt-4">
            <Button className="h-12 rounded-xl bg-green-700 text-sm font-bold shadow-lg shadow-green-700/20 hover:bg-green-800" asChild onClick={() => setShowAuthDialog(false)}>
              <Link href="/register">Create Free Account</Link>
            </Button>
            <Button variant="ghost" className="h-11 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900" asChild onClick={() => setShowAuthDialog(false)}>
              <Link href="/login">Already have an account? Sign in</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <header className={`fixed top-0 z-50 w-full border-b border-white/10 bg-green-900/95 backdrop-blur-xl transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 md:h-[72px]">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <BrandLogo
              frameClassName="border border-white/20 bg-white/95 p-1.5 shadow-lg shadow-black/15 transition-transform group-hover:scale-105"
              imageClassName="w-12"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { label: content.navigation.platformLabel, href: '/how-it-works' },
              { label: content.navigation.howItWorksLabel, href: '/how-it-works' },
              { label: content.navigation.aboutLabel, href: '/about' },
              { label: content.navigation.contactLabel, href: '/contact' },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="rounded-lg px-4 py-2 text-sm font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <div className="hidden sm:block"><LanguageSwitcher compact /></div>
            <Link href="/login" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white sm:block">
              {content.navigation.signInLabel}
            </Link>
            <Button asChild className="h-9 rounded-full border-none bg-white px-5 text-xs font-bold text-green-800 shadow-md transition-all hover:bg-green-50 hover:shadow-lg md:h-10 md:px-7 md:text-sm">
              <Link href="/register">{content.navigation.getStartedLabel}</Link>
            </Button>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-white hover:bg-white/10 lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 border-none bg-green-900 p-0 text-white sm:w-80">
                <SheetHeader className="border-b border-white/10 p-6 text-left">
                  <SheetTitle className="text-white">
                    <BrandLogo frameClassName="border border-white/10 bg-white p-1.5 shadow-lg shadow-black/15" imageClassName="w-12" />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 p-6">
                  {[
                    { label: content.navigation.platformLabel, href: '/how-it-works' },
                    { label: content.navigation.howItWorksLabel, href: '/how-it-works' },
                    { label: content.navigation.aboutLabel, href: '/about' },
                    { label: content.navigation.contactLabel, href: '/contact' },
                  ].map((link) => (
                    <Link key={link.label} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white">
                      {link.label}
                    </Link>
                  ))}
                  <div className="my-4 h-px bg-white/10" />
                  <LanguageSwitcher />
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white">
                    {content.navigation.signInLabel}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-green-950 to-slate-900" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        <div className="relative z-10 container mx-auto max-w-5xl px-5 py-20 text-center sm:px-6 md:py-28">
          <div className="space-y-7 duration-700 animate-in fade-in zoom-in-95 md:space-y-9">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-500/15 px-5 py-2 text-xs font-bold uppercase tracking-widest text-green-300 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-green-400" />
                <span>{content.hero.badge}</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 shadow-xl backdrop-blur-lg">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="h-7 w-7 border-2 border-slate-900 shadow-lg">
                      <AvatarImage src={`https://picsum.photos/seed/stu-presence-${locale}-${i}/100/100`} />
                      <AvatarFallback className="bg-green-700 text-[8px] font-black text-white">ST</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{content.hero.platformAccessLabel}</span>
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-2 py-0.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">{content.hero.platformAccessStatus}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="whitespace-nowrap text-[3.5vw] font-black leading-[1.05] tracking-tight text-white sm:text-5xl sm:whitespace-normal md:text-6xl lg:text-7xl">
                {content.hero.titleLead}<br className="hidden sm:block" /> {content.hero.titleMain} <span className="italic text-green-400">{content.hero.titleAccent}</span>
              </h1>
              <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-slate-300 md:text-lg lg:text-xl">{content.hero.description}</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row md:gap-4">
              <Button size="lg" className="h-13 w-full rounded-full border-none bg-green-500 px-8 text-sm font-bold text-white shadow-xl shadow-green-600/30 transition-all hover:-translate-y-0.5 hover:bg-green-500 sm:w-auto md:h-14 md:px-10 md:text-base" asChild>
                <Link href="/register">{content.hero.primaryCta}<ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-13 w-full rounded-full border border-white/20 bg-white/8 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/15 sm:w-auto md:h-14 md:px-10 md:text-base" asChild>
                <Link href="/how-it-works">{content.hero.secondaryCta}</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 opacity-70 md:gap-5">
              {[{ icon: <ShieldCheck className="h-3.5 w-3.5" />, label: 'Verified Listings' }, { icon: <Lock className="h-3.5 w-3.5" />, label: 'Secure & Private' }, { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: 'Free to Join' }].map((chip) => (
                <div key={chip.label} className="flex items-center gap-1.5 text-xs font-medium text-slate-400">{chip.icon}{chip.label}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white pb-14 pt-4 md:pb-20">
        <div className="container mx-auto mb-8 px-5 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{content.universityPartners.label}</p>
        </div>
        <div className="relative flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-10 whitespace-nowrap md:gap-20">
            {content.universityPartners.partners.concat(content.universityPartners.partners).map((partner, i) => (
              <div key={`${partner.name}-${i}`} className="group flex shrink-0 cursor-default items-center gap-5 md:gap-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 shadow-sm transition-all group-hover:border-green-200 group-hover:bg-green-50 md:h-14 md:w-14">
                  <span className="text-sm font-black text-slate-400 transition-colors group-hover:text-green-700">{partner.abbr}</span>
                </div>
                <span className="text-lg font-black tracking-tight text-slate-300 transition-colors group-hover:text-slate-600 md:text-2xl">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50 py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-5 sm:px-6">
          <div className="mb-14 text-center md:mb-[72px]">
            <Badge className="mb-5 rounded-full border border-green-100 bg-green-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-700">{content.features.badge}</Badge>
            <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              {content.features.titleLead} <span className="italic text-green-700">{content.features.titleAccent}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-slate-500 md:text-lg">{content.features.description}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {content.features.items.map((feature, index) => (
              <Link key={`${feature.title}-${index}`} href={feature.href} onClick={(e) => handleProtectedLink(e, feature.title)} className="group relative flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-green-100 hover:shadow-lg">
                {feature.badge && <span className="absolute right-4 top-4 rounded-full border border-green-100 bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700">{feature.badge}</span>}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700 shadow-sm transition-all duration-300 group-hover:bg-green-700 group-hover:text-white">
                  {featureIcons[feature.icon]}
                </div>
                <div>
                  <h3 className="mb-1.5 text-base font-black text-slate-900 transition-colors group-hover:text-green-700">{feature.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-500">{feature.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 pt-2 text-xs font-bold text-green-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Explore module <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-slate-100 bg-white py-14 md:py-20">
        <div className="container mx-auto mb-8 px-5 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">{content.ecosystem.label}</p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-300">{content.ecosystem.sublabel}</p>
        </div>
        <div className="relative flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-10 whitespace-nowrap md:gap-20" style={{ animationDirection: 'reverse' }}>
            {content.ecosystem.partners.concat(content.ecosystem.partners).map((partner, i) => (
              <div key={`${partner.name}-${i}`} className="group flex shrink-0 cursor-default items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 transition-all group-hover:border-green-100 md:h-12 md:w-12">
                  <span className="text-[9px] font-black text-slate-300 transition-colors group-hover:text-green-600">{partner.name.slice(0, 2)}</span>
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight text-slate-400 transition-colors group-hover:text-slate-700 md:text-base">{partner.name}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300">{partner.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 lg:py-32" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)' }}>
        <div className="container mx-auto max-w-7xl px-5 sm:px-6">
          <div className="mb-14 text-center md:mb-[72px]">
            <Badge className="mb-5 rounded-full border border-green-100 bg-green-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-700">{content.visa.badge}</Badge>
            <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              {content.visa.titleLead} <span className="italic text-green-700">{content.visa.titleAccent}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-slate-500 md:text-lg">{content.visa.description}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-7 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm md:p-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-700 text-white shadow-md shadow-green-700/20"><Globe className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">Option 01</p>
                    <h3 className="text-xl font-black text-slate-900">{content.visa.shortStayTitle}</h3>
                  </div>
                </div>
                <Badge className="mt-1 shrink-0 border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">{content.visa.shortStayBadge}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-7">
                <div className="flex flex-col items-center gap-2"><div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-100 bg-white shadow-md"><span className="text-base font-black text-slate-700">CM</span></div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cameroon</p></div>
                <div className="flex flex-1 flex-col items-center gap-1.5 px-4"><div className="h-px w-full border-t-2 border-dashed border-green-200" /><Plane className="h-5 w-5 text-green-600" /><span className="rounded-full border border-green-100 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-600">Direct</span></div>
                <div className="flex flex-col items-center gap-2"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 shadow-md"><span className="text-base font-black text-white">LV</span></div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Latvia</p></div>
              </div>
              <div className="space-y-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                <div className="flex items-center gap-2.5"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" /><p className="text-sm font-bold text-slate-800">Schengen C Visa - Short-Stay</p></div>
                <p className="text-xs font-medium leading-relaxed text-slate-500">{content.visa.shortStayDescription}</p>
              </div>
            </div>
            <div className="flex flex-col gap-7 rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-800 p-7 shadow-xl md:p-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-md"><ArrowRightLeft className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-400">Option 02</p>
                    <h3 className="text-xl font-black text-white">{content.visa.longStayTitle}</h3>
                  </div>
                </div>
                <Badge className="mt-1 shrink-0 border border-green-400/30 bg-green-500/20 px-3 py-1 text-xs font-bold text-green-300">{content.visa.longStayBadge}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-7">
                <div className="flex flex-col items-center gap-2"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10"><span className="text-sm font-black text-white">CM</span></div><p className="text-[10px] font-bold uppercase text-slate-400">Cameroon</p></div>
                <div className="flex flex-1 flex-col items-center px-3"><div className="h-px w-full border-t border-dashed border-green-500/30" /><span className="mt-1 rounded-full bg-slate-900/60 px-2 py-0.5 text-[9px] font-bold text-green-400">via Cairo</span></div>
                <div className="flex flex-col items-center gap-2"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-400/30 bg-green-500/20"><span className="text-sm font-black text-green-300">EG</span></div><p className="text-[10px] font-bold uppercase text-green-400">Egypt</p></div>
                <div className="flex flex-1 flex-col items-center px-3"><div className="h-px w-full border-t border-dashed border-green-500/30" /></div>
                <div className="flex flex-col items-center gap-2"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"><span className="text-sm font-black text-slate-900">LV</span></div><p className="text-[10px] font-bold uppercase text-white">Latvia</p></div>
              </div>
              <div className="space-y-2.5 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-2.5"><ShieldCheck className="h-4 w-4 shrink-0 text-green-400" /><p className="text-sm font-bold text-white">National D Visa - Long-Stay Student</p></div>
                <p className="text-xs font-medium leading-relaxed text-slate-400">{content.visa.longStayDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-900 py-20 md:py-28 lg:py-32">
        <div className="container mx-auto max-w-7xl px-5 sm:px-6">
          <div className="mb-14 text-center md:mb-[72px]">
            <Badge className="mb-5 rounded-full border border-green-500/25 bg-green-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-400">{content.gettingStarted.badge}</Badge>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {content.gettingStarted.titleLead} <span className="italic text-green-400">{content.gettingStarted.titleAccent}</span>
            </h2>
          </div>
          <div className="grid gap-5 md:gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 md:p-10">
              <div className="flex flex-col items-start gap-10 lg:flex-row">
                <div className="shrink-0 space-y-5 lg:w-1/3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500 text-xl font-black text-white shadow-lg shadow-green-600/20">01</div>
                  <h3 className="text-2xl font-black leading-tight text-white md:text-3xl">{content.gettingStarted.stepOneTitle}</h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-400 md:text-base">{content.gettingStarted.stepOneDescription}</p>
                </div>
                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-2/3">
                  {content.universityPartners.partners.map((uni, i) => (
                    <div key={`${uni.name}-${i}`} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 p-4 transition-all hover:border-green-500/30 hover:bg-white/10">
                      <div className="min-w-0 flex items-center gap-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-green-500/25 bg-green-500/15 text-[10px] font-black text-green-400">{uni.abbr}</div>
                        <span className="truncate text-xs font-bold uppercase tracking-tight text-slate-300">{uni.name}</span>
                      </div>
                      <Button size="sm" variant="outline" className="ml-3 h-8 shrink-0 rounded-lg border-green-500/30 text-[10px] font-bold uppercase text-green-400 transition-all hover:border-green-500 hover:bg-green-500 hover:text-white" asChild>
                        <Link href="/register">Apply</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-green-500/40 bg-green-700 p-7 shadow-xl shadow-green-900/40 md:p-10">
              <div className="flex flex-col items-center gap-8 lg:flex-row">
                <div className="space-y-5 lg:w-1/2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-black text-green-700 shadow-lg">02</div>
                  <h3 className="text-2xl font-black leading-tight text-white md:text-3xl">{content.gettingStarted.stepTwoTitle}</h3>
                  <p className="text-sm font-medium leading-relaxed text-green-100 md:text-base">{content.gettingStarted.stepTwoDescription}</p>
                </div>
                <div className="flex w-full justify-center lg:w-1/2 lg:justify-end">
                  <Button size="lg" className="group h-14 w-full rounded-full border-none bg-white px-10 text-base font-bold text-green-700 shadow-xl transition-all hover:-translate-y-0.5 hover:bg-green-50 sm:w-auto" asChild>
                    <Link href="/register">Create My Account <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-t border-slate-100 bg-white py-20 md:py-28">
        <div className="container mx-auto mb-12 max-w-7xl px-5 text-center sm:px-6 md:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-700"><Quote className="h-4 w-4" />{content.testimonials.badge}</div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            {content.testimonials.titleLead} <span className="italic text-green-700">{content.testimonials.titleAccent}</span>
          </h2>
        </div>
        <div className="relative flex overflow-hidden">
          <div className="animate-marquee flex items-stretch gap-5 whitespace-nowrap md:gap-7">
            {content.testimonials.items.concat(content.testimonials.items).map((item, i) => (
              <div key={`${item.name}-${i}`} className="flex w-[300px] shrink-0 flex-col gap-5 whitespace-normal rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-500 hover:border-green-100 hover:shadow-lg sm:w-[360px] md:w-[420px] md:p-8">
                <div className="flex gap-0.5 text-amber-400">{[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-amber-400" />)}</div>
                <p className="flex-1 text-sm font-medium leading-relaxed text-slate-600 md:text-base">"{item.content}"</p>
                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-100"><img src={item.avatar} alt={item.name} className="h-full w-full object-cover" /></div>
                    <div>
                      <p className="text-sm font-black leading-none text-slate-900">{item.flag} {item.name}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.university}</p>
                    </div>
                  </div>
                  <Badge className="border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">Verified</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 70%, #16a34a 100%)' }}>
        <div className="container mx-auto max-w-4xl px-5 sm:px-6">
          <div className="space-y-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/20 bg-white/15 backdrop-blur-sm shadow-xl md:h-20 md:w-20"><Sparkles className="h-8 w-8 text-white md:h-10 md:w-10" /></div>
            <div className="mx-auto max-w-3xl space-y-4">
              <h2 className="text-3xl font-black leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                {content.finalCta.titleLead} <span className="italic opacity-90">{content.finalCta.titleAccent}</span>
              </h2>
              <p className="mx-auto max-w-xl text-base font-medium leading-relaxed text-green-100 md:text-lg">{content.finalCta.description}</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row md:gap-4">
              <Button size="lg" className="h-13 w-full rounded-full border-none bg-white px-10 text-sm font-bold text-green-800 shadow-xl transition-all hover:-translate-y-0.5 hover:bg-green-50 sm:w-auto md:h-14 md:px-12 md:text-base" asChild>
                <Link href="/register">{content.finalCta.primaryCta}</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-13 w-full rounded-full border-2 border-white/30 bg-white/10 px-10 text-sm font-semibold text-white transition-all hover:border-white/50 hover:bg-white/20 sm:w-auto md:h-14 md:px-12 md:text-base" asChild>
                <Link href="/login">{content.finalCta.secondaryCta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white py-14 md:py-20">
        <div className="container mx-auto max-w-7xl px-5 sm:px-6">
          <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 md:gap-12">
            <div className="space-y-5 sm:col-span-2 lg:col-span-2">
              <Link href="/" className="group flex w-fit items-center gap-2.5">
                <BrandLogo imageClassName="w-28 transition-transform group-hover:scale-105" />
              </Link>
              <p className="max-w-sm text-sm font-medium leading-relaxed text-slate-500">{content.footer.description}</p>
              <div className="flex items-center gap-3">
                <Link href="/register" className="inline-flex items-center gap-1.5 rounded-xl bg-green-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-green-800">
                  Get Started Free <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/login" className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-green-50 hover:text-green-700">
                  {content.navigation.signInLabel}
                </Link>
              </div>
            </div>
            <div>
              <h4 className="mb-5 text-xs font-black uppercase tracking-widest text-slate-900">{content.footer.platformHeading}</h4>
              <ul className="space-y-3 text-sm font-medium text-slate-500">
                {footerPlatformLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} onClick={(e) => handleProtectedLink(e, link.title)} className="group flex items-center gap-1.5 transition-colors hover:text-green-700">
                      {link.label}<ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-40" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-5 text-xs font-black uppercase tracking-widest text-slate-900">{content.footer.companyHeading}</h4>
              <ul className="space-y-3 text-sm font-medium text-slate-500">
                {footerCompanyLinks.map((link) => <li key={link.label}><Link href={link.href} className="transition-colors hover:text-green-700">{link.label}</Link></li>)}
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-8 text-xs font-medium text-slate-400 md:flex-row">
            <p>{content.footer.copyright}</p>
            <p>{content.footer.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
