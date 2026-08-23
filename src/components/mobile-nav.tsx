"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "./button";

export function MobileNav({
  links,
  discordUrl,
}: {
  links: ReadonlyArray<{ href: string; label: string }>;
  discordUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="grid size-11 place-items-center rounded-full border-2 border-ink bg-paper text-ink shadow-[3px_3px_0_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full border-b-2 border-ink bg-paper px-4 pb-6 pt-3 shadow-[0_20px_40px_-20px_rgba(20,18,31,0.3)]">
          <nav aria-label="Primary" className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className="border-b border-line py-3.5 font-display text-xl font-bold text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex gap-3" onClick={close}>
            <ButtonLink href={discordUrl} variant="secondary" className="flex-1">
              Discord
            </ButtonLink>
            <ButtonLink href="/store" className="flex-1">
              Store
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
