import crafting from "./sites/crafting";
import darkrp from "./sites/darkrp";
import rusty from "./sites/rusty";
import type { SiteConfig, SiteKey, StorePackage } from "./sites/types";

export { NETWORK_NAME, NETWORK_SITES } from "./sites/network";
export type * from "./sites/types";

const SITES: Record<SiteKey, SiteConfig> = { crafting, darkrp, rusty };

function resolveKey(): SiteKey {
  const raw = (process.env.NEXT_PUBLIC_SITE ?? "crafting").toLowerCase();
  if (raw in SITES) return raw as SiteKey;
  throw new Error(`NEXT_PUBLIC_SITE="${raw}" is not one of: ${Object.keys(SITES).join(", ")}`);
}

/** The site this deployment is serving. Resolved from NEXT_PUBLIC_SITE at build time. */
export const site: SiteConfig = SITES[resolveKey()];

/** Public base URL for absolute links, metadata and Stripe redirects. */
export function siteUrl(): string {
  const override = process.env.NEXT_PUBLIC_SITE_URL;
  if (override) return override.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production") return site.url;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function getPackage(id: string): StorePackage | undefined {
  return site.store.packages.find((p) => p.id === id);
}

export function getServer(key: string) {
  return site.servers.find((s) => s.key === key);
}

export function formatPrice(cents: number, currency: string = site.store.currency): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
