import { NextResponse } from "next/server";
import { getServer, site } from "@/lib/site";
import { getSupabase, type CommandRow } from "@/lib/supabase";
import { authorizeDelivery } from "@/lib/delivery-auth";

export const runtime = "nodejs";

/**
 * GET /api/deliveries?server=<key>&limit=50
 * Returns pending commands for one game server, oldest first.
 * Run them, then POST the ids to /api/deliveries/ack.
 */
export async function GET(req: Request) {
  const denied = authorizeDelivery(req);
  if (denied) return denied;

  const url = new URL(req.url);
  const serverKey = url.searchParams.get("server") ?? "";
  if (!getServer(serverKey)) {
    return NextResponse.json(
      { error: `Unknown server. Valid keys: ${site.servers.map((s) => s.key).join(", ")}` },
      { status: 400 }
    );
  }
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 50), 1), 200);

  const { data, error } = await getSupabase()
    .from("command_queue")
    .select("id, command, purchase_id, created_at")
    .eq("site", site.key)
    .eq("server_key", serverKey)
    .eq("status", "pending")
    .order("id", { ascending: true })
    .limit(limit);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const commands = (data as Pick<CommandRow, "id" | "command" | "purchase_id" | "created_at">[]) ?? [];
  return NextResponse.json({ server: serverKey, commands }, { headers: { "Cache-Control": "no-store" } });
}
