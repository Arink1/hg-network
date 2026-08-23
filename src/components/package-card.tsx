import { Check } from "lucide-react";
import { formatPrice, site, type StorePackage } from "@/lib/site";
import { BuyButton } from "./checkout-dialog";

export type StoreMode = "stripe" | "tebex" | "closed";

export function PackageCard({ pkg, mode, delay = 0 }: { pkg: StorePackage; mode: StoreMode; delay?: number }) {
  return (
    <article
      className={`sticker sticker-hover flex flex-col p-6 ${pkg.featured ? "sticker-2" : ""}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      data-reveal
    >
      <div className="mb-4 flex min-h-7 flex-wrap items-start justify-between gap-3">
        <h3 className="display text-2xl">{pkg.name}</h3>
        {pkg.badge && <span className="chip flex-none -rotate-2 bg-accent-3">{pkg.badge}</span>}
      </div>
      <p className="font-display text-4xl font-extrabold tracking-tight text-ink">
        {formatPrice(pkg.price)}
        {pkg.interval && <span className="font-sans text-base font-medium text-muted"> / {pkg.interval}</span>}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{pkg.description}</p>
      <ul className="mt-5 flex-1 space-y-2.5 text-sm">
        {pkg.perks.map((perk) => (
          <li key={perk} className="flex gap-2.5">
            <span className="mt-0.5 grid size-5 flex-none place-items-center rounded-full bg-accent text-accent-ink">
              <Check size={12} strokeWidth={3} aria-hidden />
            </span>
            <span>{perk}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {mode === "stripe" && <BuyButton pkg={pkg} identity={site.playerIdentity} />}
        {mode === "tebex" && (
          <a href={site.store.tebexUrl} target="_blank" rel="noreferrer" className="btn btn-primary h-11 w-full px-5 text-[15px]">
            Buy on the store
          </a>
        )}
        {mode === "closed" && (
          <p className="rounded-full border-2 border-dashed border-line-strong px-3 py-2.5 text-center font-mono text-[11px] uppercase tracking-wider text-muted">
            Store opens at launch
          </p>
        )}
      </div>
    </article>
  );
}
