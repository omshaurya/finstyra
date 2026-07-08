import type { Metadata } from 'next';
import InvestmentsProfileEditClient from './InvestmentsProfileEditClient';

export const metadata: Metadata = {
  title: 'Edit Investor Profile | Finstyra',
  description: 'Manage your personal details, address, identity documents and investment plan.',
  robots: { index: false, follow: false },
};

export default function InvestmentsProfilePage() {
  return <InvestmentsProfileEditClient />;
}
