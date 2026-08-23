import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Server-only client using the service role key. Never import from a client component. */
export function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  if (!client) client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export interface PurchaseRow {
  id: string;
  site: string;
  package_id: string;
  package_name: string;
  player: string;
  player_id: string;
  email: string | null;
  amount: number;
  currency: string;
  stripe_session_id: string | null;
  stripe_subscription_id: string | null;
  status: "paid" | "refunded" | "expired";
  created_at: string;
}

export interface CommandRow {
  id: number;
  site: string;
  server_key: string;
  purchase_id: string | null;
  command: string;
  status: "pending" | "delivered";
  created_at: string;
  delivered_at: string | null;
}
