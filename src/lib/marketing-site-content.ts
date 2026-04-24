import type { SupportedLocale } from '@/lib/i18n';

export type MarketingPageKey = 'about' | 'how-it-works' | 'contact';

type HeroContent = {
  badge: string;
  title: string;
  highlight: string;
  description: string;
};

type FooterContent = {
  description: string;
  platformHeading: string;
  companyHeading: string;
  copyright: string;
};

export type AboutPageContent = {
  hero: HeroContent;
  mission: {
    title: string;
    description: string;
  };
  vision: {
    title: string;
    description: string;
  };
  pillars: {
    badge: string;
    title: string;
    items: Array<{
      title: string;
      role: string;
      description: string;
      image: string;
    }>;
  };
  values: {
    badge: string;
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  cta: {
    title: string;
    highlight: string;
    primaryCta: string;
    secondaryCta: string;
  };
  footer: FooterContent;
};

export type HowItWorksPageContent = {
  hero: HeroContent;
  steps: Array<{
    number: string;
    title: string;
    description: string;
    points: string[];
    image: string;
  }>;
  cta: {
    title: string;
    highlight: string;
    primaryCta: string;
    secondaryCta: string;
  };
  footer: FooterContent;
};

export type ContactPageContent = {
  hero: HeroContent;
  supportItems: Array<{
    title: string;
    description: string;
  }>;
  responseTime: string;
  form: {
    title: string;
    description: string;
    firstNameLabel: string;
    lastNameLabel: string;
    emailLabel: string;
    topicLabel: string;
    messageLabel: string;
    submitLabel: string;
  };
  footer: FooterContent;
};

export type MarketingPageContentMap = {
  about: AboutPageContent;
  'how-it-works': HowItWorksPageContent;
  contact: ContactPageContent;
};

export type MarketingPageContent = MarketingPageContentMap[MarketingPageKey];

const englishContent: MarketingPageContentMap = {
  about: {
    hero: {
      badge: 'The EBENESAID Story',
      title: 'Building the',
      highlight: 'Global OS for Students.',
      description:
        'EBENESAID was founded in Riga, Latvia, by international students who experienced the chaos of relocation. We built the infrastructure we wished we had.',
    },
    mission: {
      title: 'Our Mission',
      description:
        'To orchestrate the international student journey through technology, providing a secure, centralized operating system that replaces uncertainty with structure and trust.',
    },
    vision: {
      title: 'Our Vision',
      description:
        'A world where borders are not barriers to potential. We envision a seamless global education landscape where every student can thrive regardless of their origin.',
    },
    pillars: {
      badge: 'Operating Model',
      title: 'How the Platform Operates',
      items: [
        {
          title: 'Platform Strategy',
          role: 'Leadership Pillar',
          description:
            'Defines the operating model for student onboarding, relocation guidance, and long-term platform direction.',
          image: 'https://picsum.photos/seed/platform-strategy/400/400',
        },
        {
          title: 'Technology & Security',
          role: 'Leadership Pillar',
          description:
            'Owns secure account infrastructure, data protection, and the backend systems that connect platform modules.',
          image: 'https://picsum.photos/seed/platform-technology/400/400',
        },
        {
          title: 'Operations & Partnerships',
          role: 'Leadership Pillar',
          description:
            'Coordinates housing workflows, student support operations, and institutional collaboration across the platform.',
          image: 'https://picsum.photos/seed/platform-operations/400/400',
        },
      ],
    },
    values: {
      badge: 'Guiding Principles',
      title: 'Our Core Values',
      items: [
        {
          title: 'Trust First',
          description: 'We physically verify every housing unit to ensure student safety is never compromised.',
        },
        {
          title: 'Empathy Driven',
          description: 'Built by students, for students. Every feature is shaped by lived relocation experience.',
        },
        {
          title: 'Radical Inclusivity',
          description: 'Our platform adapts to culture, context, and language so users feel supported from day one.',
        },
      ],
    },
    cta: {
      title: 'Ready to join the',
      highlight: 'ecosystem?',
      primaryCta: 'Get Started Now',
      secondaryCta: 'Contact Sales',
    },
    footer: {
      description:
        'The global operating system for international student mobility. Founded in Riga, serving ambitious students worldwide.',
      platformHeading: 'Platform',
      companyHeading: 'Support',
      copyright: '© 2026 EBENESAID. All rights reserved.',
    },
  },
  'how-it-works': {
    hero: {
      badge: 'The Architecture of Mobility',
      title: 'Your Journey,',
      highlight: 'Systematized.',
      description:
        "We've broken down the complex international student relocation process into clear, verified modules.",
    },
    steps: [
      {
        number: '01',
        title: 'Profile & Admission Verification',
        description:
          'Start by connecting your university credentials. The platform syncs your admission status and generates a personalized relocation roadmap.',
        points: ['University credential sync', 'Automated roadmap generation', 'Language proficiency check'],
        image: 'https://picsum.photos/seed/admission-verification/1200/800',
      },
      {
        number: '02',
        title: 'Secure Document Management',
        description:
          'Upload your visa, residence permit, and identity documents to the secure vault and receive proactive alerts for deadlines.',
        points: ['EU data protection ready', 'Intelligent document review', 'Expiry reminder timeline'],
        image: 'https://picsum.photos/seed/document-vault/1200/800',
      },
      {
        number: '03',
        title: 'Verified Housing Search',
        description:
          'Access a curated marketplace of physically inspected housing. Every unit is reviewed before it becomes visible on the platform.',
        points: ['Physically vetted units', 'Verified rental contracts', 'Secure booking workflow'],
        image: 'https://picsum.photos/seed/housing-search/1200/800',
      },
      {
        number: '04',
        title: 'Arrival & Settlement Support',
        description:
          "From airport pickup to your first local setup steps, the platform supports the final mile of your relocation.",
        points: ['Vetted airport transfers', 'Local administrative setup', 'Buddy circle connection'],
        image: 'https://picsum.photos/seed/airport-transfer/1200/800',
      },
    ],
    cta: {
      title: 'Ready to experience the',
      highlight: 'next generation of student mobility?',
      primaryCta: 'Join the Platform',
      secondaryCta: 'Learn our Story',
    },
    footer: {
      description:
        'The global operating system for international student mobility. Founded in Riga, serving ambitious students worldwide.',
      platformHeading: 'Platform',
      companyHeading: 'Support',
      copyright: '© 2026 EBENESAID. All rights reserved.',
    },
  },
  contact: {
    hero: {
      badge: 'Contact Specialists',
      title: "We're Here to",
      highlight: 'Help.',
      description:
        "Whether you're a student starting your journey or a partner looking to collaborate, our team is ready to assist.",
    },
    supportItems: [
      { title: 'Email Support', description: 'support@ebenesaid.com' },
      { title: 'AI Concierge', description: 'Available 24/7 on your dashboard' },
      { title: 'Main Office', description: 'K. Valdemara iela 21, Riga, LV-1010' },
    ],
    responseTime: 'Response time: Under 2 hours',
    form: {
      title: 'Send a Message',
      description: 'Our specialists will review your request immediately.',
      firstNameLabel: 'First Name',
      lastNameLabel: 'Last Name',
      emailLabel: 'Email Address',
      topicLabel: 'Topic',
      messageLabel: 'Message',
      submitLabel: 'Submit Inquiry',
    },
    footer: {
      description:
        'The global operating system for international student mobility. Founded in Riga, serving ambitious students worldwide.',
      platformHeading: 'Platform',
      companyHeading: 'Support',
      copyright: '© 2026 EBENESAID. All rights reserved.',
    },
  },
};

const latvianContent: MarketingPageContentMap = {
  about: {
    hero: {
      badge: 'EBENESAID stasts',
      title: 'Veidojam',
      highlight: 'globlo studentu platformu.',
      description:
        'EBENESAID tika dibinata Riga, Latvija, starptautisko studentu vajadzibam. Mes veidojam drosu un vienotu parvaksanas infrastrukturu.',
    },
    mission: {
      title: 'Musu misija',
      description:
        'Parverst starptautisko studentu parvaksanos sakartota, drosa un uzticama procesa, izmantojot vienotu tehnisko platformu.',
    },
    vision: {
      title: 'Musu vizija',
      description:
        'Pasaule, kura valstu robežas neaptur studentu iespejas, un kur katram ir pieejams kvalitatvs atbalsts studiju dzives sakumam.',
    },
    pillars: {
      badge: 'Darbibas modelis',
      title: 'Ka platforma darbojas',
      items: [
        {
          title: 'Platformas strategija',
          role: 'Vadibas pamats',
          description: 'Nosaka studentu ievadsanas, parvaksanas atbalsta un platformas attistibas modeli.',
          image: 'https://picsum.photos/seed/platform-strategy/400/400',
        },
        {
          title: 'Tehnologijas un drosiba',
          role: 'Vadibas pamats',
          description: 'Parvalda kontu drosibu, datu aizsardzibu un backend sistemas, kas savieno platformas moduļus.',
          image: 'https://picsum.photos/seed/platform-technology/400/400',
        },
        {
          title: 'Operacijas un partneribas',
          role: 'Vadibas pamats',
          description: 'Koordine majoklu procesus, studentu atbalstu un sadarbibu ar institcijam un partneriem.',
          image: 'https://picsum.photos/seed/platform-operations/400/400',
        },
      ],
    },
    values: {
      badge: 'Pamatvertibas',
      title: 'Musu vertibas',
      items: [
        { title: 'Uzticiba', description: 'Katrs svarigs pakalpojums tiek parbaudits, lai studenti justos drosi.' },
        { title: 'Empatija', description: 'Platforma ir veidota no realas pieredzes un pielagota studentu vajadzibam.' },
        { title: 'Ieklausisana', description: 'Mes pielagojamies kulturai, valodai un situacijai, nevis otradi.' },
      ],
    },
    cta: {
      title: 'Vai esat gatavs pievienoties',
      highlight: 'ekosistemai?',
      primaryCta: 'Sakt tagad',
      secondaryCta: 'Sazinaties ar mums',
    },
    footer: {
      description: 'Starptautisko studentu mobilitates platforma, kas apvieno butiskos pakalpojumus vienuviet.',
      platformHeading: 'Platforma',
      companyHeading: 'Atbalsts',
      copyright: '© 2026 EBENESAID. Visas tiesibas aizsargatas.',
    },
  },
  'how-it-works': {
    hero: {
      badge: 'Mobilitates arhitektura',
      title: 'Jusu ceļs,',
      highlight: 'sakartots.',
      description: 'Mes sadalijam sarezgito starptautiska studenta parvaksanas procesu skaidros un parbauditos soļos.',
    },
    steps: [
      {
        number: '01',
        title: 'Profila un uznemsanas parbaude',
        description: 'Sakiet ar universitates datu sasaisti, lai platforma var izveidot individualu parvaksanas planu.',
        points: ['Universitates datu sinhronizacija', 'Automatisks ceļa plans', 'Valodas prasmes parskats'],
        image: 'https://picsum.photos/seed/admission-verification/1200/800',
      },
      {
        number: '02',
        title: 'Droša dokumentu parvaldiba',
        description: 'Augšupieladejiet svarigos dokumentus drosaja seifa un saņemiet atgadinajumus par termiņiem.',
        points: ['Atbilstiba datu aizsardzibai', 'Gudra dokumentu parbaude', 'Terminu atgadinajumi'],
        image: 'https://picsum.photos/seed/document-vault/1200/800',
      },
      {
        number: '03',
        title: 'Parbaudits majoklu tirgus',
        description: 'Piekļūstiet parbauditiem majokļiem, kuri tiek apskatiti pirms publicešanas platforma.',
        points: ['Parbauditas vienibas', 'Parbauditi ligumi', 'Drošs rezervacijas process'],
        image: 'https://picsum.photos/seed/housing-search/1200/800',
      },
      {
        number: '04',
        title: 'Ierašanas un iekartošanas atbalsts',
        description: 'No transfēra līdz pirmajiem vietējiem soļiem platforma atbalsta jusu ierašanos un iekartošanos.',
        points: ['Parbauditi transfēri', 'Vietejie procesi', 'Kopienas savienojums'],
        image: 'https://picsum.photos/seed/airport-transfer/1200/800',
      },
    ],
    cta: {
      title: 'Vai esat gatavs izjust',
      highlight: 'nakamas paaudzes studentu mobilitati?',
      primaryCta: 'Pievienoties platformai',
      secondaryCta: 'Uzzinat musu stastu',
    },
    footer: {
      description: 'Starptautisko studentu mobilitates platforma, kas apvieno butiskos pakalpojumus vienuviet.',
      platformHeading: 'Platforma',
      companyHeading: 'Atbalsts',
      copyright: '© 2026 EBENESAID. Visas tiesibas aizsargatas.',
    },
  },
  contact: {
    hero: {
      badge: 'Sazinieties ar specialistiem',
      title: 'Mes esam šeit, lai',
      highlight: 'palidzetu.',
      description: 'Gan studentiem, gan partneriem ir pieejams atsaucigs atbalsts un skaidra komunikacija.',
    },
    supportItems: [
      { title: 'E-pasta atbalsts', description: 'support@ebenesaid.com' },
      { title: 'AI asistents', description: 'Pieejams 24/7 jusu konta paneli' },
      { title: 'Galvenais birojs', description: 'K. Valdemara iela 21, Riga, LV-1010' },
    ],
    responseTime: 'Atbildes laiks: lidz 2 stundam',
    form: {
      title: 'Nosutiet zinu',
      description: 'Musu specialisti izskatis jusu pieprasijumu pec iespejas atrak.',
      firstNameLabel: 'Vards',
      lastNameLabel: 'Uzvards',
      emailLabel: 'E-pasta adrese',
      topicLabel: 'Temats',
      messageLabel: 'Zina',
      submitLabel: 'Nosutit pieprasijumu',
    },
    footer: {
      description: 'Starptautisko studentu mobilitates platforma, kas apvieno butiskos pakalpojumus vienuviet.',
      platformHeading: 'Platforma',
      companyHeading: 'Atbalsts',
      copyright: '© 2026 EBENESAID. Visas tiesibas aizsargatas.',
    },
  },
};

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function asArray<T>(value: unknown, mapper: (item: unknown, index: number) => T, fallback: T[]): T[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value.map(mapper).filter(Boolean) as T[];
  return items.length > 0 ? items : fallback;
}

export function getDefaultMarketingPageContent<TPage extends MarketingPageKey>(
  page: TPage,
  locale: SupportedLocale
): MarketingPageContentMap[TPage] {
  const source = locale === 'lv' ? latvianContent : englishContent;
  return structuredClone(source[page]);
}

export function normalizeMarketingPageContent<TPage extends MarketingPageKey>(
  page: TPage,
  value: unknown,
  locale: SupportedLocale
): MarketingPageContentMap[TPage] {
  const fallback = getDefaultMarketingPageContent(page, locale);
  const source = asObject(value);

  if (page === 'about') {
    const content = fallback as AboutPageContent;
    const hero = asObject(source.hero);
    const mission = asObject(source.mission);
    const vision = asObject(source.vision);
    const pillars = asObject(source.pillars);
    const values = asObject(source.values);
    const cta = asObject(source.cta);
    const footer = asObject(source.footer);

    return {
      hero: {
        badge: asString(hero.badge, content.hero.badge),
        title: asString(hero.title, content.hero.title),
        highlight: asString(hero.highlight, content.hero.highlight),
        description: asString(hero.description, content.hero.description),
      },
      mission: {
        title: asString(mission.title, content.mission.title),
        description: asString(mission.description, content.mission.description),
      },
      vision: {
        title: asString(vision.title, content.vision.title),
        description: asString(vision.description, content.vision.description),
      },
      pillars: {
        badge: asString(pillars.badge, content.pillars.badge),
        title: asString(pillars.title, content.pillars.title),
        items: asArray(
          pillars.items,
          (item, index) => {
            const entry = asObject(item);
            const fallbackItem = content.pillars.items[index] ?? content.pillars.items[0];
            return {
              title: asString(entry.title, fallbackItem.title),
              role: asString(entry.role, fallbackItem.role),
              description: asString(entry.description, fallbackItem.description),
              image: asString(entry.image, fallbackItem.image),
            };
          },
          content.pillars.items
        ),
      },
      values: {
        badge: asString(values.badge, content.values.badge),
        title: asString(values.title, content.values.title),
        items: asArray(
          values.items,
          (item, index) => {
            const entry = asObject(item);
            const fallbackItem = content.values.items[index] ?? content.values.items[0];
            return {
              title: asString(entry.title, fallbackItem.title),
              description: asString(entry.description, fallbackItem.description),
            };
          },
          content.values.items
        ),
      },
      cta: {
        title: asString(cta.title, content.cta.title),
        highlight: asString(cta.highlight, content.cta.highlight),
        primaryCta: asString(cta.primaryCta, content.cta.primaryCta),
        secondaryCta: asString(cta.secondaryCta, content.cta.secondaryCta),
      },
      footer: {
        description: asString(footer.description, content.footer.description),
        platformHeading: asString(footer.platformHeading, content.footer.platformHeading),
        companyHeading: asString(footer.companyHeading, content.footer.companyHeading),
        copyright: asString(footer.copyright, content.footer.copyright),
      },
    } as MarketingPageContentMap[TPage];
  }

  if (page === 'how-it-works') {
    const content = fallback as HowItWorksPageContent;
    const hero = asObject(source.hero);
    const cta = asObject(source.cta);
    const footer = asObject(source.footer);
    return {
      hero: {
        badge: asString(hero.badge, content.hero.badge),
        title: asString(hero.title, content.hero.title),
        highlight: asString(hero.highlight, content.hero.highlight),
        description: asString(hero.description, content.hero.description),
      },
      steps: asArray(
        source.steps,
        (item, index) => {
          const entry = asObject(item);
          const fallbackItem = content.steps[index] ?? content.steps[0];
          const points = asArray(
            entry.points,
            (point, pointIndex) => asString(point, fallbackItem.points[pointIndex] ?? fallbackItem.points[0]),
            fallbackItem.points
          );
          return {
            number: asString(entry.number, fallbackItem.number),
            title: asString(entry.title, fallbackItem.title),
            description: asString(entry.description, fallbackItem.description),
            points,
            image: asString(entry.image, fallbackItem.image),
          };
        },
        content.steps
      ),
      cta: {
        title: asString(cta.title, content.cta.title),
        highlight: asString(cta.highlight, content.cta.highlight),
        primaryCta: asString(cta.primaryCta, content.cta.primaryCta),
        secondaryCta: asString(cta.secondaryCta, content.cta.secondaryCta),
      },
      footer: {
        description: asString(footer.description, content.footer.description),
        platformHeading: asString(footer.platformHeading, content.footer.platformHeading),
        companyHeading: asString(footer.companyHeading, content.footer.companyHeading),
        copyright: asString(footer.copyright, content.footer.copyright),
      },
    } as MarketingPageContentMap[TPage];
  }

  const content = fallback as ContactPageContent;
  const hero = asObject(source.hero);
  const form = asObject(source.form);
  const footer = asObject(source.footer);
  return {
    hero: {
      badge: asString(hero.badge, content.hero.badge),
      title: asString(hero.title, content.hero.title),
      highlight: asString(hero.highlight, content.hero.highlight),
      description: asString(hero.description, content.hero.description),
    },
    supportItems: asArray(
      source.supportItems,
      (item, index) => {
        const entry = asObject(item);
        const fallbackItem = content.supportItems[index] ?? content.supportItems[0];
        return {
          title: asString(entry.title, fallbackItem.title),
          description: asString(entry.description, fallbackItem.description),
        };
      },
      content.supportItems
    ),
    responseTime: asString(source.responseTime, content.responseTime),
    form: {
      title: asString(form.title, content.form.title),
      description: asString(form.description, content.form.description),
      firstNameLabel: asString(form.firstNameLabel, content.form.firstNameLabel),
      lastNameLabel: asString(form.lastNameLabel, content.form.lastNameLabel),
      emailLabel: asString(form.emailLabel, content.form.emailLabel),
      topicLabel: asString(form.topicLabel, content.form.topicLabel),
      messageLabel: asString(form.messageLabel, content.form.messageLabel),
      submitLabel: asString(form.submitLabel, content.form.submitLabel),
    },
    footer: {
      description: asString(footer.description, content.footer.description),
      platformHeading: asString(footer.platformHeading, content.footer.platformHeading),
      companyHeading: asString(footer.companyHeading, content.footer.companyHeading),
      copyright: asString(footer.copyright, content.footer.copyright),
    },
  } as MarketingPageContentMap[TPage];
}
