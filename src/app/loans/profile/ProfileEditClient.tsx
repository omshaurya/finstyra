"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const COUNTRIES = ['United States','United Kingdom','Germany','France','Spain','Italy','Netherlands','Belgium','Sweden','Switzerland','Canada','Australia','Other'];
const EU_COUNTRIES = ['United Kingdom','Germany','France','Spain','Italy','Netherlands','Belgium','Sweden','Switzerland'];
const EMPLOYMENT = ['Employed Full-Time','Self-Employed','Business Owner','Student','Retired','Part-Time','Unemployed'];
const CREDIT_SCORES = ['Excellent (800+)','Very Good (740–799)','Good (670–739)','Fair (580–669)','Poor (<580)','Not Sure'];
const PURPOSES = ['Home Purchase','Car Purchase','Debt Consolidation','Home Improvement','Education','Business','Medical','Wedding','Vacation','Emergency','Other'];
const MARITAL = ['Single','Married','Divorced','Widowed','Domestic Partnership'];
const HOUSING = ['Own outright','Mortgage','Renting','Living with family','Other'];
const TERMS = [12, 24, 36, 48, 60, 84, 120];

const GOV_ID_TYPES: Record<'us' | 'eu' | 'other', string[]> = {
  us: ['Social Security Number (SSN)', 'ITIN', "Driver's License", 'State ID', 'US Passport'],
  eu: ['National ID Card', 'Passport', 'Residence Permit', 'Tax Identification Number (TIN)'],
  other: ['Passport', 'National ID', "Driver's License"],
};

function residencyOf(country: string): 'us' | 'eu' | 'other' {
  if (country === 'United States') return 'us';
  if (EU_COUNTRIES.includes(country)) return 'eu';
  return 'other';
}

interface FormState {
  name: string;
  phone: string;
  dateOfBirth: string;
  country: string;
  nationality: string;
  maritalStatus: string;
  dependents: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  yearsAtAddress: string;
  housingStatus: string;
  govIdType: string;
  govIdNumber: string;
  taxIdNumber: string;
  employmentStatus: string;
  employerName: string;
  annualIncome: string;
  monthlyExpenses: string;
  creditScoreRange: string;
  existingMonthlyDebt: string;
  loanPurpose: string;
  desiredAmount: string;
  desiredTermMonths: string;
}

const EMPTY: FormState = {
  name: '', phone: '', dateOfBirth: '', country: 'United States', nationality: '', maritalStatus: 'Single', dependents: '0',
  addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', yearsAtAddress: '0', housingStatus: 'Renting',
  govIdType: '', govIdNumber: '', taxIdNumber: '',
  employmentStatus: 'Employed Full-Time', employerName: '', annualIncome: '', monthlyExpenses: '', creditScoreRange: 'Good (670–739)', existingMonthlyDebt: '',
  loanPurpose: 'Home Purchase', desiredAmount: '', desiredTermMonths: '36',
};

export default function ProfileEditClient() {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/loans'); return; }

    fetch('/api/user/profile')
      .then(r => r.json())
      .then(data => {
        setAvatar(data.account?.avatar || '');
        const p = data.profile;
        setForm(f => ({
          ...f,
          name: data.account?.name || '',
          ...(p ? {
            phone: p.phone ?? '', dateOfBirth: p.dateOfBirth ?? '', country: p.country ?? 'United States',
            nationality: p.nationality ?? '', maritalStatus: p.maritalStatus ?? 'Single', dependents: String(p.dependents ?? 0),
            addressLine1: p.addressLine1 ?? '', addressLine2: p.addressLine2 ?? '', city: p.city ?? '', state: p.state ?? '',
            postalCode: p.postalCode ?? '', yearsAtAddress: String(p.yearsAtAddress ?? 0), housingStatus: p.housingStatus ?? 'Renting',
            govIdType: p.govIdType ?? '', govIdNumber: p.govIdNumber ?? '', taxIdNumber: p.taxIdNumber ?? '',
            employmentStatus: p.employmentStatus ?? 'Employed Full-Time', employerName: p.employerName ?? '',
            annualIncome: p.annualIncome ? String(p.annualIncome) : '', monthlyExpenses: p.monthlyExpenses ? String(p.monthlyExpenses) : '',
            creditScoreRange: p.creditScoreRange ?? 'Good (670–739)', existingMonthlyDebt: p.existingMonthlyDebt ? String(p.existingMonthlyDebt) : '',
            loanPurpose: p.loanPurpose ?? 'Home Purchase', desiredAmount: p.desiredAmount ? String(p.desiredAmount) : '',
            desiredTermMonths: String(p.desiredTermMonths ?? 36),
          } : {}),
        }));
      })
      .catch(() => setError('Could not load your profile.'))
      .finally(() => setLoading(false));
  }, [user, isLoading, router]);

  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));
  const residency = residencyOf(form.country);
  const idOptions = GOV_ID_TYPES[residency];

  const handleAvatarPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    if (file.size > 1_000_000) { setError('Image must be under 1MB.'); return; }

    setError('');
    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await fetch('/api/user/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar: dataUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        setAvatar(dataUrl);
        await refreshUser();
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = async () => {
    setUploadingAvatar(true);
    try {
      await fetch('/api/user/avatar', { method: 'DELETE' });
      setAvatar('');
      await refreshUser();
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        country: form.country,
        nationality: form.nationality,
        maritalStatus: form.maritalStatus,
        dependents: Number(form.dependents) || 0,
        residency,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        yearsAtAddress: Number(form.yearsAtAddress) || 0,
        housingStatus: form.housingStatus,
        govIdType: form.govIdType,
        govIdNumber: form.govIdNumber,
        taxIdNumber: form.taxIdNumber,
        employmentStatus: form.employmentStatus,
        employerName: form.employerName,
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
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save changes.');
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <svg className="w-8 h-8 animate-spin text-[var(--primary)]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  const input = "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 px-4 py-8">
        <div className="mx-auto max-w-4xl flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link href="/loans/dashboard" className="text-xs text-white/70 hover:text-white">← Back to dashboard</Link>
            <h1 className="text-2xl font-extrabold text-white mt-1">Edit Profile</h1>
            <p className="text-sm text-white/70">Keep your details current for accurate loan matching</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* Profile picture */}
        <Section title="Profile Picture" icon="📷">
          <div className="flex items-center gap-5">
            <div className="relative">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="Profile" className="h-20 w-20 rounded-2xl object-cover ring-2 ring-[var(--border)]" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white">
                  {form.name.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40">
                  <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarPick} className="hidden" />
              <div className="flex gap-2">
                <button onClick={() => fileRef.current?.click()} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                  Upload Photo
                </button>
                {avatar && (
                  <button onClick={removeAvatar} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]">
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-2">JPG, PNG or GIF · Max 1MB</p>
            </div>
          </div>
        </Section>

        {/* Personal details */}
        <Section title="Personal Details" icon="👤">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name"><input className={input} value={form.name} onChange={e => set('name', e.target.value)} /></Field>
            <Field label="Phone"><input className={input} type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 000 0000" /></Field>
            <Field label="Date of Birth"><input className={input} type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} /></Field>
            <Field label="Nationality"><input className={input} value={form.nationality} onChange={e => set('nationality', e.target.value)} placeholder="e.g. American, German" /></Field>
            <Field label="Marital Status"><select className={input} value={form.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}>{MARITAL.map(m => <option key={m}>{m}</option>)}</select></Field>
            <Field label="Number of Dependents"><input className={input} type="number" min="0" value={form.dependents} onChange={e => set('dependents', e.target.value)} /></Field>
          </div>
        </Section>

        {/* Address */}
        <Section title="Residential Address" icon="🏠">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Country of Residence" full><select className={input} value={form.country} onChange={e => set('country', e.target.value)}>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Address Line 1" full><input className={input} value={form.addressLine1} onChange={e => set('addressLine1', e.target.value)} placeholder="Street address" /></Field>
            <Field label="Address Line 2" full><input className={input} value={form.addressLine2} onChange={e => set('addressLine2', e.target.value)} placeholder="Apartment, suite, unit (optional)" /></Field>
            <Field label="City"><input className={input} value={form.city} onChange={e => set('city', e.target.value)} /></Field>
            <Field label={residency === 'us' ? 'State' : 'State / Region'}><input className={input} value={form.state} onChange={e => set('state', e.target.value)} /></Field>
            <Field label={residency === 'us' ? 'ZIP Code' : 'Postal Code'}><input className={input} value={form.postalCode} onChange={e => set('postalCode', e.target.value)} /></Field>
            <Field label="Years at Address"><input className={input} type="number" min="0" step="0.5" value={form.yearsAtAddress} onChange={e => set('yearsAtAddress', e.target.value)} /></Field>
            <Field label="Housing Status" full><select className={input} value={form.housingStatus} onChange={e => set('housingStatus', e.target.value)}>{HOUSING.map(h => <option key={h}>{h}</option>)}</select></Field>
          </div>
        </Section>

        {/* Government / KYC */}
        <Section title="Identity & Tax Documents" icon="🪪" badge={residency === 'us' ? 'US KYC' : residency === 'eu' ? 'EU KYC' : 'KYC'}>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2.5 mb-4 flex items-start gap-2">
            <span className="text-amber-500">🔒</span>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Required by {residency === 'us' ? 'US' : residency === 'eu' ? 'EU' : 'local'} lenders to verify your identity (KYC/AML). Your documents are stored securely and only shared with a lender when you apply.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="ID Document Type">
              <select className={input} value={form.govIdType} onChange={e => set('govIdType', e.target.value)}>
                <option value="">Select document…</option>
                {idOptions.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="ID Number"><input className={input} value={form.govIdNumber} onChange={e => set('govIdNumber', e.target.value)} placeholder={residency === 'us' ? 'e.g. SSN ●●●-●●-●●●●' : 'Document number'} /></Field>
            <Field label={residency === 'us' ? 'Tax ID (TIN/EIN, optional)' : 'Tax Identification Number (optional)'} full>
              <input className={input} value={form.taxIdNumber} onChange={e => set('taxIdNumber', e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* Employment */}
        <Section title="Employment" icon="💼">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Employment Status"><select className={input} value={form.employmentStatus} onChange={e => set('employmentStatus', e.target.value)}>{EMPLOYMENT.map(e => <option key={e}>{e}</option>)}</select></Field>
            <Field label="Employer Name"><input className={input} value={form.employerName} onChange={e => set('employerName', e.target.value)} /></Field>
          </div>
        </Section>

        {/* Financial */}
        <Section title="Financial Details" icon="💰">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Annual Income"><input className={input} type="number" min="0" value={form.annualIncome} onChange={e => set('annualIncome', e.target.value)} /></Field>
            <Field label="Monthly Expenses"><input className={input} type="number" min="0" value={form.monthlyExpenses} onChange={e => set('monthlyExpenses', e.target.value)} /></Field>
            <Field label="Credit Score Range"><select className={input} value={form.creditScoreRange} onChange={e => set('creditScoreRange', e.target.value)}>{CREDIT_SCORES.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Existing Monthly Debt"><input className={input} type="number" min="0" value={form.existingMonthlyDebt} onChange={e => set('existingMonthlyDebt', e.target.value)} /></Field>
          </div>
        </Section>

        {/* Loan preferences */}
        <Section title="Loan Preferences" icon="🎯">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Loan Purpose"><select className={input} value={form.loanPurpose} onChange={e => set('loanPurpose', e.target.value)}>{PURPOSES.map(p => <option key={p}>{p}</option>)}</select></Field>
            <Field label="Desired Amount"><input className={input} type="number" min="0" value={form.desiredAmount} onChange={e => set('desiredAmount', e.target.value)} /></Field>
            <Field label="Preferred Term"><select className={input} value={form.desiredTermMonths} onChange={e => set('desiredTermMonths', e.target.value)}>{TERMS.map(t => <option key={t} value={t}>{t} months</option>)}</select></Field>
          </div>
        </Section>

        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        {/* Sticky save bar */}
        <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg px-5 py-3">
          <p className="text-xs text-[var(--muted-foreground)]">
            {saved ? <span className="text-green-600 dark:text-green-400 font-semibold">✓ Changes saved</span> : 'Changes are saved to your account'}
          </p>
          <div className="flex gap-2">
            <Link href="/loans/dashboard" className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]">Cancel</Link>
            <button onClick={handleSave} disabled={saving} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, icon, badge, children }: { title: string; icon: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h2 className="font-semibold text-[var(--foreground)]">{title}</h2>
        {badge && <span className="ml-auto rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 text-[10px] font-bold">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-semibold text-[var(--muted-foreground)] mb-1.5">{label}</label>
      {children}
    </div>
  );
}
