"use client";
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/loans/AuthModal';
import InsuranceProfileModal, { type InsuranceProfileData } from '@/components/insurance/InsuranceProfileModal';
import { INSURANCE_PLANS, INSURANCE_CATEGORIES, INSURANCE_CATEGORY_COLORS, estimatePremium, type InsurancePlan } from '@/lib/insuranceData';

type Category = 'all' | 'health' | 'life' | 'auto' | 'home' | 'travel';
type Region = 'all' | 'us' | 'europe';
type Sort = 'premium' | 'coverage' | 'rating';

function Stars({ rating }: { rating: number }) {
  return <span className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map(i => (
    <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-[var(--border)]'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
  ))}</span>;
}

function PlanCard({ plan, onApply, applying, compared, onToggle }: { plan: InsurancePlan; onApply: (p: InsurancePlan) => void; applying?: boolean; compared: boolean; onToggle: (id: string) => void }) {
  const color = INSURANCE_CATEGORY_COLORS[plan.category];
  return (
    <div className={`relative rounded-2xl border bg-[var(--card)] transition-all hover:shadow-lg hover:-translate-y-0.5 overflow-hidden flex flex-col ${compared ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-[var(--border)]'}`}>
      <div className={`h-1 w-full bg-gradient-to-r ${color}`} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-lg shadow-sm shrink-0`}>{plan.flag}</div>
            <div><p className="font-bold text-[var(--foreground)] text-sm leading-tight">{plan.provider}</p><p className="text-[11px] text-[var(--muted-foreground)]">{plan.country}</p></div>
          </div>
          {plan.badge && <span className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-2 py-0.5 text-[10px] font-bold text-white">{plan.badge}</span>}
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mb-3">{plan.planName}</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-xl bg-[var(--muted)] p-2.5 text-center"><p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Premium</p><p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{plan.currencySymbol}{plan.minPremium}+/mo</p></div>
          <div className="rounded-xl bg-[var(--muted)] p-2.5 text-center"><p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Coverage</p><p className="text-xs font-bold text-[var(--foreground)]">{plan.currencySymbol}{plan.coverageAmount >= 1000 ? `${Math.round(plan.coverageAmount / 1000)}k` : plan.coverageAmount}</p></div>
          <div className="rounded-xl bg-[var(--muted)] p-2.5 text-center"><p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Deductible</p><p className="text-xs font-bold text-[var(--foreground)]">{plan.currencySymbol}{plan.deductible}</p></div>
        </div>
        <ul className="space-y-1.5 mb-4 flex-1">
          {plan.features.slice(0, 3).map(f => <li key={f} className="flex items-start gap-2 text-xs text-[var(--muted-foreground)]"><svg className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{f}</li>)}
        </ul>
        <div className="flex items-center gap-3 mb-3 text-xs text-[var(--muted-foreground)]"><div className="flex items-center gap-1"><Stars rating={plan.rating} /><span className="font-semibold text-[var(--foreground)]">{plan.rating}</span><span>({plan.reviewCount.toLocaleString()})</span></div><span className="text-[var(--border)]">·</span><span>⚡ {plan.claimTime}</span></div>
        <div className="flex items-center gap-2">
          <button onClick={() => onToggle(plan.id)} className={`rounded-xl border px-3 py-2 text-xs font-medium ${compared ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-emerald-500 hover:text-emerald-600'}`}>{compared ? 'Added' : 'Compare'}</button>
          <button onClick={() => onApply(plan)} disabled={applying} className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">{applying ? 'Applying…' : 'Get Quote →'}</button>
        </div>
      </div>
    </div>
  );
}

export default function InsuranceClient() {
  const { user } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState<Category>('all');
  const [region, setRegion] = useState<Region>('all');
  const [sort, setSort] = useState<Sort>('premium');

  // Apply ?type= / ?region= after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('type');
    if (t && ['health', 'life', 'auto', 'home', 'travel'].includes(t)) setCategory(t as Category);
    const r = params.get('region');
    if (r === 'us' || r === 'europe') setRegion(r);
  }, []);
  const [compared, setCompared] = useState<string[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [applyTarget, setApplyTarget] = useState<InsurancePlan | null>(null);
  const [applied, setApplied] = useState<string[]>([]);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [dbProfile, setDbProfile] = useState<{ age: number; smoker: boolean; riskFactors: string } | null>(null);

  useEffect(() => {
    if (!user) { setApplied([]); setHasProfile(false); setDbProfile(null); return; }
    fetch('/api/user/insurance/applications').then(r => r.ok ? r.json() : { applications: [] }).then(d => setApplied((d.applications ?? []).map((a: { planId: string }) => a.planId))).catch(() => {});
    fetch('/api/user/insurance/profile').then(r => r.ok ? r.json() : null).then(d => { if (d?.profile) { setHasProfile(true); setDbProfile({ age: d.profile.age ?? 30, smoker: !!d.profile.smoker, riskFactors: d.profile.riskFactors ?? 'medium' }); } }).catch(() => {});
  }, [user]);

  const filtered = useMemo(() => {
    let plans = INSURANCE_PLANS;
    if (category !== 'all') plans = plans.filter(p => p.category === category);
    if (region !== 'all') plans = plans.filter(p => p.region === region);
    if (sort === 'premium') plans = [...plans].sort((a, b) => a.minPremium - b.minPremium);
    else if (sort === 'coverage') plans = [...plans].sort((a, b) => b.coverageAmount - a.coverageAmount);
    else plans = [...plans].sort((a, b) => b.rating - a.rating);
    return plans;
  }, [category, region, sort]);

  const applyTo = useCallback(async (plan: InsurancePlan) => {
    const est = dbProfile ? estimatePremium(plan, dbProfile) : plan.minPremium;
    setApplyingId(plan.id);
    try {
      const res = await fetch('/api/user/insurance/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ planId: plan.id, provider: plan.provider, flag: plan.flag, country: plan.country, planName: plan.planName, category: plan.category, currencySymbol: plan.currencySymbol, estimatedPremium: est, coverageAmount: plan.coverageAmount, status: 'submitted' }) });
      if (res.ok) setApplied(prev => prev.includes(plan.id) ? prev : [...prev, plan.id]);
    } finally { setApplyingId(null); }
  }, [dbProfile]);

  const removeApp = useCallback(async (planId: string) => {
    setApplied(prev => prev.filter(id => id !== planId));
    try { await fetch(`/api/user/insurance/applications?planId=${encodeURIComponent(planId)}`, { method: 'DELETE' }); } catch { setApplied(prev => prev.includes(planId) ? prev : [...prev, planId]); }
  }, []);

  const handleApply = (plan: InsurancePlan) => {
    setApplyTarget(plan);
    if (!user) setShowAuth(true);
    else if (!hasProfile) setShowProfile(true);
    else applyTo(plan);
  };
  const onAuth = (u: { hasProfile: boolean }) => { setShowAuth(false); if (!hasProfile && !u.hasProfile) setShowProfile(true); else { if (applyTarget) applyTo(applyTarget); router.push('/insurance/dashboard'); } };
  const onProfile = (p: InsuranceProfileData) => { setShowProfile(false); setHasProfile(true); setDbProfile({ age: p.age, smoker: p.smoker, riskFactors: p.riskFactors }); router.push('/insurance/dashboard'); };
  const toggle = (id: string) => setCompared(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);

  const comparedPlans = INSURANCE_PLANS.filter(p => compared.includes(p.id));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 py-12 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">Compare Insurance Plans</h1>
          <p className="text-white/80">Find the right cover from {new Set(INSURANCE_PLANS.map(p => p.provider)).size}+ insurers across the US & Europe.</p>
        </div>
      </section>

      <div className="sticky top-14 z-30 bg-[var(--card)] border-b border-[var(--border)] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            {INSURANCE_CATEGORIES.map(c => <button key={c.id} onClick={() => setCategory(c.id as Category)} className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${category === c.id ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'}`}><span>{c.icon}</span>{c.label}</button>)}
          </div>
          <div className="h-5 w-px bg-[var(--border)] hidden sm:block" />
          <div className="flex items-center gap-1">
            {[{ id: 'all', l: '🌐 All' }, { id: 'us', l: '🇺🇸 US' }, { id: 'europe', l: '🌍 Europe' }].map(r => <button key={r.id} onClick={() => setRegion(r.id as Region)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${region === r.id ? 'bg-emerald-600 text-white' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'}`}>{r.l}</button>)}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select value={sort} onChange={e => setSort(e.target.value as Sort)} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] cursor-pointer"><option value="premium">Lowest Premium</option><option value="coverage">Highest Coverage</option><option value="rating">Top Rated</option></select>
            <span className="text-xs text-[var(--muted-foreground)]">{filtered.length} results</span>
          </div>
        </div>
      </div>

      {user && (
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <div className={`rounded-2xl border px-5 py-3 flex items-center justify-between ${hasProfile ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800'}`}>
            <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold">{user.name.charAt(0).toUpperCase()}</div><div><p className="text-sm font-semibold text-[var(--foreground)]">{hasProfile ? `Welcome back, ${user.name.split(' ')[0]}!` : `Hi ${user.name.split(' ')[0]}, tell us your needs`}</p><p className="text-xs text-[var(--muted-foreground)]">{hasProfile ? 'Personalized premiums shown on your dashboard' : 'Get personalized quotes in 1 minute'}</p></div></div>
            {hasProfile ? <button onClick={() => router.push('/insurance/dashboard')} className="shrink-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-1.5 text-xs font-semibold text-white">View Dashboard →</button> : <button onClick={() => setShowProfile(true)} className="shrink-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-1.5 text-xs font-semibold text-white">Complete Profile →</button>}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(plan => applied.includes(plan.id) ? (
            <div key={plan.id} className="rounded-2xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 flex flex-col items-center justify-center p-8 text-center">
              <div className="text-4xl mb-3">✅</div><p className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">Added to Dashboard</p><p className="text-sm text-[var(--muted-foreground)] mb-3">{plan.provider} — {plan.planName}</p>
              <div className="flex items-center gap-2"><button onClick={() => router.push('/insurance/dashboard')} className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-1.5 text-xs font-semibold text-white">View in Dashboard →</button><button onClick={() => removeApp(plan.id)} className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-red-500 hover:border-red-300">Remove</button></div>
            </div>
          ) : <PlanCard key={plan.id} plan={plan} onApply={handleApply} applying={applyingId === plan.id} compared={compared.includes(plan.id)} onToggle={toggle} />)}
        </div>
      </main>

      {compared.length >= 2 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--card)] shadow-2xl px-4 py-3"><div className="mx-auto max-w-7xl flex items-center gap-4">
          <div className="flex-1 flex items-center gap-2 overflow-x-auto">{comparedPlans.map(p => <div key={p.id} className="flex items-center gap-2 rounded-xl bg-[var(--muted)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] shrink-0"><span>{p.flag}</span><span>{p.provider}</span><button onClick={() => toggle(p.id)} className="ml-1 text-[var(--muted-foreground)] hover:text-red-500">×</button></div>)}</div>
          <button onClick={() => setCompared([])} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Clear</button>
        </div></div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={onAuth} loanName={applyTarget?.planName} />}
      {showProfile && user && <InsuranceProfileModal userName={user.name} onClose={() => setShowProfile(false)} onSuccess={onProfile} />}
    </div>
  );
}
