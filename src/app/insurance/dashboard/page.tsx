import type { Metadata } from 'next';
import InsuranceDashboardClient from './InsuranceDashboardClient';

export const metadata: Metadata = {
  title: 'Insurance Dashboard | Finstyra',
  description: 'Your personalized insurance dashboard — profile, quotes, premium analysis and matched plans.',
  robots: { index: false, follow: false },
};

export default function InsuranceDashboardPage() {
  return <InsuranceDashboardClient />;
}
