import type { Metadata } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/content";
import { NewsCard } from "@/components/news-card";
import { PageHeader } from "@/components/section";

export const metadata: Metadata = {
  title: "News",
  description: `Updates, patch notes and events from ${site.name}.`,
};

export default function NewsPage() {
  const posts = getAllPosts();
  const [first, ...rest] = posts;

  return (
    <>
      <PageHeader eyebrow="News" title="Updates and patch notes" intro="What changed, what is coming and when the next event is." />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {posts.length === 0 ? (
          <p className="sticker p-6 text-muted">Nothing posted yet. Launch updates land here and in Discord.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-3">
              <NewsCard post={first} large />
            </div>
            {rest.map((p, i) => (
              <NewsCard key={p.slug} post={p} delay={i * 90} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
