import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NETWORK_NAME, site } from "@/lib/site";
import { getAllPosts } from "@/lib/content";
import { ButtonLink } from "@/components/button";
import { ConnectConsole, ConsoleSkeleton } from "@/components/connect-console";
import { FeatureIcon } from "@/components/feature-icon";
import { Headline } from "@/components/headline";
import { NetworkMarquee } from "@/components/marquee";
import { NetworkCards } from "@/components/network-cards";
import { NewsCard } from "@/components/news-card";
import { PackageCard } from "@/components/package-card";
import { Section } from "@/components/section";
import { Supporters } from "@/components/supporters";
import { stripeConfigured } from "@/lib/stripe";

const TILE_COLORS = ["bg-accent", "bg-accent-2", "bg-accent-3", "bg-accent"] as const;
const TILE_INK = ["text-accent-ink", "text-white", "text-ink", "text-accent-ink"] as const;

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);
  const featured = [...site.store.packages].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)).slice(0, 3);
  const storeMode = site.store.provider === "stripe" && !stripeConfigured() ? "closed" : site.store.provider;
  const primary = site.servers[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-ink">
        <div className="blobs" aria-hidden>
          <div className="blob blob-a" />
          <div className="blob blob-b" />
          <div className="blob blob-c" />
        </div>
        <div className="texture" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pb-28 lg:pt-24">
          <div>
            <p className="eyebrow rise mb-5">{site.hero.eyebrow}</p>
            <h1 className="display rise rise-2 text-[2.75rem] sm:text-6xl lg:text-7xl">
              <Headline text={site.hero.headline} />
            </h1>
            <p className="rise rise-3 mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{site.hero.sub}</p>
            <div className="rise rise-4 mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/store" size="lg">
                Support the server
              </ButtonLink>
              <ButtonLink href={site.discordUrl} variant="secondary" size="lg">
                Join the Discord
              </ButtonLink>
            </div>
            <ul className="rise rise-5 mt-8 flex flex-wrap gap-2">
              {site.facts.map((f, i) => (
                <li key={f.label} className="chip">
                  <span className={`size-2 rounded-full ${TILE_COLORS[i % TILE_COLORS.length]}`} aria-hidden />
                  <span className="text-muted">{f.label}</span>
                  <span className="text-ink">{f.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rise rise-3">
            <div className="float">
              <Suspense fallback={<ConsoleSkeleton server={primary} />}>
                <ConnectConsole server={primary} />
              </Suspense>
            </div>
            {site.servers.length > 1 && (
              <div className="mt-5 space-y-4">
                {site.servers.slice(1).map((s) => (
                  <Suspense key={s.key} fallback={<ConsoleSkeleton server={s} compact />}>
                    <ConnectConsole server={s} compact />
                  </Suspense>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <NetworkMarquee className="border-t-0" />

      {/* Features */}
      <Section eyebrow={`Why ${site.name}`} title={site.tagline}>
        <div className="grid gap-6 sm:grid-cols-2">
          {site.features.map((f, i) => (
            <div
              key={f.title}
              className="sticker sticker-hover p-6 sm:p-7"
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              data-reveal
            >
              <div
                className={`wiggle mb-5 inline-grid size-12 -rotate-3 place-items-center rounded-[12px] border-2 border-ink ${TILE_COLORS[i % TILE_COLORS.length]} ${TILE_INK[i % TILE_INK.length]}`}
              >
                <FeatureIcon name={f.icon} size={22} />
              </div>
              <h3 className="display text-2xl">{f.title}</h3>
              <p className="mt-2.5 leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* News */}
      <Section
        eyebrow="News"
        title="Latest from the server"
        aside={
          <Link href="/news" className="btn btn-secondary h-10 px-4 text-sm">
            All posts <ArrowRight size={16} />
          </Link>
        }
      >
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p, i) => (
              <NewsCard key={p.slug} post={p} delay={i * 90} />
            ))}
          </div>
        ) : (
          <p className="sticker p-6 text-muted" data-reveal>
            Nothing posted yet. Launch updates land here and in Discord.
          </p>
        )}
      </Section>

      {/* Store */}
      <Section
        eyebrow="Support"
        title="Everything in the store pays for hosting"
        intro="Ranks and cosmetics fund the server. Nothing sold here gives an advantage over a player who never spends a cent."
        aside={
          <Link href="/store" className="btn btn-secondary h-10 px-4 text-sm">
            Full store <ArrowRight size={16} />
          </Link>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} mode={storeMode} delay={i * 90} />
            ))}
          </div>
          <div className="space-y-6">
            <Suspense fallback={null}>
              <Supporters />
            </Suspense>
            <div className="sticker sticker-3 p-6 text-sm leading-relaxed text-muted" data-reveal style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
              <p className="eyebrow mb-3">How delivery works</p>
              <p>
                Pay with card through Stripe. Your {site.playerIdentity.label} is sent to the game server and the purchase is
                applied within a minute, or on your next login if you are offline.
              </p>
              <p className="mt-3">
                Problems? Open a ticket in{" "}
                <a href={site.discordUrl} className="font-bold text-accent-2 underline decoration-2 underline-offset-4" target="_blank" rel="noreferrer">
                  Discord
                </a>{" "}
                with your receipt.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Network */}
      <Section
        eyebrow={NETWORK_NAME}
        title="Three servers. One crew."
        intro={`${site.name} is one third of ${NETWORK_NAME}. Same staff, same Discord, same no pay to win rule on every server.`}
      >
        <NetworkCards />
      </Section>

      {/* Discord CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="sticker sticker-3 flex flex-col items-start gap-6 overflow-hidden bg-ink p-8 text-paper md:flex-row md:items-center md:justify-between md:p-12"
          data-reveal
        >
          <div className="relative">
            <p className="eyebrow mb-3 text-accent-3">Discord</p>
            <h2 className="display text-3xl sm:text-4xl">Announcements, tickets and the people you will be playing with.</h2>
          </div>
          <ButtonLink href={site.discordUrl} size="lg" className="flex-none">
            Join the Discord
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
