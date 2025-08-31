// app/articles/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import {
  getArticleBySlug,
  getArticleSlugs,
  type Article,
} from "@/lib/mdx";
import { getHeadingsFromMdx, type Heading } from "@/lib/toc";
import { getWriterBySlug } from "@/lib/writers";

type Params = { slug: string };

// Next.js 15 では Server Component で params が Promise の場合があるため、Promise を受けて await します
export default async function ArticlePage({
  params,
}: {
  params: Promise<Params> | Params;
}) {
  const resolved: Params = params instanceof Promise ? await params : params;
  const slug: string | undefined = resolved?.slug;

  if (!slug) {
    return notFound();
  }

  // 記事取得
  const article: Article | null = (() => {
    try {
      return getArticleBySlug(slug);
    } catch {
      return null;
    }
  })();

  if (!article) return notFound();

  const { title, date, author, cover, excerpt, content, readMin } = article;

  // 見出しは本文から生成（ファイルに headings フロントマターが無くてもOK）
  const headings: Heading[] = getHeadingsFromMdx(content);

  // ライター情報（author が無い場合は null）
  const writer = author ? getWriterBySlug(author) : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* ===== ヘッダー ===== */}
      <header className="mb-6 border-b pb-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <time>{new Date(date).toLocaleDateString("ja-JP")}</time>
          {typeof readMin === "number" && <span>・{readMin}分</span>}
        </div>
        <h1 className="mt-2 text-3xl font-bold">{title}</h1>
        {excerpt && <p className="mt-2 text-lg text-gray-600">{excerpt}</p>}
      </header>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* ===== 本文 ===== */}
        <article className="md:col-span-3">
          {cover && (
            <div className="mb-6">
              <Image
                src={cover}
                alt={title}
                width={1200}
                height={630}
                className="rounded-lg"
                priority
              />
            </div>
          )}

          <div className="prose prose-lg mdx-content dark:prose-invert">
            <MDXRemote source={content} />
          </div>

          {/* ライター */}
          {writer && (
            <div className="mt-12 rounded-lg border bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="flex items-center gap-4">
                <Image
                  src={writer.avatar}
                  alt={writer.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold">{writer.name}</h3>
                  {writer.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{writer.bio}</p>
                  )}

                  {(writer.sns?.x || writer.sns?.instagram) && (
                    <div className="mt-2 flex gap-3">
                      {writer.sns?.x && (
                        <Link
                          href={writer.sns.x}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          X
                        </Link>
                      )}
                      {writer.sns?.instagram && (
                        <Link
                          href={writer.sns.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:underline"
                        >
                          Instagram
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </article>

        {/* ===== 目次（TOC） ===== */}
        <aside className="md:col-span-1">
          <nav className="sticky top-24 space-y-2">
            <p className="mb-2 text-sm font-semibold text-gray-500">目次</p>
            <ul className="space-y-1 text-sm">
              {headings.map((h: Heading) => (
                <li key={`${h.depth}-${h.slug}`} className={h.depth > 2 ? "pl-3" : ""}>
                  <a href={`#${h.slug}`} className="hover:underline">
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </main>
  );
}

// SSG（ビルド時プリレンダリング）
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getArticleSlugs().map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));
}
