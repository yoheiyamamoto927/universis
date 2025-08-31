// lib/mdx.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

/** 記事メタ（一覧やカードで使う最小集合） */
export type ArticleMeta = {
  title: string;
  slug: string;
  date: string; // YYYY-MM-DD など文字列想定
  author: string;
  readMin: number;

  cover?: string;
  excerpt?: string;
  teams?: string[];
  tags?: string[];

  /** カテゴリ（例: "kanto-taikosen"） */
  category?: string;

  /** 試合で束ねたいときのID（任意） */
  matchId?: string;

  /** 任意：ランキング等で使う閲覧数 */
  views?: number;
};

/** 本文付き */
export type Article = ArticleMeta & { content: string };

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

function existsArticlesDir(): boolean {
  try {
    return fs.existsSync(ARTICLES_DIR);
  } catch {
    return false;
  }
}

export function getArticleSlugs(): string[] {
  if (!existsArticlesDir()) return [];
  return fs.readdirSync(ARTICLES_DIR).filter((f) => f.toLowerCase().endsWith(".mdx"));
}

function readMdx(file: string): { data: unknown; content: string } {
  const fullPath = path.join(ARTICLES_DIR, file);
  const fileStr = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileStr);
  return { data, content };
}

/** gray-matter の data を安全に ArticleMeta に落とす */
function toMeta(raw: unknown): ArticleMeta | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;

  const getStr = (k: string): string | undefined =>
    typeof r[k] === "string" ? (r[k] as string) : undefined;

  const getNum = (k: string): number | undefined => {
    const v = r[k];
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
      return Number(v);
    }
    return undefined;
  };

  const getStrArr = (k: string): string[] | undefined => {
    const v = r[k];
    if (!Array.isArray(v)) return undefined;
    const arr = v.filter((x) => typeof x === "string") as string[];
    return arr.length ? arr : undefined;
  };

  const slug = getStr("slug");
  const title = getStr("title");
  if (!slug || !title) return null;

  return {
    title,
    slug,
    date: getStr("date") ?? "",
    author: getStr("author") ?? "",
    readMin: getNum("readMin") ?? 0,

    cover: getStr("cover"),
    excerpt: getStr("excerpt"),
    teams: getStrArr("teams"),
    tags: getStrArr("tags"),

    category: getStr("category"),
    matchId: getStr("matchId"),
    views: getNum("views"),
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

/** 一覧用メタデータ（欠落を弾きつつ日付降順） */
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

function score(a: ArticleForRanking): number {
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
