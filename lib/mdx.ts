// lib/mdx.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ArticleMeta = {
  title: string;
  slug: string;
  date: string;        // YYYY-MM-DD などの文字列想定
  author: string;
  teams?: string[];
  tags?: string[];
  readMin: number;
  cover?: string;
  excerpt?: string;
  // 任意で閲覧数（ランキング用にあれば使う）
  views?: number;
};

export type Article = ArticleMeta & { content: string };

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));
}

function readMdx(file: string) {
  const fullPath = path.join(ARTICLES_DIR, file);
  const fileStr = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileStr);
  return { meta: data as unknown as ArticleMeta, content };
}

/**
 * 指定 slug の記事を返す。見つからなければ null。
 * - frontmatter の slug で照合
 * - 大文字/小文字の違いは無視
 */
export function getArticleBySlug(slug?: string): Article | null {
  if (!slug) return null;

  const target = slug.toLowerCase();

  for (const file of getArticleSlugs()) {
    const { meta, content } = readMdx(file);
    if (typeof meta?.slug !== "string") continue;

    if (meta.slug.toLowerCase() === target) {
      // 必要に応じてデフォルト埋め
      const safeMeta: ArticleMeta = {
        title: meta.title ?? "",
        slug: meta.slug,
        date: meta.date ?? "",
        author: meta.author ?? "",
        teams: meta.teams,
        tags: meta.tags,
        readMin: Number(meta.readMin ?? 0),
        cover: meta.cover,
        excerpt: meta.excerpt,
        views: typeof meta.views === "number" ? meta.views : undefined,
      };
      return { ...safeMeta, content };
    }
  }
  return null;
}

/**
 * 一覧表示用のメタデータ。欠落の大きいものは弾きつつ日付降順で返す。
 */
export function getAllArticles(): ArticleMeta[] {
  const list = getArticleSlugs()
    .map((file) => {
      const { meta } = readMdx(file);
      // 最低限、slug と title が無いものは除外
      if (!meta?.slug || !meta?.title) return null;

      return {
        title: String(meta.title ?? ""),
        slug: String(meta.slug),
        date: String(meta.date ?? ""),
        author: String(meta.author ?? ""),
        teams: meta.teams,
        tags: meta.tags,
        readMin: Number(meta.readMin ?? 0),
        cover: meta.cover,
        excerpt: meta.excerpt,
        views: typeof meta.views === "number" ? meta.views : undefined,
      } as ArticleMeta;
    })
    .filter((a): a is ArticleMeta => !!a);

  // 日付降順
  return list.sort((a, b) => {
    const ad = new Date(a.date).getTime() || 0;
    const bd = new Date(b.date).getTime() || 0;
    return bd - ad;
  });
}

// --- ここから：閲覧数ベースのランキング（無ければ日付順） ---

export type ArticleForRanking = {
  slug: string;
  title: string;
  date: string;
  views?: number; // frontmatter で任意
};

// 仮: views が無ければ新しい順のスコアで代替
function score(a: ArticleForRanking) {
  if (typeof a.views === "number") return a.views;
  return new Date(a.date).getTime();
}

/** トップN件を返す（views降順 → 代替で日付降順） */
export function getTopArticles(n = 5): ArticleForRanking[] {
  const all = getAllArticles();
  const slim = all.map((a) => ({
    slug: a.slug,
    title: a.title,
    date: a.date,
    views: a.views,
  }));
  return slim.sort((x, y) => score(y) - score(x)).slice(0, n);
}
