import { ArrowUpRight } from "lucide-react";
import { NETWORK_SITES, site } from "@/lib/site";

/**
 * The other two servers, each drawn in its own colors. Every site shows this so
 * a player who lands on one of them finds the rest of the network.
 */
export function NetworkCards() {
  const others = NETWORK_SITES.filter((s) => s.key !== site.key);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {others.map((s, i) => (
        <a
          key={s.key}
          href={s.url}
          className="sticker sticker-hover group flex flex-col p-6 sm:p-8"
          style={
            {
              "--accent": s.accent,
              "--accent-2": s.accent2,
              "--accent-3": s.accent3,
              "--accent-ink": s.accentInk,
              "--reveal-delay": `${i * 120}ms`,
            } as React.CSSProperties
          }
          data-reveal
        >
          <div className="mb-6 flex items-center justify-between">
            <span
              className="grid size-12 -rotate-6 place-items-center rounded-[12px] border-2 border-ink font-display text-base font-extrabold transition-transform group-hover:rotate-6"
              style={{ background: s.accent, color: s.accentInk }}
              aria-hidden
            >
              HG
            </span>
            <span className="chip" style={{ background: s.accent3 }}>
              {s.game}
            </span>
          </div>
          <h3 className="display text-3xl sm:text-4xl">
            HG<span style={{ color: s.accent }}>{s.shortName}</span>
          </h3>
          <p className="mt-3 flex-1 text-base leading-relaxed text-muted">{s.pitch}</p>
          <span className="mt-6 inline-flex items-center gap-1.5 font-display text-base font-bold text-ink">
            Visit {s.url.replace("https://", "")}
            <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </a>
      ))}
    </div>
  );
}
