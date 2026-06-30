import type { Metadata } from "next";
import Link from "next/link";
import { buildAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "System Status – Finstyra",
  description: "Real-time operational status of Finstyra's calculators and services.",
  alternates: buildAlternates("/status"),
};

const SERVICES = [
  { name: "Calculators (100+)", status: "operational", desc: "All financial calculators run client-side and are unaffected by backend status." },
  { name: "Contact Form", status: "operational", desc: "Email delivery for the contact form." },
  { name: "Newsletter Signup", status: "operational", desc: "Footer newsletter subscription endpoint." },
  { name: "Website / CDN", status: "operational", desc: "Static site delivery and page loads." },
  { name: "Public Developer API", status: "beta", desc: "REST API for third-party integration. Currently in private beta — not yet publicly available." },
];

const STATUS_STYLES: Record<string, { dot: string; label: string; text: string }> = {
  operational: { dot: "bg-emerald-500", label: "Operational", text: "text-emerald-700 dark:text-emerald-300" },
  degraded: { dot: "bg-amber-500", label: "Degraded", text: "text-amber-700 dark:text-amber-300" },
  outage: { dot: "bg-red-500", label: "Outage", text: "text-red-700 dark:text-red-300" },
  beta: { dot: "bg-indigo-500", label: "Private Beta", text: "text-indigo-700 dark:text-indigo-300" },
};

const allOperational = SERVICES.every(s => s.status === "operational" || s.status === "beta");

export default function StatusPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-[var(--border)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0d1117] dark:via-[#0d1117] dark:to-[#161b22] py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <nav className="text-xs text-[var(--muted-foreground)] mb-4">
            <Link href="/developers" className="hover:text-[var(--foreground)]">Developers</Link>
            {" / "}
            <span className="text-[var(--foreground)]">Status</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] mb-3">System Status</h1>
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${allOperational ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
            <p className="text-[var(--foreground)] font-medium">
              {allOperational ? "All core systems operational" : "Some systems are experiencing issues"}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <div className="rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
          {SERVICES.map(s => {
            const style = STATUS_STYLES[s.status];
            return (
              <div key={s.name} className="flex items-start gap-4 p-5 bg-[var(--card)]">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                <div className="flex-1">
                  <p className="font-semibold text-[var(--foreground)]">{s.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{s.desc}</p>
                </div>
                <span className={`shrink-0 text-xs font-semibold ${style.text}`}>{style.label}</span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-[var(--muted-foreground)] mt-6 text-center">
          Having an issue not reflected here? <Link href="/contact" className="text-[var(--primary)] hover:underline">Contact us</Link>.
        </p>
      </div>
    </div>
  );
}
