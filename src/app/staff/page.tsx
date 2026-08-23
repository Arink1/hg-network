import type { Metadata } from "next";
import { site } from "@/lib/site";
import { ButtonLink } from "@/components/button";
import { PageHeader } from "@/components/section";

export const metadata: Metadata = {
  title: "Staff",
  description: `Who runs ${site.name} and how to apply.`,
};

export default function StaffPage() {
  const open = site.staff.roles.filter((r) => r.open);
  return (
    <>
      <PageHeader eyebrow="Staff" title="Who runs the server" intro={site.staff.intro} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <h2 className="eyebrow mb-5">Roles</h2>
          <ul className="space-y-4">
            {site.staff.roles.map((r, i) => (
              <li
                key={r.name}
                className={`sticker grid gap-3 p-5 sm:grid-cols-[10rem_1fr_auto] sm:items-center sm:gap-6 ${r.open ? "" : "sticker-flat"}`}
                style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
                data-reveal
              >
                <span className="display text-2xl">{r.name}</span>
                <span className="text-muted">{r.blurb}</span>
                <span className={`chip justify-self-start sm:justify-self-end ${r.open ? "bg-accent-3" : "text-muted"}`}>
                  {r.open ? "Applications open" : "By promotion"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="sticker sticker-2 self-start p-6" data-reveal>
          <p className="eyebrow mb-2">Apply</p>
          <h2 className="display text-3xl">
            {open.length > 0 ? `${open.length} ${open.length === 1 ? "role is" : "roles are"} open` : "Nothing open right now"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Applications go through Discord. Open a ticket in the applications channel, say which role you want and how long you
            have played here. We reply within a week.
          </p>
          <ButtonLink href={site.staff.applyUrl} className="mt-5 w-full">
            Apply in Discord
          </ButtonLink>
        </aside>
      </div>
    </>
  );
}
