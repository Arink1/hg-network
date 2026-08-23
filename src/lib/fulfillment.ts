import { site, type StorePackage } from "./site";
import { getSupabase, type PurchaseRow } from "./supabase";

export interface FulfillmentInput {
  pkg: StorePackage;
  player: string;
  playerId: string;
  email: string | null;
  amount: number;
  currency: string;
  /** Idempotency key. Checkout session id for first payments, invoice id for renewals. */
  stripeSessionId: string;
  stripeSubscriptionId: string | null;
}

interface CommandContext {
  player: string;
  playerId: string;
  package: string;
  purchaseId: string;
}

/** Fill {player} {playerId} {package} {purchaseId} in a command template. */
export function renderCommand(template: string, ctx: CommandContext): string {
  return template.replace(/\{(player|playerId|package|purchaseId)\}/g, (_, key: keyof CommandContext) => ctx[key]);
}

function targetServers(pkg: StorePackage): string[] {
  return pkg.server ? [pkg.server] : site.servers.map((s) => s.key);
}

/**
 * Record a paid purchase and queue its commands for every target server.
 * Safe to call twice with the same stripeSessionId: the second call is a no-op.
 */
export async function fulfillPurchase(input: FulfillmentInput): Promise<{ purchaseId: string; queued: number; duplicate: boolean }> {
  const db = getSupabase();

  const existing = await db.from("purchases").select("id").eq("stripe_session_id", input.stripeSessionId).maybeSingle();
  if (existing.data) return { purchaseId: existing.data.id, queued: 0, duplicate: true };

  const inserted = await db
    .from("purchases")
    .insert({
      site: site.key,
      package_id: input.pkg.id,
      package_name: input.pkg.name,
      player: input.player,
      player_id: input.playerId,
      email: input.email,
      amount: input.amount,
      currency: input.currency,
      stripe_session_id: input.stripeSessionId,
      stripe_subscription_id: input.stripeSubscriptionId,
      status: "paid",
    })
    .select("id")
    .single();
  if (inserted.error) throw new Error(`purchase insert failed: ${inserted.error.message}`);

  const purchaseId = inserted.data.id as string;
  const queued = await queueCommands(purchaseId, input.pkg, input.pkg.commands, { player: input.player, playerId: input.playerId });
  return { purchaseId, queued, duplicate: false };
}

/** Mark a subscription purchase expired and queue its removal commands. */
export async function expireSubscription(stripeSubscriptionId: string): Promise<number> {
  const db = getSupabase();
  const found = await db
    .from("purchases")
    .select("*")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .eq("status", "paid")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const purchase = found.data as PurchaseRow | null;
  if (!purchase) return 0;

  await db.from("purchases").update({ status: "expired" }).eq("stripe_subscription_id", stripeSubscriptionId);

  const pkg = site.store.packages.find((p) => p.id === purchase.package_id);
  if (!pkg?.expireCommands?.length) return 0;
  return queueCommands(purchase.id, pkg, pkg.expireCommands, { player: purchase.player, playerId: purchase.player_id });
}

async function queueCommands(
  purchaseId: string,
  pkg: StorePackage,
  templates: string[],
  who: { player: string; playerId: string }
): Promise<number> {
  const db = getSupabase();
  const ctx: CommandContext = { ...who, package: pkg.id, purchaseId };
  const rows = targetServers(pkg).flatMap((server_key) =>
    templates.map((t) => ({
      site: site.key,
      server_key,
      purchase_id: purchaseId,
      command: renderCommand(t, ctx),
      status: "pending",
    }))
  );
  if (rows.length === 0) return 0;
  const result = await db.from("command_queue").insert(rows);
  if (result.error) throw new Error(`command queue insert failed: ${result.error.message}`);
  return rows.length;
}

export interface Supporter {
  player: string;
  package_name: string;
  created_at: string;
}

/** Most recent paid purchases for the supporters strip. Returns [] when the database is not configured. */
export async function recentSupporters(limit = 8): Promise<Supporter[]> {
  try {
    const db = getSupabase();
    const { data } = await db
      .from("purchases")
      .select("player, package_name, created_at")
      .eq("site", site.key)
      .eq("status", "paid")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data as Supporter[]) ?? [];
  } catch {
    return [];
  }
}
