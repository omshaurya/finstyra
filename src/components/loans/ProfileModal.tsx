"use client";
import { useState } from 'react';

interface Props {
  userName: string;
  onClose: () => void;
  onSuccess: (profile: ProfileData) => void;
}

export interface ProfileData {
  phone: string;
  dateOfBirth: string;
  country: string;
  employmentStatus: string;
  annualIncome: number;
  monthlyExpenses: number;
  creditScoreRange: string;
  existingMonthlyDebt: number;
  loanPurpose: string;
  desiredAmount: number;
  desiredTermMonths: number;
}

const COUNTRIES = ['United States','United Kingdom','Germany','France','Spain','Italy','Netherlands','Belgium','Sweden','Switzerland','Canada','Australia','Other'];
const EMPLOYMENT = ['Employed Full-Time','Self-Employed','Business Owner','Student','Retired','Part-Time','Unemployed'];
const CREDIT_SCORES = ['Excellent (800+)','Very Good (740–799)','Good (670–739)','Fair (580–669)','Poor (<580)','Not Sure'];
const PURPOSES = ['Home Purchase','Car Purchase','Debt Consolidation','Home Improvement','Education','Business','Medical','Wedding','Vacation','Emergency','Other'];
const TERMS = [12, 24, 36, 48, 60, 84, 120];

const STEPS = ['Personal Info', 'Finances', 'Loan Need'];

export default function ProfileModal({ userName, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    phone: '', dateOfBirth: '', country: 'United States',
    employmentStatus: 'Employed Full-Time',
    annualIncome: '', monthlyExpenses: '', creditScoreRange: 'Good (670–739)', existingMonthlyDebt: '',
    loanPurpose: 'Home Purchase', desiredAmount: '', desiredTermMonths: '36',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const profile: ProfileData = {
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        country: form.country,
        employmentStatus: form.employmentStatus,
        annualIncome: Number(form.annualIncome) || 0,
        monthlyExpenses: Number(form.monthlyExpenses) || 0,
        creditScoreRange: form.creditScoreRange,
        existingMonthlyDebt: Number(form.existingMonthlyDebt) || 0,
        loanPurpose: form.loanPurpose,
        desiredAmount: Number(form.desiredAmount) || 0,
        desiredTermMonths: Number(form.desiredTermMonths),
      };

      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error('Failed to save profile');
      setDone(true);
      setTimeout(() => onSuccess(profile), 1500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors";
  const labelCls = "block text-xs font-semibold text-[var(--muted-foreground)] mb-1.5 uppercase tracking-wide";
  const selectCls = inputCls + " cursor-pointer";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden animate-fadeInUp max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5 text-white shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="text-sm text-white/80">Welcome, {userName}!</p>
          <h2 className="text-lg font-bold mt-0.5">Complete Your Profile</h2>
          <p className="text-xs text-white/70 mt-1">Takes 2 minutes · Helps us find your best matches</p>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mt-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  i + 1 < step ? 'bg-white text-indigo-600' : i + 1 === step ? 'bg-white/30 text-white ring-2 ring-white' : 'bg-white/10 text-white/50'
                }`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs ${i + 1 === step ? 'text-white font-medium' : 'text-white/60'}`}>{s}</span>
                {i < STEPS.length - 1 && <div className="w-4 h-px bg-white/30" />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {done ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-3xl mb-4">✓</div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Profile Complete!</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Finding your best loan matches…</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Phone (optional)</label>
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 000 0000" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Date of Birth</label>
                      <input type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Country of Residence</label>
                    <select value={form.country} onChange={e => set('country', e.target.value)} className={selectCls}>
                      {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Employment Status</label>
                    <select value={form.employmentStatus} onChange={e => set('employmentStatus', e.target.value)} className={selectCls}>
                      {EMPLOYMENT.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Step 2: Financial Info */}
              {step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Annual Income</label>
                      <input type="number" value={form.annualIncome} onChange={e => set('annualIncome', e.target.value)} placeholder="60000" min="0" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Monthly Expenses</label>
                      <input type="number" value={form.monthlyExpenses} onChange={e => set('monthlyExpenses', e.target.value)} placeholder="2500" min="0" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Credit Score Range</label>
                    <select value={form.creditScoreRange} onChange={e => set('creditScoreRange', e.target.value)} className={selectCls}>
                      {CREDIT_SCORES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Existing Monthly Debt Payments</label>
                    <input type="number" value={form.existingMonthlyDebt} onChange={e => set('existingMonthlyDebt', e.target.value)} placeholder="500" min="0" className={inputCls} />
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-1">Car payments, other loans, credit card minimums, etc.</p>
                  </div>
                </>
              )}

              {/* Step 3: Loan Requirements */}
              {step === 3 && (
                <>
                  <div>
                    <label className={labelCls}>Loan Purpose</label>
                    <select value={form.loanPurpose} onChange={e => set('loanPurpose', e.target.value)} className={selectCls}>
                      {PURPOSES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Desired Loan Amount</label>
                    <input type="number" value={form.desiredAmount} onChange={e => set('desiredAmount', e.target.value)} placeholder="25000" min="0" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Preferred Loan Term</label>
                    <select value={form.desiredTermMonths} onChange={e => set('desiredTermMonths', e.target.value)} className={selectCls}>
                      {TERMS.map(t => <option key={t} value={t}>{t} months ({Math.round(t / 12 * 10) / 10} years)</option>)}
                    </select>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2.5 text-xs text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-[var(--border)] bg-[var(--card)]">
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              {step > 1 ? '← Back' : 'Skip for now'}
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save & Find Matches →'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
