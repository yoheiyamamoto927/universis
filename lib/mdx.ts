// lib/mdx.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

/** 記事メタ（一覧やカードで使う最小集合） */
export type ArticleMeta = {
  title: string;
  slug: string;
  date: string;                 // YYYY-MM-DD など文字列想定
  author: string;
  readMin: number;

  cover?: string;
  excerpt?: string;
  teams?: string[];
  tags?: string[];

  /** ★ 追加: カテゴリ（例: "kanto-taikosen"） */
  category?: string;

  /** ★ 追加: 試合で束ねたいときのID（任意） */
  matchId?: string;

  /** ランキング等で任意に使う閲覧数 */
  views?: number;
};

/** 本文付き */
export type Article = ArticleMeta & { content: string };

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

function existsArticlesDir() {
  try {
    return fs.existsSync(ARTICLES_DIR);
  } catch {
    return false;
  }
}

export function getArticleSlugs(): string[] {
  if (!existsArticlesDir()) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.toLowerCase().endsWith(".mdx"));
}

function readMdx(file: string) {
  const fullPath = path.join(ARTICLES_DIR, file);
  const fileStr = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileStr);
  return { data, content };
}

function toMeta(raw: any): ArticleMeta | null {
  if (!raw?.slug || !raw?.title) return null;

  const category =
    typeof raw.category === "string" ? String(raw.category) : undefined;

  const matchId =
    typeof raw.matchId === "string" ? String(raw.matchId) : undefined;

  return {
    title: String(raw.title ?? ""),
    slug: String(raw.slug),
    date: String(raw.date ?? ""),
    author: String(raw.author ?? ""),
    readMin: Number(raw.readMin ?? 0),

    cover: raw.cover,
    excerpt: raw.excerpt,
    teams: Array.isArray(raw.teams) ? raw.teams : undefined,
    tags: Array.isArray(raw.tags) ? raw.tags : undefined,

    // ★ ここで frontmatter から通す
    category,
    matchId,

    views: typeof raw.views === "number" ? raw.views : undefined,
  };
}

/**
 * 指定 slug の記事を返す。見つからなければ null。
 * - frontmatter の slug で照合（大小無視）
 */
export function getArticleBySlug(slug?: string): Article | null {
  if (!slug) return null;
  const target = slug.toLowerCase();

  for (const file of getArticleSlugs()) {
    const { data, content } = readMdx(file);
    const meta = toMeta(data);
    if (!meta) continue;

    if (meta.slug.toLowerCase() === target) {
      return { ...meta, content };
    }
  }
  return null;
}

/**
 * 一覧用メタデータ（欠落を弾きつつ日付降順）
 */
export function getAllArticles(): ArticleMeta[] {
  const list = getArticleSlugs()
    .map((file) => {
      const { data } = readMdx(file);
      return toMeta(data);
    })
    .filter((a): a is ArticleMeta => !!a);

  // 日付降順（不正値は0扱い）
  return list.sort((a, b) => {
    const ad = new Date(a.date).getTime() || 0;
    const bd = new Date(b.date).getTime() || 0;
    return bd - ad;
  });
}

/** ランキング等（views 降順 → 無ければ日付降順） */
export type ArticleForRanking = Pick<ArticleMeta, "slug" | "title" | "date" | "views">;

function score(a: ArticleForRanking) {
  if (typeof a.views === "number") return a.views;
  return new Date(a.date).getTime() || 0;
}

export function getTopArticles(n = 5): ArticleForRanking[] {
  const slim = getAllArticles().map((a) => ({
    slug: a.slug,
    title: a.title,
    date: a.date,
    views: a.views,
  }));
  return slim.sort((x, y) => score(y) - score(x)).slice(0, n);
}
