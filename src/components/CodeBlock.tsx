"use client";
import { useState } from "react";

export default function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — ignore.
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--border)]">
      <button
        type="button"
        onClick={handleCopy}
        className="flex w-full items-center justify-between bg-[var(--muted)] px-4 py-2.5 border-b border-[var(--border)] hover:bg-[var(--accent)] transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] capitalize">{lang}</span>
        <span className="text-[10px] text-[var(--muted-foreground)]">{copied ? "Copied!" : "Click to copy"}</span>
      </button>
      <pre className="bg-[var(--card)] p-4 text-xs text-[var(--foreground)] overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
