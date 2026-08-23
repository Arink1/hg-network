import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getPackage, site } from "@/lib/site";
import { getStripe } from "@/lib/stripe";
import { expireSubscription, fulfillPurchase } from "@/lib/fulfillment";

export const runtime = "nodejs";

/**
 * Stripe sends every event for the account to every registered endpoint, so each site
 * ignores events whose metadata.site is not its own.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.metadata?.site !== site.key) break;
        if (session.payment_status !== "paid") break;
        await fulfillFromMetadata(session.metadata, {
          email: session.customer_details?.email ?? null,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? site.store.currency,
          stripeSessionId: session.id,
          stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null,
        });
        break;
      }

      case "invoice.paid": {
        // Monthly renewals. The first invoice is covered by checkout.session.completed.
        const invoice = event.data.object;
        if (invoice.billing_reason !== "subscription_cycle") break;
        const subId = subscriptionIdFromInvoice(invoice);
        if (!subId) break;
        const sub = await stripe.subscriptions.retrieve(subId);
        if (sub.metadata?.site !== site.key) break;
        await fulfillFromMetadata(sub.metadata, {
          email: invoice.customer_email ?? null,
          amount: invoice.amount_paid ?? 0,
          currency: invoice.currency ?? site.store.currency,
          stripeSessionId: invoice.id,
          stripeSubscriptionId: sub.id,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        if (sub.metadata?.site !== site.key) break;
        await expireSubscription(sub.id);
        break;
      }
    }
  } catch (err) {
    console.error(`[webhook] ${event.type} failed`, err);
    // 500 makes Stripe retry, which is what we want for a transient database error.
    return NextResponse.json({ error: "Fulfillment failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const parent = (invoice as Stripe.Invoice & { parent?: { subscription_details?: { subscription?: string | { id: string } } } }).parent;
  const fromParent = parent?.subscription_details?.subscription;
  if (typeof fromParent === "string") return fromParent;
  if (fromParent && typeof fromParent === "object") return fromParent.id;
  const legacy = (invoice as unknown as { subscription?: string | { id: string } }).subscription;
  if (typeof legacy === "string") return legacy;
  if (legacy && typeof legacy === "object") return legacy.id;
  return null;
}

async function fulfillFromMetadata(
  metadata: Stripe.Metadata,
  payment: { email: string | null; amount: number; currency: string; stripeSessionId: string; stripeSubscriptionId: string | null }
) {
  const pkg = getPackage(metadata.packageId ?? "");
  if (!pkg) throw new Error(`unknown package ${metadata.packageId}`);
  const result = await fulfillPurchase({
    pkg,
    player: metadata.player ?? "",
    playerId: metadata.playerId ?? "",
    ...payment,
  });
  if (!result.duplicate) console.log(`[webhook] ${pkg.id} for ${metadata.player}: queued ${result.queued} commands`);
}
