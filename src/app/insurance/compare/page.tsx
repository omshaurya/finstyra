import type { Metadata } from 'next';
import InsuranceClient from '../InsuranceClient';

export const metadata: Metadata = {
  title: 'Compare Insurance Plans | Finstyra',
  description: 'Compare health, life, auto, home and travel insurance from top US and European insurers side-by-side.',
};

export default function CompareInsurancePage() {
  return <InsuranceClient />;
}
