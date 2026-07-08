"use client";
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { matchLoans, type LoanProfileInput, type LoanMatch } from '@/lib/loanData';
import { amortizationSchedule } from '@/lib/formulas';

interface ProfileDoc extends LoanProfileInput {
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  maritalStatus?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  housingStatus?: string;
  govIdType?: string;
  govIdNumber?: string;
  employerName?: string;
}
interface AccountDoc {
  email: string;
  name: string;
  avatar: string;
  memberSince: string;
  hasProfile: boolean;
}

interface Application {
  _id: string;
  loanId: string;
  bank: string;
  flag: string;
  country: string;
  productName: string;
  category: string;
  offeredRate: number;
  amount: number;
  termMonths: number;
  monthlyPayment: number;
  currencySymbol: string;
  status: string;
  createdAt: string;
}

const CURRENCY_BY_COUNTRY: Record<string, { symbol: string; code: string }> = {
  'United States': { symbol: '$', code: 'USD' },
  'Canada': { symbol: 'C$', code: 'CAD' },
  'United Kingdom': { symbol: '£', code: 'GBP' },
  'Australia': { symbol: 'A$', code: 'AUD' },
  'Switzerland': { symbol: 'CHF ', code: 'CHF' },
  'Sweden': { symbol: 'kr ', code: 'SEK' },
};
function currencyFor(country: string) {
  return CURRENCY_BY_COUNTRY[country] ?? { symbol: '€', code: 'EUR' };
}

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

// Show only the last 4 characters of a sensitive ID number.
function maskId(id: string): string {
  const trimmed = id.replace(/\s/g, '');
  if (trimmed.length <= 4) return '••••';
  return '••••' + trimmed.slice(-4);
}

export default function DashboardClient() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileDoc | null>(null);
  const [account, setAccount] = useState<AccountDoc | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/loans'); return; }

    Promise.all([
      fetch('/api/user/profile').then(res => {
        if (!res.ok) throw new Error('Could not load your profile.');
        return res.json();
      }),
      fetch('/api/user/applications').then(res => res.ok ? res.json() : { applications: [] }),
    ])
      .then(([profileData, appsData]) => {
        setProfile(profileData.profile);
        setAccount(profileData.account);
        setApplications(appsData.applications ?? []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, isLoading, router]);

  const removeApplication = async (loanId: string) => {
    setApplications(prev => prev.filter(a => a.loanId !== loanId)); // optimistic
    try {
      await fetch(`/api/user/applications?loanId=${encodeURIComponent(loanId)}`, { method: 'DELETE' });
    } catch {
      // best-effort; a reload will reconcile
    }
  };

  const cur = currencyFor(profile?.country ?? '');
  const fmt = (v: number) =>
    `${cur.symbol}${Math.round(v).toLocaleString('en-US')}`;

  const matches: LoanMatch[] = useMemo(
    () => (profile ? matchLoans(profile) : []),
    [profile]
  );
  const best = matches[0];

  // Amortization for the best-matched plan
  const amortization = useMemo(() => {
    if (!best || !profile) return [];
    const amount = Math.min(Math.max(profile.desiredAmount, best.loan.minAmount), best.loan.maxAmount);
    const term = Math.min(Math.max(profile.desiredTermMonths, best.loan.termMin), best.loan.termMax);
    const rows = amortizationSchedule(amount, best.offeredRate, term);
    // sample ~ every few months to keep chart readable
    const step = Math.max(1, Math.floor(rows.length / 24));
    return rows
      .filter((_, i) => i % step === 0 || i === rows.length - 1)
      .map(r => ({
        month: r.month,
        Balance: Math.round(r.balance),
        'Principal Paid': Math.round(r.totalPrincipal),
        'Interest Paid': Math.round(r.totalInterest),
      }));
  }, [best, profile]);

  const monthlyIncome = profile ? profile.annualIncome / 12 : 0;
  const newEmi = best?.monthlyPayment ?? 0;
  const dti = monthlyIncome > 0 ? ((profile!.existingMonthlyDebt + newEmi) / monthlyIncome) * 100 : 0;
  const disposable = Math.max(0, monthlyIncome - (profile?.monthlyExpenses ?? 0) - (profile?.existingMonthlyDebt ?? 0) - newEmi);

  // Eligibility score 0–100
  const creditScoreVal = useMemo(() => {
    const map: Record<string, number> = {
      'Excellent (800+)': 95, 'Very Good (740–799)': 82, 'Good (670–739)': 68,
      'Fair (580–669)': 45, 'Poor (<580)': 25, 'Not Sure': 55,
    };
    return map[profile?.creditScoreRange ?? 'Not Sure'] ?? 55;
  }, [profile]);
  const eligibilityScore = Math.round(
    Math.max(0, Math.min(100, creditScoreVal * 0.6 + Math.max(0, 40 - dti) * 1.0))
  );
  const eligibilityLabel =
    eligibilityScore >= 75 ? 'Excellent' : eligibilityScore >= 55 ? 'Good' : eligibilityScore >= 35 ? 'Fair' : 'Needs Work';
  const eligibilityColor =
    eligibilityScore >= 75 ? '#10b981' : eligibilityScore >= 55 ? '#6366f1' : eligibilityScore >= 35 ? '#f59e0b' : '#ef4444';

  const budgetData = useMemo(() => {
    if (!profile) return [];
    return [
      { name: 'Living Expenses', value: Math.round(profile.monthlyExpenses) },
      { name: 'Existing Debt', value: Math.round(profile.existingMonthlyDebt) },
      { name: 'New Loan EMI', value: Math.round(newEmi) },
      { name: 'Disposable', value: Math.round(disposable) },
    ].filter(d => d.value > 0);
  }, [profile, newEmi, disposable]);

  const paymentBreakdown = useMemo(() => {
    if (!best || !profile) return [];
    const amount = Math.min(Math.max(profile.desiredAmount, best.loan.minAmount), best.loan.maxAmount);
    return [
      { name: 'Principal', value: Math.round(amount) },
      { name: 'Interest', value: Math.round(best.totalInterest) },
    ];
  }, [best, profile]);

  const comparisonData = useMemo(
    () => matches.slice(0, 5).map(m => ({
      name: m.loan.bank,
      'Monthly Payment': Math.round(m.monthlyPayment),
      'Total Interest': Math.round(m.totalInterest),
    })),
    [matches]
  );

  // ── Loading / guards ────────────────────────────────────────────────────────
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-[var(--primary)]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-[var(--muted-foreground)]">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
        <div className="text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-[var(--foreground)] font-semibold mb-2">{error}</p>
          <Link href="/loans/compare" className="text-[var(--primary)] text-sm hover:underline">← Back to loans</Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-3">📋</p>
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">Complete your profile first</h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">We need a few financial details to build your personalized loan dashboard.</p>
          <Link href="/loans/profile" className="inline-block rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            Set up profile →
          </Link>
        </div>
      </div>
    );
  }

  const age = profile.dateOfBirth
    ? Math.floor((Date.now() - new Date(profile.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null;

  // Profile completeness across key fields
  const fullAddress = [profile.addressLine1, profile.city, profile.state, profile.postalCode]
    .filter(Boolean).join(', ');
  const kycComplete = Boolean(profile.govIdType && profile.govIdNumber);
  const completenessChecks: Array<[string, boolean]> = [
    ['phone', Boolean(profile.phone)],
    ['date of birth', Boolean(profile.dateOfBirth)],
    ['address', Boolean(profile.addressLine1 && profile.city)],
    ['ID document', kycComplete],
    ['employer', Boolean(profile.employerName)],
    ['income', profile.annualIncome > 0],
    ['profile photo', Boolean(account?.avatar)],
  ];
  const filledCount = completenessChecks.filter(([, ok]) => ok).length;
  const completeness = Math.round((filledCount / completenessChecks.length) * 100);
  const missingFields = completenessChecks.filter(([, ok]) => !ok).map(([label]) => label);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 px-4 py-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {account?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={account.avatar} alt="Profile" className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/30" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white ring-2 ring-white/30">
                {account?.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm text-white/70">Welcome back,</p>
              <h1 className="text-2xl font-extrabold text-white">{account?.name}</h1>
              <p className="text-xs text-white/60 mt-0.5">
                {account?.memberSince && `Member since ${new Date(account.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/loans/profile" className="rounded-xl bg-white text-indigo-700 px-4 py-2 text-sm font-semibold hover:bg-white/90 transition-colors">
              ✏️ Edit Profile
            </Link>
            <Link href="/loans/compare" className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors">
              Browse Loans
            </Link>
            <button
              onClick={async () => { await logout(); router.replace('/loans'); }}
              className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        {/* Summary metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon="💰" label="Recommended Amount" value={fmt(profile.desiredAmount)} sub={`${profile.loanPurpose}`} accent="text-[var(--primary)]" />
          <MetricCard icon="📅" label="Est. Monthly Payment" value={best ? fmt(best.monthlyPayment) : '—'} sub={best ? `${best.offeredRate}% APR · ${profile.desiredTermMonths} mo` : ''} accent="text-emerald-600 dark:text-emerald-400" />
          <MetricCard icon="📊" label="Debt-to-Income" value={`${dti.toFixed(1)}%`} sub={dti < 36 ? 'Healthy' : dti < 43 ? 'Moderate' : 'High'} accent={dti < 36 ? 'text-emerald-600 dark:text-emerald-400' : dti < 43 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'} />
          <MetricCard icon="✅" label="Eligibility Score" value={`${eligibilityScore}/100`} sub={eligibilityLabel} accent="text-[var(--primary)]" />
        </div>

        {/* My Applications */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 font-semibold text-[var(--foreground)] text-sm">
              <span>📄</span> My Applications
              <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[11px] text-[var(--muted-foreground)]">{applications.length}</span>
            </h3>
            <Link href="/loans/compare" className="text-xs text-[var(--primary)] hover:underline">+ Apply to more</Link>
          </div>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">🗂️</p>
              <p className="text-sm text-[var(--muted-foreground)] mb-3">You haven&apos;t applied to any loans yet.</p>
              <Link href="/loans/compare" className="inline-block rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white hover:opacity-90">
                Browse Loans →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {applications.map(app => (
                <div key={app._id} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted)] text-lg shrink-0">{app.flag}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[var(--foreground)] truncate">{app.bank}</p>
                      <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 text-[9px] font-bold uppercase shrink-0">{app.status.replace('_', ' ')}</span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] truncate">{app.productName}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                      {app.currencySymbol}{app.amount?.toLocaleString()} · {app.offeredRate}% · {app.currencySymbol}{app.monthlyPayment?.toLocaleString()}/mo
                    </p>
                  </div>
                  <button
                    onClick={() => removeApplication(app.loanId)}
                    title="Remove application"
                    className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Profile + Account */}
          <div className="space-y-6">
            {/* Profile completeness */}
            <Card title="Profile Completeness" icon="📈">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-2.5 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all" style={{ width: `${completeness}%` }} />
                </div>
                <span className="text-sm font-bold text-[var(--foreground)]">{completeness}%</span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                {completeness >= 100 ? 'All set — your profile is complete.' : `Add ${missingFields.slice(0, 2).join(', ')}${missingFields.length > 2 ? '…' : ''} to improve your matches.`}
              </p>
              {completeness < 100 && (
                <Link href="/loans/profile" className="mt-3 inline-block text-xs font-semibold text-[var(--primary)] hover:underline">Complete profile →</Link>
              )}
            </Card>

            {/* Profile card */}
            <Card title="Loan Profile" icon="👤" action={<Link href="/loans/profile" className="text-xs text-[var(--primary)] hover:underline">Edit</Link>}>
              <dl className="space-y-3">
                <Row label="Country" value={`${profile.country}`} />
                {age !== null && <Row label="Age" value={`${age} years`} />}
                {profile.nationality && <Row label="Nationality" value={profile.nationality} />}
                {profile.phone && <Row label="Phone" value={profile.phone} />}
                {profile.maritalStatus && <Row label="Marital Status" value={profile.maritalStatus} />}
                <Row label="Employment" value={profile.employmentStatus} />
                {profile.employerName && <Row label="Employer" value={profile.employerName} />}
                <Row label="Annual Income" value={fmt(profile.annualIncome)} />
                <Row label="Monthly Expenses" value={fmt(profile.monthlyExpenses)} />
                <Row label="Existing Debt" value={`${fmt(profile.existingMonthlyDebt)}/mo`} />
                <Row label="Credit Score" value={profile.creditScoreRange} badge />
              </dl>
            </Card>

            {/* Address & documents */}
            <Card title="Address & Identity" icon="🪪" action={<Link href="/loans/profile" className="text-xs text-[var(--primary)] hover:underline">Edit</Link>}>
              <dl className="space-y-3">
                {fullAddress ? <Row label="Address" value={fullAddress} /> : <Row label="Address" value="Not provided" />}
                {profile.housingStatus && <Row label="Housing" value={profile.housingStatus} />}
                <Row label="ID Document" value={profile.govIdType || 'Not provided'} />
                {profile.govIdNumber && <Row label="ID Number" value={maskId(profile.govIdNumber)} />}
                <div className="pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <dt className="text-xs text-[var(--muted-foreground)]">KYC Verification</dt>
                    <dd className={`text-xs font-semibold rounded-full px-2 py-0.5 ${kycComplete ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30' : 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30'}`}>
                      {kycComplete ? '✓ Documents on file' : '⚠ Incomplete'}
                    </dd>
                  </div>
                </div>
              </dl>
            </Card>

            {/* Account card */}
            <Card title="Account" icon="⚙️">
              <dl className="space-y-3">
                <Row label="Name" value={account?.name ?? ''} />
                <Row label="Email" value={account?.email ?? ''} />
                <Row label="Member Since" value={account?.memberSince ? new Date(account.memberSince).toLocaleDateString() : '—'} />
                <Row label="Profile Status" value="Complete ✓" />
              </dl>
              <button
                onClick={async () => { await logout(); router.replace('/loans'); }}
                className="mt-4 w-full rounded-xl border border-[var(--border)] py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                Sign Out
              </button>
            </Card>

            {/* Eligibility radial */}
            <Card title="Eligibility Analysis" icon="🎯">
              <ResponsiveContainer width="100%" height={180}>
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: 'Score', value: eligibilityScore, fill: eligibilityColor }]} startAngle={90} endAngle={-270}>
                  <RadialBar background dataKey="value" cornerRadius={12} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="text-center -mt-28 mb-16 pointer-events-none">
                <p className="text-3xl font-extrabold" style={{ color: eligibilityColor }}>{eligibilityScore}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{eligibilityLabel}</p>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] text-center">
                Based on your {profile.creditScoreRange.split(' ')[0].toLowerCase()} credit and {dti.toFixed(0)}% debt-to-income ratio.
              </p>
            </Card>
          </div>

          {/* RIGHT: Loan plan + graphs (span 2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Best matched plan */}
            {best && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{best.loan.flag}</span>
                    <div>
                      <p className="text-white font-bold">{best.loan.bank} — {best.loan.productName}</p>
                      <p className="text-xs text-white/70">Your best-matched plan · {best.loan.country}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                    Match {best.matchScore}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[var(--border)]">
                  <PlanStat label="Your APR" value={`${best.offeredRate}%`} sub={`Range ${best.loan.minRate}–${best.loan.maxRate}%`} />
                  <PlanStat label="Monthly" value={fmt(best.monthlyPayment)} sub={`${profile.desiredTermMonths} months`} />
                  <PlanStat label="Total Interest" value={fmt(best.totalInterest)} sub="Over full term" />
                  <PlanStat label="Total Cost" value={fmt(best.totalCost)} sub="Principal + interest" />
                </div>
                <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-3">
                  <div className="flex flex-wrap gap-2">
                    {best.loan.features.slice(0, 2).map(f => (
                      <span key={f} className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs text-[var(--muted-foreground)]">✓ {f}</span>
                    ))}
                  </div>
                  <Link href="/loans/compare" className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                    Apply for this plan →
                  </Link>
                </div>
              </div>
            )}

            {/* Amortization */}
            <Card title="Loan Balance & Payoff Over Time" icon="📉">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={amortization}>
                  <defs>
                    <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} label={{ value: 'Month', position: 'insideBottom', offset: -3, fontSize: 11 }} />
                  <YAxis tickFormatter={v => `${cur.symbol}${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => fmt(Number(v))} />
                  <Legend />
                  <Area type="monotone" dataKey="Balance" stroke="#6366f1" fill="url(#balGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Interest Paid" stroke="#ec4899" fill="url(#intGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Two pies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card title="Payment Breakdown" icon="🥧">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={paymentBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2}>
                      {paymentBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(Number(v))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Monthly Budget Allocation" icon="💵">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={budgetData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                      {budgetData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `${fmt(Number(v))}/mo`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Comparison bar */}
            <Card title="Top Matched Lenders — Cost Comparison" icon="🏦">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={comparisonData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tickFormatter={v => `${cur.symbol}${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip formatter={(v) => fmt(Number(v))} />
                  <Legend />
                  <Bar dataKey="Monthly Payment" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="Total Interest" fill="#ec4899" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Small presentational helpers ────────────────────────────────────────────
function MetricCard({ icon, label, value, sub, accent }: { icon: string; label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <p className="text-xs text-[var(--muted-foreground)] font-medium">{label}</p>
      </div>
      <p className={`text-xl font-extrabold ${accent}`}>{value}</p>
      {sub && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{sub}</p>}
    </div>
  );
}

function Card({ title, icon, children, action }: { title: string; icon: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 font-semibold text-[var(--foreground)] text-sm">
          <span>{icon}</span> {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-[var(--muted-foreground)]">{label}</dt>
      {badge ? (
        <dd className="text-xs font-semibold text-[var(--primary)] bg-indigo-50 dark:bg-indigo-950/40 rounded-full px-2 py-0.5">{value}</dd>
      ) : (
        <dd className="text-sm font-medium text-[var(--foreground)] text-right">{value}</dd>
      )}
    </div>
  );
}

function PlanStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="px-4 py-3 text-center">
      <p className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)] mb-1">{label}</p>
      <p className="text-base font-bold text-[var(--foreground)]">{value}</p>
      <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{sub}</p>
    </div>
  );
}
