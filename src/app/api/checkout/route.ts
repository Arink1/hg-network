import { NextResponse } from "next/server";
import { getPackage, site, siteUrl } from "@/lib/site";
import { PlayerError, resolvePlayer } from "@/lib/player";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (site.store.provider !== "stripe" || !stripeConfigured()) {
    return NextResponse.json({ error: "The store is not open yet." }, { status: 503 });
  }

  let body: { packageId?: string; player?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const pkg = body.packageId ? getPackage(body.packageId) : undefined;
  if (!pkg) return NextResponse.json({ error: "That package does not exist." }, { status: 404 });
  if (typeof body.player !== "string" || !body.player.trim()) {
    return NextResponse.json({ error: `Enter your ${site.playerIdentity.label}.` }, { status: 400 });
  }

  let resolved;
  try {
    resolved = await resolvePlayer(body.player);
  } catch (err) {
    if (err instanceof PlayerError) return NextResponse.json({ error: err.message }, { status: 422 });
    throw err;
  }

  const metadata = {
    site: site.key,
    packageId: pkg.id,
    player: resolved.player,
    playerId: resolved.playerId,
  };

  const stripe = getStripe();
  const base = siteUrl();
  const session = await stripe.checkout.sessions.create({
    mode: pkg.interval ? "subscription" : "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: site.store.currency,
          unit_amount: pkg.price,
          product_data: {
            name: `${site.name} ${pkg.name}`,
            description: `For ${resolved.player}. ${pkg.description}`,
          },
          ...(pkg.interval ? { recurring: { interval: pkg.interval } } : {}),
        },
      },
    ],
    metadata,
    ...(pkg.interval ? { subscription_data: { metadata } } : {}),
    allow_promotion_codes: true,
    success_url: `${base}/store/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/store`,
  });

  return NextResponse.json({ url: session.url, player: resolved.player });
}
