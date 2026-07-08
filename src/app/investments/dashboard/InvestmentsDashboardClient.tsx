"use client";
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { matchInvestments, projectValue, type InvestmentMatch } from '@/lib/investmentData';

interface ProfileDoc {
  phone?: string; country?: string; nationality?: string; addressLine1?: string; city?: string; state?: string; postalCode?: string;
  employmentStatus?: string; annualIncome?: number; goal?: string; riskTolerance?: string; experienceLevel?: string;
  initialInvestment?: number; monthlyContribution?: number; timeHorizonYears?: number; existingPortfolio?: number; govIdType?: string; govIdNumber?: string;
}
interface AccountDoc { email: string; name: string; avatar: string; memberSince: string }
interface App { _id: string; productId: string; provider: string; flag: string; country: string; productName: string; category: string; projectedReturn: number; initialInvestment: number; monthlyContribution: number; projectedValue: number; currencySymbol: string; status: string }

const PIE = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
const CUR: Record<string, string> = { 'United States': '$', 'United Kingdom': '£', Canada: 'C$' };
const sym = (c?: string) => CUR[c ?? ''] ?? '€';
function maskId(id: string) { const t = id.replace(/\s/g, ''); return t.length <= 4 ? '••••' : '••••' + t.slice(-4); }

export default function InvestmentsDashboardClient() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileDoc | null>(null);
  const [account, setAccount] = useState<AccountDoc | null>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/investments'); return; }
    Promise.all([
      fetch('/api/user/investment/profile').then(r => { if (!r.ok) throw new Error('Could not load your profile.'); return r.json(); }),
      fetch('/api/user/investment/applications').then(r => r.ok ? r.json() : { applications: [] }),
    ]).then(([p, a]) => { setProfile(p.profile); setAccount(p.account); setApps(a.applications ?? []); }).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [user, isLoading, router]);

  const removeApp = async (productId: string) => { setApps(prev => prev.filter(a => a.productId !== productId)); try { await fetch(`/api/user/investment/applications?productId=${encodeURIComponent(productId)}`, { method: 'DELETE' }); } catch {} };

  const cur = sym(profile?.country);
  const fmt = (v: number) => `${cur}${Math.round(v).toLocaleString('en-US')}`;

  const matches: InvestmentMatch[] = useMemo(() => profile ? matchInvestments({ country: profile.country ?? '', goal: profile.goal ?? 'Build Wealth', riskTolerance: profile.riskTolerance ?? 'Moderate', initialInvestment: profile.initialInvestment ?? 0, monthlyContribution: profile.monthlyContribution ?? 0, timeHorizonYears: profile.timeHorizonYears ?? 10 }) : [], [profile]);
  const best = matches[0];

  const years = profile?.timeHorizonYears ?? 10;
  const growth = useMemo(() => {
    if (!best || !profile) return [];
    const rate = best.projectedReturn;
    const init = profile.initialInvestment ?? 0;
    const monthly = profile.monthlyContribution ?? 0;
    return Array.from({ length: years + 1 }, (_, y) => {
      const value = projectValue(init, monthly, rate, y);
      const contributed = init + monthly * 12 * y;
      return { year: new Date().getFullYear() + y, Value: Math.round(value), Contributed: Math.round(contributed) };
    });
  }, [best, profile, years]);

  const totalContributed = (profile?.initialInvestment ?? 0) + (profile?.monthlyContribution ?? 0) * 12 * years;
  const finalValue = best?.projectedValue ?? 0;
  const totalGain = finalValue - totalContributed;

  const allocation = useMemo(() => [
    { name: 'Contributions', value: Math.round(totalContributed) },
    { name: 'Projected Gains', value: Math.round(Math.max(0, totalGain)) },
  ], [totalContributed, totalGain]);

  const comparison = useMemo(() => matches.slice(0, 5).map(m => ({ name: m.product.provider, 'Projected Value': Math.round(m.projectedValue) })), [matches]);

  const riskMap: Record<string, number> = { Conservative: 35, Moderate: 65, Aggressive: 90 };
  const riskScore = riskMap[profile?.riskTolerance ?? 'Moderate'] ?? 65;
  const riskColor = riskScore >= 80 ? '#ef4444' : riskScore >= 50 ? '#6366f1' : '#10b981';

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--background)]"><svg className="w-8 h-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 text-center"><div><p className="text-4xl mb-3">⚠️</p><p className="text-[var(--foreground)] font-semibold mb-2">{error}</p><Link href="/investments/compare" className="text-indigo-600 text-sm hover:underline">← Back</Link></div></div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 text-center"><div className="max-w-sm"><p className="text-4xl mb-3">📋</p><h2 className="text-lg font-bold text-[var(--foreground)] mb-2">Set your goals first</h2><p className="text-sm text-[var(--muted-foreground)] mb-4">Tell us your plan to unlock growth projections.</p><Link href="/investments/profile" className="inline-block rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white">Set up profile →</Link></div></div>;

  const fullAddress = [profile.addressLine1, profile.city, profile.state, profile.postalCode].filter(Boolean).join(', ');
  const kyc = Boolean(profile.govIdType && profile.govIdNumber);
  const checks: [string, boolean][] = [['phone', !!profile.phone], ['address', !!(profile.addressLine1 && profile.city)], ['ID document', kyc], ['income', (profile.annualIncome ?? 0) > 0], ['photo', !!account?.avatar]];
  const completeness = Math.round(checks.filter(([, ok]) => ok).length / checks.length * 100);
  const missing = checks.filter(([, ok]) => !ok).map(([l]) => l);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 px-4 py-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {account?.avatar ? <img src={account.avatar} alt="Profile" className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/30" /> : <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white ring-2 ring-white/30">{account?.name.charAt(0).toUpperCase()}</div>}
            <div><p className="text-sm text-white/70">Investment dashboard</p><h1 className="text-2xl font-extrabold text-white">{account?.name}</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/investments/profile" className="rounded-xl bg-white text-indigo-700 px-4 py-2 text-sm font-semibold hover:bg-white/90">✏️ Edit Profile</Link>
            <Link href="/investments/compare" className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/20">Browse Products</Link>
            <button onClick={async () => { await logout(); router.replace('/investments'); }} className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/20">Sign Out</button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric icon="🎯" label="Goal" value={profile.goal ?? '—'} sub={`${years}-year horizon`} accent="text-indigo-600 dark:text-indigo-400" />
          <Metric icon="📈" label="Projected Value" value={fmt(finalValue)} sub={best ? `at ${best.projectedReturn}%/yr` : ''} accent="text-emerald-600 dark:text-emerald-400" />
          <Metric icon="💰" label="Total Gain" value={fmt(totalGain)} sub={`${totalContributed > 0 ? Math.round(totalGain / totalContributed * 100) : 0}% ROI`} accent="text-emerald-600 dark:text-emerald-400" />
          <Metric icon="⚖️" label="Risk Profile" value={profile.riskTolerance ?? 'Moderate'} sub={profile.experienceLevel ?? ''} accent="text-[var(--foreground)]" />
        </div>

        {/* My Applications */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="flex items-center gap-2 font-semibold text-[var(--foreground)] text-sm"><span>📄</span> My Accounts<span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[11px] text-[var(--muted-foreground)]">{apps.length}</span></h3><Link href="/investments/compare" className="text-xs text-indigo-600 hover:underline">+ Open more</Link></div>
          {apps.length === 0 ? <div className="text-center py-8"><p className="text-3xl mb-2">🗂️</p><p className="text-sm text-[var(--muted-foreground)] mb-3">No accounts opened yet.</p><Link href="/investments/compare" className="inline-block rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white">Browse Products →</Link></div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{apps.map(a => (
              <div key={a._id} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted)] text-lg shrink-0">{a.flag}</div>
                <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="text-sm font-semibold text-[var(--foreground)] truncate">{a.provider}</p><span className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 text-[9px] font-bold uppercase shrink-0">{a.status.replace('_', ' ')}</span></div><p className="text-xs text-[var(--muted-foreground)] truncate">{a.productName}</p><p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{a.projectedReturn}%/yr · proj. {a.currencySymbol}{a.projectedValue?.toLocaleString()}</p></div>
                <button onClick={() => removeApp(a.productId)} title="Remove" className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            ))}</div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card title="Profile Completeness" icon="📈">
              <div className="flex items-center gap-3 mb-2"><div className="flex-1 h-2.5 rounded-full bg-[var(--muted)] overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: `${completeness}%` }} /></div><span className="text-sm font-bold text-[var(--foreground)]">{completeness}%</span></div>
              <p className="text-xs text-[var(--muted-foreground)]">{completeness >= 100 ? 'All set!' : `Add ${missing.slice(0, 2).join(', ')} to improve.`}</p>
              {completeness < 100 && <Link href="/investments/profile" className="mt-3 inline-block text-xs font-semibold text-indigo-600 hover:underline">Complete profile →</Link>}
            </Card>
            <Card title="Investor Profile" icon="👤" action={<Link href="/investments/profile" className="text-xs text-indigo-600 hover:underline">Edit</Link>}>
              <dl className="space-y-3">
                <Row label="Country" value={profile.country ?? '—'} />
                <Row label="Goal" value={profile.goal ?? '—'} />
                <Row label="Risk Tolerance" value={profile.riskTolerance ?? '—'} badge />
                <Row label="Experience" value={profile.experienceLevel ?? '—'} />
                <Row label="Initial" value={fmt(profile.initialInvestment ?? 0)} />
                <Row label="Monthly" value={`${fmt(profile.monthlyContribution ?? 0)}/mo`} />
                <Row label="Horizon" value={`${years} years`} />
                {profile.annualIncome ? <Row label="Annual Income" value={fmt(profile.annualIncome)} /> : null}
              </dl>
            </Card>
            <Card title="Address & Identity" icon="🪪" action={<Link href="/investments/profile" className="text-xs text-indigo-600 hover:underline">Edit</Link>}>
              <dl className="space-y-3">
                <Row label="Address" value={fullAddress || 'Not provided'} />
                <Row label="ID Document" value={profile.govIdType || 'Not provided'} />
                {profile.govIdNumber ? <Row label="ID Number" value={maskId(profile.govIdNumber)} /> : null}
                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between"><dt className="text-xs text-[var(--muted-foreground)]">KYC</dt><dd className={`text-xs font-semibold rounded-full px-2 py-0.5 ${kyc ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30' : 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30'}`}>{kyc ? '✓ On file' : '⚠ Incomplete'}</dd></div>
              </dl>
            </Card>
            <Card title="Risk Appetite" icon="⚖️">
              <ResponsiveContainer width="100%" height={160}><RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: riskScore, fill: riskColor }]} startAngle={90} endAngle={-270}><RadialBar background dataKey="value" cornerRadius={12} /></RadialBarChart></ResponsiveContainer>
              <div className="text-center -mt-24 mb-12 pointer-events-none"><p className="text-xl font-extrabold" style={{ color: riskColor }}>{profile.riskTolerance}</p></div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {best && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-2xl">{best.product.flag}</span><div><p className="text-white font-bold">{best.product.provider} — {best.product.productName}</p><p className="text-xs text-white/70">Your best-matched product · {best.product.country}</p></div></div><span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">Match {best.matchScore}</span></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[var(--border)]">
                  <Stat label="Exp. Return" value={`${best.projectedReturn}%`} sub={`${best.product.riskLevel} risk`} />
                  <Stat label="Projected" value={fmt(best.projectedValue)} sub={`in ${years} yrs`} />
                  <Stat label="Total Gain" value={fmt(best.totalGain)} sub="Est. profit" />
                  <Stat label="Annual Fee" value={`${best.product.annualFee}%`} sub="Expense ratio" />
                </div>
                <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-3"><div className="flex flex-wrap gap-2">{best.product.features.slice(0, 2).map(f => <span key={f} className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs text-[var(--muted-foreground)]">✓ {f}</span>)}</div><Link href="/investments/compare" className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white hover:opacity-90">Open account →</Link></div>
              </div>
            )}
            <Card title={`Projected Growth Over ${years} Years`} icon="📈">
              <ResponsiveContainer width="100%" height={260}><AreaChart data={growth}>
                <defs><linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tickFormatter={v => `${cur}${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} /><Tooltip formatter={(v) => fmt(Number(v))} /><Legend />
                <Area type="monotone" dataKey="Value" stroke="#6366f1" fill="url(#valGrad)" strokeWidth={2} /><Area type="monotone" dataKey="Contributed" stroke="#10b981" fill="transparent" strokeWidth={2} strokeDasharray="4 2" />
              </AreaChart></ResponsiveContainer>
            </Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card title="Contributions vs Gains" icon="🥧">
                <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={allocation} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2}>{allocation.map((_, i) => <Cell key={i} fill={PIE[i]} />)}</Pie><Tooltip formatter={(v) => fmt(Number(v))} /><Legend /></PieChart></ResponsiveContainer>
              </Card>
              <Card title="Provider Comparison" icon="🏦">
                <ResponsiveContainer width="100%" height={220}><BarChart data={comparison} layout="vertical" margin={{ left: 10 }}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis type="number" tickFormatter={v => `${cur}${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} /><Tooltip formatter={(v) => fmt(Number(v))} /><Bar dataKey="Projected Value" fill="#6366f1" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer>
              </Card>
            </div>
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
  return <div className="flex items-center justify-between gap-3"><dt className="text-xs text-[var(--muted-foreground)]">{label}</dt>{badge ? <dd className="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 rounded-full px-2 py-0.5">{value}</dd> : <dd className="text-sm font-medium text-[var(--foreground)] text-right">{value}</dd>}</div>;
}
function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="px-4 py-3 text-center"><p className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)] mb-1">{label}</p><p className="text-base font-bold text-[var(--foreground)]">{value}</p><p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{sub}</p></div>;
}
