import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  intro,
  aside,
  children,
  className = "",
  id,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20 ${className}`}>
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between" data-reveal>
        <div className="max-w-2xl">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 className="display text-3xl sm:text-4xl lg:text-5xl">{title}</h2>
          {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
        </div>
        {aside && <div className="flex-none">{aside}</div>}
      </div>
      {children}
    </section>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="relative overflow-hidden border-b-2 border-ink">
      <div className="blobs" aria-hidden>
        <div className="blob blob-a" style={{ opacity: 0.4 }} />
        <div className="blob blob-b" style={{ opacity: 0.35 }} />
      </div>
      <div className="texture" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6 lg:pb-16 lg:pt-20">
        <p className="eyebrow rise mb-4">{eyebrow}</p>
        <h1 className="display rise rise-2 text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && <p className="rise rise-3 mt-5 max-w-2xl text-lg text-muted">{intro}</p>}
      </div>
    </div>
  );
}
