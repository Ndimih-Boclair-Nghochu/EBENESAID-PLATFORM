'use client';

import { useEffect, useState } from 'react';

import { defaultLocale, normalizeLocale, type SupportedLocale } from '@/lib/i18n';

export function useActiveLocale() {
  const [locale, setLocale] = useState<SupportedLocale>(defaultLocale);

  useEffect(() => {
    const applyLocale = () => {
      setLocale(normalizeLocale(window.localStorage.getItem('eb_locale')));
    };

    applyLocale();
    window.addEventListener('eb-locale-change', applyLocale as EventListener);
    window.addEventListener('storage', applyLocale);

    return () => {
      window.removeEventListener('eb-locale-change', applyLocale as EventListener);
      window.removeEventListener('storage', applyLocale);
    };
  }, []);

  return locale;
}
