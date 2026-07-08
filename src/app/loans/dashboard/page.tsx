import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Loan Dashboard | Finstyra',
  description: 'Your personalized loan dashboard — profile, account, matched loan plans, EMI breakdown, amortization and eligibility analysis.',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
