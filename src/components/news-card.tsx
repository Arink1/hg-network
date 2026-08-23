import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/site";
import type { Post } from "@/lib/content";

export function NewsCard({ post, large = false, delay = 0 }: { post: Post; large?: boolean; delay?: number }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className={`sticker sticker-hover group flex flex-col ${large ? "p-7 sm:p-9" : "p-6"}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      data-reveal
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="chip bg-accent-3">{post.tag}</span>
        <time dateTime={post.date} className="font-mono text-[11px] uppercase tracking-wider text-muted">
          {formatDate(post.date)}
        </time>
      </div>
      <h3 className={`display ${large ? "text-3xl sm:text-4xl" : "text-2xl"}`}>{post.title}</h3>
      <p className={`mt-3 flex-1 leading-relaxed text-muted ${large ? "text-base sm:text-lg" : "line-clamp-3 text-sm"}`}>{post.excerpt}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-bold text-ink">
        Read post <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
