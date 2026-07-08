import type { Metadata } from 'next';
import LoansLanding from './LoansLanding';

export const metadata: Metadata = {
  title: 'Loans – Compare & Apply Across the US & Europe | Finstyra',
  description: 'Get free loan quotes from 15+ top banks across the US and Europe. Personal, home, auto, business and student loans — compare rates and apply in minutes.',
  openGraph: {
    title: 'Loans – Compare & Apply Across the US & Europe | Finstyra',
    description: 'Free loan quotes from leading US and European banks. Compare rates side-by-side and apply in minutes.',
  },
};

export default function LoansPage() {
  return <LoansLanding />;
}
