import { site } from "./site";

export interface ResolvedPlayer {
  /** Display name shown on the site and passed as {player}. */
  player: string;
  /** Stable id passed as {playerId}: Mojang UUID or SteamID64. */
  playerId: string;
}

export class PlayerError extends Error {}

const MC_NAME = /^[A-Za-z0-9_]{3,16}$/;
const STEAMID64 = /^7656119\d{10}$/;

/** Validate the player identity for this site against the relevant service. Throws PlayerError with a user-facing message. */
export async function resolvePlayer(input: string): Promise<ResolvedPlayer> {
  const value = input.trim();
  if (site.playerIdentity.kind === "minecraft-username") {
    if (!MC_NAME.test(value)) throw new PlayerError("Minecraft usernames are 3 to 16 letters, numbers or underscores.");
    const res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(value)}`, {
      cache: "no-store",
    });
    if (res.status === 404 || res.status === 204) throw new PlayerError(`No Java Edition account named "${value}" exists.`);
    if (!res.ok) throw new PlayerError("Mojang did not answer. Try again in a minute.");
    const data = (await res.json()) as { id: string; name: string };
    return { player: data.name, playerId: dashUuid(data.id) };
  }

  if (!STEAMID64.test(value)) throw new PlayerError("A SteamID64 is 17 digits and starts with 7656119.");
  const key = process.env.STEAM_API_KEY;
  if (!key) return { player: value, playerId: value };
  try {
    const res = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${value}`,
      { cache: "no-store" }
    );
    if (!res.ok) return { player: value, playerId: value };
    const data = await res.json();
    const name: string | undefined = data?.response?.players?.[0]?.personaname;
    return { player: name ?? value, playerId: value };
  } catch {
    return { player: value, playerId: value };
  }
}

function dashUuid(hex: string): string {
  const h = hex.replace(/-/g, "");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
