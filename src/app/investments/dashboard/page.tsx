import type { Metadata } from 'next';
import InvestmentsDashboardClient from './InvestmentsDashboardClient';

export const metadata: Metadata = {
  title: 'Investment Dashboard | Finstyra',
  description: 'Your personalized investment dashboard — goals, growth projections, allocation and matched products.',
  robots: { index: false, follow: false },
};

export default function InvestmentsDashboardPage() {
  return <InvestmentsDashboardClient />;
}
