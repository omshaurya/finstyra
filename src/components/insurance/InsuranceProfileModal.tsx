"use client";
import { useState } from 'react';

export interface InsuranceProfileData {
  phone: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  country: string;
  smoker: boolean;
  coverageType: string;
  coverageAmount: number;
  dependents: number;
  riskFactors: string;
}

interface Props {
  userName: string;
  onClose: () => void;
  onSuccess: (profile: InsuranceProfileData) => void;
}

const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Switzerland', 'Canada', 'Other'];
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const COVERAGE = ['Health', 'Life Cover', 'Auto', 'Home', 'Travel'];
const RISK = [{ v: 'low', l: 'Low — healthy, safe record' }, { v: 'medium', l: 'Medium — average' }, { v: 'high', l: 'High — some risk factors' }];
const STEPS = ['About You', 'Coverage Need'];

export default function InsuranceProfileModal({ userName, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    phone: '', dateOfBirth: '', gender: 'Male', country: 'United States', smoker: 'no',
    coverageType: 'Health', coverageAmount: '500000', dependents: '0', riskFactors: 'medium',
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const ageFromDob = (dob: string) => dob ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000)) : 30;

  const save = async () => {
    setSaving(true); setError('');
    try {
      const profile: InsuranceProfileData = {
        phone: form.phone, dateOfBirth: form.dateOfBirth, age: ageFromDob(form.dateOfBirth),
        gender: form.gender, country: form.country, smoker: form.smoker === 'yes',
        coverageType: form.coverageType, coverageAmount: Number(form.coverageAmount) || 0,
        dependents: Number(form.dependents) || 0, riskFactors: form.riskFactors,
      };
      const res = await fetch('/api/user/insurance/profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error('Failed to save profile');
      setDone(true);
      setTimeout(() => onSuccess(profile), 1200);
    } catch (e) {
      setError((e as Error).message);
    } finally { setSaving(false); }
  };

  const inp = "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]";
  const lbl = "block text-xs font-semibold text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden animate-fadeInUp max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 text-white shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <p className="text-sm text-white/80">Welcome, {userName}!</p>
          <h2 className="text-lg font-bold mt-0.5">Get Your Insurance Quotes</h2>
          <div className="flex items-center gap-2 mt-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i + 1 <= step ? 'bg-white text-emerald-600' : 'bg-white/20 text-white/60'}`}>{i + 1 < step ? '✓' : i + 1}</div>
                <span className={`text-xs ${i + 1 === step ? 'text-white font-medium' : 'text-white/60'}`}>{s}</span>
                {i < STEPS.length - 1 && <div className="w-4 h-px bg-white/30" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {done ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-3xl mb-4">✓</div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Profile Saved!</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Finding your best insurance matches…</p>
            </div>
          ) : (
            <div className="space-y-4">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={lbl}>Date of Birth</label><input type="date" className={inp} value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} /></div>
                    <div><label className={lbl}>Gender</label><select className={inp} value={form.gender} onChange={e => set('gender', e.target.value)}>{GENDERS.map(g => <option key={g}>{g}</option>)}</select></div>
                  </div>
                  <div><label className={lbl}>Country</label><select className={inp} value={form.country} onChange={e => set('country', e.target.value)}>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select></div>
                  <div><label className={lbl}>Phone (optional)</label><input type="tel" className={inp} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 000 0000" /></div>
                  <div>
                    <label className={lbl}>Do you smoke?</label>
                    <div className="flex gap-2">
                      {['no', 'yes'].map(v => (
                        <button key={v} onClick={() => set('smoker', v)} className={`flex-1 rounded-xl border px-4 py-2 text-sm font-medium capitalize ${form.smoker === v ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'border-[var(--border)] text-[var(--muted-foreground)]'}`}>{v === 'no' ? 'Non-smoker' : 'Smoker'}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div><label className={lbl}>Coverage Type</label><select className={inp} value={form.coverageType} onChange={e => set('coverageType', e.target.value)}>{COVERAGE.map(c => <option key={c}>{c}</option>)}</select></div>
                  <div><label className={lbl}>Coverage Amount</label><input type="number" className={inp} value={form.coverageAmount} onChange={e => set('coverageAmount', e.target.value)} placeholder="500000" /></div>
                  <div><label className={lbl}>Dependents / Beneficiaries</label><input type="number" min="0" className={inp} value={form.dependents} onChange={e => set('dependents', e.target.value)} /></div>
                  <div><label className={lbl}>Risk Profile</label><select className={inp} value={form.riskFactors} onChange={e => set('riskFactors', e.target.value)}>{RISK.map(r => <option key={r.v} value={r.v}>{r.l}</option>)}</select></div>
                  {error && <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2.5 text-xs text-red-600 dark:text-red-400">{error}</div>}
                </>
              )}
            </div>
          )}
        </div>

        {!done && (
          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : onClose()} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]">{step > 1 ? '← Back' : 'Skip'}</button>
            {step < 2 ? (
              <button onClick={() => setStep(s => s + 1)} className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2 text-sm font-semibold text-white hover:opacity-90">Next →</button>
            ) : (
              <button onClick={save} disabled={saving} className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">{saving ? 'Saving…' : 'Get Matches →'}</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
