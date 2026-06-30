import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developer Portal – Finstyra",
  description: "Build financial tools with the Finstyra API. SDKs, documentation, and sandbox environment.",
};

const SDKS = [
  { lang: "JavaScript / TypeScript", icon: "🟨", install: "npm install @finstyra/sdk" },
  { lang: "Python", icon: "🐍", install: "pip install finstyra" },
  { lang: "PHP", icon: "🐘", install: "composer require finstyra/sdk" },
  { lang: "Go", icon: "🔵", install: "go get github.com/finstyra/go-sdk" },
];

const RESOURCES = [
  { title: "API Reference", desc: "Complete REST API documentation with all endpoints, parameters, and response schemas.", icon: "📖", href: "/api-docs" },
  { title: "Quick Start Guide", desc: "Get your first API call working in under 5 minutes. No credit card required.", icon: "⚡", href: "/api-docs" },
  { title: "Code Examples", desc: "Ready-to-use code samples in JavaScript, Python, PHP, Go, Java, and C#.", icon: "💻", href: "/api-docs" },
  { title: "Changelog", desc: "Stay up to date with API changes, new endpoints, and deprecation notices.", icon: "📋", href: "/changelog" },
  { title: "Status Page", desc: "Real-time API uptime and incident history. We target 99.9% availability.", icon: "🟢", href: "/status" },
  { title: "OpenAPI Spec", desc: "Download our OpenAPI 3.1 spec to generate client libraries in any language.", icon: "📄", href: "/openapi.json" },
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="border-b border-[var(--border)] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-900/50 border border-indigo-700 px-3 py-1 text-xs font-semibold text-indigo-300 mb-4">
            ⚡ Developer Portal
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Build with Finstyra
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Embed 100+ financial calculators into your app, website, or workflow with our REST API. Fast, reliable, and free to get started.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/api-docs" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-6 py-3 text-sm font-semibold hover:bg-indigo-500 transition-colors">
              View API Docs →
            </Link>
            <a href="mailto:finstyra@gmail.com" className="inline-flex items-center gap-2 rounded-xl border border-slate-600 text-slate-300 px-6 py-3 text-sm font-semibold hover:border-slate-400 hover:text-white transition-colors">
              Contact API Team
            </a>
          </div>
        </div>
      </div>

      {/* Quick start */}
      <div className="border-b border-[var(--border)] bg-[var(--muted)]">
        <div className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Quick Start</h2>
          <p className="text-[var(--muted-foreground)] mb-6">Make your first API call in seconds:</p>
          <div className="rounded-2xl bg-[#0d1117] border border-[#3d444d] p-5 overflow-x-auto">
            <pre className="text-sm text-slate-300 font-mono leading-relaxed">{`curl -X POST https://api.finstyra.com/v1/calculate/mortgage \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "home_price": 400000,
    "down_payment": 80000,
    "interest_rate": 7.0,
    "loan_term": 30,
    "currency": "USD"
  }'`}</pre>
          </div>
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            Don&apos;t have an API key?{" "}
            <a href="mailto:finstyra@gmail.com" className="text-[var(--primary)] hover:underline font-medium">Request free access →</a>
          </p>
        </div>
      </div>

      {/* SDKs */}
      <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Official SDKs</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">SDKs ship alongside the public API launch. Here's what's planned:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SDKS.map(sdk => (
            <div key={sdk.lang} className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 opacity-75">
              <span className="absolute top-4 right-4 rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--muted-foreground)]">Coming Soon</span>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{sdk.icon}</span>
                <span className="font-semibold text-[var(--foreground)]">{sdk.lang}</span>
              </div>
              <div className="rounded-lg bg-[var(--muted)] px-3 py-2 font-mono text-xs text-[var(--muted-foreground)]">
                {sdk.install}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">Java and C# SDKs are also planned. All SDKs will be open source on GitHub once released.</p>
      </div>

      {/* Resources */}
      <div className="border-t border-[var(--border)] bg-[var(--muted)]">
        <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Developer Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESOURCES.map(r => (
              <Link key={r.title} href={r.href} className="group block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:border-[var(--primary)]/50 hover:shadow-md transition-all">
                <div className="text-2xl mb-2">{r.icon}</div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--primary)] transition-colors">{r.title}</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{r.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
