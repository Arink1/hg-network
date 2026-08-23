import type { GameServer } from "./site";

export interface ServerStatus {
  online: boolean;
  players: number;
  maxPlayers: number;
  version?: string;
  map?: string;
  lastWipe?: string;
  checkedAt: string;
}

const OFFLINE: Omit<ServerStatus, "checkedAt"> = { online: false, players: 0, maxPlayers: 0 };

/** Live status for one server. Cached for 60 seconds at the edge. Never throws. */
export async function fetchStatus(server: GameServer): Promise<ServerStatus> {
  const checkedAt = new Date().toISOString();
  try {
    const src = server.status;
    if (src.provider === "minecraft") {
      const res = await fetch(
        `https://api.mcstatus.io/v2/status/java/${src.host}:${src.port ?? 25565}`,
        { next: { revalidate: 60 } }
      );
      if (!res.ok) return { ...OFFLINE, checkedAt };
      const data = await res.json();
      return {
        online: Boolean(data.online),
        players: data.players?.online ?? 0,
        maxPlayers: data.players?.max ?? 0,
        version: data.version?.name_clean ?? undefined,
        checkedAt,
      };
    }
    if (src.provider === "battlemetrics") {
      const res = await fetch(`https://api.battlemetrics.com/servers/${src.serverId}`, {
        next: { revalidate: 60 },
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return { ...OFFLINE, checkedAt };
      const { data } = await res.json();
      const a = data?.attributes ?? {};
      const details = a.details ?? {};
      return {
        online: a.status === "online",
        players: a.players ?? 0,
        maxPlayers: a.maxPlayers ?? 0,
        map: details.map ?? undefined,
        lastWipe: details.rust_last_wipe ?? undefined,
        checkedAt,
      };
    }
    return { ...OFFLINE, checkedAt };
  } catch {
    return { ...OFFLINE, checkedAt };
  }
}

export async function fetchAllStatus(servers: GameServer[]) {
  const statuses = await Promise.all(servers.map(fetchStatus));
  return servers.map((server, i) => ({ server, status: statuses[i] }));
}
