import type { Metadata } from "next";
import { site } from "@/lib/site";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { ButtonLink } from "@/components/button";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

export default async function SuccessPage({ searchParams }: PageProps<"/store/success">) {
  const { session_id } = await searchParams;
  const id = typeof session_id === "string" ? session_id : null;

  let player: string | null = null;
  let packageName: string | null = null;
  if (id && stripeConfigured()) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(id);
      if (session.metadata?.site === site.key) {
        player = session.metadata.player ?? null;
        const pkg = site.store.packages.find((p) => p.id === session.metadata?.packageId);
        packageName = pkg?.name ?? null;
      }
    } catch {
      // Fall through to the generic message.
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <div className="sticker sticker-2 p-8 sm:p-10">
        <p className="eyebrow mb-3">Payment received</p>
        <h1 className="display text-4xl">
          {player ? `Thanks, ${player}.` : "Thanks for supporting the server."}
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          {packageName ? <>Your <span className="text-fg">{packageName}</span> is on its way. </> : null}
          Delivery usually takes under a minute while you are online. If you are offline, it applies on your next login.
          Stripe has emailed you a receipt.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to {site.name}</ButtonLink>
          <ButtonLink href={site.discordUrl} variant="secondary">
            Need help? Open a ticket
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
