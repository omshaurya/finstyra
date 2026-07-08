"use client";
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/loans/AuthModal';
import { INSURANCE_PLANS, INSURANCE_CATEGORIES, INSURANCE_CATEGORY_COLORS, INSURANCE_CATEGORY_INFO } from '@/lib/insuranceData';

export default function InsuranceLanding() {
  const { user } = useAuth();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [pendingQuery, setPendingQuery] = useState('');

  const categoryStats = useMemo(() =>
    INSURANCE_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
      const plans = INSURANCE_PLANS.filter(p => p.category === cat.id);
      const minPremium = plans.length ? Math.min(...plans.map(p => p.minPremium)) : 0;
      return { ...cat, count: plans.length, minPremium, symbol: plans[0]?.currencySymbol ?? '$' };
    }), []);

  const providersByCountry = useMemo(() => {
    const map = new Map<string, { flag: string; region: 'us' | 'europe'; providers: Map<string, number> }>();
    for (const p of INSURANCE_PLANS) {
      if (!map.has(p.country)) map.set(p.country, { flag: p.flag, region: p.region, providers: new Map() });
      const e = map.get(p.country)!;
      e.providers.set(p.provider, (e.providers.get(p.provider) ?? 0) + 1);
    }
    return map;
  }, []);
  const us = [...providersByCountry.entries()].filter(([, v]) => v.region === 'us');
  const eu = [...providersByCountry.entries()].filter(([, v]) => v.region === 'europe');

  const getQuote = (query = '') => {
    const dest = `/insurance/compare${query ? `?${query}` : ''}`;
    if (user) router.push(dest);
    else { setPendingQuery(query); setShowAuth(true); }
  };
  const onAuth = () => { setShowAuth(false); router.push(`/insurance/compare${pendingQuery ? `?${pendingQuery}` : ''}`); };

  const totalProviders = new Set(INSURANCE_PLANS.map(p => p.provider)).size;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 py-20 px-4">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-white blur-3xl" /><div className="absolute bottom-0 right-10 h-56 w-56 rounded-full bg-teal-300 blur-2xl" /></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs text-white/90 font-medium mb-5">🛡️ Protect what matters — US & Europe</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">Compare Insurance<br />& Save Hundreds</h1>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Free quotes from {totalProviders}+ trusted insurers across health, life, auto, home and travel. Compare cover side-by-side and apply in minutes.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => getQuote()} className="rounded-xl bg-white px-7 py-3 text-sm font-bold text-emerald-700 shadow-lg hover:bg-white/90">Get Free Quotes →</button>
            <button onClick={() => getQuote()} className="rounded-xl bg-white/10 border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/20">Browse All Plans</button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[{ n: `${INSURANCE_PLANS.length}+`, l: 'Plans' }, { n: `${totalProviders}`, l: 'Insurers' }, { n: '5', l: 'Categories' }, { n: '0%', l: 'Commission' }].map(s => (
              <div key={s.l} className="text-center"><p className="text-2xl font-extrabold text-white">{s.n}</p><p className="text-xs text-white/70">{s.l}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-10"><h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-2">What do you want to protect?</h2><p className="text-[var(--muted-foreground)]">Pick a cover type to get matched with the best insurers.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryStats.map(cat => (
            <div key={cat.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${INSURANCE_CATEGORY_COLORS[cat.id]} text-2xl shadow-sm mb-4`}>{cat.icon}</div>
              <h3 className="font-bold text-[var(--foreground)] mb-1">{cat.label} Insurance</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4 flex-1">{INSURANCE_CATEGORY_INFO[cat.id]}</p>
              <div className="flex items-center justify-between mb-4">
                <div><p className="text-[11px] text-[var(--muted-foreground)]">From</p><p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{cat.symbol}{cat.minPremium}<span className="text-xs font-medium text-[var(--muted-foreground)]">/mo</span></p></div>
                <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs text-[var(--muted-foreground)]">{cat.count} insurers</span>
              </div>
              <button onClick={() => getQuote(`type=${cat.id}`)} className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-sm font-semibold text-white hover:opacity-90">Get Quote →</button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--muted)]/40 border-y border-[var(--border)] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10"><h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-2">Trusted Insurers by Country</h2><p className="text-[var(--muted-foreground)]">Leading providers across the US and Europe.</p></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div><h3 className="flex items-center gap-2 font-bold text-[var(--foreground)] mb-4">🇺🇸 United States</h3><div className="space-y-3">
              {us.flatMap(([country, v]) => [...v.providers.entries()].map(([prov, count]) => <ProviderRow key={country + prov} flag={v.flag} name={prov} country={country} count={count} onEnquire={() => getQuote('region=us')} />))}
            </div></div>
            <div><h3 className="flex items-center gap-2 font-bold text-[var(--foreground)] mb-4">🌍 Europe</h3><div className="space-y-3">
              {eu.flatMap(([country, v]) => [...v.providers.entries()].map(([prov, count]) => <ProviderRow key={country + prov} flag={v.flag} name={prov} country={country} count={count} onEnquire={() => getQuote('region=europe')} />))}
            </div></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center mb-10"><h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-2">How it works</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[{ n: 1, icon: '💬', t: 'Tell Us Your Needs', d: 'Create a free account and share a few details — no impact on anything.' }, { n: 2, icon: '📊', t: 'Compare Quotes', d: 'See matching plans with real premiums, coverage and deductibles side-by-side.' }, { n: 3, icon: '🚀', t: 'Apply & Track', d: 'Apply in one click and manage every policy from your dashboard.' }].map(s => (
            <div key={s.n} className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl mb-4">{s.icon}</div><div className="absolute top-4 right-4 text-3xl font-extrabold text-[var(--muted)]">{s.n}</div><h3 className="font-bold text-[var(--foreground)] mb-2">{s.t}</h3><p className="text-sm text-[var(--muted-foreground)]">{s.d}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 px-8 py-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Ready to get covered?</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">Compare insurance across the US and Europe — free, fast, no obligation.</p>
          <button onClick={() => getQuote()} className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-emerald-700 shadow-lg hover:bg-white/90">{user ? 'Compare Plans Now →' : 'Get Started — Free →'}</button>
        </div>
      </section>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={onAuth} loanName="insurance quotes" />}
    </div>
  );
}

function ProviderRow({ flag, name, country, count, onEnquire }: { flag: string; name: string; country: string; count: number; onEnquire: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted)] text-lg shrink-0">{flag}</div>
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[var(--foreground)] truncate">{name}</p><p className="text-xs text-[var(--muted-foreground)]">{country} · {count} plan{count > 1 ? 's' : ''}</p></div>
      <button onClick={onEnquire} className="shrink-0 rounded-xl border border-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors">Enquire</button>
    </div>
  );
}
