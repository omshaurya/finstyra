"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy', 'Switzerland', 'Canada', 'Other'];
const EU = ['United Kingdom', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy', 'Switzerland'];
const GOALS = ['Retirement', 'Build Wealth', 'Passive Income', 'Hands-Off Investing', 'Active Trading', 'Education Fund', 'Speculative Growth', 'Safe Haven', 'Capital Preservation'];
const RISK = ['Conservative', 'Moderate', 'Aggressive'];
const EXPERIENCE = ['Beginner', 'Intermediate', 'Experienced'];
const EMPLOYMENT = ['Employed Full-Time', 'Self-Employed', 'Business Owner', 'Student', 'Retired', 'Unemployed'];
const HORIZONS = [3, 5, 10, 15, 20, 30];
const GOV: Record<'us' | 'eu' | 'other', string[]> = { us: ['Social Security Number (SSN)', "Driver's License", 'State ID', 'US Passport'], eu: ['National ID Card', 'Passport', 'Residence Permit', 'Tax Identification Number (TIN)'], other: ['Passport', 'National ID'] };
const resOf = (c: string): 'us' | 'eu' | 'other' => c === 'United States' ? 'us' : EU.includes(c) ? 'eu' : 'other';

export default function InvestmentsProfileEditClient() {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [f, setF] = useState({
    name: '', phone: '', country: 'United States', nationality: '', addressLine1: '', city: '', state: '', postalCode: '',
    employmentStatus: 'Employed Full-Time', annualIncome: '', goal: 'Build Wealth', riskTolerance: 'Moderate', experienceLevel: 'Beginner',
    initialInvestment: '5000', monthlyContribution: '500', timeHorizonYears: '10', existingPortfolio: '', govIdType: '', govIdNumber: '',
  });
  const set = (k: string, v: string) => setF(s => ({ ...s, [k]: v }));

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/investments'); return; }
    fetch('/api/user/investment/profile').then(r => r.json()).then(d => {
      setAvatar(d.account?.avatar || '');
      const p = d.profile;
      setF(s => ({ ...s, name: d.account?.name || '', ...(p ? { phone: p.phone ?? '', country: p.country ?? 'United States', nationality: p.nationality ?? '', addressLine1: p.addressLine1 ?? '', city: p.city ?? '', state: p.state ?? '', postalCode: p.postalCode ?? '', employmentStatus: p.employmentStatus ?? 'Employed Full-Time', annualIncome: p.annualIncome ? String(p.annualIncome) : '', goal: p.goal ?? 'Build Wealth', riskTolerance: p.riskTolerance ?? 'Moderate', experienceLevel: p.experienceLevel ?? 'Beginner', initialInvestment: String(p.initialInvestment ?? 5000), monthlyContribution: String(p.monthlyContribution ?? 500), timeHorizonYears: String(p.timeHorizonYears ?? 10), existingPortfolio: p.existingPortfolio ? String(p.existingPortfolio) : '', govIdType: p.govIdType ?? '', govIdNumber: p.govIdNumber ?? '' } : {}) }));
    }).catch(() => setError('Could not load your profile.')).finally(() => setLoading(false));
  }, [user, isLoading, router]);

  const residency = resOf(f.country);

  const pickAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 1_000_000) { setError('Image must be under 1MB.'); return; }
    setUploading(true); setError('');
    const reader = new FileReader();
    reader.onload = async () => { const url = reader.result as string; try { const r = await fetch('/api/user/avatar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ avatar: url }) }); if (!r.ok) throw new Error('Upload failed'); setAvatar(url); await refreshUser(); } catch (er) { setError((er as Error).message); } finally { setUploading(false); } };
    reader.readAsDataURL(file);
  };
  const removeAvatar = async () => { setUploading(true); try { await fetch('/api/user/avatar', { method: 'DELETE' }); setAvatar(''); await refreshUser(); } finally { setUploading(false); } };

  const save = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      const res = await fetch('/api/user/investment/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: f.name, phone: f.phone, country: f.country, nationality: f.nationality, residency, addressLine1: f.addressLine1, city: f.city, state: f.state, postalCode: f.postalCode, employmentStatus: f.employmentStatus, annualIncome: Number(f.annualIncome) || 0, goal: f.goal, riskTolerance: f.riskTolerance, experienceLevel: f.experienceLevel, initialInvestment: Number(f.initialInvestment) || 0, monthlyContribution: Number(f.monthlyContribution) || 0, timeHorizonYears: Number(f.timeHorizonYears) || 10, existingPortfolio: Number(f.existingPortfolio) || 0, govIdType: f.govIdType, govIdNumber: f.govIdNumber }) });
      if (!res.ok) throw new Error('Failed to save changes.');
      await refreshUser(); setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch (e) { setError((e as Error).message); } finally { setSaving(false); }
  };

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--background)]"><svg className="w-8 h-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;

  const inp = "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-indigo-500";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 px-4 py-8"><div className="mx-auto max-w-4xl"><Link href="/investments/dashboard" className="text-xs text-white/70 hover:text-white">← Back to dashboard</Link><h1 className="text-2xl font-extrabold text-white mt-1">Edit Investor Profile</h1></div></section>
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <Section title="Profile Picture" icon="📷">
          <div className="flex items-center gap-5">
            <div className="relative">{avatar ? <img src={avatar} alt="Profile" className="h-20 w-20 rounded-2xl object-cover ring-2 ring-[var(--border)]" /> : <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white">{f.name.charAt(0).toUpperCase() || '?'}</div>}{uploading && <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40"><svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>}</div>
            <div><input ref={fileRef} type="file" accept="image/*" onChange={pickAvatar} className="hidden" /><div className="flex gap-2"><button onClick={() => fileRef.current?.click()} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white">Upload Photo</button>{avatar && <button onClick={removeAvatar} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]">Remove</button>}</div><p className="text-xs text-[var(--muted-foreground)] mt-2">Max 1MB</p></div>
          </div>
        </Section>
        <Section title="Personal Details" icon="👤">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name"><input className={inp} value={f.name} onChange={e => set('name', e.target.value)} /></Field>
            <Field label="Phone"><input className={inp} value={f.phone} onChange={e => set('phone', e.target.value)} /></Field>
            <Field label="Nationality"><input className={inp} value={f.nationality} onChange={e => set('nationality', e.target.value)} /></Field>
            <Field label="Employment"><select className={inp} value={f.employmentStatus} onChange={e => set('employmentStatus', e.target.value)}>{EMPLOYMENT.map(x => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Annual Income"><input type="number" className={inp} value={f.annualIncome} onChange={e => set('annualIncome', e.target.value)} /></Field>
          </div>
        </Section>
        <Section title="Residential Address" icon="🏠">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Country" full><select className={inp} value={f.country} onChange={e => set('country', e.target.value)}>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Address" full><input className={inp} value={f.addressLine1} onChange={e => set('addressLine1', e.target.value)} placeholder="Street address" /></Field>
            <Field label="City"><input className={inp} value={f.city} onChange={e => set('city', e.target.value)} /></Field>
            <Field label={residency === 'us' ? 'State' : 'Region'}><input className={inp} value={f.state} onChange={e => set('state', e.target.value)} /></Field>
            <Field label={residency === 'us' ? 'ZIP' : 'Postal Code'}><input className={inp} value={f.postalCode} onChange={e => set('postalCode', e.target.value)} /></Field>
          </div>
        </Section>
        <Section title="Identity Document (KYC)" icon="🪪" badge={residency === 'us' ? 'US KYC' : residency === 'eu' ? 'EU KYC' : 'KYC'}>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2.5 mb-4 text-xs text-amber-700 dark:text-amber-400">🔒 Brokers require identity verification (KYC/AML) before you can fund an account.</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Document Type"><select className={inp} value={f.govIdType} onChange={e => set('govIdType', e.target.value)}><option value="">Select…</option>{GOV[residency].map(t => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Document Number"><input className={inp} value={f.govIdNumber} onChange={e => set('govIdNumber', e.target.value)} /></Field>
          </div>
        </Section>
        <Section title="Investment Plan" icon="🎯">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Goal"><select className={inp} value={f.goal} onChange={e => set('goal', e.target.value)}>{GOALS.map(g => <option key={g}>{g}</option>)}</select></Field>
            <Field label="Risk Tolerance"><select className={inp} value={f.riskTolerance} onChange={e => set('riskTolerance', e.target.value)}>{RISK.map(r => <option key={r}>{r}</option>)}</select></Field>
            <Field label="Experience"><select className={inp} value={f.experienceLevel} onChange={e => set('experienceLevel', e.target.value)}>{EXPERIENCE.map(x => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Time Horizon"><select className={inp} value={f.timeHorizonYears} onChange={e => set('timeHorizonYears', e.target.value)}>{HORIZONS.map(h => <option key={h} value={h}>{h} years</option>)}</select></Field>
            <Field label="Initial Investment"><input type="number" className={inp} value={f.initialInvestment} onChange={e => set('initialInvestment', e.target.value)} /></Field>
            <Field label="Monthly Contribution"><input type="number" className={inp} value={f.monthlyContribution} onChange={e => set('monthlyContribution', e.target.value)} /></Field>
            <Field label="Existing Portfolio (optional)" full><input type="number" className={inp} value={f.existingPortfolio} onChange={e => set('existingPortfolio', e.target.value)} /></Field>
          </div>
        </Section>
        {error && <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</div>}
        <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg px-5 py-3">
          <p className="text-xs text-[var(--muted-foreground)]">{saved ? <span className="text-green-600 dark:text-green-400 font-semibold">✓ Saved</span> : 'Saved to your account'}</p>
          <div className="flex gap-2"><Link href="/investments/dashboard" className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]">Cancel</Link><button onClick={save} disabled={saving} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">{saving ? 'Saving…' : 'Save Changes'}</button></div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, icon, badge, children }: { title: string; icon: string; badge?: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"><div className="flex items-center gap-2 mb-4"><span className="text-lg">{icon}</span><h2 className="font-semibold text-[var(--foreground)]">{title}</h2>{badge && <span className="ml-auto rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 text-[10px] font-bold">{badge}</span>}</div>{children}</div>;
}
function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return <div className={full ? 'sm:col-span-2' : ''}><label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1.5">{label}</label>{children}</div>;
}
