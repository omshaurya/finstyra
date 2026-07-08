import type { Metadata } from 'next';
import InvestmentsLanding from './InvestmentsLanding';

export const metadata: Metadata = {
  title: 'Investments – Compare Funds, Brokers & Robo-Advisors | Finstyra',
  description: 'Compare investment products from top US and European providers — index funds, robo-advisors, stocks, bonds and retirement accounts. Project your growth and start investing.',
};

export default function InvestmentsPage() {
  return <InvestmentsLanding />;
}
