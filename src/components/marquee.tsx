import { NETWORK_NAME, NETWORK_SITES, site } from "@/lib/site";

/** A scrolling strip of the three servers. Lives under the hero and above the footer so the network is always one scroll away. */
export function NetworkMarquee({ className = "" }: { className?: string }) {
  const items = [...NETWORK_SITES, ...NETWORK_SITES];
  return (
    <div className={`marquee border-y-2 border-ink bg-paper py-3 ${className}`} aria-label={`${NETWORK_NAME} servers`}>
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
            {items.map((s, i) => (
              <a
                key={`${copy}-${i}`}
                href={s.key === site.key ? "/" : s.url}
                tabIndex={copy === 1 ? -1 : undefined}
                className="group mx-5 inline-flex items-center gap-3 font-display text-lg font-extrabold tracking-tight text-ink"
              >
                <span
                  className="size-3 -rotate-12 rounded-[4px] border-2 border-ink transition-transform group-hover:rotate-12"
                  style={{ background: s.accent }}
                  aria-hidden
                />
                {s.name}
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted">{s.game}</span>
                <span className="text-muted" aria-hidden>
                  ✦
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
