import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getAllPosts } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const statics = ["", "/store", "/news", "/rules", "/staff", "/legal/terms", "/legal/privacy", "/legal/refunds"];
  return [
    ...statics.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...getAllPosts().map((p) => ({ url: `${base}/news/${p.slug}`, lastModified: new Date(p.date), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
