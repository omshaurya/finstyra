import type { Metadata } from 'next';
import InvestmentsClient from '../InvestmentsClient';

export const metadata: Metadata = {
  title: 'Compare Investment Products | Finstyra',
  description: 'Compare index funds, robo-advisors, stock brokers, bonds and retirement accounts side-by-side.',
};

export default function CompareInvestmentsPage() {
  return <InvestmentsClient />;
}
