import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDoc } from "@/lib/content";
import { formatDate } from "@/lib/site";
import { PageHeader } from "@/components/section";

const DOCS = ["terms", "privacy", "refunds"] as const;
type DocName = (typeof DOCS)[number];

export function generateStaticParams() {
  return DOCS.map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[doc]">): Promise<Metadata> {
  const { doc } = await params;
  const d = isDoc(doc) ? getDoc(`legal/${doc}`) : null;
  return { title: d?.title ?? "Not found" };
}

export default async function LegalPage({ params }: PageProps<"/legal/[doc]">) {
  const { doc } = await params;
  if (!isDoc(doc)) notFound();
  const d = getDoc(`legal/${doc}`);
  if (!d) notFound();

  return (
    <>
      <PageHeader eyebrow="Legal" title={d.title} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {d.updated && <p className="mb-6 font-mono text-[11px] uppercase tracking-wider text-muted">Last updated {formatDate(d.updated)}</p>}
        <div className="prose" dangerouslySetInnerHTML={{ __html: d.html }} />
      </div>
    </>
  );
}

function isDoc(value: string): value is DocName {
  return (DOCS as readonly string[]).includes(value);
}
