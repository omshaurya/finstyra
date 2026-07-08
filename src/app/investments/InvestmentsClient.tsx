"use client";
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/loans/AuthModal';
import InvestmentProfileModal, { type InvestmentProfileData } from '@/components/investments/InvestmentProfileModal';
import { INVESTMENT_PRODUCTS, INVESTMENT_CATEGORIES, INVESTMENT_CATEGORY_COLORS, INVESTMENT_CATEGORY_IDS, INVESTMENT_REGIONS, estimatedReturn, projectValue, type InvestmentProduct, type InvestmentCategory, type InvestmentRegion } from '@/lib/investmentData';

type Category = 'all' | InvestmentCategory;
type Region = 'all' | InvestmentRegion;
type Sort = 'return' | 'fee' | 'rating';

const RISK_COLOR: Record<string, string> = { Low: 'text-emerald-600 dark:text-emerald-400', Medium: 'text-amber-600 dark:text-amber-400', High: 'text-red-600 dark:text-red-400' };

function Stars({ rating }: { rating: number }) {
  return <span className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map(i => (<svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-[var(--border)]'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</span>;
}

function ProductCard({ product, onApply, applying, compared, onToggle }: { product: InvestmentProduct; onApply: (p: InvestmentProduct) => void; applying?: boolean; compared: boolean; onToggle: (id: string) => void }) {
  const color = INVESTMENT_CATEGORY_COLORS[product.category];
  return (
    <div className={`relative rounded-2xl border bg-[var(--card)] transition-all hover:shadow-lg hover:-translate-y-0.5 overflow-hidden flex flex-col ${compared ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-[var(--border)]'}`}>
      <div className={`h-1 w-full bg-gradient-to-r ${color}`} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5"><div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-lg shadow-sm shrink-0`}>{product.flag}</div><div><p className="font-bold text-[var(--foreground)] text-sm leading-tight">{product.provider}</p><p className="text-[11px] text-[var(--muted-foreground)]">{product.country}</p></div></div>
          {product.badge && <span className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">{product.badge}</span>}
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mb-1">{product.productName}</p>
        {product.market && <p className="text-[10px] text-[var(--muted-foreground)] mb-3 flex items-center gap-1"><span className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-medium">{product.market}</span></p>}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-xl bg-[var(--muted)] p-2.5 text-center"><p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Return</p><p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{product.expectedReturnMin}–{product.expectedReturnMax}%</p></div>
          <div className="rounded-xl bg-[var(--muted)] p-2.5 text-center"><p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Fee</p><p className="text-xs font-bold text-[var(--foreground)]">{product.annualFee}%</p></div>
          <div className="rounded-xl bg-[var(--muted)] p-2.5 text-center"><p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Risk</p><p className={`text-xs font-bold ${RISK_COLOR[product.riskLevel]}`}>{product.riskLevel}</p></div>
        </div>
        <ul className="space-y-1.5 mb-4 flex-1">{product.features.slice(0, 3).map(f => <li key={f} className="flex items-start gap-2 text-xs text-[var(--muted-foreground)]"><svg className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{f}</li>)}</ul>
        <div className="flex items-center gap-3 mb-3 text-xs text-[var(--muted-foreground)]"><div className="flex items-center gap-1"><Stars rating={product.rating} /><span className="font-semibold text-[var(--foreground)]">{product.rating}</span><span>({product.reviewCount.toLocaleString()})</span></div><span className="text-[var(--border)]">·</span><span>min {product.currencySymbol}{product.minInvestment}</span></div>
        <div className="flex items-center gap-2">
          <button onClick={() => onToggle(product.id)} className={`rounded-xl border px-3 py-2 text-xs font-medium ${compared ? 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-indigo-500 hover:text-indigo-600'}`}>{compared ? 'Added' : 'Compare'}</button>
          <button onClick={() => onApply(product)} disabled={applying} className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">{applying ? 'Opening…' : 'Open Account →'}</button>
        </div>
      </div>
    </div>
  );
}

export default function InvestmentsClient() {
  const { user } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState<Category>('all');
  const [region, setRegion] = useState<Region>('all');
  const [sort, setSort] = useState<Sort>('return');

  // Apply ?type= / ?region= after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('type');
    if (t && (INVESTMENT_CATEGORY_IDS as string[]).includes(t)) setCategory(t as Category);
    const r = params.get('region');
    if (r === 'us' || r === 'europe' || r === 'asia' || r === 'global') setRegion(r);
  }, []);
  const [compared, setCompared] = useState<string[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [applyTarget, setApplyTarget] = useState<InvestmentProduct | null>(null);
  const [applied, setApplied] = useState<string[]>([]);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [dbProfile, setDbProfile] = useState<{ riskTolerance: string; initialInvestment: number; monthlyContribution: number; timeHorizonYears: number } | null>(null);

  useEffect(() => {
    if (!user) { setApplied([]); setHasProfile(false); setDbProfile(null); return; }
    fetch('/api/user/investment/applications').then(r => r.ok ? r.json() : { applications: [] }).then(d => setApplied((d.applications ?? []).map((a: { productId: string }) => a.productId))).catch(() => {});
    fetch('/api/user/investment/profile').then(r => r.ok ? r.json() : null).then(d => { if (d?.profile) { setHasProfile(true); setDbProfile({ riskTolerance: d.profile.riskTolerance ?? 'Moderate', initialInvestment: d.profile.initialInvestment ?? 0, monthlyContribution: d.profile.monthlyContribution ?? 0, timeHorizonYears: d.profile.timeHorizonYears ?? 10 }); } }).catch(() => {});
  }, [user]);

  const filtered = useMemo(() => {
    let prods = INVESTMENT_PRODUCTS;
    if (category !== 'all') prods = prods.filter(p => p.category === category);
    if (region !== 'all') prods = prods.filter(p => p.region === region);
    if (sort === 'return') prods = [...prods].sort((a, b) => b.expectedReturnMax - a.expectedReturnMax);
    else if (sort === 'fee') prods = [...prods].sort((a, b) => a.annualFee - b.annualFee);
    else prods = [...prods].sort((a, b) => b.rating - a.rating);
    return prods;
  }, [category, region, sort]);

  const applyTo = useCallback(async (product: InvestmentProduct) => {
    const ret = dbProfile ? estimatedReturn(product, dbProfile.riskTolerance) : (product.expectedReturnMin + product.expectedReturnMax) / 2;
    const init = dbProfile?.initialInvestment ?? product.minInvestment;
    const monthly = dbProfile?.monthlyContribution ?? 0;
    const years = dbProfile?.timeHorizonYears ?? 10;
    const projected = projectValue(init, monthly, ret, years);
    setApplyingId(product.id);
    try {
      const res = await fetch('/api/user/investment/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: product.id, provider: product.provider, flag: product.flag, country: product.country, productName: product.productName, category: product.category, currencySymbol: product.currencySymbol, projectedReturn: ret, initialInvestment: init, monthlyContribution: monthly, projectedValue: Math.round(projected), status: 'submitted' }) });
      if (res.ok) setApplied(prev => prev.includes(product.id) ? prev : [...prev, product.id]);
    } finally { setApplyingId(null); }
  }, [dbProfile]);

  const removeApp = useCallback(async (productId: string) => {
    setApplied(prev => prev.filter(id => id !== productId));
    try { await fetch(`/api/user/investment/applications?productId=${encodeURIComponent(productId)}`, { method: 'DELETE' }); } catch { setApplied(prev => prev.includes(productId) ? prev : [...prev, productId]); }
  }, []);

  const handleApply = (product: InvestmentProduct) => { setApplyTarget(product); if (!user) setShowAuth(true); else if (!hasProfile) setShowProfile(true); else applyTo(product); };
  const onAuth = (u: { hasProfile: boolean }) => { setShowAuth(false); if (!hasProfile && !u.hasProfile) setShowProfile(true); else { if (applyTarget) applyTo(applyTarget); router.push('/investments/dashboard'); } };
  const onProfile = (p: InvestmentProfileData) => { setShowProfile(false); setHasProfile(true); setDbProfile({ riskTolerance: p.riskTolerance, initialInvestment: p.initialInvestment, monthlyContribution: p.monthlyContribution, timeHorizonYears: p.timeHorizonYears }); router.push('/investments/dashboard'); };
  const toggle = (id: string) => setCompared(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);

  const comparedProducts = INVESTMENT_PRODUCTS.filter(p => compared.includes(p.id));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 py-12 px-4"><div className="mx-auto max-w-5xl text-center"><h1 className="text-3xl font-extrabold text-white mb-2">Compare Investment Products</h1><p className="text-white/80">Index funds, robo-advisors, brokers and more from {new Set(INVESTMENT_PRODUCTS.map(p => p.provider)).size}+ providers.</p></div></section>

      <div className="sticky top-14 z-30 bg-[var(--card)] border-b border-[var(--border)] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 overflow-x-auto">{INVESTMENT_CATEGORIES.map(c => <button key={c.id} onClick={() => setCategory(c.id as Category)} className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${category === c.id ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'}`}><span>{c.icon}</span>{c.label}</button>)}</div>
          <div className="h-5 w-px bg-[var(--border)] hidden sm:block" />
          <div className="flex items-center gap-1 overflow-x-auto">{INVESTMENT_REGIONS.map(r => <button key={r.id} onClick={() => setRegion(r.id as Region)} className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap ${region === r.id ? 'bg-indigo-600 text-white' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'}`}>{r.label}</button>)}</div>
          <div className="ml-auto flex items-center gap-2"><select value={sort} onChange={e => setSort(e.target.value as Sort)} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] cursor-pointer"><option value="return">Highest Return</option><option value="fee">Lowest Fee</option><option value="rating">Top Rated</option></select><span className="text-xs text-[var(--muted-foreground)]">{filtered.length} results</span></div>
        </div>
      </div>

      {user && (
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <div className={`rounded-2xl border px-5 py-3 flex items-center justify-between ${hasProfile ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'}`}>
            <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">{user.name.charAt(0).toUpperCase()}</div><div><p className="text-sm font-semibold text-[var(--foreground)]">{hasProfile ? `Welcome back, ${user.name.split(' ')[0]}!` : `Hi ${user.name.split(' ')[0]}, set your goals`}</p><p className="text-xs text-[var(--muted-foreground)]">{hasProfile ? 'Growth projections shown on your dashboard' : 'Get personalized projections in 1 minute'}</p></div></div>
            {hasProfile ? <button onClick={() => router.push('/investments/dashboard')} className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white">View Dashboard →</button> : <button onClick={() => setShowProfile(true)} className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white">Set Goals →</button>}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(product => applied.includes(product.id) ? (
            <div key={product.id} className="rounded-2xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 flex flex-col items-center justify-center p-8 text-center">
              <div className="text-4xl mb-3">✅</div><p className="font-bold text-indigo-700 dark:text-indigo-400 mb-1">Added to Dashboard</p><p className="text-sm text-[var(--muted-foreground)] mb-3">{product.provider} — {product.productName}</p>
              <div className="flex items-center gap-2"><button onClick={() => router.push('/investments/dashboard')} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white">View in Dashboard →</button><button onClick={() => removeApp(product.id)} className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-red-500 hover:border-red-300">Remove</button></div>
            </div>
          ) : <ProductCard key={product.id} product={product} onApply={handleApply} applying={applyingId === product.id} compared={compared.includes(product.id)} onToggle={toggle} />)}
        </div>
      </main>

      {compared.length >= 2 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--card)] shadow-2xl px-4 py-3"><div className="mx-auto max-w-7xl flex items-center gap-4">
          <div className="flex-1 flex items-center gap-2 overflow-x-auto">{comparedProducts.map(p => <div key={p.id} className="flex items-center gap-2 rounded-xl bg-[var(--muted)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] shrink-0"><span>{p.flag}</span><span>{p.provider}</span><button onClick={() => toggle(p.id)} className="ml-1 text-[var(--muted-foreground)] hover:text-red-500">×</button></div>)}</div>
          <button onClick={() => setCompared([])} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Clear</button>
        </div></div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={onAuth} loanName={applyTarget?.productName} />}
      {showProfile && user && <InvestmentProfileModal userName={user.name} onClose={() => setShowProfile(false)} onSuccess={onProfile} />}
    </div>
  );
}
