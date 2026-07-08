export interface InsurancePlan {
  id: string;
  provider: string;
  flag: string;
  country: string;
  region: 'us' | 'europe';
  category: 'health' | 'life' | 'auto' | 'home' | 'travel';
  planName: string;
  minPremium: number;   // monthly, in local currency
  maxPremium: number;
  coverageAmount: number;
  currency: string;
  currencySymbol: string;
  deductible: number;
  features: string[];
  rating: number;
  reviewCount: number;
  badge?: string;
  claimTime: string;
  network: string;
}

export const INSURANCE_PLANS: InsurancePlan[] = [
  // ── US Health ────────────────────────────────────────────────────────────────
  { id: 'uhc-health', provider: 'UnitedHealthcare', flag: '🇺🇸', country: 'United States', region: 'us', category: 'health',
    planName: 'Choice Plus PPO', minPremium: 320, maxPremium: 620, coverageAmount: 2000000, currency: 'USD', currencySymbol: '$', deductible: 1500,
    features: ['Largest US provider network', 'Telehealth included', 'Prescription coverage', 'No referrals needed'], rating: 4.4, reviewCount: 18200, badge: 'Most Popular', claimTime: '5–7 days', network: '1.3M+ providers' },
  { id: 'aetna-health', provider: 'Aetna', flag: '🇺🇸', country: 'United States', region: 'us', category: 'health',
    planName: 'Aetna Select HMO', minPremium: 280, maxPremium: 540, coverageAmount: 1500000, currency: 'USD', currencySymbol: '$', deductible: 2000,
    features: ['CVS MinuteClinic access', 'Wellness rewards', '24/7 nurse line', 'Dental add-on available'], rating: 4.2, reviewCount: 12400, badge: 'Best Value', claimTime: '5–10 days', network: '1.2M+ providers' },
  { id: 'cigna-health', provider: 'Cigna', flag: '🇺🇸', country: 'United States', region: 'us', category: 'health',
    planName: 'Cigna Open Access Plus', minPremium: 300, maxPremium: 580, coverageAmount: 2000000, currency: 'USD', currencySymbol: '$', deductible: 1750,
    features: ['Global coverage', 'Behavioral health included', 'Chronic condition support', 'Home delivery pharmacy'], rating: 4.3, reviewCount: 9800, claimTime: '4–7 days', network: '1.5M+ providers' },
  // ── US Auto ──────────────────────────────────────────────────────────────────
  { id: 'geico-auto', provider: 'GEICO', flag: '🇺🇸', country: 'United States', region: 'us', category: 'auto',
    planName: 'Auto Full Coverage', minPremium: 95, maxPremium: 230, coverageAmount: 300000, currency: 'USD', currencySymbol: '$', deductible: 500,
    features: ['15-minute quotes', 'Accident forgiveness', 'Mobile app claims', 'Multi-policy discounts'], rating: 4.5, reviewCount: 24100, badge: 'Best Rate', claimTime: '2–4 days', network: 'Nationwide' },
  { id: 'progressive-auto', provider: 'Progressive', flag: '🇺🇸', country: 'United States', region: 'us', category: 'auto',
    planName: 'Snapshot Auto', minPremium: 105, maxPremium: 250, coverageAmount: 300000, currency: 'USD', currencySymbol: '$', deductible: 500,
    features: ['Usage-based savings', 'Name Your Price tool', 'Bundling discounts', 'Gap coverage available'], rating: 4.3, reviewCount: 19700, claimTime: '2–5 days', network: 'Nationwide' },
  { id: 'statefarm-auto', provider: 'State Farm', flag: '🇺🇸', country: 'United States', region: 'us', category: 'auto',
    planName: 'Drive Safe & Save', minPremium: 100, maxPremium: 240, coverageAmount: 500000, currency: 'USD', currencySymbol: '$', deductible: 500,
    features: ['Local agents nationwide', 'Safe-driver discounts', 'Rideshare coverage', 'Roadside assistance'], rating: 4.4, reviewCount: 21300, badge: 'Most Trusted', claimTime: '3–5 days', network: 'Nationwide' },
  // ── US Life ──────────────────────────────────────────────────────────────────
  { id: 'metlife-life', provider: 'MetLife', flag: '🇺🇸', country: 'United States', region: 'us', category: 'life',
    planName: 'Term Life 20', minPremium: 30, maxPremium: 180, coverageAmount: 1000000, currency: 'USD', currencySymbol: '$', deductible: 0,
    features: ['Up to $1M coverage', 'No medical exam option', 'Convertible to permanent', 'Living benefits rider'], rating: 4.3, reviewCount: 8900, badge: 'Editor’s Choice', claimTime: '10–14 days', network: 'Direct' },
  { id: 'prudential-life', provider: 'Prudential', flag: '🇺🇸', country: 'United States', region: 'us', category: 'life',
    planName: 'Term Essential', minPremium: 28, maxPremium: 165, coverageAmount: 1000000, currency: 'USD', currencySymbol: '$', deductible: 0,
    features: ['Flexible term lengths', 'Competitive rates for non-smokers', 'Accelerated death benefit', 'Online application'], rating: 4.2, reviewCount: 7100, claimTime: '10–14 days', network: 'Direct' },
  // ── US Home ──────────────────────────────────────────────────────────────────
  { id: 'allstate-home', provider: 'Allstate', flag: '🇺🇸', country: 'United States', region: 'us', category: 'home',
    planName: 'Homeowners Protect', minPremium: 110, maxPremium: 280, coverageAmount: 500000, currency: 'USD', currencySymbol: '$', deductible: 1000,
    features: ['Claim-free rewards', 'Digital home inventory', 'Water backup coverage', 'Identity theft protection'], rating: 4.2, reviewCount: 11200, claimTime: '5–9 days', network: 'Nationwide' },
  // ── UK / Europe Health ───────────────────────────────────────────────────────
  { id: 'bupa-health', provider: 'Bupa', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'health',
    planName: 'By You Health', minPremium: 55, maxPremium: 160, coverageAmount: 1000000, currency: 'GBP', currencySymbol: '£', deductible: 100,
    features: ['Private hospital network', 'Fast specialist access', 'Cancer care cover', 'Digital GP 24/7'], rating: 4.5, reviewCount: 14300, badge: 'Best Health UK', claimTime: '3–5 days', network: 'Private UK network' },
  { id: 'axa-health', provider: 'AXA Health', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'health',
    planName: 'Personal Health', minPremium: 48, maxPremium: 145, coverageAmount: 1000000, currency: 'GBP', currencySymbol: '£', deductible: 150,
    features: ['Fast-track appointments', 'Mental health support', 'Online claims', 'Family plans'], rating: 4.3, reviewCount: 10800, claimTime: '3–6 days', network: 'Private UK network' },
  // ── Europe Auto ──────────────────────────────────────────────────────────────
  { id: 'allianz-auto', provider: 'Allianz', flag: '🇩🇪', country: 'Germany', region: 'europe', category: 'auto',
    planName: 'Kfz-Versicherung Komfort', minPremium: 45, maxPremium: 130, coverageAmount: 500000, currency: 'EUR', currencySymbol: '€', deductible: 300,
    features: ['Europe-wide cover', 'Workshop network', 'No-claims discount up to 65%', '24h roadside help'], rating: 4.6, reviewCount: 20400, badge: 'Best Rate EU', claimTime: '3–5 days', network: 'EU-wide' },
  { id: 'axa-auto', provider: 'AXA', flag: '🇫🇷', country: 'France', region: 'europe', category: 'auto',
    planName: 'Assurance Auto Confort', minPremium: 42, maxPremium: 125, coverageAmount: 500000, currency: 'EUR', currencySymbol: '€', deductible: 350,
    features: ['Tous risques cover', 'Courtesy vehicle', 'Green driving discounts', 'App-based claims'], rating: 4.4, reviewCount: 15900, claimTime: '3–6 days', network: 'EU-wide' },
  // ── Europe Life ──────────────────────────────────────────────────────────────
  { id: 'legalgeneral-life', provider: 'Legal & General', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'life',
    planName: 'Life Insurance', minPremium: 12, maxPremium: 90, coverageAmount: 750000, currency: 'GBP', currencySymbol: '£', deductible: 0,
    features: ['UK’s #1 life insurer', 'Terminal illness cover', 'Fixed premiums', 'Free parent cover'], rating: 4.6, reviewCount: 22100, badge: 'Most Popular', claimTime: '7–10 days', network: 'Direct' },
  { id: 'generali-life', provider: 'Generali', flag: '🇮🇹', country: 'Italy', region: 'europe', category: 'life',
    planName: 'Vita Protezione', minPremium: 15, maxPremium: 95, coverageAmount: 500000, currency: 'EUR', currencySymbol: '€', deductible: 0,
    features: ['Flexible coverage', 'Investment-linked options', 'Serious illness rider', 'Pan-European insurer'], rating: 4.3, reviewCount: 8600, claimTime: '7–12 days', network: 'Direct' },
  // ── Europe Home ──────────────────────────────────────────────────────────────
  { id: 'aviva-home', provider: 'Aviva', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'home',
    planName: 'Home Insurance Plus', minPremium: 22, maxPremium: 75, coverageAmount: 600000, currency: 'GBP', currencySymbol: '£', deductible: 250,
    features: ['Buildings & contents', 'Accidental damage cover', 'Home emergency add-on', 'Online claims tracking'], rating: 4.4, reviewCount: 13100, badge: 'Best Home EU', claimTime: '4–7 days', network: 'UK-wide' },
  { id: 'zurich-home', provider: 'Zurich', flag: '🇨🇭', country: 'Switzerland', region: 'europe', category: 'home',
    planName: 'Home Comprehensive', minPremium: 35, maxPremium: 95, coverageAmount: 800000, currency: 'EUR', currencySymbol: '€', deductible: 400,
    features: ['Natural hazard cover', 'Worldwide contents', 'Legal protection add-on', 'Fast digital claims'], rating: 4.5, reviewCount: 7400, claimTime: '4–8 days', network: 'EU-wide' },
  // ── Travel (both) ────────────────────────────────────────────────────────────
  { id: 'allianz-travel', provider: 'Allianz Travel', flag: '🇺🇸', country: 'United States', region: 'us', category: 'travel',
    planName: 'OneTrip Prime', minPremium: 40, maxPremium: 180, coverageAmount: 100000, currency: 'USD', currencySymbol: '$', deductible: 0,
    features: ['Trip cancellation', 'Emergency medical abroad', 'Baggage loss cover', '24/7 assistance hotline'], rating: 4.3, reviewCount: 9200, badge: 'Best Travel', claimTime: '5–8 days', network: 'Worldwide' },
  { id: 'axa-travel', provider: 'AXA Travel', flag: '🇫🇷', country: 'France', region: 'europe', category: 'travel',
    planName: 'Schengen & Worldwide', minPremium: 25, maxPremium: 120, coverageAmount: 150000, currency: 'EUR', currencySymbol: '€', deductible: 0,
    features: ['Schengen visa compliant', 'COVID-19 cover', 'Adventure sports option', 'Multi-trip annual plans'], rating: 4.4, reviewCount: 11500, claimTime: '4–7 days', network: 'Worldwide' },
];

export const INSURANCE_CATEGORIES = [
  { id: 'all', label: 'All Insurance', icon: '🛡️' },
  { id: 'health', label: 'Health', icon: '🏥' },
  { id: 'life', label: 'Life', icon: '❤️' },
  { id: 'auto', label: 'Auto', icon: '🚗' },
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
] as const;

export const INSURANCE_CATEGORY_COLORS: Record<string, string> = {
  health: 'from-emerald-500 to-teal-600',
  life: 'from-rose-500 to-pink-600',
  auto: 'from-blue-500 to-cyan-600',
  home: 'from-amber-500 to-orange-600',
  travel: 'from-violet-500 to-purple-600',
};

export const INSURANCE_CATEGORY_INFO: Record<string, string> = {
  health: 'Medical, hospital and prescription coverage for you and your family.',
  life: 'Protect your loved ones financially with term or whole life cover.',
  auto: 'Comprehensive and liability cover for your vehicle, on the road.',
  home: 'Buildings and contents protection against damage and theft.',
  travel: 'Trip cancellation, medical and baggage cover anywhere you go.',
};

// ── Matching & premium estimation ────────────────────────────────────────────

export interface InsuranceProfileInput {
  country: string;
  age: number;
  gender: string;
  smoker: boolean;
  coverageType: string;      // maps to category
  coverageAmount: number;
  dependents: number;
  riskFactors: string;       // 'low' | 'medium' | 'high'
}

const PURPOSE_TO_CATEGORY: Record<string, InsurancePlan['category']> = {
  Health: 'health', 'Life Cover': 'life', Auto: 'auto', Home: 'home', Travel: 'travel',
};

export function coverageToCategory(coverageType: string): InsurancePlan['category'] {
  return PURPOSE_TO_CATEGORY[coverageType] ?? 'health';
}

/** Estimate the actual monthly premium a person would be offered based on their risk profile. */
export function estimatePremium(plan: InsurancePlan, profile: Pick<InsuranceProfileInput, 'age' | 'smoker' | 'riskFactors'>): number {
  const range = plan.maxPremium - plan.minPremium;
  // Age factor: young → near min, older → near max
  const ageFactor = Math.min(1, Math.max(0, (profile.age - 25) / 45));
  let premium = plan.minPremium + range * ageFactor;
  if (profile.smoker && (plan.category === 'health' || plan.category === 'life')) premium *= 1.4;
  if (profile.riskFactors === 'high') premium *= 1.25;
  else if (profile.riskFactors === 'low') premium *= 0.9;
  return Math.round(Math.min(premium, plan.maxPremium * 1.5));
}

export interface InsuranceMatch {
  plan: InsurancePlan;
  estimatedPremium: number;
  annualCost: number;
  fits: boolean;
  matchScore: number;
}

export function matchInsurance(profile: InsuranceProfileInput): InsuranceMatch[] {
  const category = coverageToCategory(profile.coverageType);
  const candidates = INSURANCE_PLANS.filter(p => p.category === category);
  const pool = candidates.length >= 2 ? candidates : INSURANCE_PLANS;

  return pool
    .map(plan => {
      const estimatedPremium = estimatePremium(plan, profile);
      const annualCost = estimatedPremium * 12;
      const fits = plan.coverageAmount >= profile.coverageAmount;
      const matchScore = Math.round(
        (fits ? 40 : 10) +
        Math.max(0, 30 - estimatedPremium / 20) +
        plan.rating * 6
      );
      return { plan, estimatedPremium, annualCost, fits, matchScore };
    })
    .sort((a, b) => (b.fits === a.fits ? a.estimatedPremium - b.estimatedPremium : a.fits ? -1 : 1));
}
