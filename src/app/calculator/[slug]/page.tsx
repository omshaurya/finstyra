import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CALCULATORS, getCalculatorBySlug } from "@/lib/calculators";
import { getCalculatorComponent } from "@/calculators/registry";
import CalculatorLayout from "@/components/calculator/CalculatorLayout";

export function generateStaticParams() {
  return CALCULATORS.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCalculatorBySlug(slug);
  if (!meta) return {};
  return {
    title: meta.seoTitle,
    description: meta.seoDescription,
    keywords: meta.keywords,
    openGraph: {
      title: meta.seoTitle,
      description: meta.seoDescription,
      type: "website",
    },
    alternates: {
      canonical: `/calculator/${meta.slug}`,
    },
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getCalculatorBySlug(slug);
  if (!meta) notFound();

  const CalculatorComponent = getCalculatorComponent(slug);
  if (!CalculatorComponent) notFound();

  return (
    <CalculatorLayout meta={meta}>
      <CalculatorComponent meta={meta} />
    </CalculatorLayout>
  );
}
