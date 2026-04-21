export const supportedLocales = ['en', 'lv'] as const;

export type SupportedLocale = typeof supportedLocales[number];

export const localeLabels: Record<SupportedLocale, string> = {
  en: 'English',
  lv: 'Latviski',
};

export const defaultLocale: SupportedLocale = 'en';

export function normalizeLocale(value: string | null | undefined): SupportedLocale {
  return value === 'lv' ? 'lv' : defaultLocale;
}
