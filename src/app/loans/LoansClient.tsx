"use client";
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/loans/AuthModal';
import ProfileModal, { type ProfileData } from '@/components/loans/ProfileModal';
import { LOANS, LOAN_CATEGORIES, CATEGORY_COLORS, estimateOfferedRate, type Loan } from '@/lib/loanData';
import { calcEMI } from '@/lib/formulas';

type Category = 'all' | 'personal' | 'home' | 'auto' | 'business' | 'student';
type Region = 'all' | 'us' | 'europe';
type Sort = 'rate' | 'amount' | 'rating';
type Eligibility = 'likely' | 'possible' | null;

function getEligibility(loan: Loan, profile: ProfileData | null): Eligibility {
  if (!profile) return null;
  const creditMap: Record<string, number> = {
    'Excellent (800+)': 5, 'Very Good (740–799)': 4, 'Good (670–739)': 3, 'Fair (580–669)': 2, 'Poor (<580)': 1, 'Not Sure': 2,
  };
  const credit = creditMap[profile.creditScoreRange] ?? 2;
  const monthlyIncome = profile.annualIncome / 12;
  const dti = monthlyIncome > 0 ? profile.existingMonthlyDebt / monthlyIncome : 1;

  if (credit >= 4 && dti < 0.3) return 'likely';
  if (credit >= 3 && dti < 0.43) return 'possible';
  if (credit >= 2 && dti < 0.5) return 'possible';
  return null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-[var(--border)]'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function LoanCard({
  loan, onApply, applying, compared, onToggleCompare, eligibility
}: {
  loan: Loan;
  onApply: (loan: Loan) => void;
  applying?: boolean;
  compared: boolean;
  onToggleCompare: (id: string) => void;
  eligibility: Eligibility;
}) {
  const color = CATEGORY_COLORS[loan.category];
  return (
    <div className={`relative rounded-2xl border bg-[var(--card)] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden flex flex-col ${compared ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20' : 'border-[var(--border)]'}`}>
      {/* Category color bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${color}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Bank header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-lg shadow-sm shrink-0`}>
              {loan.flag}
            </div>
            <div>
              <p className="font-bold text-[var(--foreground)] text-sm leading-tight">{loan.bank}</p>
              <p className="text-[11px] text-[var(--muted-foreground)]">{loan.country}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {loan.badge && (
              <span className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">
                {loan.badge}
              </span>
            )}
            {eligibility === 'likely' && (
              <span className="rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 text-[10px] font-bold border border-green-200 dark:border-green-800">
                ✓ Likely Approved
              </span>
            )}
            {eligibility === 'possible' && (
              <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                ~ May Qualify
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-[var(--muted-foreground)] mb-3">{loan.productName}</p>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-xl bg-[var(--muted)] p-2.5 text-center">
            <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">APR</p>
            <p className="text-xs font-bold text-[var(--primary)]">{loan.minRate}–{loan.maxRate}%</p>
          </div>
          <div className="rounded-xl bg-[var(--muted)] p-2.5 text-center">
            <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Amount</p>
            <p className="text-xs font-bold text-[var(--foreground)]">
              {loan.currencySymbol}{(loan.minAmount >= 1000 ? `${loan.minAmount / 1000}k` : loan.minAmount)}–{loan.currencySymbol}{loan.maxAmount >= 1000 ? `${loan.maxAmount / 1000}k` : loan.maxAmount}
            </p>
          </div>
          <div className="rounded-xl bg-[var(--muted)] p-2.5 text-center">
            <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Term</p>
            <p className="text-xs font-bold text-[var(--foreground)]">{loan.termMin}–{loan.termMax} mo</p>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-1.5 mb-4 flex-1">
          {loan.features.slice(0, 3).map(f => (
            <li key={f} className="flex items-start gap-2 text-xs text-[var(--muted-foreground)]">
              <svg className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="flex items-center gap-3 mb-3 text-xs text-[var(--muted-foreground)]">
          <div className="flex items-center gap-1">
            <StarRating rating={loan.rating} />
            <span className="font-semibold text-[var(--foreground)]">{loan.rating}</span>
            <span>({loan.reviewCount.toLocaleString()})</span>
          </div>
          <span className="text-[var(--border)]">·</span>
          <span>⚡ {loan.processingTime}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleCompare(loan.id)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
              compared
                ? 'border-[var(--primary)] text-[var(--primary)] bg-indigo-50 dark:bg-indigo-950/30'
                : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {compared ? 'Added' : 'Compare'}
          </button>
          <button
            onClick={() => onApply(loan)}
            disabled={applying}
            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity text-center disabled:opacity-60"
          >
            {applying ? 'Applying…' : 'Apply Now →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareModal({ loans, onClose, onApply }: { loans: Loan[]; onClose: () => void; onApply: (l: Loan) => void }) {
  const rows = [
    { label: 'Bank', key: (l: Loan) => l.bank },
    { label: 'Country', key: (l: Loan) => `${l.flag} ${l.country}` },
    { label: 'APR Range', key: (l: Loan) => `${l.minRate}% – ${l.maxRate}%` },
    { label: 'Loan Amount', key: (l: Loan) => `${l.currencySymbol}${l.minAmount.toLocaleString()} – ${l.currencySymbol}${l.maxAmount.toLocaleString()}` },
    { label: 'Term', key: (l: Loan) => `${l.termMin} – ${l.termMax} months` },
    { label: 'Processing Fee', key: (l: Loan) => l.processingFee },
    { label: 'Processing Time', key: (l: Loan) => l.processingTime },
    { label: 'Rating', key: (l: Loan) => `⭐ ${l.rating} (${l.reviewCount.toLocaleString()})` },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden animate-fadeInUp max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
          <h2 className="font-bold text-[var(--foreground)]">Loan Comparison</h2>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left text-xs text-[var(--muted-foreground)] font-semibold uppercase tracking-wide bg-[var(--muted)] w-32">Feature</th>
                {loans.map(l => (
                  <th key={l.id} className="py-3 px-4 text-center bg-[var(--muted)] border-l border-[var(--border)]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">{l.flag}</span>
                      <span className="font-bold text-[var(--foreground)] text-xs">{l.bank}</span>
                      {l.badge && <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 text-[10px] font-bold">{l.badge}</span>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-[var(--card)]' : 'bg-[var(--muted)]/30'}>
                  <td className="py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)]">{row.label}</td>
                  {loans.map(l => (
                    <td key={l.id} className="py-3 px-4 text-center text-xs font-medium text-[var(--foreground)] border-l border-[var(--border)]">
                      {row.key(l)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-[var(--card)] border-t border-[var(--border)]">
                <td className="py-3 px-4" />
                {loans.map(l => (
                  <td key={l.id} className="py-3 px-4 text-center border-l border-[var(--border)]">
                    <button
                      onClick={() => { onClose(); onApply(l); }}
                      className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                    >
                      Apply →
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function LoansClient() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState<Category>('all');
  const [region, setRegion] = useState<Region>('all');
  const [sort, setSort] = useState<Sort>('rate');

  // Honor ?type= / ?region= from the landing's "Get Quote / Enquire" buttons.
  // Applied after mount (not in the initializer) to avoid an SSR hydration mismatch.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('type');
    if (t && ['personal', 'home', 'auto', 'business', 'student'].includes(t)) setCategory(t as Category);
    const r = params.get('region');
    if (r === 'us' || r === 'europe') setRegion(r);
  }, []);
  const [compared, setCompared] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [applyTarget, setApplyTarget] = useState<Loan | null>(null);
  const [appliedLoans, setAppliedLoans] = useState<string[]>([]);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  // Full profile fetched from DB (credit score, desired amount/term) — used to price applications.
  const [dbProfile, setDbProfile] = useState<{ creditScoreRange: string; desiredAmount: number; desiredTermMonths: number } | null>(null);

  // When logged in, load existing applications + profile so the grid reflects saved state.
  useEffect(() => {
    if (!user) { setAppliedLoans([]); setDbProfile(null); return; }
    fetch('/api/user/applications')
      .then(r => r.ok ? r.json() : { applications: [] })
      .then(d => setAppliedLoans((d.applications ?? []).map((a: { loanId: string }) => a.loanId)))
      .catch(() => {});
    if (user.hasProfile) {
      fetch('/api/user/profile')
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          if (d?.profile) {
            setDbProfile({
              creditScoreRange: d.profile.creditScoreRange ?? 'Not Sure',
              desiredAmount: d.profile.desiredAmount ?? 0,
              desiredTermMonths: d.profile.desiredTermMonths ?? 36,
            });
            setProfile(d.profile);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const filtered = useMemo(() => {
    let loans = LOANS;
    if (category !== 'all') loans = loans.filter(l => l.category === category);
    if (region !== 'all') loans = loans.filter(l => l.region === region);
    if (sort === 'rate') loans = [...loans].sort((a, b) => a.minRate - b.minRate);
    else if (sort === 'amount') loans = [...loans].sort((a, b) => b.maxAmount - a.maxAmount);
    else loans = [...loans].sort((a, b) => b.rating - a.rating);
    return loans;
  }, [category, region, sort]);

  const comparedLoans = LOANS.filter(l => compared.includes(l.id));

  // Persist an application to the user's dashboard (DB).
  const applyToLoan = useCallback(async (loan: Loan) => {
    const credit = dbProfile?.creditScoreRange ?? 'Not Sure';
    const offeredRate = estimateOfferedRate(loan, credit);
    const amount = Math.min(Math.max(dbProfile?.desiredAmount || loan.minAmount, loan.minAmount), loan.maxAmount);
    const term = Math.min(Math.max(dbProfile?.desiredTermMonths || 36, loan.termMin), loan.termMax);
    const monthlyPayment = calcEMI(amount, offeredRate, term);

    setApplyingId(loan.id);
    try {
      const res = await fetch('/api/user/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanId: loan.id, bank: loan.bank, flag: loan.flag, country: loan.country,
          productName: loan.productName, category: loan.category, currencySymbol: loan.currencySymbol,
          offeredRate, amount, termMonths: term, monthlyPayment: Math.round(monthlyPayment), status: 'submitted',
        }),
      });
      if (res.ok) setAppliedLoans(prev => prev.includes(loan.id) ? prev : [...prev, loan.id]);
    } finally {
      setApplyingId(null);
    }
  }, [dbProfile]);

  const removeApplication = useCallback(async (loanId: string) => {
    setAppliedLoans(prev => prev.filter(id => id !== loanId)); // optimistic
    try {
      await fetch(`/api/user/applications?loanId=${encodeURIComponent(loanId)}`, { method: 'DELETE' });
    } catch {
      // On failure, re-add so the UI stays truthful.
      setAppliedLoans(prev => prev.includes(loanId) ? prev : [...prev, loanId]);
    }
  }, []);

  const handleApply = (loan: Loan) => {
    setApplyTarget(loan);
    if (!user) {
      setShowAuth(true);
    } else if (!user.hasProfile) {
      setShowProfile(true);
    } else {
      applyToLoan(loan);
    }
  };

  const handleAuthSuccess = (u: { id: string; email: string; name: string; hasProfile: boolean }) => {
    setShowAuth(false);
    if (!u.hasProfile) {
      // New user (or profile not yet built) → collect details next.
      setShowProfile(true);
    } else {
      // Returning user with a profile → apply to the target loan, then go to dashboard.
      if (applyTarget) applyToLoan(applyTarget);
      router.push('/loans/dashboard');
    }
  };

  const handleProfileSuccess = (prof: ProfileData) => {
    setProfile(prof);
    setShowProfile(false);
    updateUser({ hasProfile: true });
    setDbProfile({ creditScoreRange: prof.creditScoreRange, desiredAmount: prof.desiredAmount, desiredTermMonths: prof.desiredTermMonths });
    // Profile complete → show the personalized dashboard.
    router.push('/loans/dashboard');
  };

  const toggleCompare = (id: string) => {
    setCompared(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const totalLoans = LOANS.length;
  const usCount = LOANS.filter(l => l.region === 'us').length;
  const euCount = LOANS.filter(l => l.region === 'europe').length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 py-16 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-8 h-48 w-48 rounded-full bg-purple-300 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs text-white/90 font-medium mb-4">
            🏦 US & European Loan Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Compare Loans from Top Banks
          </h1>
          <p className="text-base sm:text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Find the lowest rates from {totalLoans}+ loan products across {usCount} US and {euCount} European banks.
            <span className="font-medium text-white"> No login required to browse.</span>
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: '🏦', label: `${totalLoans}+ Loan Products` },
              { icon: '🌍', label: '10 Countries' },
              { icon: '💸', label: '0% Commission' },
              { icon: '⚡', label: 'Instant Comparison' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm text-white font-medium">
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-14 z-30 bg-[var(--card)] border-b border-[var(--border)] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {LOAN_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id as Category)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    category === cat.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="h-5 w-px bg-[var(--border)] hidden sm:block" />

            {/* Region */}
            <div className="flex items-center gap-1">
              {[{ id: 'all', label: '🌐 All' }, { id: 'us', label: '🇺🇸 US' }, { id: 'europe', label: '🌍 Europe' }].map(r => (
                <button
                  key={r.id}
                  onClick={() => setRegion(r.id as Region)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    region === r.id
                      ? 'bg-[var(--primary)] text-white'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-[var(--muted-foreground)] hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as Sort)}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
              >
                <option value="rate">Lowest APR</option>
                <option value="amount">Highest Amount</option>
                <option value="rating">Top Rated</option>
              </select>
              <span className="text-xs text-[var(--muted-foreground)]">{filtered.length} results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome banner for logged-in user */}
      {user && (
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <div className={`rounded-2xl border px-5 py-3 flex items-center justify-between ${
            user.hasProfile
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {user.hasProfile ? `Welcome back, ${user.name.split(' ')[0]}!` : `Hi ${user.name.split(' ')[0]}, complete your profile`}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {user.hasProfile ? 'Eligibility badges shown on matching loans' : 'Get personalized loan recommendations in 2 minutes'}
                </p>
              </div>
            </div>
            {user.hasProfile ? (
              <button
                onClick={() => router.push('/loans/dashboard')}
                className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
              >
                View Dashboard →
              </button>
            ) : (
              <button
                onClick={() => setShowProfile(true)}
                className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Complete Profile →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loan Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">No loans found</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">Try changing your filters</p>
            <button onClick={() => { setCategory('all'); setRegion('all'); }} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)]">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(loan => (
              appliedLoans.includes(loan.id) ? (
                <div key={loan.id} className="rounded-2xl border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 flex flex-col items-center justify-center p-8 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="font-bold text-green-700 dark:text-green-400 mb-1">Added to Dashboard</p>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3">{loan.bank} — {loan.productName}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push('/loans/dashboard')}
                      className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                    >
                      View in Dashboard →
                    </button>
                    <button
                      onClick={() => removeApplication(loan.id)}
                      className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-red-500 hover:border-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  onApply={handleApply}
                  applying={applyingId === loan.id}
                  compared={compared.includes(loan.id)}
                  onToggleCompare={toggleCompare}
                  eligibility={getEligibility(loan, profile)}
                />
              )
            ))}
          </div>
        )}
      </main>

      {/* Compare bar */}
      {compared.length >= 2 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--card)] shadow-2xl px-4 py-3">
          <div className="mx-auto max-w-7xl flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2 overflow-x-auto">
              {comparedLoans.map(l => (
                <div key={l.id} className="flex items-center gap-2 rounded-xl bg-[var(--muted)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] shrink-0">
                  <span>{l.flag}</span>
                  <span>{l.bank}</span>
                  <button onClick={() => toggleCompare(l.id)} className="ml-1 text-[var(--muted-foreground)] hover:text-red-500">×</button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setCompared([])} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Clear</button>
              <button
                onClick={() => setShowCompare(true)}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Compare {compared.length} Loans →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
          loanName={applyTarget?.productName}
        />
      )}

      {showProfile && user && (
        <ProfileModal
          userName={user.name}
          onClose={() => setShowProfile(false)}
          onSuccess={handleProfileSuccess}
        />
      )}

      {showCompare && comparedLoans.length >= 2 && (
        <CompareModal
          loans={comparedLoans}
          onClose={() => setShowCompare(false)}
          onApply={loan => { setShowCompare(false); handleApply(loan); }}
        />
      )}
    </div>
  );
}
