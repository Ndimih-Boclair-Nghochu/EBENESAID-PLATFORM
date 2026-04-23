'use client';

import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { defaultLocale, localeLabels, normalizeLocale, supportedLocales, type SupportedLocale } from '@/lib/i18n';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const [locale, setLocale] = useState<SupportedLocale>(defaultLocale);

  useEffect(() => {
    const saved = normalizeLocale(window.localStorage.getItem('eb_locale'));
    setLocale(saved);
    document.documentElement.lang = saved;
  }, []);

  function changeLocale(nextLocale: SupportedLocale) {
    setLocale(nextLocale);
    window.localStorage.setItem('eb_locale', nextLocale);
    document.cookie = `eb_locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nextLocale;
    window.dispatchEvent(new CustomEvent('eb-locale-change', { detail: { locale: nextLocale } }));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={compact ? 'sm' : 'default'}
          className="gap-2 rounded-xl font-bold text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-slate-100">
        {supportedLocales.map((option) => (
          <DropdownMenuItem
            key={option}
            onSelect={() => changeLocale(option)}
            className="cursor-pointer text-xs font-bold"
          >
            {localeLabels[option]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
