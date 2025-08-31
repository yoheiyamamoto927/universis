// app/articles/[slug]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getArticleBySlug, getArticleSlugs } from "@/lib/mdx";
import { getHeadingsFromMdx } from "@/lib/toc";
import { getWriterBySlug } from "@/lib/writers";
import TOC from "./TOC";

// ページのパラメータ型
type Props = {
  params: { slug: string };
};

// 静的パスを生成
export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ""),
  }));
}

export default function ArticlePage({ params }: Props) {
  // 記事取得（存在しなければ 404）
  const article = getArticleBySlug(params.slug);
  if (!article) return notFound();

  // 型に無い項目は安全に取り扱う（headings はオプショナル扱い）
  const { title, date, author, cover, excerpt, content, readMin } = article;

  // 1) frontmatter に headings があればそれを使う
  // 2) 無ければ本文 content から自動抽出
  const headings =
    (article as any).headings && Array.isArray((article as any).headings)
      ? (article as any).headings
      : getHeadingsFromMdx(content);

  // ライター情報を取得（無ければ null）
  const writer = author ? getWriterBySlug(author as string) : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* ===== 記事ヘッダー ===== */}
      <header className="mb-6 border-b pb-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <time>{new Date(date).toLocaleDateString()}</time>
          {typeof readMin === "number" && <span>・{readMin}分</span>}
        </div>
        <h1 className="mt-2 text-3xl font-bold">{title}</h1>
        {excerpt && <p className="mt-2 text-lg text-gray-600">{excerpt}</p>}
      </header>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* ===== 本文エリア ===== */}
        <article className="md:col-span-3">
          {cover && (
            <div className="mb-6">
              <Image
                src={cover}
                alt={title}
                width={800}
                height={450}
                className="rounded-lg"
              />
            </div>
          )}

          {/* MDX本文 */}
          <div className="prose prose-lg mdx-content dark:prose-invert">
            <MDXRemote source={content} />
          </div>

          {/* ===== ライタープロフィール ===== */}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {writer.bio}
                  </p>
                  {writer.sns && (
                    <div className="mt-2 flex gap-3">
                      {writer.sns.x && (
                        <Link
                          href={writer.sns.x}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          X
                        </Link>
                      )}
                      {writer.sns.instagram && (
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

        {/* ===== サイドバー（TOC） ===== */}
        <aside className="md:col-span-1">
          {/* headings は必ず配列（空配列含む）になるので型エラーになりません */}
          <TOC headings={headings} />
        </aside>
      </div>
    </main>
  );
}
