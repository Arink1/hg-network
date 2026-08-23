import type { NetworkSite } from "./types";

export const NETWORK_NAME = "HG Network";

/* One palette per server. The same values live in each site's config; keep them in sync. */
export const NETWORK_SITES: NetworkSite[] = [
  {
    key: "crafting",
    name: "HGCrafting",
    shortName: "Crafting",
    game: "Minecraft",
    url: "https://hgcrafting.com",
    pitch: "Survival with land claims, a player economy and seasons that actually end.",
    accent: "#17b857",
    accent2: "#1d9bf0",
    accent3: "#ffd23f",
    accentInk: "#0a2a15",
  },
  {
    key: "darkrp",
    name: "HGDarkRP",
    shortName: "DarkRP",
    game: "Garry's Mod",
    url: "https://hgdarkrp.com",
    pitch: "Sixty custom jobs, player owned businesses and a mayor you can vote out.",
    accent: "#ff2d87",
    accent2: "#7a3cff",
    accent3: "#2ee6ff",
    accentInk: "#ffffff",
  },
  {
    key: "rusty",
    name: "HGRusty",
    shortName: "Rusty",
    game: "Rust",
    url: "https://hgrusty.com",
    pitch: "2x gather, weekly wipes, max group of five and admins who do not play.",
    accent: "#ff6a1a",
    accent2: "#e8262f",
    accent3: "#ffc53d",
    accentInk: "#2a1000",
  },
];
