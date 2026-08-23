"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { PlayerIdentity, StorePackage } from "@/lib/sites/types";
import { Button } from "./button";

function price(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function BuyButton({ pkg, identity }: { pkg: StorePackage; identity: PlayerIdentity }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className="w-full" onClick={() => setOpen(true)}>
        {pkg.interval ? "Subscribe" : "Buy"} for {price(pkg.price)}
        {pkg.interval ? " / month" : ""}
      </Button>
      {open && <CheckoutDialog pkg={pkg} identity={identity} onClose={() => setOpen(false)} />}
    </>
  );
}

function CheckoutDialog({ pkg, identity, onClose }: { pkg: StorePackage; identity: PlayerIdentity; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [player, setPlayer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    d.showModal();
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, [onClose]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id, player }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Checkout could not start. Try again.");
        setBusy(false);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError("Could not reach the store. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-auto w-[min(92vw,28rem)] bg-transparent p-0 text-ink backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={submit} className="sticker sticker-2 rise p-6 sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-1">Checkout</p>
            <h2 className="display text-3xl">{pkg.name}</h2>
            <p className="mt-1.5 font-mono text-sm text-muted">
              {price(pkg.price)}
              {pkg.interval ? " every month, cancel anytime" : " one time"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 flex-none place-items-center rounded-full border-2 border-ink text-ink transition-colors hover:bg-accent-3"
          >
            <X size={18} />
          </button>
        </div>

        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-muted">{identity.label}</span>
          <input
            autoFocus
            required
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
            placeholder={identity.placeholder}
            inputMode={identity.kind === "steamid64" ? "numeric" : "text"}
            autoComplete="off"
            spellCheck={false}
            className="h-12 w-full rounded-xl border-2 border-ink bg-paper px-3.5 font-mono text-base text-ink placeholder:text-muted/50 focus:shadow-[3px_3px_0_0_var(--accent)] focus:outline-none"
          />
          <span className="mt-2 block text-xs leading-relaxed text-muted">{identity.help}</span>
        </label>

        {error && (
          <p role="alert" className="mt-4 rounded-xl border-2 border-accent-2 bg-accent-soft px-3 py-2 text-sm font-medium">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Back
          </Button>
          <Button type="submit" disabled={busy || !player.trim()} className="flex-1">
            {busy ? "Opening checkout" : "Continue to payment"}
          </Button>
        </div>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
          Payment is handled by Stripe. Your purchase is delivered in game within a minute of payment, or on your next login.
        </p>
      </form>
    </dialog>
  );
}
