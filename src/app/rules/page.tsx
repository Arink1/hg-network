import type { Metadata } from "next";
import { formatDate, site } from "@/lib/site";
import { getDoc } from "@/lib/content";
import { PageHeader } from "@/components/section";

export const metadata: Metadata = {
  title: "Rules",
  description: `The rules on ${site.name}. Read them before you play; they are enforced.`,
};

export default function RulesPage() {
  const doc = getDoc("rules");
  return (
    <>
      <PageHeader
        eyebrow="Rules"
        title={doc?.title ?? "Server rules"}
        intro="Short on purpose. If something is not listed, use judgment, and ask staff if you are unsure."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {doc?.updated && <p className="mb-6 font-mono text-[11px] uppercase tracking-wider text-muted">Last updated {formatDate(doc.updated)}</p>}
        {doc ? (
          <div className="prose" dangerouslySetInnerHTML={{ __html: doc.html }} />
        ) : (
          <p className="text-muted">Rules are being written. Check Discord in the meantime.</p>
        )}
      </div>
    </>
  );
}
