import type { SiteConfig } from "./types";

const site: SiteConfig = {
  key: "darkrp",
  name: "HGDarkRP",
  shortName: "DarkRP",
  game: "gmod",
  gameLabel: "Garry's Mod",
  domain: "hgdarkrp.com",
  url: "https://hgdarkrp.com",
  tagline: "A city that runs on players, not scripts.",
  description:
    "HGDarkRP is the Garry's Mod DarkRP server of HG Network. Custom jobs, a working economy, serious roleplay rules and staff who are actually online.",
  discordUrl: "https://discord.gg/Sgq7Jq9gwH",
  contactEmail: "support@hgdarkrp.com",
  theme: {
    accent: "#ff2d87",
    accent2: "#7a3cff",
    accent3: "#2ee6ff",
    accentInk: "#ffffff",
    bg: "#fbf3fc",
    material: "neon",
  },
  servers: [
    {
      key: "main",
      name: "Downtown",
      address: "darkrp.hgnetwork.gg:27015",
      connectUrl: "steam://connect/darkrp.hgnetwork.gg:27015",
      status: { provider: "battlemetrics", serverId: "00000000" },
    },
  ],
  hero: {
    eyebrow: "Garry's Mod DarkRP / rp_downtown_v4c_v2",
    headline: "Own the block. [Run the city.]",
    sub: "Sixty custom jobs, player owned businesses, a police force that follows procedure and a mayor who can actually get voted out.",
  },
  facts: [
    { label: "Map", value: "rp_downtown_v4c_v2" },
    { label: "Slots", value: "128" },
    { label: "Style", value: "Semi-serious RP" },
    { label: "Restarts", value: "Daily at 6:00 AM ET" },
  ],
  features: [
    {
      icon: "users",
      title: "Jobs with purpose",
      body: "Every job has an income, a reason to exist and something another job needs. Nobody gets to be a gun dealer with no customers.",
    },
    {
      icon: "shield",
      title: "Rules that are enforced",
      body: "RDM, NLR and FailRP are handled in minutes by staff who are on the server, not in a Discord channel.",
    },
    {
      icon: "coins",
      title: "An economy with sinks",
      body: "Property tax, upkeep, raids and a casino keep money moving. Printers are balanced against real risk.",
    },
    {
      icon: "zap",
      title: "Optimized, not bloated",
      body: "Tuned addons and a strict content pack. Join in under a minute on a first download.",
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
      { id: "vip", name: "VIP", blurb: "Monthly VIP tiers. Priority queue, extra jobs, cosmetics." },
      { id: "jobs", name: "Custom jobs", blurb: "One time, permanent custom job slots." },
      { id: "credits", name: "Credits", blurb: "Pointshop credits for cosmetics. Nothing that shoots." },
    ],
    packages: [
      {
        id: "vip",
        name: "VIP",
        category: "vip",
        price: 599,
        interval: "month",
        description: "Skip the queue and unlock VIP jobs.",
        perks: ["Priority queue", "VIP jobs", "Extra door slots", "VIP tag and chat color"],
        commands: ["ulx adduserid {playerId} vip"],
        expireCommands: ["ulx removeuserid {playerId}"],
      },
      {
        id: "vip-plus",
        name: "VIP+",
        category: "vip",
        price: 1299,
        interval: "month",
        featured: true,
        badge: "Most popular",
        description: "Everything in VIP plus the top tier jobs and a monthly credit drop.",
        perks: ["Reserved slot", "VIP+ jobs", "2,500 credits every month", "Custom chat tag", "Everything in VIP"],
        commands: ["ulx adduserid {playerId} vipplus", "ps2_givecredits {playerId} 2500"],
        expireCommands: ["ulx removeuserid {playerId}"],
      },
      {
        id: "job-custom",
        name: "Custom job",
        category: "jobs",
        price: 2499,
        description: "A permanent custom job with your name, model and loadout. Reviewed by staff before it goes live.",
        perks: [
          "Permanent custom job",
          "Custom player model from the content pack",
          "Two weapons from the approved list",
          "Staff review within 72 hours",
        ],
        commands: ["hg_ticket create customjob {playerId} {purchaseId}"],
      },
      {
        id: "credits-5000",
        name: "5,000 credits",
        category: "credits",
        price: 499,
        description: "Pointshop credits for hats, trails and player models.",
        perks: ["5,000 credits", "Delivered instantly if you are online"],
        commands: ["ps2_givecredits {playerId} 5000"],
      },
      {
        id: "credits-15000",
        name: "15,000 credits",
        category: "credits",
        price: 1199,
        badge: "Save 20%",
        description: "The bulk credit pack.",
        perks: ["15,000 credits", "Delivered instantly if you are online"],
        commands: ["ps2_givecredits {playerId} 15000"],
      },
    ],
  },
  staff: {
    intro:
      "Staff on HGDarkRP play the server. We look for people who understand RP, keep their temper in a sit and can write a clear ban reason.",
    roles: [
      { name: "Trial Moderator", blurb: "Take sits, log actions, learn the rulebook. Two week trial.", open: true },
      { name: "Moderator", blurb: "Full sit authority and ban powers. Promoted from trial.", open: false },
      { name: "Event Team", blurb: "Run purges, city events and job contests on a schedule.", open: true },
    ],
    applyUrl: "https://discord.gg/hgnetwork",
  },
};

export default site;
