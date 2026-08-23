import Link from "next/link";
import { NETWORK_NAME, NETWORK_SITES, site } from "@/lib/site";
import { Logo } from "./logo";
import { NetworkMarquee } from "./marquee";

const TRADEMARK: Record<typeof site.game, string> = {
  minecraft: "Minecraft is a trademark of Mojang AB. HGCrafting is not affiliated with or endorsed by Mojang or Microsoft.",
  gmod: "Garry's Mod is a trademark of Facepunch Studios. HGDarkRP is not affiliated with or endorsed by Facepunch or Valve.",
  rust: "Rust is a trademark of Facepunch Studios. HGRusty is not affiliated with or endorsed by Facepunch.",
};

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24">
      <NetworkMarquee />
      <div className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo invert />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">{site.description}</p>
            <p className="mt-4 font-mono text-xs text-paper/70">
              Support:{" "}
              <a className="text-paper underline decoration-accent decoration-2 underline-offset-4 hover:text-accent" href={`mailto:${site.contactEmail}`}>
                {site.contactEmail}
              </a>
            </p>
          </div>

          <FooterCol title="Server">
            <FooterLink href="/store">Store</FooterLink>
            <FooterLink href="/news">News</FooterLink>
            <FooterLink href="/rules">Rules</FooterLink>
            <FooterLink href="/staff">Staff and applications</FooterLink>
            <FooterLink href="/api/status" external>
              Status JSON
            </FooterLink>
          </FooterCol>

          <FooterCol title={NETWORK_NAME}>
            {NETWORK_SITES.map((s) => (
              <FooterLink key={s.key} href={s.key === site.key ? "/" : s.url} external={s.key !== site.key}>
                <span className="mr-2 inline-block size-2.5 -rotate-12 rounded-[3px] align-middle" style={{ background: s.accent }} aria-hidden />
                {s.name}
                <span className="ml-1.5 text-paper/50">{s.game}</span>
              </FooterLink>
            ))}
            <FooterLink href={site.discordUrl} external>
              Discord
            </FooterLink>
          </FooterCol>

          <FooterCol title="Legal">
            <FooterLink href="/legal/terms">Terms of service</FooterLink>
            <FooterLink href="/legal/privacy">Privacy</FooterLink>
            <FooterLink href="/legal/refunds">Refund policy</FooterLink>
          </FooterCol>
        </div>
        <div className="border-t border-paper/15">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 font-mono text-[11px] leading-relaxed text-paper/60 sm:px-6 md:flex-row md:items-center md:justify-between">
            <span>
              &copy; {year} {NETWORK_NAME}. All purchases are donations toward server costs.
            </span>
            <span className="max-w-xl md:text-right">{TRADEMARK[site.game]}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent-3">{title}</h2>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  const cls = "text-paper/85 transition-colors hover:text-accent-3";
  return (
    <li>
      {external ? (
        <a href={href} className={cls} target="_blank" rel="noreferrer">
          {children}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {children}
        </Link>
      )}
    </li>
  );
}
