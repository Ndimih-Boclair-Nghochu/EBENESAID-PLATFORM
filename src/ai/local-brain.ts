import 'server-only';

import { getPlatformIntelligenceSnapshot, type PlatformIntelligenceSnapshot } from '@/lib/db';

export type AiUserContext = {
  firstName?: string;
  lastName?: string;
  email?: string;
  university?: string;
  countryOfOrigin?: string;
  userType?: string;
};

export type SpecialistKey =
  | 'navigator'
  | 'housing'
  | 'career'
  | 'documents'
  | 'community'
  | 'transit'
  | 'kitchen'
  | 'settings'
  | 'ops';

type SpecialistConfig = {
  label: string;
  focus: string[];
  fallbackRoute: { title: string; path: string };
  referralKeywords: Record<string, { title: string; path: string; label: string }>;
};

const specialistConfigs: Record<SpecialistKey, SpecialistConfig> = {
  navigator: {
    label: 'Platform Navigator',
    focus: ['platform', 'dashboard', 'modules', 'where', 'how', 'find'],
    fallbackRoute: { title: 'Student Dashboard', path: '/dashboard' },
    referralKeywords: {},
  },
  housing: {
    label: 'Housing Specialist',
    focus: ['housing', 'room', 'apartment', 'listing', 'rent', 'landlord', 'neighborhood', 'accommodation'],
    fallbackRoute: { title: 'Verified Housing', path: '/accommodation' },
    referralKeywords: {
      jobs: { title: 'Career Specialist', path: '/jobs', label: 'Jobs tab' },
      work: { title: 'Career Specialist', path: '/jobs', label: 'Jobs tab' },
      visa: { title: 'Compliance Specialist', path: '/docs', label: 'Documents tab' },
      permit: { title: 'Compliance Specialist', path: '/docs', label: 'Documents tab' },
      food: { title: 'Kitchen Specialist', path: '/food', label: 'Food tab' },
    },
  },
  career: {
    label: 'Career Specialist',
    focus: ['job', 'career', 'internship', 'cv', 'resume', 'employer', 'salary', 'work permit'],
    fallbackRoute: { title: 'Employment Bridge', path: '/jobs' },
    referralKeywords: {
      housing: { title: 'Housing Specialist', path: '/accommodation', label: 'Housing tab' },
      rent: { title: 'Housing Specialist', path: '/accommodation', label: 'Housing tab' },
      visa: { title: 'Compliance Specialist', path: '/docs', label: 'Documents tab' },
    },
  },
  documents: {
    label: 'Compliance Specialist',
    focus: ['document', 'passport', 'visa', 'permit', 'wallet', 'privacy', 'gdpr', 'letter'],
    fallbackRoute: { title: 'Secure Wallet', path: '/docs' },
    referralKeywords: {
      housing: { title: 'Housing Specialist', path: '/accommodation', label: 'Housing tab' },
      job: { title: 'Career Specialist', path: '/jobs', label: 'Jobs tab' },
      community: { title: 'Social Specialist', path: '/community', label: 'Community tab' },
    },
  },
  community: {
    label: 'Social Specialist',
    focus: ['community', 'circle', 'friend', 'network', 'event', 'social', 'buddy'],
    fallbackRoute: { title: 'Student Circle', path: '/community' },
    referralKeywords: {
      job: { title: 'Career Specialist', path: '/jobs', label: 'Jobs tab' },
      housing: { title: 'Housing Specialist', path: '/accommodation', label: 'Housing tab' },
      rent: { title: 'Housing Specialist', path: '/accommodation', label: 'Housing tab' },
    },
  },
  transit: {
    label: 'Transit Specialist',
    focus: ['airport', 'arrival', 'pickup', 'bus', 'taxi', 'transport', 'route', 'tram'],
    fallbackRoute: { title: 'Arrival & Transit', path: '/arrival' },
    referralKeywords: {
      housing: { title: 'Housing Specialist', path: '/accommodation', label: 'Housing tab' },
      documents: { title: 'Compliance Specialist', path: '/docs', label: 'Documents tab' },
      visa: { title: 'Compliance Specialist', path: '/docs', label: 'Documents tab' },
    },
  },
  kitchen: {
    label: 'Kitchen Specialist',
    focus: ['food', 'meal', 'kitchen', 'menu', 'delivery', 'pickup', 'diet', 'catering'],
    fallbackRoute: { title: 'Food & Dining', path: '/food' },
    referralKeywords: {
      address: { title: 'Settings Specialist', path: '/settings', label: 'Settings tab' },
      housing: { title: 'Housing Specialist', path: '/accommodation', label: 'Housing tab' },
      job: { title: 'Career Specialist', path: '/jobs', label: 'Jobs tab' },
    },
  },
  settings: {
    label: 'Settings Specialist',
    focus: ['settings', 'profile', 'account', 'security', 'privacy', 'email', 'phone', 'password'],
    fallbackRoute: { title: 'Settings', path: '/settings' },
    referralKeywords: {
      housing: { title: 'Housing Specialist', path: '/accommodation', label: 'Housing tab' },
      job: { title: 'Career Specialist', path: '/jobs', label: 'Jobs tab' },
      visa: { title: 'Compliance Specialist', path: '/docs', label: 'Documents tab' },
    },
  },
  ops: {
    label: 'Operations Specialist',
    focus: ['admin', 'verification', 'analytics', 'users', 'partners', 'students', 'reports', 'operations'],
    fallbackRoute: { title: 'Admin Dashboard', path: '/admin/dashboard' },
    referralKeywords: {},
  },
};

function getFirstName(user?: AiUserContext) {
  return user?.firstName?.trim() || 'there';
}

function getUserDescriptor(user?: AiUserContext) {
  const pieces = [user?.university, user?.countryOfOrigin].filter(Boolean);
  return pieces.length ? pieces.join(' | ') : 'your current platform profile';
}

function detectReferral(specialist: SpecialistKey, message: string) {
  const lower = message.toLowerCase();
  for (const [keyword, target] of Object.entries(specialistConfigs[specialist].referralKeywords)) {
    if (lower.includes(keyword)) {
      return target;
    }
  }
  return null;
}

function getSignalSummary(snapshot: PlatformIntelligenceSnapshot) {
  return `${snapshot.students} students, ${snapshot.verifiedListings} verified houses, ${snapshot.openJobs} active jobs, and ${snapshot.communityCircles} community circles`;
}

function buildSpecialistAnswer(
  specialist: SpecialistKey,
  message: string,
  user: AiUserContext | undefined,
  snapshot: PlatformIntelligenceSnapshot
) {
  const firstName = getFirstName(user);
  const descriptor = getUserDescriptor(user);
  const lower = message.toLowerCase();
  const referral = specialist === 'navigator' ? null : detectReferral(specialist, message);

  if (referral) {
    return {
      response: `${firstName}, that question is better handled in the ${referral.title.toLowerCase()} flow. Please open the ${referral.label} so the right specialist can guide you with the correct tools and records.`,
      links: [{ title: referral.title, path: referral.path }],
    };
  }

  const platformSignal = getSignalSummary(snapshot);

  switch (specialist) {
    case 'navigator':
      return {
        response: `${firstName}, based on ${descriptor}, the best next step depends on what you need to solve first. Right now the platform is managing ${platformSignal}, so you can move directly into housing, jobs, documents, arrival support, food, or community depending on your immediate priority.`,
        links: getNavigatorLinks(lower),
      };
    case 'housing':
      return {
        response: `${firstName}, I’ll keep the housing guidance aligned with ${descriptor}. We currently have ${snapshot.verifiedListings} verified housing records, so focus first on budget fit, commute to ${user?.university || 'your institution'}, and verified status before you contact a housing partner.`,
      };
    case 'career':
      return {
        response: `${firstName}, I’ll keep the job guidance tied to your current profile and student context in Latvia. The platform currently has ${snapshot.openJobs} active job records, so the strongest next move is to target roles that match your availability, update your profile details, and apply only where the job type and location fit your study routine.`,
      };
    case 'documents':
      return {
        response: `${firstName}, I’ll stay focused on documents, privacy, and administrative readiness using the details already in your account. For your next step, make sure your passport, admission record, visa or permit items, and any housing proof are uploaded clearly and named in a way your support team can review quickly.`,
      };
    case 'community':
      return {
        response: `${firstName}, the platform currently supports ${snapshot.communityCircles} active community circles. The best move is to join groups connected to your course, region, or relocation stage, then introduce yourself with a clear message about the support or connection you are looking for.`,
      };
    case 'transit':
      return {
        response: `${firstName}, I’ll stay focused on arrival, pickup planning, and first-day movement around Riga. The safest plan is to confirm your destination, save pickup notes early, and keep your arrival timing accurate so transport support can coordinate the handoff without confusion.`,
      };
    case 'kitchen':
      return {
        response: `${firstName}, I’ll use your current platform profile to keep food and delivery guidance practical. The platform currently has ${snapshot.foodItems} food records available, so the smartest choice is to compare delivery against pickup, keep your saved address current, and choose meal options that match both your schedule and your weekly budget.`,
      };
    case 'settings':
      return {
        response: `${firstName}, I can guide you based on the account information already attached to your profile. To keep the whole system working properly for you, review your email, phone, university, country of origin, and billing details carefully because those fields affect support, jobs, delivery, and relocation guidance across the platform.`,
      };
    case 'ops':
      return {
        response: `${firstName}, here is the live platform picture from current system records: ${platformSignal}. For admin decisions, use these numbers to prioritize verification queues, partner supply gaps, and user response speed before making policy or pricing changes.`,
      };
  }
}

function getNavigatorLinks(message: string) {
  const lower = message.toLowerCase();
  const links: Array<{ title: string; path: string }> = [];
  const map = [
    { keywords: ['dashboard', 'home'], title: 'Student Dashboard', path: '/dashboard' },
    { keywords: ['housing', 'house', 'accommodation', 'rent'], title: 'Verified Housing', path: '/accommodation' },
    { keywords: ['document', 'wallet', 'visa', 'passport'], title: 'Secure Wallet', path: '/docs' },
    { keywords: ['job', 'career', 'internship', 'work'], title: 'Employment Bridge', path: '/jobs' },
    { keywords: ['community', 'social', 'circle', 'friends'], title: 'Student Circle', path: '/community' },
    { keywords: ['arrival', 'pickup', 'transport'], title: 'Arrival & Transit', path: '/arrival' },
    { keywords: ['food', 'meal', 'kitchen'], title: 'Food & Dining', path: '/food' },
  ];

  for (const entry of map) {
    if (entry.keywords.some(keyword => lower.includes(keyword))) {
      links.push({ title: entry.title, path: entry.path });
    }
  }

  return links.length ? links : [{ title: 'Student Dashboard', path: '/dashboard' }];
}

export async function runLocalSpecialist(input: {
  specialist: SpecialistKey;
  message: string;
  user?: AiUserContext;
}) {
  const snapshot = await getPlatformIntelligenceSnapshot();
  return buildSpecialistAnswer(input.specialist, input.message, input.user, snapshot);
}

export async function buildLocalAccommodationSummary(input: {
  accommodationListing: string;
  userPreferences: {
    universityProximity?: string;
    preferredNationalities?: string[];
    budget?: string;
  };
}) {
  const listing = input.accommodationListing.toLowerCase();
  const budget = input.userPreferences.budget || '';
  const proximity = input.userPreferences.universityProximity || 'your university';

  const pros: string[] = [];
  const cons: string[] = [];
  let matchScore = 6.8;

  if (listing.includes('verified') || listing.includes('inspection')) {
    pros.push('verified status');
    matchScore += 1;
  }
  if (listing.includes('riga') || listing.includes('centre') || listing.includes('center')) {
    pros.push('strong city access');
    matchScore += 0.6;
  }
  if (listing.includes('shared')) {
    pros.push('lower likely monthly cost');
    matchScore += 0.4;
  }
  if (listing.includes('deposit')) {
    cons.push('watch the deposit terms');
    matchScore -= 0.3;
  }
  if (budget && /250|300|350|400|500/.test(budget) && listing.includes('premium')) {
    cons.push('may stretch your target budget');
    matchScore -= 0.8;
  }

  const normalizedScore = Math.max(4.8, Math.min(9.6, Number(matchScore.toFixed(1))));
  return {
    summary: `EBENESAID AI review: this listing looks best for a student who wants reliable accommodation close to ${proximity}. It appears strongest when safety, commute control, and verified records matter more than chasing the absolute lowest price.`,
    pros: pros.length ? pros : ['verified workflow', 'student-friendly setup'],
    cons: cons.length ? cons : ['confirm move-in timing'],
    matchScore: normalizedScore,
  };
}

export function buildLocalAdminTaskExplanation(input: {
  taskDescription: string;
  studentNationality: string;
  studentUniversity: string;
  studentCurrentLocation: string;
  additionalContext?: string;
}) {
  return {
    explanation: `EBENESAID AI recommends handling "${input.taskDescription}" in a simple order: first confirm the official requirement with ${input.studentUniversity}, then collect the core documents connected to ${input.studentNationality}, and finally complete the submission or in-person step from ${input.studentCurrentLocation}. ${input.additionalContext ? `Keep this extra context in mind: ${input.additionalContext}.` : ''}`.trim(),
    estimatedTime: '1-3 business days depending on document readiness',
    requiredDocuments: ['Passport or ID record', 'University letter or confirmation', 'Supporting proof tied to the request'],
    importantTips: ['Use the document wallet to keep files organized', 'Check names and dates before submitting', 'Escalate to support early if a deadline is close'],
  };
}

export function buildLocalRelocationGuidance(input: {
  university: string;
  nationality: string;
  arrivalStatus: string;
}) {
  return {
    checklist: [
      { task: `Confirm your study status with ${input.university || 'your university'}`, isCompleted: false },
      { task: 'Upload passport, admission, and insurance documents', isCompleted: false },
      { task: 'Review verified housing options and shortlist the best fit', isCompleted: false },
      { task: 'Plan airport pickup and first-day transit details', isCompleted: false },
      { task: 'Check work, registration, and local support options', isCompleted: false },
    ],
    guidance: `EBENESAID AI guidance for ${input.nationality || 'your profile'}: because you are currently ${input.arrivalStatus || 'preparing your move'}, focus on sequence rather than speed. Secure your documents first, then housing, then arrival logistics, and use each specialist tab for deeper support where needed.`,
  };
}
