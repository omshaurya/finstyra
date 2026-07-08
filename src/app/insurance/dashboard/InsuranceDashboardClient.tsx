"use client";
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PieChart, Pie, Cell, BarChart, Bar, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { matchInsurance, type InsuranceMatch } from '@/lib/insuranceData';

interface ProfileDoc {
  phone?: string; dateOfBirth?: string; age?: number; gender?: string; country?: string; nationality?: string;
  addressLine1?: string; city?: string; state?: string; postalCode?: string; smoker?: boolean; occupation?: string;
  coverageType?: string; coverageAmount?: number; dependents?: number; riskFactors?: string; govIdType?: string; govIdNumber?: string;
}
interface AccountDoc { email: string; name: string; avatar: string; memberSince: string }
interface App { _id: string; planId: string; provider: string; flag: string; country: string; planName: string; category: string; estimatedPremium: number; coverageAmount: number; currencySymbol: string; status: string }

const PIE = ['#10b981', '#14b8a6', '#f59e0b', '#6366f1', '#ec4899'];
const CUR: Record<string, string> = { 'United States': '$', 'United Kingdom': '£', Canada: 'C$' };
const sym = (c?: string) => CUR[c ?? ''] ?? '€';
function maskId(id: string) { const t = id.replace(/\s/g, ''); return t.length <= 4 ? '••••' : '••••' + t.slice(-4); }

export default function InsuranceDashboardClient() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileDoc | null>(null);
  const [account, setAccount] = useState<AccountDoc | null>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/insurance'); return; }
    Promise.all([
      fetch('/api/user/insurance/profile').then(r => { if (!r.ok) throw new Error('Could not load your profile.'); return r.json(); }),
      fetch('/api/user/insurance/applications').then(r => r.ok ? r.json() : { applications: [] }),
    ]).then(([p, a]) => { setProfile(p.profile); setAccount(p.account); setApps(a.applications ?? []); }).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [user, isLoading, router]);

  const removeApp = async (planId: string) => { setApps(prev => prev.filter(a => a.planId !== planId)); try { await fetch(`/api/user/insurance/applications?planId=${encodeURIComponent(planId)}`, { method: 'DELETE' }); } catch {} };

  const cur = sym(profile?.country);
  const fmt = (v: number) => `${cur}${Math.round(v).toLocaleString('en-US')}`;

  const matches: InsuranceMatch[] = useMemo(() => profile ? matchInsurance({ country: profile.country ?? '', age: profile.age ?? 30, gender: profile.gender ?? '', smoker: !!profile.smoker, coverageType: profile.coverageType ?? 'Health', coverageAmount: profile.coverageAmount ?? 0, dependents: profile.dependents ?? 0, riskFactors: profile.riskFactors ?? 'medium' }) : [], [profile]);
  const best = matches[0];

  const comparison = useMemo(() => matches.slice(0, 5).map(m => ({ name: m.plan.provider, 'Monthly Premium': m.estimatedPremium, 'Annual Cost': m.annualCost })), [matches]);
  const coverageData = useMemo(() => best && profile ? [{ name: 'Your Coverage', value: profile.coverageAmount ?? 0 }, { name: 'Deductible', value: best.plan.deductible }] : [], [best, profile]);

  const riskScore = useMemo(() => { const base = profile?.riskFactors === 'low' ? 85 : profile?.riskFactors === 'high' ? 40 : 65; return profile?.smoker ? Math.max(20, base - 20) : base; }, [profile]);
  const riskColor = riskScore >= 70 ? '#10b981' : riskScore >= 50 ? '#f59e0b' : '#ef4444';
  const riskLabel = riskScore >= 70 ? 'Low Risk' : riskScore >= 50 ? 'Moderate' : 'Higher Risk';

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--background)]"><svg className="w-8 h-8 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 text-center"><div><p className="text-4xl mb-3">⚠️</p><p className="text-[var(--foreground)] font-semibold mb-2">{error}</p><Link href="/insurance/compare" className="text-emerald-600 text-sm hover:underline">← Back</Link></div></div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 text-center"><div className="max-w-sm"><p className="text-4xl mb-3">📋</p><h2 className="text-lg font-bold text-[var(--foreground)] mb-2">Complete your profile</h2><p className="text-sm text-[var(--muted-foreground)] mb-4">A few details unlock personalized insurance quotes.</p><Link href="/insurance/profile" className="inline-block rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white">Set up profile →</Link></div></div>;

  const fullAddress = [profile.addressLine1, profile.city, profile.state, profile.postalCode].filter(Boolean).join(', ');
  const kyc = Boolean(profile.govIdType && profile.govIdNumber);
  const checks: [string, boolean][] = [['phone', !!profile.phone], ['date of birth', !!profile.dateOfBirth], ['address', !!(profile.addressLine1 && profile.city)], ['ID document', kyc], ['occupation', !!profile.occupation], ['photo', !!account?.avatar]];
  const completeness = Math.round(checks.filter(([, ok]) => ok).length / checks.length * 100);
  const missing = checks.filter(([, ok]) => !ok).map(([l]) => l);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 px-4 py-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {account?.avatar ? <img src={account.avatar} alt="Profile" className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/30" /> : <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white ring-2 ring-white/30">{account?.name.charAt(0).toUpperCase()}</div>}
            <div><p className="text-sm text-white/70">Insurance dashboard</p><h1 className="text-2xl font-extrabold text-white">{account?.name}</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/insurance/profile" className="rounded-xl bg-white text-emerald-700 px-4 py-2 text-sm font-semibold hover:bg-white/90">✏️ Edit Profile</Link>
            <Link href="/insurance/compare" className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/20">Browse Plans</Link>
            <button onClick={async () => { await logout(); router.replace('/insurance'); }} className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/20">Sign Out</button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric icon="🛡️" label="Coverage Type" value={profile.coverageType ?? '—'} sub={`${fmt(profile.coverageAmount ?? 0)} cover`} accent="text-emerald-600 dark:text-emerald-400" />
          <Metric icon="💵" label="Est. Premium" value={best ? `${fmt(best.estimatedPremium)}/mo` : '—'} sub={best ? best.plan.provider : ''} accent="text-[var(--foreground)]" />
          <Metric icon="📅" label="Annual Cost" value={best ? fmt(best.annualCost) : '—'} sub="Estimated" accent="text-[var(--foreground)]" />
          <Metric icon="🎯" label="Risk Rating" value={riskLabel} sub={`${riskScore}/100`} accent="text-emerald-600 dark:text-emerald-400" />
        </div>

        {/* My Applications */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="flex items-center gap-2 font-semibold text-[var(--foreground)] text-sm"><span>📄</span> My Quotes<span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[11px] text-[var(--muted-foreground)]">{apps.length}</span></h3><Link href="/insurance/compare" className="text-xs text-emerald-600 hover:underline">+ Get more quotes</Link></div>
          {apps.length === 0 ? <div className="text-center py-8"><p className="text-3xl mb-2">🗂️</p><p className="text-sm text-[var(--muted-foreground)] mb-3">No quotes saved yet.</p><Link href="/insurance/compare" className="inline-block rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-semibold text-white">Browse Plans →</Link></div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{apps.map(a => (
              <div key={a._id} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted)] text-lg shrink-0">{a.flag}</div>
                <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="text-sm font-semibold text-[var(--foreground)] truncate">{a.provider}</p><span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 text-[9px] font-bold uppercase shrink-0">{a.status.replace('_', ' ')}</span></div><p className="text-xs text-[var(--muted-foreground)] truncate">{a.planName}</p><p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{a.currencySymbol}{a.estimatedPremium}/mo · {a.currencySymbol}{a.coverageAmount?.toLocaleString()} cover</p></div>
                <button onClick={() => removeApp(a.planId)} title="Remove" className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            ))}</div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card title="Profile Completeness" icon="📈">
              <div className="flex items-center gap-3 mb-2"><div className="flex-1 h-2.5 rounded-full bg-[var(--muted)] overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600" style={{ width: `${completeness}%` }} /></div><span className="text-sm font-bold text-[var(--foreground)]">{completeness}%</span></div>
              <p className="text-xs text-[var(--muted-foreground)]">{completeness >= 100 ? 'All set!' : `Add ${missing.slice(0, 2).join(', ')} to improve quotes.`}</p>
              {completeness < 100 && <Link href="/insurance/profile" className="mt-3 inline-block text-xs font-semibold text-emerald-600 hover:underline">Complete profile →</Link>}
            </Card>
            <Card title="Insurance Profile" icon="👤" action={<Link href="/insurance/profile" className="text-xs text-emerald-600 hover:underline">Edit</Link>}>
              <dl className="space-y-3">
                <Row label="Country" value={profile.country ?? '—'} />
                {profile.age ? <Row label="Age" value={`${profile.age} years`} /> : null}
                {profile.gender ? <Row label="Gender" value={profile.gender} /> : null}
                <Row label="Smoker" value={profile.smoker ? 'Yes' : 'No'} />
                <Row label="Coverage" value={profile.coverageType ?? '—'} />
                <Row label="Coverage Amount" value={fmt(profile.coverageAmount ?? 0)} />
                <Row label="Dependents" value={String(profile.dependents ?? 0)} />
                <Row label="Risk Profile" value={(profile.riskFactors ?? 'medium').toUpperCase()} badge />
              </dl>
            </Card>
            <Card title="Address & Identity" icon="🪪" action={<Link href="/insurance/profile" className="text-xs text-emerald-600 hover:underline">Edit</Link>}>
              <dl className="space-y-3">
                <Row label="Address" value={fullAddress || 'Not provided'} />
                <Row label="ID Document" value={profile.govIdType || 'Not provided'} />
                {profile.govIdNumber ? <Row label="ID Number" value={maskId(profile.govIdNumber)} /> : null}
                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between"><dt className="text-xs text-[var(--muted-foreground)]">KYC</dt><dd className={`text-xs font-semibold rounded-full px-2 py-0.5 ${kyc ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30' : 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30'}`}>{kyc ? '✓ On file' : '⚠ Incomplete'}</dd></div>
              </dl>
            </Card>
            <Card title="Risk Analysis" icon="🎯">
              <ResponsiveContainer width="100%" height={160}><RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: riskScore, fill: riskColor }]} startAngle={90} endAngle={-270}><RadialBar background dataKey="value" cornerRadius={12} /></RadialBarChart></ResponsiveContainer>
              <div className="text-center -mt-24 mb-12 pointer-events-none"><p className="text-2xl font-extrabold" style={{ color: riskColor }}>{riskScore}</p><p className="text-xs text-[var(--muted-foreground)]">{riskLabel}</p></div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {best && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-2xl">{best.plan.flag}</span><div><p className="text-white font-bold">{best.plan.provider} — {best.plan.planName}</p><p className="text-xs text-white/70">Your best-matched plan · {best.plan.country}</p></div></div><span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">Match {best.matchScore}</span></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[var(--border)]">
                  <Stat label="Your Premium" value={`${fmt(best.estimatedPremium)}/mo`} sub={`${best.plan.claimTime} claims`} />
                  <Stat label="Annual Cost" value={fmt(best.annualCost)} sub="Estimated" />
                  <Stat label="Coverage" value={fmt(profile.coverageAmount ?? 0)} sub="Sum insured" />
                  <Stat label="Deductible" value={fmt(best.plan.deductible)} sub="Per claim" />
                </div>
                <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-3"><div className="flex flex-wrap gap-2">{best.plan.features.slice(0, 2).map(f => <span key={f} className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs text-[var(--muted-foreground)]">✓ {f}</span>)}</div><Link href="/insurance/compare" className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-sm font-semibold text-white hover:opacity-90">Get this quote →</Link></div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card title="Coverage vs Deductible" icon="🥧">
                <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={coverageData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2}>{coverageData.map((_, i) => <Cell key={i} fill={PIE[i]} />)}</Pie><Tooltip formatter={(v) => fmt(Number(v))} /><Legend /></PieChart></ResponsiveContainer>
              </Card>
              <Card title="Premium by Category" icon="📊">
                <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={matches.slice(0, 4).map(m => ({ name: m.plan.provider, value: m.estimatedPremium }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>{matches.slice(0, 4).map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}</Pie><Tooltip formatter={(v) => `${fmt(Number(v))}/mo`} /><Legend /></PieChart></ResponsiveContainer>
              </Card>
            </div>
            <Card title="Top Insurers — Premium Comparison" icon="🏥">
              <ResponsiveContainer width="100%" height={260}><BarChart data={comparison} layout="vertical" margin={{ left: 20 }}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis type="number" tickFormatter={v => `${cur}${v}`} tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} /><Tooltip formatter={(v) => fmt(Number(v))} /><Legend /><Bar dataKey="Monthly Premium" fill="#10b981" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function Metric({ icon, label, value, sub, accent }: { icon: string; label: string; value: string; sub: string; accent: string }) {
  return <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"><div className="flex items-center gap-2 mb-2"><span className="text-lg">{icon}</span><p className="text-xs text-[var(--muted-foreground)] font-medium">{label}</p></div><p className={`text-xl font-extrabold ${accent}`}>{value}</p>{sub && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{sub}</p>}</div>;
}
function Card({ title, icon, children, action }: { title: string; icon: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"><div className="flex items-center justify-between mb-4"><h3 className="flex items-center gap-2 font-semibold text-[var(--foreground)] text-sm"><span>{icon}</span> {title}</h3>{action}</div>{children}</div>;
}
function Row({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
  return <div className="flex items-center justify-between gap-3"><dt className="text-xs text-[var(--muted-foreground)]">{label}</dt>{badge ? <dd className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-full px-2 py-0.5">{value}</dd> : <dd className="text-sm font-medium text-[var(--foreground)] text-right">{value}</dd>}</div>;
}
function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="px-4 py-3 text-center"><p className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)] mb-1">{label}</p><p className="text-base font-bold text-[var(--foreground)]">{value}</p><p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{sub}</p></div>;
}
