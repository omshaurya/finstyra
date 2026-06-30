import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog – Finstyra",
  description: "Recent updates, new calculators, and improvements to Finstyra.",
};

const ENTRIES = [
  {
    date: "2024-06",
    tag: "New",
    title: "Multi-currency support across all calculators",
    body: "Every calculator now supports 13+ currencies with live symbol formatting, including the projection tables, charts, and AI insights.",
  },
  {
    date: "2024-05",
    tag: "New",
    title: "Developer API documentation published",
    body: "Published the API reference, code examples in 4 languages, and an OpenAPI 3.1 spec. The public API is in private beta — request access from the Developer Portal.",
  },
  {
    date: "2024-04",
    tag: "Improved",
    title: "Premium animations & micro-interactions",
    body: "Added scroll-triggered reveals, animated counters, button ripple effects, and a custom cursor across the site for a more polished feel.",
  },
  {
    date: "2024-03",
    tag: "New",
    title: "60+ new calculators added",
    body: "Expanded coverage across FIRE planning, real estate, business finance, insurance, and taxes — bringing the total to 100+ calculators.",
  },
  {
    date: "2024-02",
    tag: "Improved",
    title: "PDF, CSV, and copy export on every calculator",
    body: "Added one-click export of results and full projection tables from the Export panel on every calculator page.",
  },
  {
    date: "2024-01",
    tag: "Launch",
    title: "Finstyra launched",
    body: "Initial launch with core calculators: SIP, EMI, Mortgage, Compound Interest, FIRE, and Retirement planning.",
  },
];

const TAG_STYLES: Record<string, string> = {
  New: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
  Improved: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  Launch: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-[var(--border)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0d1117] dark:via-[#0d1117] dark:to-[#161b22] py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <nav className="text-xs text-[var(--muted-foreground)] mb-4">
            <Link href="/developers" className="hover:text-[var(--foreground)]">Developers</Link>
            {" / "}
            <span className="text-[var(--foreground)]">Changelog</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] mb-3">Changelog</h1>
          <p className="text-[var(--muted-foreground)]">What's new and improved at Finstyra.</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <div className="space-y-8">
          {ENTRIES.map((e, i) => (
            <div key={i} className="relative pl-8 border-l-2 border-[var(--border)] pb-2 last:border-transparent">
              <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[var(--primary)]" />
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono text-[var(--muted-foreground)]">{e.date}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TAG_STYLES[e.tag]}`}>{e.tag}</span>
              </div>
              <h2 className="font-semibold text-[var(--foreground)] mb-1">{e.title}</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{e.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
