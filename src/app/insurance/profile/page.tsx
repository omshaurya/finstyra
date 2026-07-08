import type { Metadata } from 'next';
import InsuranceProfileEditClient from './InsuranceProfileEditClient';

export const metadata: Metadata = {
  title: 'Edit Insurance Profile | Finstyra',
  description: 'Manage your personal details, address, identity documents and coverage needs.',
  robots: { index: false, follow: false },
};

export default function InsuranceProfilePage() {
  return <InsuranceProfileEditClient />;
}
