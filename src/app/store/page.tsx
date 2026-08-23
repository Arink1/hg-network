import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { stripeConfigured } from "@/lib/stripe";
import { PackageCard } from "@/components/package-card";
import { PageHeader } from "@/components/section";
import { Supporters } from "@/components/supporters";

export const metadata: Metadata = {
  title: "Store",
  description: `Support ${site.name}. Ranks, cosmetics and convenience. No pay to win.`,
};

export default function StorePage() {
  const storeMode = site.store.provider === "stripe" && !stripeConfigured() ? "closed" : site.store.provider;
  const categories = site.store.categories.filter((c) => site.store.packages.some((p) => p.category === c.id));

  return (
    <>
      <PageHeader
        eyebrow={`${site.name} store`}
        title="Support the server"
        intro="Every purchase goes toward hosting and development. Nothing here changes how fights, loot or the economy work for anyone."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav aria-label="Store categories" className="flex flex-wrap gap-2 py-6">
          {categories.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="btn btn-secondary h-10 px-4 text-sm">
              {c.name}
            </a>
          ))}
        </nav>

        {storeMode === "closed" && (
          <p className="chip rounded-2xl border-dashed px-4 py-3 text-muted">The store opens at launch. Packages and prices below are final.</p>
        )}

        <div className="grid gap-12 py-10 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-16">
            {categories.map((c) => (
              <section key={c.id} id={c.id} className="scroll-mt-36">
                <div className="mb-6" data-reveal>
                  <h2 className="display text-3xl sm:text-4xl">{c.name}</h2>
                  <p className="mt-2 text-lg text-muted">{c.blurb}</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {site.store.packages
                    .filter((p) => p.category === c.id)
                    .map((pkg, i) => (
                      <PackageCard key={pkg.id} pkg={pkg} mode={storeMode} delay={i * 90} />
                    ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-36 lg:self-start">
            <Suspense fallback={null}>
              <Supporters />
            </Suspense>
            <div className="sticker sticker-3 p-6 text-sm leading-relaxed text-muted" data-reveal>
              <p className="eyebrow mb-3">Before you buy</p>
              <ul className="space-y-3">
                <li>You need your exact {site.playerIdentity.label}. Purchases go to the account you enter.</li>
                <li>Monthly packages renew automatically. Cancel any time from the receipt email.</li>
                <li>Bans do not refund purchases. Read the rules first.</li>
                <li>
                  Refunds follow the{" "}
                  <Link href="/legal/refunds" className="font-bold text-accent-2 underline decoration-2 underline-offset-4">
                    refund policy
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
