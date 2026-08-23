import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { NETWORK_NAME, site } from "./site";

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tag: string;
  author: string;
  html: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

function siteDir(...parts: string[]) {
  return path.join(CONTENT_ROOT, site.key, ...parts);
}

/** Replace {{site}} style placeholders in shared documents. */
function fillPlaceholders(text: string): string {
  const vars: Record<string, string> = {
    site: site.name,
    game: site.gameLabel,
    domain: site.domain,
    url: site.url,
    email: site.contactEmail,
    network: NETWORK_NAME,
    discord: site.discordUrl,
  };
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => vars[key] ?? "");
}

export function renderMarkdown(md: string): string {
  return marked.parse(fillPlaceholders(md), { async: false }) as string;
}

export function getAllPosts(): Post[] {
  const dir = siteDir("news");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => readPost(file.replace(/\.md$/, "")))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  return readPost(slug);
}

function readPost(slug: string): Post | null {
  const file = siteDir("news", `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? "1970-01-01"),
    excerpt: String(data.excerpt ?? ""),
    tag: String(data.tag ?? "Update"),
    author: String(data.author ?? "HG Staff"),
    html: renderMarkdown(content),
  };
}

export interface Doc {
  title: string;
  updated?: string;
  html: string;
}

/** A per-site document like rules.md, falling back to content/shared/<name>.md. */
export function getDoc(name: string): Doc | null {
  const candidates = [siteDir(`${name}.md`), path.join(CONTENT_ROOT, "shared", `${name}.md`)];
  const file = candidates.find((f) => fs.existsSync(f));
  if (!file) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    title: fillPlaceholders(String(data.title ?? name)),
    updated: data.updated ? new Date(data.updated).toISOString().slice(0, 10) : undefined,
    html: renderMarkdown(content),
  };
}
