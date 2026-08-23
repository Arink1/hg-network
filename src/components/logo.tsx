import Link from "next/link";
import { site } from "@/lib/site";

/** The HG chip is shared across the network. The word after it changes per site. */
export function Logo({ className = "", invert = false }: { className?: string; invert?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label={`${site.name} home`}>
      <Mark />
      <span className="font-display text-xl font-extrabold tracking-tight">
        <span className={invert ? "text-paper" : "text-ink"}>HG</span>
        <span className="text-accent">{site.shortName}</span>
      </span>
    </Link>
  );
}

export function Mark({ size = 36 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="grid flex-none -rotate-6 place-items-center rounded-[10px] border-2 border-ink bg-accent font-display font-extrabold leading-none text-accent-ink shadow-[3px_3px_0_0_var(--ink)] transition-transform duration-300 group-hover:rotate-6"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      HG
    </span>
  );
}
