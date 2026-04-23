'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileText, Plus, Save, Trash2 } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { SidebarShell } from '@/components/layout/sidebar-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { defaultLocale, supportedLocales, type SupportedLocale } from '@/lib/i18n';
import { getDefaultHomePageContent, type HomeFeature, type HomeFeatureIconKey, type HomePageContent } from '@/lib/public-site-content';

type ContentState = Record<SupportedLocale, HomePageContent>;

const featureIconOptions: Array<{ value: HomeFeatureIconKey; label: string }> = [
  { value: 'home', label: 'Housing' },
  { value: 'fileText', label: 'Documents' },
  { value: 'briefcase', label: 'Jobs' },
  { value: 'navigation', label: 'Transport' },
  { value: 'utensils', label: 'Food' },
  { value: 'users', label: 'Community' },
];

function createDefaultState(): ContentState {
  return {
    en: getDefaultHomePageContent('en'),
    lv: getDefaultHomePageContent('lv'),
  };
}

export default function AdminContentPage() {
  const [activeLocale, setActiveLocale] = useState<SupportedLocale>(defaultLocale);
  const [contentByLocale, setContentByLocale] = useState<ContentState>(createDefaultState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setStatus(null);

      try {
        const [english, latvian] = await Promise.all(
          supportedLocales.map(async (locale) => {
            const res = await fetch(`/api/admin/content?page=home&locale=${locale}`, { credentials: 'include' });
            const body = await res.json();
            if (!res.ok) {
              throw new Error(body.error || `Failed to load ${locale.toUpperCase()} content.`);
            }

            return [locale, body.content] as const;
          })
        );

        if (!active) {
          return;
        }

        setContentByLocale({
          en: english[1],
          lv: latvian[1],
        });
      } catch (error) {
        if (active) {
          setStatus(error instanceof Error ? error.message : 'Failed to load content studio.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  function updateLocaleContent(locale: SupportedLocale, update: (draft: HomePageContent) => void) {
    setContentByLocale((current) => {
      const next = structuredClone(current) as ContentState;
      update(next[locale]);
      return next;
    });
  }

  async function saveContent() {
    setSaving(true);
    setStatus(null);

    try {
      for (const locale of supportedLocales) {
        const res = await fetch('/api/admin/content', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            page: 'home',
            locale,
            content: contentByLocale[locale],
          }),
        });

        const body = await res.json();
        if (!res.ok) {
          throw new Error(body.error || `Failed to save ${locale.toUpperCase()} content.`);
        }
      }

      setStatus('Homepage content updated for English and Latvian.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to save homepage content.');
    } finally {
      setSaving(false);
    }
  }

  const content = useMemo(() => contentByLocale[activeLocale], [activeLocale, contentByLocale]);

  return (
    <SidebarShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-10">
        <PageHeader
          title="Public Content Studio"
          subtitle="Manage the homepage copy and partner highlights without editing code."
          actions={
            <Button className="rounded-xl bg-green-700 hover:bg-green-800" onClick={saveContent} disabled={loading || saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Content'}
            </Button>
          }
        />

        {status && <p className="text-sm font-medium text-slate-600">{status}</p>}

        <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-black">Homepage Locales</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Edit English and Latvian content with the same structure and layout.</p>
            </div>
            <Badge variant="outline" className="border-green-100 bg-green-50 text-green-700">
              <FileText className="mr-1 h-3.5 w-3.5" />
              Home page
            </Badge>
          </CardHeader>
          <CardContent>
            <Tabs value={activeLocale} onValueChange={(value) => setActiveLocale(value as SupportedLocale)}>
              <TabsList className="grid w-full max-w-xs grid-cols-2 rounded-xl bg-slate-100">
                <TabsTrigger value="en" className="rounded-lg font-bold">English</TabsTrigger>
                <TabsTrigger value="lv" className="rounded-lg font-bold">Latvian</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <SectionCard title="Navigation">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Platform label" value={content.navigation.platformLabel} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.navigation.platformLabel = value; })} />
                <Field label="How it works label" value={content.navigation.howItWorksLabel} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.navigation.howItWorksLabel = value; })} />
                <Field label="About label" value={content.navigation.aboutLabel} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.navigation.aboutLabel = value; })} />
                <Field label="Contact label" value={content.navigation.contactLabel} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.navigation.contactLabel = value; })} />
                <Field label="Sign-in label" value={content.navigation.signInLabel} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.navigation.signInLabel = value; })} />
                <Field label="Get started label" value={content.navigation.getStartedLabel} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.navigation.getStartedLabel = value; })} />
              </div>
            </SectionCard>

            <SectionCard title="Hero">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Hero badge" value={content.hero.badge} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.hero.badge = value; })} />
                <Field label="Access label" value={content.hero.platformAccessLabel} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.hero.platformAccessLabel = value; })} />
                <Field label="Access status" value={content.hero.platformAccessStatus} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.hero.platformAccessStatus = value; })} />
                <Field label="Primary CTA" value={content.hero.primaryCta} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.hero.primaryCta = value; })} />
                <Field label="Title lead" value={content.hero.titleLead} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.hero.titleLead = value; })} />
                <Field label="Title main" value={content.hero.titleMain} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.hero.titleMain = value; })} />
                <Field label="Title accent" value={content.hero.titleAccent} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.hero.titleAccent = value; })} />
                <Field label="Secondary CTA" value={content.hero.secondaryCta} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.hero.secondaryCta = value; })} />
              </div>
              <TextField label="Hero description" value={content.hero.description} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.hero.description = value; })} />
            </SectionCard>

            <SectionCard title="Feature Section">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Section badge" value={content.features.badge} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.features.badge = value; })} />
                <Field label="Title lead" value={content.features.titleLead} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.features.titleLead = value; })} />
                <Field label="Title accent" value={content.features.titleAccent} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.features.titleAccent = value; })} />
              </div>
              <TextField label="Section description" value={content.features.description} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.features.description = value; })} />

              <div className="space-y-4">
                {content.features.items.map((feature, index) => (
                  <Card key={`${feature.title}-${index}`} className="rounded-2xl border-slate-100 shadow-none">
                    <CardContent className="grid gap-4 p-4 md:grid-cols-2">
                      <Field label="Feature title" value={feature.title} onChange={(value) => updateFeature(activeLocale, index, { title: value }, updateLocaleContent)} />
                      <Field label="Feature link" value={feature.href} onChange={(value) => updateFeature(activeLocale, index, { href: value }, updateLocaleContent)} />
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select value={feature.icon} onValueChange={(value) => updateFeature(activeLocale, index, { icon: value as HomeFeatureIconKey }, updateLocaleContent)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {featureIconOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Field label="Badge" value={feature.badge ?? ''} onChange={(value) => updateFeature(activeLocale, index, { badge: value.trim().length > 0 ? value : null }, updateLocaleContent)} />
                      <div className="md:col-span-2">
                        <TextField label="Description" value={feature.desc} onChange={(value) => updateFeature(activeLocale, index, { desc: value }, updateLocaleContent)} />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <Button variant="outline" className="rounded-xl" onClick={() => removeFeature(activeLocale, index, updateLocaleContent)} disabled={content.features.items.length <= 1}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove feature
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" className="rounded-xl" onClick={() => addFeature(activeLocale, updateLocaleContent)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add feature
                </Button>
              </div>
            </SectionCard>

            <SectionCard title="Testimonials">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Section badge" value={content.testimonials.badge} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.testimonials.badge = value; })} />
                <Field label="Title lead" value={content.testimonials.titleLead} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.testimonials.titleLead = value; })} />
                <Field label="Title accent" value={content.testimonials.titleAccent} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.testimonials.titleAccent = value; })} />
              </div>
              <div className="space-y-4">
                {content.testimonials.items.map((item, index) => (
                  <Card key={`${item.name}-${index}`} className="rounded-2xl border-slate-100 shadow-none">
                    <CardContent className="grid gap-4 p-4 md:grid-cols-2">
                      <Field label="Name" value={item.name} onChange={(value) => updateTestimonial(activeLocale, index, 'name', value, updateLocaleContent)} />
                      <Field label="Subtitle" value={item.university} onChange={(value) => updateTestimonial(activeLocale, index, 'university', value, updateLocaleContent)} />
                      <Field label="Avatar URL" value={item.avatar} onChange={(value) => updateTestimonial(activeLocale, index, 'avatar', value, updateLocaleContent)} />
                      <Field label="Flag" value={item.flag} onChange={(value) => updateTestimonial(activeLocale, index, 'flag', value, updateLocaleContent)} />
                      <div className="md:col-span-2">
                        <TextField label="Testimonial" value={item.content} onChange={(value) => updateTestimonial(activeLocale, index, 'content', value, updateLocaleContent)} />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <Button variant="outline" className="rounded-xl" onClick={() => removeTestimonial(activeLocale, index, updateLocaleContent)} disabled={content.testimonials.items.length <= 1}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove testimonial
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" className="rounded-xl" onClick={() => addTestimonial(activeLocale, updateLocaleContent)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add testimonial
                </Button>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <SectionCard title="University Partners">
              <Field label="Section label" value={content.universityPartners.label} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.universityPartners.label = value; })} />
              <div className="space-y-4">
                {content.universityPartners.partners.map((partner, index) => (
                  <div key={`${partner.name}-${index}`} className="grid gap-4 rounded-2xl border border-slate-100 p-4 md:grid-cols-[1fr_120px_auto]">
                    <Field label="University name" value={partner.name} onChange={(value) => updatePartner(activeLocale, index, 'name', value, updateLocaleContent)} />
                    <Field label="Abbreviation" value={partner.abbr} onChange={(value) => updatePartner(activeLocale, index, 'abbr', value, updateLocaleContent)} />
                    <div className="flex items-end">
                      <Button variant="outline" className="w-full rounded-xl" onClick={() => removePartner(activeLocale, index, updateLocaleContent)} disabled={content.universityPartners.partners.length <= 1}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="rounded-xl" onClick={() => addPartner(activeLocale, updateLocaleContent)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add university
                </Button>
              </div>
            </SectionCard>

            <SectionCard title="Ecosystem Partners">
              <Field label="Section label" value={content.ecosystem.label} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.ecosystem.label = value; })} />
              <Field label="Section sublabel" value={content.ecosystem.sublabel} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.ecosystem.sublabel = value; })} />
              <div className="space-y-4">
                {content.ecosystem.partners.map((partner, index) => (
                  <div key={`${partner.name}-${index}`} className="grid gap-4 rounded-2xl border border-slate-100 p-4 md:grid-cols-[1fr_160px_auto]">
                    <Field label="Partner name" value={partner.name} onChange={(value) => updateEcoPartner(activeLocale, index, 'name', value, updateLocaleContent)} />
                    <Field label="Type label" value={partner.type} onChange={(value) => updateEcoPartner(activeLocale, index, 'type', value, updateLocaleContent)} />
                    <div className="flex items-end">
                      <Button variant="outline" className="w-full rounded-xl" onClick={() => removeEcoPartner(activeLocale, index, updateLocaleContent)} disabled={content.ecosystem.partners.length <= 1}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="rounded-xl" onClick={() => addEcoPartner(activeLocale, updateLocaleContent)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add ecosystem item
                </Button>
              </div>
            </SectionCard>

            <SectionCard title="Visa Guidance">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Section badge" value={content.visa.badge} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.visa.badge = value; })} />
                <Field label="Title lead" value={content.visa.titleLead} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.visa.titleLead = value; })} />
                <Field label="Title accent" value={content.visa.titleAccent} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.visa.titleAccent = value; })} />
                <Field label="Short-stay title" value={content.visa.shortStayTitle} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.visa.shortStayTitle = value; })} />
                <Field label="Short-stay badge" value={content.visa.shortStayBadge} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.visa.shortStayBadge = value; })} />
                <Field label="Long-stay title" value={content.visa.longStayTitle} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.visa.longStayTitle = value; })} />
                <Field label="Long-stay badge" value={content.visa.longStayBadge} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.visa.longStayBadge = value; })} />
              </div>
              <TextField label="Section description" value={content.visa.description} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.visa.description = value; })} />
              <TextField label="Short-stay description" value={content.visa.shortStayDescription} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.visa.shortStayDescription = value; })} />
              <TextField label="Long-stay description" value={content.visa.longStayDescription} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.visa.longStayDescription = value; })} />
            </SectionCard>

            <SectionCard title="Getting Started">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Section badge" value={content.gettingStarted.badge} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.gettingStarted.badge = value; })} />
                <Field label="Title lead" value={content.gettingStarted.titleLead} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.gettingStarted.titleLead = value; })} />
                <Field label="Title accent" value={content.gettingStarted.titleAccent} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.gettingStarted.titleAccent = value; })} />
                <Field label="Step one title" value={content.gettingStarted.stepOneTitle} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.gettingStarted.stepOneTitle = value; })} />
                <Field label="Step two title" value={content.gettingStarted.stepTwoTitle} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.gettingStarted.stepTwoTitle = value; })} />
              </div>
              <TextField label="Step one description" value={content.gettingStarted.stepOneDescription} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.gettingStarted.stepOneDescription = value; })} />
              <TextField label="Step two description" value={content.gettingStarted.stepTwoDescription} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.gettingStarted.stepTwoDescription = value; })} />
            </SectionCard>

            <SectionCard title="Final Call To Action">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title lead" value={content.finalCta.titleLead} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.finalCta.titleLead = value; })} />
                <Field label="Title accent" value={content.finalCta.titleAccent} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.finalCta.titleAccent = value; })} />
                <Field label="Primary CTA" value={content.finalCta.primaryCta} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.finalCta.primaryCta = value; })} />
                <Field label="Secondary CTA" value={content.finalCta.secondaryCta} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.finalCta.secondaryCta = value; })} />
              </div>
              <TextField label="Description" value={content.finalCta.description} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.finalCta.description = value; })} />
            </SectionCard>

            <SectionCard title="Footer">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Platform heading" value={content.footer.platformHeading} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.footer.platformHeading = value; })} />
                <Field label="Company heading" value={content.footer.companyHeading} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.footer.companyHeading = value; })} />
                <Field label="Copyright" value={content.footer.copyright} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.footer.copyright = value; })} />
              </div>
              <TextField label="Footer description" value={content.footer.description} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.footer.description = value; })} />
              <TextField label="Footer tagline" value={content.footer.tagline} onChange={(value) => updateLocaleContent(activeLocale, (draft) => { draft.footer.tagline = value; })} />
            </SectionCard>
          </div>
        </div>
      </div>
    </SidebarShell>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-black">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-[96px]" />
    </div>
  );
}

function updateFeature(
  locale: SupportedLocale,
  index: number,
  patch: Partial<HomeFeature>,
  updateLocaleContent: (locale: SupportedLocale, update: (draft: HomePageContent) => void) => void
) {
  updateLocaleContent(locale, (draft) => {
    draft.features.items[index] = {
      ...draft.features.items[index],
      ...patch,
    };
  });
}

function addFeature(
  locale: SupportedLocale,
  updateLocaleContent: (locale: SupportedLocale, update: (draft: HomePageContent) => void) => void
) {
  updateLocaleContent(locale, (draft) => {
    draft.features.items.push({
      title: 'New feature',
      desc: 'Describe this module for users.',
      badge: null,
      href: '/register',
      icon: 'users',
    });
  });
}

function removeFeature(
  locale: SupportedLocale,
  index: number,
  updateLocaleContent: (locale: SupportedLocale, update: (draft: HomePageContent) => void) => void
) {
  updateLocaleContent(locale, (draft) => {
    draft.features.items.splice(index, 1);
  });
}

function updatePartner(
  locale: SupportedLocale,
  index: number,
  key: 'name' | 'abbr',
  value: string,
  updateLocaleContent: (locale: SupportedLocale, update: (draft: HomePageContent) => void) => void
) {
  updateLocaleContent(locale, (draft) => {
    draft.universityPartners.partners[index][key] = value;
  });
}

function addPartner(
  locale: SupportedLocale,
  updateLocaleContent: (locale: SupportedLocale, update: (draft: HomePageContent) => void) => void
) {
  updateLocaleContent(locale, (draft) => {
    draft.universityPartners.partners.push({ name: 'New partner', abbr: 'NP' });
  });
}

function removePartner(
  locale: SupportedLocale,
  index: number,
  updateLocaleContent: (locale: SupportedLocale, update: (draft: HomePageContent) => void) => void
) {
  updateLocaleContent(locale, (draft) => {
    draft.universityPartners.partners.splice(index, 1);
  });
}

function updateEcoPartner(
  locale: SupportedLocale,
  index: number,
  key: 'name' | 'type',
  value: string,
  updateLocaleContent: (locale: SupportedLocale, update: (draft: HomePageContent) => void) => void
) {
  updateLocaleContent(locale, (draft) => {
    draft.ecosystem.partners[index][key] = value;
  });
}

function addEcoPartner(
  locale: SupportedLocale,
  updateLocaleContent: (locale: SupportedLocale, update: (draft: HomePageContent) => void) => void
) {
  updateLocaleContent(locale, (draft) => {
    draft.ecosystem.partners.push({ name: 'New partner item', type: 'Module' });
  });
}

function removeEcoPartner(
  locale: SupportedLocale,
  index: number,
  updateLocaleContent: (locale: SupportedLocale, update: (draft: HomePageContent) => void) => void
) {
  updateLocaleContent(locale, (draft) => {
    draft.ecosystem.partners.splice(index, 1);
  });
}

function updateTestimonial(
  locale: SupportedLocale,
  index: number,
  key: 'name' | 'university' | 'content' | 'avatar' | 'flag',
  value: string,
  updateLocaleContent: (locale: SupportedLocale, update: (draft: HomePageContent) => void) => void
) {
  updateLocaleContent(locale, (draft) => {
    draft.testimonials.items[index][key] = value;
  });
}

function addTestimonial(
  locale: SupportedLocale,
  updateLocaleContent: (locale: SupportedLocale, update: (draft: HomePageContent) => void) => void
) {
  updateLocaleContent(locale, (draft) => {
    draft.testimonials.items.push({
      name: 'New testimonial',
      university: 'Program or journey',
      content: 'Add a credible platform outcome here.',
      avatar: 'https://picsum.photos/seed/new-testimonial/100/100',
      flag: '',
    });
  });
}

function removeTestimonial(
  locale: SupportedLocale,
  index: number,
  updateLocaleContent: (locale: SupportedLocale, update: (draft: HomePageContent) => void) => void
) {
  updateLocaleContent(locale, (draft) => {
    draft.testimonials.items.splice(index, 1);
  });
}
