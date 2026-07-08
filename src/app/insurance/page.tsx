import type { Metadata } from 'next';
import InsuranceLanding from './InsuranceLanding';

export const metadata: Metadata = {
  title: 'Insurance – Compare Health, Life, Auto & Home | Finstyra',
  description: 'Compare insurance quotes from top US and European insurers. Health, life, auto, home and travel cover — find the best plan and apply in minutes.',
};

export default function InsurancePage() {
  return <InsuranceLanding />;
}
