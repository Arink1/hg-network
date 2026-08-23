"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          window.prompt("Copy the address", value);
        }
      }}
      className={`btn h-8 px-3 text-[12px] ${copied ? "bg-accent-3 text-ink shadow-[3px_3px_0_0_var(--ink)]" : "btn-secondary"}`}
      aria-live="polite"
    >
      {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
      {copied ? "Copied" : label}
    </button>
  );
}
