'use client';

import { useEffect, useState } from 'react';

import { useActiveLocale } from '@/hooks/use-active-locale';
import { getDefaultMarketingPageContent, type MarketingPageContentMap, type MarketingPageKey } from '@/lib/marketing-site-content';

export function useMarketingPageContent<TPage extends MarketingPageKey>(page: TPage) {
  const locale = useActiveLocale();
  const [content, setContent] = useState<MarketingPageContentMap[TPage]>(() => getDefaultMarketingPageContent(page, locale));

  useEffect(() => {
    let active = true;
    setContent(getDefaultMarketingPageContent(page, locale));

    async function load() {
      const response = await fetch(`/api/public/content?page=${page}&locale=${locale}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) {
        return;
      }

      if (active) {
        setContent(payload.content);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [locale, page]);

  return { content, locale };
}
