import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { getSupabase } from "@/lib/supabase";
import { authorizeDelivery } from "@/lib/delivery-auth";

export const runtime = "nodejs";

/** POST /api/deliveries/ack  { "ids": [1, 2, 3] }  marks commands delivered. */
export async function POST(req: Request) {
  const denied = authorizeDelivery(req);
  if (denied) return denied;

  let ids: unknown;
  try {
    ids = (await req.json())?.ids;
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }
  if (!Array.isArray(ids) || ids.length === 0 || !ids.every((n) => Number.isInteger(n))) {
    return NextResponse.json({ error: "ids must be a non-empty array of integers." }, { status: 400 });
  }

  const { data, error } = await getSupabase()
    .from("command_queue")
    .update({ status: "delivered", delivered_at: new Date().toISOString() })
    .eq("site", site.key)
    .eq("status", "pending")
    .in("id", ids as number[])
    .select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ delivered: data?.length ?? 0 });
}
