"use client";
import { useState } from 'react';

export interface InvestmentProfileData {
  phone: string;
  country: string;
  goal: string;
  riskTolerance: string;
  experienceLevel: string;
  initialInvestment: number;
  monthlyContribution: number;
  timeHorizonYears: number;
  annualIncome: number;
}

interface Props {
  userName: string;
  onClose: () => void;
  onSuccess: (profile: InvestmentProfileData) => void;
}

const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy', 'Switzerland', 'Canada', 'Other'];
const GOALS = ['Retirement', 'Build Wealth', 'Passive Income', 'Hands-Off Investing', 'Active Trading', 'Education Fund', 'Speculative Growth', 'Safe Haven', 'Capital Preservation'];
const RISK = ['Conservative', 'Moderate', 'Aggressive'];
const EXPERIENCE = ['Beginner', 'Intermediate', 'Experienced'];
const HORIZONS = [3, 5, 10, 15, 20, 30];
const STEPS = ['Your Goals', 'Investment Plan'];

export default function InvestmentProfileModal({ userName, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    phone: '', country: 'United States', goal: 'Build Wealth', riskTolerance: 'Moderate', experienceLevel: 'Beginner',
    initialInvestment: '5000', monthlyContribution: '500', timeHorizonYears: '10', annualIncome: '',
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setError('');
    try {
      const profile: InvestmentProfileData = {
        phone: form.phone, country: form.country, goal: form.goal, riskTolerance: form.riskTolerance, experienceLevel: form.experienceLevel,
        initialInvestment: Number(form.initialInvestment) || 0, monthlyContribution: Number(form.monthlyContribution) || 0,
        timeHorizonYears: Number(form.timeHorizonYears) || 10, annualIncome: Number(form.annualIncome) || 0,
      };
      const res = await fetch('/api/user/investment/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
      if (!res.ok) throw new Error('Failed to save profile');
      setDone(true);
      setTimeout(() => onSuccess(profile), 1200);
    } catch (e) { setError((e as Error).message); } finally { setSaving(false); }
  };

  const inp = "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-indigo-500";
  const lbl = "block text-xs font-semibold text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden animate-fadeInUp max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5 text-white shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          <p className="text-sm text-white/80">Welcome, {userName}!</p>
          <h2 className="text-lg font-bold mt-0.5">Build Your Investment Plan</h2>
          <div className="flex items-center gap-2 mt-4">{STEPS.map((s, i) => (<div key={s} className="flex items-center gap-2"><div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i + 1 <= step ? 'bg-white text-indigo-600' : 'bg-white/20 text-white/60'}`}>{i + 1 < step ? '✓' : i + 1}</div><span className={`text-xs ${i + 1 === step ? 'text-white font-medium' : 'text-white/60'}`}>{s}</span>{i < STEPS.length - 1 && <div className="w-4 h-px bg-white/30" />}</div>))}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {done ? (
            <div className="flex flex-col items-center justify-center py-8 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-3xl mb-4">✓</div><h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Plan Saved!</h3><p className="text-sm text-[var(--muted-foreground)]">Building your projections…</p></div>
          ) : (
            <div className="space-y-4">
              {step === 1 && (<>
                <div><label className={lbl}>Investment Goal</label><select className={inp} value={form.goal} onChange={e => set('goal', e.target.value)}>{GOALS.map(g => <option key={g}>{g}</option>)}</select></div>
                <div><label className={lbl}>Risk Tolerance</label><div className="flex gap-2">{RISK.map(r => <button key={r} onClick={() => set('riskTolerance', r)} className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium ${form.riskTolerance === r ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600' : 'border-[var(--border)] text-[var(--muted-foreground)]'}`}>{r}</button>)}</div></div>
                <div><label className={lbl}>Experience Level</label><select className={inp} value={form.experienceLevel} onChange={e => set('experienceLevel', e.target.value)}>{EXPERIENCE.map(x => <option key={x}>{x}</option>)}</select></div>
                <div><label className={lbl}>Country</label><select className={inp} value={form.country} onChange={e => set('country', e.target.value)}>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select></div>
              </>)}
              {step === 2 && (<>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lbl}>Initial Investment</label><input type="number" className={inp} value={form.initialInvestment} onChange={e => set('initialInvestment', e.target.value)} /></div>
                  <div><label className={lbl}>Monthly Contribution</label><input type="number" className={inp} value={form.monthlyContribution} onChange={e => set('monthlyContribution', e.target.value)} /></div>
                </div>
                <div><label className={lbl}>Time Horizon</label><select className={inp} value={form.timeHorizonYears} onChange={e => set('timeHorizonYears', e.target.value)}>{HORIZONS.map(h => <option key={h} value={h}>{h} years</option>)}</select></div>
                <div><label className={lbl}>Annual Income (optional)</label><input type="number" className={inp} value={form.annualIncome} onChange={e => set('annualIncome', e.target.value)} /></div>
                {error && <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2.5 text-xs text-red-600 dark:text-red-400">{error}</div>}
              </>)}
            </div>
          )}
        </div>

        {!done && (
          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : onClose()} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]">{step > 1 ? '← Back' : 'Skip'}</button>
            {step < 2 ? <button onClick={() => setStep(s => s + 1)} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 text-sm font-semibold text-white hover:opacity-90">Next →</button> : <button onClick={save} disabled={saving} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">{saving ? 'Saving…' : 'See Projections →'}</button>}
          </div>
        )}
      </div>
    </div>
  );
}
