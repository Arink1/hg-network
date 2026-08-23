import Link from "next/link";
import { NETWORK_NAME, NETWORK_SITES, site } from "@/lib/site";
import { Logo } from "./logo";
import { ButtonLink } from "./button";
import { MobileNav } from "./mobile-nav";

export const NAV_LINKS = [
  { href: "/store", label: "Store" },
  { href: "/news", label: "News" },
  { href: "/rules", label: "Rules" },
  { href: "/staff", label: "Staff" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/90 backdrop-blur-md">
      {/* Network switcher. The three sites are one network and this is how you hop between them. */}
      <div className="border-b border-line bg-bg/70">
        <div className="mx-auto flex h-10 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <span className="hidden font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted sm:inline">
            {NETWORK_NAME}
          </span>
          <nav aria-label="Network sites" className="flex w-full items-center gap-1 sm:w-auto">
            {NETWORK_SITES.map((s) => {
              const current = s.key === site.key;
              return (
                <a
                  key={s.key}
                  href={current ? "/" : s.url}
                  aria-current={current ? "page" : undefined}
                  className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors sm:flex-none ${
                    current ? "bg-ink text-paper" : "text-muted hover:bg-paper hover:text-ink"
                  }`}
                >
                  <span className="size-2 rounded-full" style={{ background: s.accent }} aria-hidden />
                  <span className="hidden sm:inline">{s.name}</span>
                  <span className="sm:hidden">{s.shortName}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 font-display text-[15px] font-bold text-ink transition-colors hover:bg-accent-soft"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ButtonLink href={site.discordUrl} variant="secondary" size="sm">
            Discord
          </ButtonLink>
          <ButtonLink href="/store" size="sm">
            Support the server
          </ButtonLink>
        </div>
        <MobileNav links={NAV_LINKS} discordUrl={site.discordUrl} />
      </div>
    </header>
  );
}
