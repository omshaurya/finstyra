"use client";
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/loans/AuthModal';
import { LOANS, LOAN_CATEGORIES, CATEGORY_COLORS } from '@/lib/loanData';

type Cat = 'personal' | 'home' | 'auto' | 'business' | 'student';

const CATEGORY_INFO: Record<Cat, { blurb: string }> = {
  personal: { blurb: 'Debt consolidation, weddings, medical bills or any personal need.' },
  home: { blurb: 'Mortgages and home-improvement loans with the lowest long-term rates.' },
  auto: { blurb: 'New & used vehicle finance with fast, same-day approvals.' },
  business: { blurb: 'Working capital, expansion and equipment financing for your company.' },
  student: { blurb: 'Tuition financing and student-loan refinancing at competitive rates.' },
};

export default function LoansLanding() {
  const { user } = useAuth();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string>('');

  // Categories with lowest available rate + product count
  const categoryStats = useMemo(() => {
    return LOAN_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
      const loans = LOANS.filter(l => l.category === cat.id);
      const minRate = loans.length ? Math.min(...loans.map(l => l.minRate)) : 0;
      return { ...cat, count: loans.length, minRate };
    });
  }, []);

  // Banks grouped by country
  const banksByCountry = useMemo(() => {
    const map = new Map<string, { flag: string; region: 'us' | 'europe'; banks: Map<string, { count: number; minRate: number }> }>();
    for (const l of LOANS) {
      if (!map.has(l.country)) map.set(l.country, { flag: l.flag, region: l.region, banks: new Map() });
      const entry = map.get(l.country)!;
      const bank = entry.banks.get(l.bank) ?? { count: 0, minRate: Infinity };
      bank.count += 1;
      bank.minRate = Math.min(bank.minRate, l.minRate);
      entry.banks.set(l.bank, bank);
    }
    return map;
  }, []);

  const usCountries = [...banksByCountry.entries()].filter(([, v]) => v.region === 'us');
  const euCountries = [...banksByCountry.entries()].filter(([, v]) => v.region === 'europe');

  // Enquire / Get Quote → auth (if needed) → marketplace
  const getQuote = (query = '') => {
    const dest = `/loans/compare${query ? `?${query}` : ''}`;
    if (user) {
      router.push(dest);
    } else {
      setPendingQuery(query);
      setShowAuth(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    router.push(`/loans/compare${pendingQuery ? `?${pendingQuery}` : ''}`);
  };

  const totalBanks = new Set(LOANS.map(l => l.bank)).size;
  const totalCountries = banksByCountry.size;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 py-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-10 h-56 w-56 rounded-full bg-purple-300 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs text-white/90 font-medium mb-5">
            🏦 Trusted across the US & Europe
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Find & Compare the Best<br />Loans in Minutes
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Get free quotes from {totalBanks}+ top banks across {totalCountries} countries.
            Compare rates side-by-side, then apply — all in one place, at zero cost.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => getQuote()}
              className="rounded-xl bg-white px-7 py-3 text-sm font-bold text-indigo-700 shadow-lg hover:bg-white/90 transition-colors"
            >
              Get Your Free Quote →
            </button>
            <button
              onClick={() => getQuote()}
              className="rounded-xl bg-white/10 border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Browse All Loans
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              { n: `${LOANS.length}+`, l: 'Loan Products' },
              { n: `${totalBanks}`, l: 'Partner Banks' },
              { n: `${totalCountries}`, l: 'Countries' },
              { n: '0%', l: 'Commission' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-2xl font-extrabold text-white">{s.n}</p>
                <p className="text-xs text-white/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Types */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-2">What type of loan do you need?</h2>
          <p className="text-[var(--muted-foreground)]">Choose a category to get personalized quotes from matching lenders.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryStats.map(cat => (
            <div key={cat.id} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${CATEGORY_COLORS[cat.id]} text-2xl shadow-sm mb-4`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-[var(--foreground)] mb-1">{cat.label} Loans</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4 flex-1">{CATEGORY_INFO[cat.id as Cat].blurb}</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] text-[var(--muted-foreground)]">From</p>
                  <p className="text-lg font-extrabold text-[var(--primary)]">{cat.minRate}% <span className="text-xs font-medium text-[var(--muted-foreground)]">APR</span></p>
                </div>
                <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs text-[var(--muted-foreground)]">{cat.count} lenders</span>
              </div>
              <button
                onClick={() => getQuote(`type=${cat.id}`)}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Get Quote →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Banks by country */}
      <section className="bg-[var(--muted)]/40 border-y border-[var(--border)] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-2">Partner Banks by Country</h2>
            <p className="text-[var(--muted-foreground)]">Compare offers from leading lenders across the US and Europe.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* US */}
            <div>
              <h3 className="flex items-center gap-2 font-bold text-[var(--foreground)] mb-4">🇺🇸 United States</h3>
              <div className="space-y-3">
                {usCountries.flatMap(([country, v]) =>
                  [...v.banks.entries()].map(([bank, stats]) => (
                    <BankRow key={country + bank} flag={v.flag} bank={bank} country={country} count={stats.count} minRate={stats.minRate} onEnquire={() => getQuote(`region=us`)} />
                  ))
                )}
              </div>
            </div>

            {/* Europe */}
            <div>
              <h3 className="flex items-center gap-2 font-bold text-[var(--foreground)] mb-4">🌍 Europe</h3>
              <div className="space-y-3">
                {euCountries.flatMap(([country, v]) =>
                  [...v.banks.entries()].map(([bank, stats]) => (
                    <BankRow key={country + bank} flag={v.flag} bank={bank} country={country} count={stats.count} minRate={stats.minRate} onEnquire={() => getQuote(`region=europe`)} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-2">How it works</h2>
          <p className="text-[var(--muted-foreground)]">Three simple steps to your best loan.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { n: 1, icon: '💬', t: 'Get a Free Quote', d: 'Tell us what you need and create your free account — no impact on your credit score.' },
            { n: 2, icon: '📊', t: 'Compare Offers', d: 'See matching loans side-by-side with real rates, fees and monthly payments.' },
            { n: 3, icon: '🚀', t: 'Apply & Track', d: 'Apply in one click and track every application from your personal dashboard.' },
          ].map(s => (
            <div key={s.n} className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl mb-4">{s.icon}</div>
              <div className="absolute top-4 right-4 text-3xl font-extrabold text-[var(--muted)]">{s.n}</div>
              <h3 className="font-bold text-[var(--foreground)] mb-2">{s.t}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Ready to find your best loan?</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">Join thousands comparing loans across the US and Europe. It&apos;s free, fast, and there&apos;s no obligation.</p>
          <button
            onClick={() => getQuote()}
            className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-indigo-700 shadow-lg hover:bg-white/90 transition-colors"
          >
            {user ? 'Compare Loans Now →' : 'Get Started — It’s Free →'}
          </button>
        </div>
      </section>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
          loanName="loan quotes"
        />
      )}
    </div>
  );
}

function BankRow({ flag, bank, country, count, minRate, onEnquire }: {
  flag: string; bank: string; country: string; count: number; minRate: number; onEnquire: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted)] text-lg shrink-0">{flag}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--foreground)] truncate">{bank}</p>
        <p className="text-xs text-[var(--muted-foreground)]">{country} · {count} product{count > 1 ? 's' : ''} · from {minRate}% APR</p>
      </div>
      <button
        onClick={onEnquire}
        className="shrink-0 rounded-xl border border-[var(--primary)] px-3.5 py-1.5 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
      >
        Enquire
      </button>
    </div>
  );
}
