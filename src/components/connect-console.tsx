import { Gamepad2 } from "lucide-react";
import { site, type GameServer } from "@/lib/site";
import { fetchStatus, type ServerStatus } from "@/lib/status";
import { CopyButton } from "./copy-button";

/**
 * The join card: the address to connect and the live player count.
 * Streams in under Suspense so the hero never waits on it.
 */
export async function ConnectConsole({ server, compact = false }: { server: GameServer; compact?: boolean }) {
  const status = await fetchStatus(server);
  return <ConsoleView server={server} status={status} compact={compact} />;
}

export function ConsoleSkeleton({ server, compact = false }: { server: GameServer; compact?: boolean }) {
  return (
    <ConsoleView
      server={server}
      status={{ online: false, players: 0, maxPlayers: 0, checkedAt: "" }}
      compact={compact}
      loading
    />
  );
}

function ConsoleView({
  server,
  status,
  compact,
  loading = false,
}: {
  server: GameServer;
  status: ServerStatus;
  compact: boolean;
  loading?: boolean;
}) {
  const joinHint =
    site.game === "minecraft"
      ? "Multiplayer, Add server, paste the address."
      : "Use the Steam connect link, or paste the address in the in-game console.";
  const fill = status.online && status.maxPlayers > 0 ? Math.min(100, Math.round((status.players / status.maxPlayers) * 100)) : 0;

  return (
    <div className={`sticker sticker-2 overflow-hidden ${compact ? "" : ""}`}>
      <div className="flex items-center justify-between gap-3 border-b-2 border-ink bg-accent-soft px-5 py-3">
        <span className="inline-flex items-center gap-2 font-display text-sm font-bold">
          <Gamepad2 size={16} aria-hidden /> {server.name}
        </span>
        <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-wider text-muted">
          <span className={`dot ${status.online ? "dot-online" : ""}`} aria-hidden />
          {loading ? "Checking" : status.online ? "Online" : "Offline"}
        </span>
      </div>

      <div className={`space-y-4 px-5 ${compact ? "py-4" : "py-5"}`}>
        <div>
          <p className="mb-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-muted">Server address</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`select-all font-mono font-bold text-ink ${compact ? "text-base" : "text-lg sm:text-xl"}`}>{server.address}</span>
            <CopyButton value={server.address} />
            {server.connectUrl && (
              <a href={server.connectUrl} className="btn btn-secondary h-8 px-3 text-[12px]">
                Steam connect
              </a>
            )}
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] font-medium uppercase tracking-wider text-muted">
            <span>Players online</span>
            <span className="text-ink">
              {loading ? "..." : status.online ? `${status.players} / ${status.maxPlayers}` : "No response"}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full border-2 border-ink bg-paper">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-out"
              style={{ width: `${fill}%` }}
            />
          </div>
          {!loading && status.online && (status.version || status.map) && (
            <p className="mt-2 font-mono text-[11px] text-muted">
              {status.version && <span>{status.version}</span>}
              {status.version && status.map && <span> · </span>}
              {status.map && <span>{status.map}</span>}
            </p>
          )}
          {!loading && !status.online && (
            <p className="mt-2 font-mono text-[11px] text-muted">Could not reach the server. Try again in a minute.</p>
          )}
        </div>

        {!compact && <p className="text-sm text-muted">{joinHint}</p>}
      </div>
    </div>
  );
}
