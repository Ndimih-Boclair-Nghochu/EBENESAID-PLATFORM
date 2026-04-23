import type { SupportedLocale } from '@/lib/i18n';

export type HomeFeatureIconKey = 'home' | 'fileText' | 'briefcase' | 'navigation' | 'utensils' | 'users';

export type HomePartner = {
  name: string;
  abbr: string;
};

export type HomeEcosystemPartner = {
  name: string;
  type: string;
};

export type HomeTestimonial = {
  name: string;
  university: string;
  content: string;
  avatar: string;
  flag: string;
};

export type HomeFeature = {
  title: string;
  desc: string;
  badge: string | null;
  href: string;
  icon: HomeFeatureIconKey;
};

export type HomePageContent = {
  navigation: {
    platformLabel: string;
    howItWorksLabel: string;
    aboutLabel: string;
    contactLabel: string;
    signInLabel: string;
    getStartedLabel: string;
  };
  hero: {
    badge: string;
    platformAccessLabel: string;
    platformAccessStatus: string;
    titleLead: string;
    titleMain: string;
    titleAccent: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  universityPartners: {
    label: string;
    partners: HomePartner[];
  };
  features: {
    badge: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    items: HomeFeature[];
  };
  ecosystem: {
    label: string;
    sublabel: string;
    partners: HomeEcosystemPartner[];
  };
  visa: {
    badge: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    shortStayTitle: string;
    shortStayBadge: string;
    shortStayDescription: string;
    longStayTitle: string;
    longStayBadge: string;
    longStayDescription: string;
  };
  gettingStarted: {
    badge: string;
    titleLead: string;
    titleAccent: string;
    stepOneTitle: string;
    stepOneDescription: string;
    stepTwoTitle: string;
    stepTwoDescription: string;
  };
  testimonials: {
    badge: string;
    titleLead: string;
    titleAccent: string;
    items: HomeTestimonial[];
  };
  finalCta: {
    titleLead: string;
    titleAccent: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  footer: {
    description: string;
    platformHeading: string;
    companyHeading: string;
    copyright: string;
    tagline: string;
  };
};

const englishHomeContent: HomePageContent = {
  navigation: {
    platformLabel: 'Platform',
    howItWorksLabel: 'How it Works',
    aboutLabel: 'About Us',
    contactLabel: 'Contact',
    signInLabel: 'Sign In',
    getStartedLabel: 'Get Started',
  },
  hero: {
    badge: 'The Smart Relocation Platform for Latvia',
    platformAccessLabel: 'Platform access',
    platformAccessStatus: 'Ready',
    titleLead: 'From Arrival to',
    titleMain: 'Settlement.',
    titleAccent: 'Simplified.',
    description:
      'The trusted platform for international students relocating to Latvia and the Baltics. Housing, documents, jobs, and community - all in one place.',
    primaryCta: "Get Started - It's Free",
    secondaryCta: 'See How It Works',
  },
  universityPartners: {
    label: "Trusted by students at Latvia's top universities",
    partners: [
      { name: 'RTU RIGA', abbr: 'RT' },
      { name: 'UNIVERSITY OF LATVIA', abbr: 'UL' },
      { name: 'TURIBA UNIVERSITY', abbr: 'TU' },
      { name: 'RSU', abbr: 'RS' },
      { name: 'RISEBA', abbr: 'RI' },
    ],
  },
  features: {
    badge: 'Everything You Need',
    titleLead: 'One Platform.',
    titleAccent: 'Every Step.',
    description:
      'From your first housing search to landing your first job in Latvia - EBENESAID covers every stage of your student journey.',
    items: [
      {
        icon: 'home',
        title: 'Verified Housing',
        desc: 'Scam-free, physically inspected accommodation. Every listing is legally verified before it appears on our platform.',
        badge: 'Most Popular',
        href: '/accommodation',
      },
      {
        icon: 'fileText',
        title: 'Document Wallet',
        desc: 'Store your visa, passport, residence permit, and all academic documents in one encrypted, accessible place.',
        badge: null,
        href: '/docs',
      },
      {
        icon: 'briefcase',
        title: 'Career Bridge',
        desc: 'Verified part-time jobs and internships vetted for international students and work-permit compliance.',
        badge: null,
        href: '/jobs',
      },
      {
        icon: 'navigation',
        title: 'Arrival & Transit',
        desc: 'Book your airport-to-city transfer in advance and get guided through your first days in Latvia.',
        badge: null,
        href: '/arrival',
      },
      {
        icon: 'utensils',
        title: 'Food & Dining',
        desc: 'Order familiar and local food from our verified supplier network, delivered to your door.',
        badge: null,
        href: '/food',
      },
      {
        icon: 'users',
        title: 'Student Community',
        desc: 'Connect with students from your university and country. Build your social network before you even arrive.',
        badge: null,
        href: '/community',
      },
    ],
  },
  ecosystem: {
    label: 'Verified Ecosystem Partners',
    sublabel: 'Housing · Careers · Logistics',
    partners: [
      { name: 'Verified Housing', type: 'Module' },
      { name: 'Secure Wallet', type: 'Module' },
      { name: 'Career Bridge', type: 'Module' },
      { name: 'Arrival Support', type: 'Module' },
      { name: 'Food Supply', type: 'Module' },
      { name: 'Student Circle', type: 'Module' },
    ],
  },
  visa: {
    badge: 'Visa & Travel Guidance',
    titleLead: 'Know Your',
    titleAccent: 'Visa Requirements.',
    description: 'Clear guidance on travel and visa requirements based on how long you plan to stay in Latvia.',
    shortStayTitle: 'Short-Term Stay',
    shortStayBadge: 'Under 3 Months',
    shortStayDescription:
      'For stays under 3 months (exchanges, visits). Direct entry is permitted under Schengen protocols for eligible academic guests.',
    longStayTitle: 'Long-Term Stay',
    longStayBadge: '3+ Months',
    longStayDescription:
      'Required for stays over 3 months. Since there is no Latvian Embassy in Cameroon, students must transit via the Latvian Embassy in Cairo, Egypt for visa processing.',
  },
  gettingStarted: {
    badge: 'How It Works',
    titleLead: 'Get Started in',
    titleAccent: 'Two Steps.',
    stepOneTitle: 'Apply to a Partner University',
    stepOneDescription:
      'Your journey begins with academic excellence. Choose a certified Latvian institution and start your application directly.',
    stepTwoTitle: 'Set Up Your EBENESAID Account',
    stepTwoDescription:
      'Once your admission is confirmed, register on EBENESAID to unlock your personalized relocation plan and manage every step of your move.',
  },
  testimonials: {
    badge: 'Student Reviews',
    titleLead: 'Trusted by Ambitious',
    titleAccent: 'Students Worldwide.',
    items: [
      {
        name: 'Relocation Support',
        university: 'Platform Journey',
        content:
          'The platform is designed to keep housing, documents, community, and support in one operational flow.',
        avatar: 'https://picsum.photos/seed/platform-relocation/100/100',
        flag: '',
      },
      {
        name: 'Secure Records',
        university: 'Document Workflow',
        content:
          'Document storage, account setup, and guided tasks are structured to reduce confusion during relocation.',
        avatar: 'https://picsum.photos/seed/platform-docs/100/100',
        flag: '',
      },
      {
        name: 'Verified Modules',
        university: 'Service Access',
        content:
          'Students, partners, and administrators use one connected platform instead of disconnected tools.',
        avatar: 'https://picsum.photos/seed/platform-modules/100/100',
        flag: '',
      },
    ],
  },
  finalCta: {
    titleLead: 'Start Your Journey to',
    titleAccent: 'Latvia Today.',
    description:
      'Join thousands of international students who chose EBENESAID for a smooth, safe, and supported relocation.',
    primaryCta: 'Create Free Account',
    secondaryCta: 'Sign In',
  },
  footer: {
    description:
      'The relocation platform for international students in Latvia and the Baltics. Housing, documents, jobs, and community - all in one place.',
    platformHeading: 'Platform',
    companyHeading: 'Company',
    copyright: '© 2026 EBENESAID. All rights reserved.',
    tagline: 'Built for international students in Latvia and the Baltics.',
  },
};

const latvianHomeContent: HomePageContent = {
  navigation: {
    platformLabel: 'Platforma',
    howItWorksLabel: 'Kā tas darbojas',
    aboutLabel: 'Par mums',
    contactLabel: 'Kontakti',
    signInLabel: 'Pierakstīties',
    getStartedLabel: 'Sākt',
  },
  hero: {
    badge: 'Viedā pārcelšanās platforma Latvijai',
    platformAccessLabel: 'Piekļuve platformai',
    platformAccessStatus: 'Gatavs',
    titleLead: 'No ierašanās līdz',
    titleMain: 'iekārtošanās brīdim.',
    titleAccent: 'Vienkāršāk.',
    description:
      'Uzticama platforma starptautiskajiem studentiem, kuri pārceļas uz Latviju un Baltiju. Mājoklis, dokumenti, darbs un kopiena - viss vienuviet.',
    primaryCta: 'Sāc bez maksas',
    secondaryCta: 'Skatīt, kā tas darbojas',
  },
  universityPartners: {
    label: 'Studentu uzticība vadošajām Latvijas augstskolām',
    partners: [
      { name: 'RTU RIGA', abbr: 'RT' },
      { name: 'LATVIJAS UNIVERSITĀTE', abbr: 'LU' },
      { name: 'TURĪBAS UNIVERSITĀTE', abbr: 'TU' },
      { name: 'RSU', abbr: 'RS' },
      { name: 'RISEBA', abbr: 'RI' },
    ],
  },
  features: {
    badge: 'Viss, kas nepieciešams',
    titleLead: 'Viena platforma.',
    titleAccent: 'Katrs solis.',
    description:
      'No pirmā mājokļa meklējuma līdz pirmajam darbam Latvijā - EBENESAID aptver katru studenta ceļa posmu.',
    items: [
      {
        icon: 'home',
        title: 'Pārbaudīts mājoklis',
        desc: 'Droši un fiziski pārbaudīti dzīvokļi. Katrs sludinājums tiek juridiski pārbaudīts pirms publicēšanas platformā.',
        badge: 'Populārākais',
        href: '/accommodation',
      },
      {
        icon: 'fileText',
        title: 'Dokumentu maks',
        desc: 'Glabājiet vīzu, pasi, uzturēšanās atļauju un akadēmiskos dokumentus vienā drošā vietā.',
        badge: null,
        href: '/docs',
      },
      {
        icon: 'briefcase',
        title: 'Karjeras tilts',
        desc: 'Pārbaudīti nepilna laika darbi un prakses vietas starptautiskajiem studentiem ar atbilstības pārbaudi.',
        badge: null,
        href: '/jobs',
      },
      {
        icon: 'navigation',
        title: 'Ierašanās un transfērs',
        desc: 'Rezervējiet transfēru no lidostas uz pilsētu un saņemiet skaidru atbalstu pirmajām dienām Latvijā.',
        badge: null,
        href: '/arrival',
      },
      {
        icon: 'utensils',
        title: 'Ēdiens un ēdināšana',
        desc: 'Pasūtiet iecienītus un vietējos ēdienus no pārbaudīta piegādātāju tīkla ar piegādi līdz durvīm.',
        badge: null,
        href: '/food',
      },
      {
        icon: 'users',
        title: 'Studentu kopiena',
        desc: 'Sazinieties ar studentiem no savas universitātes un valsts, veidojot kontaktus vēl pirms ierašanās.',
        badge: null,
        href: '/community',
      },
    ],
  },
  ecosystem: {
    label: 'Pārbaudīti ekosistēmas partneri',
    sublabel: 'Mājokļi · Karjera · Loģistika',
    partners: [
      { name: 'Pārbaudīts mājoklis', type: 'Modulis' },
      { name: 'Drošais maks', type: 'Modulis' },
      { name: 'Karjeras tilts', type: 'Modulis' },
      { name: 'Ierašanās atbalsts', type: 'Modulis' },
      { name: 'Ēdināšana', type: 'Modulis' },
      { name: 'Studentu loks', type: 'Modulis' },
    ],
  },
  visa: {
    badge: 'Vīzas un ceļošanas atbalsts',
    titleLead: 'Zini savas',
    titleAccent: 'vīzas prasības.',
    description: 'Skaidrs ceļvedis par vīzas un ceļošanas prasībām atkarībā no plānotā uzturēšanās ilguma Latvijā.',
    shortStayTitle: 'Īstermiņa uzturēšanās',
    shortStayBadge: 'Līdz 3 mēnešiem',
    shortStayDescription:
      'Uzturēšanās laikam līdz 3 mēnešiem (apmaiņa, vizītes). Tiesīgajiem akadēmiskajiem viesiem ir iespējama tieša ieceļošana saskaņā ar Šengenas noteikumiem.',
    longStayTitle: 'Ilgtermiņa uzturēšanās',
    longStayBadge: 'Vairāk nekā 3 mēneši',
    longStayDescription:
      'Nepieciešama uzturēšanās laikam virs 3 mēnešiem. Tā kā Kamerūnā nav Latvijas vēstniecības, studentiem vīzas noformēšanai jādodas caur Latvijas vēstniecību Kairā, Ēģiptē.',
  },
  gettingStarted: {
    badge: 'Kā tas darbojas',
    titleLead: 'Sāciet',
    titleAccent: 'divos soļos.',
    stepOneTitle: 'Piesakieties partneraugstskolā',
    stepOneDescription:
      'Jūsu ceļš sākas ar akadēmisku izcilību. Izvēlieties sertificētu Latvijas augstskolu un sāciet pieteikšanos tieši.',
    stepTwoTitle: 'Izveidojiet savu EBENESAID kontu',
    stepTwoDescription:
      'Kad uzņemšana ir apstiprināta, reģistrējieties EBENESAID, lai atvērtu savu personalizēto pārcelšanās plānu un pārvaldītu katru soli.',
  },
  testimonials: {
    badge: 'Studentu atsauksmes',
    titleLead: 'Uzticas mērķtiecīgi',
    titleAccent: 'studenti visā pasaulē.',
    items: [
      {
        name: 'Pārcelšanās atbalsts',
        university: 'Platformas pieredze',
        content:
          'Platforma apvieno mājokli, dokumentus, kopienu un atbalstu vienā praktiskā darbplūsmā.',
        avatar: 'https://picsum.photos/seed/platform-relocation/100/100',
        flag: '',
      },
      {
        name: 'Droši ieraksti',
        university: 'Dokumentu process',
        content:
          'Dokumentu glabāšana, konta sagatavošana un vadītie uzdevumi palīdz mazināt neskaidrību pārcelšanās laikā.',
        avatar: 'https://picsum.photos/seed/platform-docs/100/100',
        flag: '',
      },
      {
        name: 'Pārbaudīti moduļi',
        university: 'Pakalpojumu piekļuve',
        content: 'Studenti, partneri un administratori izmanto vienu savienotu platformu vairāku atsevišķu rīku vietā.',
        avatar: 'https://picsum.photos/seed/platform-modules/100/100',
        flag: '',
      },
    ],
  },
  finalCta: {
    titleLead: 'Sāciet savu ceļu uz',
    titleAccent: 'Latviju jau šodien.',
    description:
      'Pievienojieties tūkstošiem starptautisko studentu, kuri izvēlējās EBENESAID drošai un sakārtotai pārcelšanās pieredzei.',
    primaryCta: 'Izveidot bezmaksas kontu',
    secondaryCta: 'Pierakstīties',
  },
  footer: {
    description:
      'Pārcelšanās platforma starptautiskajiem studentiem Latvijā un Baltijā. Mājoklis, dokumenti, darbs un kopiena - viss vienuviet.',
    platformHeading: 'Platforma',
    companyHeading: 'Uzņēmums',
    copyright: '© 2026 EBENESAID. Visas tiesības aizsargātas.',
    tagline: 'Izstrādāta starptautiskajiem studentiem Latvijā un Baltijā.',
  },
};

export function getDefaultHomePageContent(locale: SupportedLocale): HomePageContent {
  return locale === 'lv' ? latvianHomeContent : englishHomeContent;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function asNullableString(value: unknown, fallback: string | null): string | null {
  if (value === null) {
    return null;
  }

  return typeof value === 'string' ? value : fallback;
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function normalizeHomePageContent(value: unknown, locale: SupportedLocale): HomePageContent {
  const fallback = getDefaultHomePageContent(locale);
  const source = asObject(value);
  const navigation = asObject(source.navigation);
  const hero = asObject(source.hero);
  const universityPartners = asObject(source.universityPartners);
  const features = asObject(source.features);
  const ecosystem = asObject(source.ecosystem);
  const visa = asObject(source.visa);
  const gettingStarted = asObject(source.gettingStarted);
  const testimonials = asObject(source.testimonials);
  const finalCta = asObject(source.finalCta);
  const footer = asObject(source.footer);

  return {
    navigation: {
      platformLabel: asString(navigation.platformLabel, fallback.navigation.platformLabel),
      howItWorksLabel: asString(navigation.howItWorksLabel, fallback.navigation.howItWorksLabel),
      aboutLabel: asString(navigation.aboutLabel, fallback.navigation.aboutLabel),
      contactLabel: asString(navigation.contactLabel, fallback.navigation.contactLabel),
      signInLabel: asString(navigation.signInLabel, fallback.navigation.signInLabel),
      getStartedLabel: asString(navigation.getStartedLabel, fallback.navigation.getStartedLabel),
    },
    hero: {
      badge: asString(hero.badge, fallback.hero.badge),
      platformAccessLabel: asString(hero.platformAccessLabel, fallback.hero.platformAccessLabel),
      platformAccessStatus: asString(hero.platformAccessStatus, fallback.hero.platformAccessStatus),
      titleLead: asString(hero.titleLead, fallback.hero.titleLead),
      titleMain: asString(hero.titleMain, fallback.hero.titleMain),
      titleAccent: asString(hero.titleAccent, fallback.hero.titleAccent),
      description: asString(hero.description, fallback.hero.description),
      primaryCta: asString(hero.primaryCta, fallback.hero.primaryCta),
      secondaryCta: asString(hero.secondaryCta, fallback.hero.secondaryCta),
    },
    universityPartners: {
      label: asString(universityPartners.label, fallback.universityPartners.label),
      partners: asArray(universityPartners.partners).map((item, index) => {
        const partner = asObject(item);
        const partnerFallback = fallback.universityPartners.partners[index] ?? fallback.universityPartners.partners[0];
        return {
          name: asString(partner.name, partnerFallback.name),
          abbr: asString(partner.abbr, partnerFallback.abbr),
        };
      }).filter((item) => item.name.trim().length > 0).slice(0, 12),
    },
    features: {
      badge: asString(features.badge, fallback.features.badge),
      titleLead: asString(features.titleLead, fallback.features.titleLead),
      titleAccent: asString(features.titleAccent, fallback.features.titleAccent),
      description: asString(features.description, fallback.features.description),
      items: asArray(features.items).map((item, index) => {
        const feature = asObject(item);
        const featureFallback = fallback.features.items[index] ?? fallback.features.items[0];
        const icon = asString(feature.icon, featureFallback.icon) as HomeFeatureIconKey;
        return {
          icon: ['home', 'fileText', 'briefcase', 'navigation', 'utensils', 'users'].includes(icon)
            ? icon
            : featureFallback.icon,
          title: asString(feature.title, featureFallback.title),
          desc: asString(feature.desc, featureFallback.desc),
          badge: asNullableString(feature.badge, featureFallback.badge),
          href: asString(feature.href, featureFallback.href),
        };
      }).filter((item) => item.title.trim().length > 0).slice(0, 12),
    },
    ecosystem: {
      label: asString(ecosystem.label, fallback.ecosystem.label),
      sublabel: asString(ecosystem.sublabel, fallback.ecosystem.sublabel),
      partners: asArray(ecosystem.partners).map((item, index) => {
        const partner = asObject(item);
        const partnerFallback = fallback.ecosystem.partners[index] ?? fallback.ecosystem.partners[0];
        return {
          name: asString(partner.name, partnerFallback.name),
          type: asString(partner.type, partnerFallback.type),
        };
      }).filter((item) => item.name.trim().length > 0).slice(0, 12),
    },
    visa: {
      badge: asString(visa.badge, fallback.visa.badge),
      titleLead: asString(visa.titleLead, fallback.visa.titleLead),
      titleAccent: asString(visa.titleAccent, fallback.visa.titleAccent),
      description: asString(visa.description, fallback.visa.description),
      shortStayTitle: asString(visa.shortStayTitle, fallback.visa.shortStayTitle),
      shortStayBadge: asString(visa.shortStayBadge, fallback.visa.shortStayBadge),
      shortStayDescription: asString(visa.shortStayDescription, fallback.visa.shortStayDescription),
      longStayTitle: asString(visa.longStayTitle, fallback.visa.longStayTitle),
      longStayBadge: asString(visa.longStayBadge, fallback.visa.longStayBadge),
      longStayDescription: asString(visa.longStayDescription, fallback.visa.longStayDescription),
    },
    gettingStarted: {
      badge: asString(gettingStarted.badge, fallback.gettingStarted.badge),
      titleLead: asString(gettingStarted.titleLead, fallback.gettingStarted.titleLead),
      titleAccent: asString(gettingStarted.titleAccent, fallback.gettingStarted.titleAccent),
      stepOneTitle: asString(gettingStarted.stepOneTitle, fallback.gettingStarted.stepOneTitle),
      stepOneDescription: asString(gettingStarted.stepOneDescription, fallback.gettingStarted.stepOneDescription),
      stepTwoTitle: asString(gettingStarted.stepTwoTitle, fallback.gettingStarted.stepTwoTitle),
      stepTwoDescription: asString(gettingStarted.stepTwoDescription, fallback.gettingStarted.stepTwoDescription),
    },
    testimonials: {
      badge: asString(testimonials.badge, fallback.testimonials.badge),
      titleLead: asString(testimonials.titleLead, fallback.testimonials.titleLead),
      titleAccent: asString(testimonials.titleAccent, fallback.testimonials.titleAccent),
      items: asArray(testimonials.items).map((item, index) => {
        const testimonial = asObject(item);
        const testimonialFallback = fallback.testimonials.items[index] ?? fallback.testimonials.items[0];
        return {
          name: asString(testimonial.name, testimonialFallback.name),
          university: asString(testimonial.university, testimonialFallback.university),
          content: asString(testimonial.content, testimonialFallback.content),
          avatar: asString(testimonial.avatar, testimonialFallback.avatar),
          flag: typeof testimonial.flag === 'string' ? testimonial.flag : testimonialFallback.flag,
        };
      }).filter((item) => item.name.trim().length > 0).slice(0, 12),
    },
    finalCta: {
      titleLead: asString(finalCta.titleLead, fallback.finalCta.titleLead),
      titleAccent: asString(finalCta.titleAccent, fallback.finalCta.titleAccent),
      description: asString(finalCta.description, fallback.finalCta.description),
      primaryCta: asString(finalCta.primaryCta, fallback.finalCta.primaryCta),
      secondaryCta: asString(finalCta.secondaryCta, fallback.finalCta.secondaryCta),
    },
    footer: {
      description: asString(footer.description, fallback.footer.description),
      platformHeading: asString(footer.platformHeading, fallback.footer.platformHeading),
      companyHeading: asString(footer.companyHeading, fallback.footer.companyHeading),
      copyright: asString(footer.copyright, fallback.footer.copyright),
      tagline: asString(footer.tagline, fallback.footer.tagline),
    },
  };
}
