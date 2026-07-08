export interface Loan {
  id: string;
  bank: string;
  flag: string;
  country: string;
  region: 'us' | 'europe';
  category: 'personal' | 'home' | 'auto' | 'business' | 'student';
  productName: string;
  minRate: number;
  maxRate: number;
  minAmount: number;
  maxAmount: number;
  currency: string;
  currencySymbol: string;
  termMin: number;
  termMax: number;
  features: string[];
  rating: number;
  reviewCount: number;
  badge?: string;
  processingTime: string;
  processingFee: string;
}

export const LOANS: Loan[] = [
  // ── US Personal Loans ───────────────────────────────────────────────────────
  {
    id: 'sofi-personal',
    bank: 'SoFi', flag: '🇺🇸', country: 'United States', region: 'us', category: 'personal',
    productName: 'Personal Loan',
    minRate: 8.99, maxRate: 25.81,
    minAmount: 5000, maxAmount: 100000, currency: 'USD', currencySymbol: '$',
    termMin: 24, termMax: 84,
    features: ['No origination fee', 'Unemployment protection', 'Same-day funding', 'Career coaching included'],
    rating: 4.8, reviewCount: 14230,
    badge: "Editor's Choice",
    processingTime: 'Same day', processingFee: '0%',
  },
  {
    id: 'marcus-personal',
    bank: 'Marcus by Goldman Sachs', flag: '🇺🇸', country: 'United States', region: 'us', category: 'personal',
    productName: 'Personal Loan',
    minRate: 6.99, maxRate: 24.99,
    minAmount: 3500, maxAmount: 40000, currency: 'USD', currencySymbol: '$',
    termMin: 36, termMax: 72,
    features: ['No fees ever', 'On-time payment reward (skip a payment)', 'Direct payoff to creditors', 'Fixed rates guaranteed'],
    rating: 4.7, reviewCount: 9840,
    badge: 'Best Rate',
    processingTime: '1–3 days', processingFee: '0%',
  },
  {
    id: 'discover-personal',
    bank: 'Discover', flag: '🇺🇸', country: 'United States', region: 'us', category: 'personal',
    productName: 'Personal Loan',
    minRate: 7.99, maxRate: 24.99,
    minAmount: 2500, maxAmount: 40000, currency: 'USD', currencySymbol: '$',
    termMin: 36, termMax: 84,
    features: ['No origination fee', '30-day money-back guarantee', 'Free credit score monitoring', 'Flexible repayment terms'],
    rating: 4.6, reviewCount: 7650,
    processingTime: '1–2 days', processingFee: '0%',
  },
  {
    id: 'lightstream-personal',
    bank: 'LightStream', flag: '🇺🇸', country: 'United States', region: 'us', category: 'personal',
    productName: 'Personal Loan',
    minRate: 7.49, maxRate: 25.49,
    minAmount: 5000, maxAmount: 100000, currency: 'USD', currencySymbol: '$',
    termMin: 24, termMax: 144,
    features: ['Rate Beat Program (0.10% lower)', 'Same-day funding available', 'No fees of any kind', 'Longest terms up to 12 years'],
    rating: 4.7, reviewCount: 11200,
    badge: 'Most Popular',
    processingTime: 'Same day', processingFee: '0%',
  },
  {
    id: 'upstart-personal',
    bank: 'Upstart', flag: '🇺🇸', country: 'United States', region: 'us', category: 'personal',
    productName: 'AI-Powered Personal Loan',
    minRate: 7.80, maxRate: 35.99,
    minAmount: 1000, maxAmount: 50000, currency: 'USD', currencySymbol: '$',
    termMin: 36, termMax: 60,
    features: ['AI approval considers education & job history', 'Available to thin-credit borrowers', 'Fast 1-day funding', 'Soft credit check pre-qualification'],
    rating: 4.3, reviewCount: 8900,
    processingTime: '1 day', processingFee: '0–12%',
  },
  // ── US Home Loans ────────────────────────────────────────────────────────────
  {
    id: 'chase-mortgage',
    bank: 'Chase', flag: '🇺🇸', country: 'United States', region: 'us', category: 'home',
    productName: 'Home Mortgage',
    minRate: 6.375, maxRate: 7.5,
    minAmount: 100000, maxAmount: 2000000, currency: 'USD', currencySymbol: '$',
    termMin: 120, termMax: 360,
    features: ['Rate lock up to 90 days', 'DreaMaker® low down-payment program', 'Online application & tracking', 'Dedicated loan advisor'],
    rating: 4.5, reviewCount: 22100,
    badge: 'Most Popular',
    processingTime: '21–30 days', processingFee: '0.5–1%',
  },
  {
    id: 'wellsfargo-mortgage',
    bank: 'Wells Fargo', flag: '🇺🇸', country: 'United States', region: 'us', category: 'home',
    productName: 'Home Mortgage',
    minRate: 6.25, maxRate: 7.375,
    minAmount: 75000, maxAmount: 1500000, currency: 'USD', currencySymbol: '$',
    termMin: 120, termMax: 360,
    features: ['Priority customer service', 'Home Key Rate Advantage', 'Down payment assistance programs', 'First-time buyer education'],
    rating: 4.3, reviewCount: 18700,
    processingTime: '20–30 days', processingFee: '0.5–1.5%',
  },
  // ── US Auto Loans ────────────────────────────────────────────────────────────
  {
    id: 'capitalone-auto',
    bank: 'Capital One', flag: '🇺🇸', country: 'United States', region: 'us', category: 'auto',
    productName: 'Auto Finance',
    minRate: 5.99, maxRate: 24.99,
    minAmount: 4000, maxAmount: 75000, currency: 'USD', currencySymbol: '$',
    termMin: 36, termMax: 84,
    features: ['Pre-qualify with no credit impact', 'Same-day approval', '12,000+ dealer network', 'Auto Navigator app'],
    rating: 4.4, reviewCount: 16500,
    badge: 'Best Rate',
    processingTime: 'Same day', processingFee: '0%',
  },
  {
    id: 'bofa-auto',
    bank: 'Bank of America', flag: '🇺🇸', country: 'United States', region: 'us', category: 'auto',
    productName: 'Auto Loan',
    minRate: 5.69, maxRate: 23.74,
    minAmount: 7500, maxAmount: 100000, currency: 'USD', currencySymbol: '$',
    termMin: 48, termMax: 72,
    features: ['0.5% Preferred Rewards discount', 'Online application', 'New & used vehicles', 'Refinancing available'],
    rating: 4.2, reviewCount: 12300,
    processingTime: '1–2 days', processingFee: '0%',
  },
  // ── US Student Loans ─────────────────────────────────────────────────────────
  {
    id: 'sofi-student',
    bank: 'SoFi', flag: '🇺🇸', country: 'United States', region: 'us', category: 'student',
    productName: 'Student Loan Refinance',
    minRate: 4.99, maxRate: 13.99,
    minAmount: 5000, maxAmount: 300000, currency: 'USD', currencySymbol: '$',
    termMin: 60, termMax: 240,
    features: ['No origination or prepayment fees', 'Unemployment protection', 'Career coaching & financial planning', 'Referral bonuses'],
    rating: 4.8, reviewCount: 10100,
    badge: "Editor's Choice",
    processingTime: '2–4 weeks', processingFee: '0%',
  },
  // ── Europe Personal Loans ─────────────────────────────────────────────────────
  {
    id: 'lloyds-personal',
    bank: 'Lloyds Bank', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'personal',
    productName: 'Personal Loan',
    minRate: 2.8, maxRate: 24.9,
    minAmount: 1000, maxAmount: 25000, currency: 'GBP', currencySymbol: '£',
    termMin: 12, termMax: 60,
    features: ['Preferential rates for existing customers', 'No arrangement fee', 'Flexible repayment options', 'Instant online quote'],
    rating: 4.6, reviewCount: 19800,
    badge: 'Best Rate UK',
    processingTime: 'Same day', processingFee: '0%',
  },
  {
    id: 'hsbc-personal',
    bank: 'HSBC', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'personal',
    productName: 'Personal Loan',
    minRate: 3.9, maxRate: 18.9,
    minAmount: 1000, maxAmount: 25000, currency: 'GBP', currencySymbol: '£',
    termMin: 12, termMax: 60,
    features: ['Same-day decision', 'FSCS protected', 'Premier customer rates', 'Online & branch management'],
    rating: 4.5, reviewCount: 15600,
    processingTime: 'Same day', processingFee: '0%',
  },
  {
    id: 'barclays-personal',
    bank: 'Barclays', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'personal',
    productName: 'Personal Loan',
    minRate: 4.9, maxRate: 29.9,
    minAmount: 1000, maxAmount: 35000, currency: 'GBP', currencySymbol: '£',
    termMin: 12, termMax: 60,
    features: ['Instant online decision', 'No early repayment fee', 'Barclays app management', 'Available to non-customers'],
    rating: 4.3, reviewCount: 13200,
    processingTime: '1 day', processingFee: '0%',
  },
  {
    id: 'ing-personal',
    bank: 'ING', flag: '🇩🇪', country: 'Germany', region: 'europe', category: 'personal',
    productName: 'Privatkredit',
    minRate: 3.99, maxRate: 10.99,
    minAmount: 1000, maxAmount: 75000, currency: 'EUR', currencySymbol: '€',
    termMin: 12, termMax: 84,
    features: ['100% paperless application', 'Same-week funding', 'Fixed monthly payments', 'No hidden fees'],
    rating: 4.7, reviewCount: 21400,
    badge: 'Best Rate EU',
    processingTime: '3–5 days', processingFee: '0%',
  },
  {
    id: 'deutsche-personal',
    bank: 'Deutsche Bank', flag: '🇩🇪', country: 'Germany', region: 'europe', category: 'personal',
    productName: 'Privatkredit',
    minRate: 4.35, maxRate: 12.99,
    minAmount: 1000, maxAmount: 50000, currency: 'EUR', currencySymbol: '€',
    termMin: 12, termMax: 120,
    features: ['Branch & online application', 'Existing customer preferential rates', 'Flexible repayment schedule', 'Up to 10 year terms'],
    rating: 4.4, reviewCount: 11700,
    processingTime: '3–7 days', processingFee: '0–1%',
  },
  {
    id: 'bnp-personal',
    bank: 'BNP Paribas', flag: '🇫🇷', country: 'France', region: 'europe', category: 'personal',
    productName: 'Crédit Personnel',
    minRate: 3.9, maxRate: 15.9,
    minAmount: 1000, maxAmount: 75000, currency: 'EUR', currencySymbol: '€',
    termMin: 12, termMax: 84,
    features: ['Fast online approval (24h)', 'Green loan products available', 'EU-wide coverage', 'Flexible modulation of installments'],
    rating: 4.5, reviewCount: 17300,
    badge: 'Most Popular',
    processingTime: '1–2 days', processingFee: '0%',
  },
  {
    id: 'santander-personal',
    bank: 'Santander', flag: '🇪🇸', country: 'Spain', region: 'europe', category: 'personal',
    productName: 'Préstamo Personal',
    minRate: 5.99, maxRate: 12.99,
    minAmount: 3000, maxAmount: 75000, currency: 'EUR', currencySymbol: '€',
    termMin: 12, termMax: 96,
    features: ['Instant online decision', 'Pan-European network', 'Flexible installment dates', 'Early repayment with no penalty'],
    rating: 4.4, reviewCount: 14900,
    processingTime: '1–3 days', processingFee: '0–0.5%',
  },
  {
    id: 'unicredit-personal',
    bank: 'UniCredit', flag: '🇮🇹', country: 'Italy', region: 'europe', category: 'personal',
    productName: 'Prestito Personale',
    minRate: 6.49, maxRate: 14.99,
    minAmount: 1000, maxAmount: 50000, currency: 'EUR', currencySymbol: '€',
    termMin: 12, termMax: 84,
    features: ["Italy's leading bank", 'Sustainable & green loan options', 'Online & branch application', 'Flexible payment holiday'],
    rating: 4.3, reviewCount: 9600,
    processingTime: '2–5 days', processingFee: '0–1%',
  },
  // ── Europe Home Loans ─────────────────────────────────────────────────────────
  {
    id: 'halifax-mortgage',
    bank: 'Halifax', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'home',
    productName: 'Residential Mortgage',
    minRate: 4.1, maxRate: 5.9,
    minAmount: 25000, maxAmount: 500000, currency: 'GBP', currencySymbol: '£',
    termMin: 60, termMax: 300,
    features: ['£500 cashback on completion', 'Free property valuation', 'Flexible overpayments (10%/yr)', 'Online application tracker'],
    rating: 4.6, reviewCount: 26700,
    badge: "Editor's Choice",
    processingTime: '4–8 weeks', processingFee: '0%',
  },
  {
    id: 'ing-mortgage',
    bank: 'ING', flag: '🇳🇱', country: 'Netherlands', region: 'europe', category: 'home',
    productName: 'Hypotheek',
    minRate: 3.5, maxRate: 5.2,
    minAmount: 50000, maxAmount: 750000, currency: 'EUR', currencySymbol: '€',
    termMin: 60, termMax: 360,
    features: ['Fixed rate up to 30 years', 'Sustainability energy bonus', 'Free online mortgage advice', 'Fully digital application'],
    rating: 4.7, reviewCount: 18900,
    badge: 'Best Rate EU',
    processingTime: '3–6 weeks', processingFee: '0%',
  },
  // ── Europe Business Loans ─────────────────────────────────────────────────────
  {
    id: 'barclays-business',
    bank: 'Barclays', flag: '🇬🇧', country: 'United Kingdom', region: 'europe', category: 'business',
    productName: 'Business Loan',
    minRate: 6.5, maxRate: 18.0,
    minAmount: 10000, maxAmount: 500000, currency: 'GBP', currencySymbol: '£',
    termMin: 12, termMax: 60,
    features: ['Dedicated relationship manager', 'Flexible repayment schedules', 'Capital repayment holiday available', 'Start-up friendly'],
    rating: 4.4, reviewCount: 7200,
    processingTime: '5–10 days', processingFee: '1–2%',
  },
  {
    id: 'deutsche-business',
    bank: 'Deutsche Bank', flag: '🇩🇪', country: 'Germany', region: 'europe', category: 'business',
    productName: 'Unternehmenskredit',
    minRate: 5.5, maxRate: 14.0,
    minAmount: 25000, maxAmount: 500000, currency: 'EUR', currencySymbol: '€',
    termMin: 12, termMax: 84,
    features: ['Structured financing options', 'KfW program access', 'Industry-specific products', 'Pan-European corporate banking'],
    rating: 4.5, reviewCount: 5400,
    processingTime: '5–14 days', processingFee: '0.5–2%',
  },
  // ── US Business Loans ─────────────────────────────────────────────────────────
  {
    id: 'chase-business',
    bank: 'Chase', flag: '🇺🇸', country: 'United States', region: 'us', category: 'business',
    productName: 'Business Term Loan',
    minRate: 7.25, maxRate: 20.0,
    minAmount: 5000, maxAmount: 500000, currency: 'USD', currencySymbol: '$',
    termMin: 12, termMax: 84,
    features: ['SBA loan programs available', 'No collateral up to $100k', 'Dedicated business banker', 'Line of credit option'],
    rating: 4.5, reviewCount: 8900,
    processingTime: '3–5 days', processingFee: '0–2%',
  },
];

export const LOAN_CATEGORIES = [
  { id: 'all', label: 'All Loans', icon: '🏦' },
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'auto', label: 'Auto', icon: '🚗' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'student', label: 'Student', icon: '🎓' },
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  personal: 'from-indigo-500 to-purple-600',
  home: 'from-emerald-500 to-teal-600',
  auto: 'from-blue-500 to-cyan-600',
  business: 'from-amber-500 to-orange-600',
  student: 'from-rose-500 to-pink-600',
};

// ── Loan matching & analysis (dashboard) ─────────────────────────────────────

export interface LoanProfileInput {
  country: string;
  employmentStatus: string;
  annualIncome: number;
  monthlyExpenses: number;
  creditScoreRange: string;
  existingMonthlyDebt: number;
  loanPurpose: string;
  desiredAmount: number;
  desiredTermMonths: number;
}

const CREDIT_TIER: Record<string, number> = {
  'Excellent (800+)': 1,
  'Very Good (740–799)': 0.78,
  'Good (670–739)': 0.55,
  'Fair (580–669)': 0.3,
  'Poor (<580)': 0.08,
  'Not Sure': 0.4,
};

const PURPOSE_TO_CATEGORY: Record<string, Loan['category']> = {
  'Home Purchase': 'home',
  'Home Improvement': 'home',
  'Car Purchase': 'auto',
  'Business': 'business',
  'Education': 'student',
  'Debt Consolidation': 'personal',
  'Medical': 'personal',
  'Wedding': 'personal',
  'Vacation': 'personal',
  'Emergency': 'personal',
  'Other': 'personal',
};

/** Estimate the APR a borrower would actually be offered based on their credit tier. */
export function estimateOfferedRate(loan: Loan, creditScoreRange: string): number {
  const tier = CREDIT_TIER[creditScoreRange] ?? 0.4;
  // Excellent credit → near min rate; poor credit → near max rate.
  return +(loan.maxRate - (loan.maxRate - loan.minRate) * tier).toFixed(2);
}

export function purposeToCategory(purpose: string): Loan['category'] {
  return PURPOSE_TO_CATEGORY[purpose] ?? 'personal';
}

export interface LoanMatch {
  loan: Loan;
  offeredRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  fits: boolean;
  matchScore: number;
}

function emi(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12 / 100;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

/** Rank loans for a given profile: right category/region, amount fits, then lowest total cost. */
export function matchLoans(profile: LoanProfileInput): LoanMatch[] {
  const category = purposeToCategory(profile.loanPurpose);
  const amount = profile.desiredAmount || 0;
  const term = profile.desiredTermMonths || 36;

  const candidates = LOANS.filter(l => l.category === category);
  const pool = candidates.length >= 3 ? candidates : LOANS;

  return pool
    .map(loan => {
      const offeredRate = estimateOfferedRate(loan, profile.creditScoreRange);
      const clampedAmount = Math.min(Math.max(amount, loan.minAmount), loan.maxAmount);
      const clampedTerm = Math.min(Math.max(term, loan.termMin), loan.termMax);
      const monthlyPayment = emi(clampedAmount, offeredRate, clampedTerm);
      const totalCost = monthlyPayment * clampedTerm;
      const totalInterest = totalCost - clampedAmount;
      const fits = amount >= loan.minAmount && amount <= loan.maxAmount && term >= loan.termMin && term <= loan.termMax;
      // Lower rate + better fit + higher rating = higher score.
      const matchScore = Math.round(
        (fits ? 40 : 0) +
        Math.max(0, 35 - offeredRate) +
        loan.rating * 5
      );
      return { loan, offeredRate, monthlyPayment, totalInterest, totalCost, fits, matchScore };
    })
    .sort((a, b) => (b.fits === a.fits ? a.totalCost - b.totalCost : a.fits ? -1 : 1));
}
