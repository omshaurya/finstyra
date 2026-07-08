"use client";
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/loans/AuthModal';
import { INVESTMENT_PRODUCTS, INVESTMENT_CATEGORIES, INVESTMENT_CATEGORY_COLORS, INVESTMENT_CATEGORY_INFO, REGION_LABELS, type InvestmentRegion } from '@/lib/investmentData';

export default function InvestmentsLanding() {
  const { user } = useAuth();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [pendingQuery, setPendingQuery] = useState('');

  const categoryStats = useMemo(() =>
    INVESTMENT_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
      const prods = INVESTMENT_PRODUCTS.filter(p => p.category === cat.id);
      const maxReturn = prods.length ? Math.max(...prods.map(p => p.expectedReturnMax)) : 0;
      return { ...cat, count: prods.length, maxReturn };
    }), []);

  // Group unique providers by region (dedup provider names per region).
  const providersByRegion = useMemo(() => {
    const regions: InvestmentRegion[] = ['us', 'europe', 'asia', 'global'];
    return regions.map(region => {
      const seen = new Map<string, { flag: string; country: string; count: number }>();
      for (const p of INVESTMENT_PRODUCTS) {
        if (p.region !== region) continue;
        const cur = seen.get(p.provider) ?? { flag: p.flag, country: p.country, count: 0 };
        cur.count += 1;
        seen.set(p.provider, cur);
      }
      return { region, providers: [...seen.entries()].map(([name, v]) => ({ name, ...v })) };
    }).filter(g => g.providers.length > 0);
  }, []);

  const getStarted = (query = '') => {
    const dest = `/investments/compare${query ? `?${query}` : ''}`;
    if (user) router.push(dest);
    else { setPendingQuery(query); setShowAuth(true); }
  };
  const onAuth = () => { setShowAuth(false); router.push(`/investments/compare${pendingQuery ? `?${pendingQuery}` : ''}`); };

  const totalProviders = new Set(INVESTMENT_PRODUCTS.map(p => p.provider)).size;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 py-20 px-4">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-white blur-3xl" /><div className="absolute bottom-0 right-10 h-56 w-56 rounded-full bg-purple-300 blur-2xl" /></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs text-white/90 font-medium mb-5">📈 Grow your wealth — US & Europe</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">Invest Smarter,<br />Grow Faster</h1>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Compare {totalProviders}+ top brokers and funds across index funds, robo-advisors, stocks, bonds and retirement accounts. Project your growth and start investing.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => getStarted()} className="rounded-xl bg-white px-7 py-3 text-sm font-bold text-indigo-700 shadow-lg hover:bg-white/90">Start Investing →</button>
            <button onClick={() => getStarted()} className="rounded-xl bg-white/10 border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/20">Browse Products</button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-10">{[{ n: `${INVESTMENT_PRODUCTS.length}+`, l: 'Products' }, { n: `${totalProviders}`, l: 'Providers' }, { n: '5', l: 'Categories' }, { n: '0%', l: 'Commission' }].map(s => (<div key={s.l} className="text-center"><p className="text-2xl font-extrabold text-white">{s.n}</p><p className="text-xs text-white/70">{s.l}</p></div>))}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-10"><h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-2">How do you want to invest?</h2><p className="text-[var(--muted-foreground)]">Pick a strategy to get matched with the best products.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryStats.map(cat => (
            <div key={cat.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${INVESTMENT_CATEGORY_COLORS[cat.id]} text-2xl shadow-sm mb-4`}>{cat.icon}</div>
              <h3 className="font-bold text-[var(--foreground)] mb-1">{cat.label}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4 flex-1">{INVESTMENT_CATEGORY_INFO[cat.id]}</p>
              <div className="flex items-center justify-between mb-4"><div><p className="text-[11px] text-[var(--muted-foreground)]">Up to</p><p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{cat.maxReturn}%<span className="text-xs font-medium text-[var(--muted-foreground)]"> /yr</span></p></div><span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs text-[var(--muted-foreground)]">{cat.count} products</span></div>
              <button onClick={() => getStarted(`type=${cat.id}`)} className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2.5 text-sm font-semibold text-white hover:opacity-90">Explore →</button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--muted)]/40 border-y border-[var(--border)] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10"><h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-2">Top Providers Worldwide</h2><p className="text-[var(--muted-foreground)]">Leading brokers, exchanges and fund managers across the globe.</p></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
            {providersByRegion.map(group => (
              <div key={group.region}>
                <h3 className="flex items-center gap-2 font-bold text-[var(--foreground)] mb-4">{REGION_LABELS[group.region]}</h3>
                <div className="space-y-3">{group.providers.map(p => <ProviderRow key={group.region + p.name} flag={p.flag} name={p.name} country={p.country} count={p.count} onEnquire={() => getStarted(`region=${group.region}`)} />)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center mb-10"><h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mb-2">How it works</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">{[{ n: 1, icon: '🎯', t: 'Set Your Goals', d: 'Create a free account and tell us your goals, risk appetite and timeline.' }, { n: 2, icon: '📊', t: 'Compare & Project', d: 'See matching products with fees, expected returns and growth projections.' }, { n: 3, icon: '🚀', t: 'Open & Track', d: 'Open an account in one click and track your plan from your dashboard.' }].map(s => (<div key={s.n} className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl mb-4">{s.icon}</div><div className="absolute top-4 right-4 text-3xl font-extrabold text-[var(--muted)]">{s.n}</div><h3 className="font-bold text-[var(--foreground)] mb-2">{s.t}</h3><p className="text-sm text-[var(--muted-foreground)]">{s.d}</p></div>))}</div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-12 text-center"><h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Ready to grow your money?</h2><p className="text-white/80 mb-6 max-w-xl mx-auto">Compare investment products across the US and Europe — free, no obligation.</p><button onClick={() => getStarted()} className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-indigo-700 shadow-lg hover:bg-white/90">{user ? 'Explore Products Now →' : 'Get Started — Free →'}</button></div>
      </section>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={onAuth} loanName="investment options" />}
    </div>
  );
}

function ProviderRow({ flag, name, country, count, onEnquire }: { flag: string; name: string; country: string; count: number; onEnquire: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted)] text-lg shrink-0">{flag}</div>
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[var(--foreground)] truncate">{name}</p><p className="text-xs text-[var(--muted-foreground)]">{country} · {count} product{count > 1 ? 's' : ''}</p></div>
      <button onClick={onEnquire} className="shrink-0 rounded-xl border border-indigo-500 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white transition-colors">Explore</button>
    </div>
  );
}
