import type { Metadata } from "next";
import { CALCULATORS } from "@/lib/calculators";
import { buildAlternates } from "@/lib/seo";
import CalculatorsClient from "./CalculatorsClient";

export const metadata: Metadata = {
  title: `All Financial Calculators – ${CALCULATORS.length}+ Free Tools`,
  description: `Browse all ${CALCULATORS.length}+ free financial calculators for FIRE, retirement, investing, mortgages, loans, and taxes. Search and filter by category to find the right tool instantly.`,
  alternates: buildAlternates("/calculators"),
  openGraph: {
    title: `All Financial Calculators – ${CALCULATORS.length}+ Free Tools | Finstyra`,
    description: `Browse all ${CALCULATORS.length}+ free financial calculators for FIRE, retirement, investing, mortgages, loans, and taxes.`,
    url: "/calculators",
  },
};

export default function CalculatorsPage() {
  return <CalculatorsClient />;
}
