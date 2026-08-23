import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { formatDate, site } from "@/lib/site";
import { getAllPosts, getPost } from "@/lib/content";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date, siteName: site.name },
  };
}

export default async function PostPage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link href="/news" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted hover:text-accent">
        <ArrowLeft size={14} /> All news
      </Link>
      <header className="mb-10 mt-6 border-b border-line pb-8">
        <div className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-muted">
          <span className="text-accent">{post.tag}</span>
          <span aria-hidden>/</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>/</span>
          <span>{post.author}</span>
        </div>
        <h1 className="display text-4xl sm:text-5xl">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg text-muted">{post.excerpt}</p>}
      </header>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
