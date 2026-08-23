import type { SiteConfig } from "./types";

const site: SiteConfig = {
  key: "rusty",
  name: "HGRusty",
  shortName: "Rusty",
  game: "rust",
  gameLabel: "Rust",
  domain: "hgrusty.com",
  url: "https://hgrusty.com",
  tagline: "Weekly wipes. Fair fights. No pay to win.",
  description:
    "HGRusty is the Rust server of HG Network. 2x gather, weekly map wipes, monthly blueprint wipes, active admins and a store that sells nothing you can shoot.",
  discordUrl: "https://discord.gg/hgnetwork",
  contactEmail: "support@hgrusty.com",
  theme: {
    accent: "#ff6a1a",
    accent2: "#e8262f",
    accent3: "#ffc53d",
    accentInk: "#2a1000",
    bg: "#fff6ee",
    material: "grain",
  },
  servers: [
    {
      key: "main",
      name: "HGRusty 2x",
      address: "rust.hgnetwork.gg:28015",
      connectUrl: "steam://connect/rust.hgnetwork.gg:28015",
      status: { provider: "battlemetrics", serverId: "00000000" },
    },
  ],
  hero: {
    eyebrow: "Rust / 2x Vanilla+ / 4000 map",
    headline: "Wipe day is [Thursday.] Be ready.",
    sub: "2x gather, faster smelting, kits for everyone, max group of five and admins who do not play. The rest is vanilla.",
  },
  facts: [
    { label: "Map wipe", value: "Thursdays, 2:00 PM ET" },
    { label: "BP wipe", value: "First Thursday monthly" },
    { label: "Group limit", value: "Max 5" },
    { label: "Gather", value: "2x, 2x smelt" },
  ],
  features: [
    {
      icon: "swords",
      title: "Max five, enforced",
      body: "Group limit is five. Alliances count. Admins check base logs and TC auth, not just Discord screenshots.",
    },
    {
      icon: "radio",
      title: "Admins who do not play",
      body: "Nobody on staff owns a base. Anti-cheat reports are answered inside the hour during peak.",
    },
    {
      icon: "map",
      title: "A map you can learn",
      body: "4000 size, custom monuments every wipe, a ring road and boats at every fishing village.",
    },
    {
      icon: "hammer",
      title: "Quality of life, not advantage",
      body: "Free starter kit, shared skins, quick smelt, home teleport with a cooldown. No gather or loot perks for sale.",
    },
  ],
  playerIdentity: {
    kind: "steamid64",
    label: "SteamID64",
    placeholder: "76561198000000000",
    help: "Your 17 digit SteamID64. Find it at steamid.io or in your Steam profile URL.",
  },
  store: {
    provider: "stripe",
    currency: "usd",
    categories: [
      { id: "queue", name: "Queue skip", blurb: "Monthly queue skip for wipe day. That is the entire perk." },
      { id: "kits", name: "Kits", blurb: "Convenience kits. No weapons, no armor, no advantage." },
      { id: "skins", name: "Skins", blurb: "Skin box access so you can use any approved workshop skin." },
    ],
    packages: [
      {
        id: "queue-skip",
        name: "Queue skip",
        category: "queue",
        price: 499,
        interval: "month",
        featured: true,
        badge: "Wipe day pick",
        description: "Join ahead of the queue when the server is full.",
        perks: ["Queue skip on the main server", "Supporter tag in Discord"],
        commands: ["oxide.usergroup add {playerId} vip"],
        expireCommands: ["oxide.usergroup remove {playerId} vip"],
      },
      {
        id: "kit-builder",
        name: "Builder kit",
        category: "kits",
        price: 399,
        description: "Tools and a little wood, once per wipe.",
        perks: ["Hammer, building plan, stone tools", "1,000 wood and 500 stone", "Once per wipe for the rest of the month"],
        commands: ["oxide.usergroup add {playerId} kit_builder"],
      },
      {
        id: "home-extra",
        name: "Extra home",
        category: "kits",
        price: 299,
        description: "One more /home slot. Permanent.",
        perks: ["+1 home slot", "Stacks up to three"],
        commands: ["oxide.usergroup add {playerId} home_extra"],
      },
      {
        id: "skinbox",
        name: "Skin box",
        category: "skins",
        price: 699,
        description: "Use any approved workshop skin from the skin box. Permanent.",
        perks: ["Skin box access", "Over 3,000 approved skins"],
        commands: ["oxide.usergroup add {playerId} skinbox"],
      },
    ],
  },
  staff: {
    intro:
      "Admins on HGRusty do not play on the server. If you want to help and can give up playing here, we want to hear from you.",
    roles: [
      { name: "Moderator", blurb: "Handle reports, group limit checks and Discord tickets.", open: true },
      { name: "Admin", blurb: "Full server access, anti-cheat tooling, wipe management.", open: false },
      { name: "Map builder", blurb: "Custom monuments and map edits in RustEdit.", open: true },
    ],
    applyUrl: "https://discord.gg/hgnetwork",
  },
};

export default site;
