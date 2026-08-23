import { NextResponse } from "next/server";
import { supabaseConfigured } from "./supabase";

/** Bearer token auth for the game server delivery endpoints. Returns a response to send when denied. */
export function authorizeDelivery(req: Request): NextResponse | null {
  const expected = process.env.DELIVERY_API_KEY;
  if (!expected) return NextResponse.json({ error: "DELIVERY_API_KEY is not set on the site." }, { status: 503 });
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token.length === 0 || token !== expected) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  return null;
}
