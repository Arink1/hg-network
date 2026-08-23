export type SiteKey = "crafting" | "darkrp" | "rusty";
export type Game = "minecraft" | "gmod" | "rust";
export type Material = "pixel" | "neon" | "grain";

export type StatusSource =
  | { provider: "minecraft"; host: string; port?: number }
  | { provider: "battlemetrics"; serverId: string }
  | { provider: "none" };

export interface GameServer {
  /** Stable key used by the delivery API and package targeting. */
  key: string;
  name: string;
  /** Address shown to players and copied to clipboard. */
  address: string;
  /** Optional deep link, e.g. steam://connect/ip:port */
  connectUrl?: string;
  status: StatusSource;
}

export interface PlayerIdentity {
  kind: "minecraft-username" | "steamid64";
  label: string;
  placeholder: string;
  help: string;
}

export interface StoreCategory {
  id: string;
  name: string;
  blurb: string;
}

export interface StorePackage {
  id: string;
  name: string;
  category: string;
  /** Price in the smallest currency unit (cents). */
  price: number;
  /** Monthly subscription when set. One-time purchase otherwise. */
  interval?: "month";
  description: string;
  perks: string[];
  featured?: boolean;
  badge?: string;
  /** Server key this package delivers to. Defaults to every server on the site. */
  server?: string;
  /**
   * Commands run on the game server after payment.
   * Placeholders: {player} {playerId} {package} {purchaseId}
   */
  commands: string[];
  /** Commands run when a subscription ends. */
  expireCommands?: string[];
}

export type FeatureIcon =
  | "pickaxe"
  | "shield"
  | "users"
  | "zap"
  | "map"
  | "swords"
  | "coins"
  | "radio"
  | "clock"
  | "hammer";

export interface Feature {
  title: string;
  body: string;
  icon: FeatureIcon;
}

export interface StaffRole {
  name: string;
  blurb: string;
  open: boolean;
}

export interface SiteTheme {
  /** Main brand color. Buttons, sticker shadows, the logo chip. */
  accent: string;
  /** Second color. Eyebrows, links, alternate shadows. */
  accent2: string;
  /** Third color. Highlighter marks and selection. */
  accent3: string;
  /** Text color that sits on top of `accent`. */
  accentInk: string;
  /** Page background. A very light tint of the accent. */
  bg: string;
  /** Hero texture keyed to the game. */
  material: Material;
}

export interface SiteConfig {
  key: SiteKey;
  name: string;
  shortName: string;
  game: Game;
  gameLabel: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  discordUrl: string;
  contactEmail: string;
  theme: SiteTheme;
  servers: GameServer[];
  hero: {
    eyebrow: string;
    /** Headline. Wrap the word to highlight in [brackets]. */
    headline: string;
    sub: string;
  };
  /** Facts about the server shown under the hero. Keep these true. */
  facts: { label: string; value: string }[];
  features: Feature[];
  playerIdentity: PlayerIdentity;
  store: {
    /** "stripe" runs checkout here. "tebex" links out. "closed" shows packages without checkout. */
    provider: "stripe" | "tebex" | "closed";
    tebexUrl?: string;
    currency: "usd";
    categories: StoreCategory[];
    packages: StorePackage[];
  };
  staff: {
    intro: string;
    roles: StaffRole[];
    applyUrl: string;
  };
}

export interface NetworkSite {
  key: SiteKey;
  name: string;
  shortName: string;
  game: string;
  url: string;
  /** One line pitch used on the other sites' "network" cards. */
  pitch: string;
  accent: string;
  accent2: string;
  accent3: string;
  accentInk: string;
}
