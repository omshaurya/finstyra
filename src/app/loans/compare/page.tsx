import type { Metadata } from 'next';
import LoansClient from '../LoansClient';

export const metadata: Metadata = {
  title: 'Compare Loans – US & Europe | Finstyra',
  description: 'Compare personal, home, auto, business, and student loans from top US and European banks. Find the best APR rates instantly and apply in minutes.',
  openGraph: {
    title: 'Compare Loans – US & Europe | Finstyra',
    description: 'Find the lowest APR loans from banks in the US and Europe. Compare side-by-side and apply in minutes.',
  },
};

export default function CompareLoansPage() {
  return <LoansClient />;
}
