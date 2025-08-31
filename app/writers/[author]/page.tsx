// app/writers/[author]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles } from "@/lib/mdx";
import { getWriterBySlug } from "@/lib/writers";

type Params = { author: string };

export default function WriterPage({ params }: { params: Params }) {
  const slug = params.author;
  const writer = getWriterBySlug(slug);
  if (!writer) return notFound();

  // 記事は frontmatter の author を slug と比較して抽出
  const articles = getAllArticles().filter(
    (a) => (a.author || "").toLowerCase() === writer.slug.toLowerCase()
  );

  return (
    <main className="mx-auto max-w-5xl px-4 lg:px-6 space-y-10">
      {/* プロフィールヘッダー */}
      <header className="flex items-start gap-6 pt-8">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border">
          <Image
            src={writer.avatar || "/images/UNIVERSISトップ画像.webp"}
            alt={writer.name}
            fill
            sizes="96px"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            記者: {writer.name}
          </h1>
          {writer.bio && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {writer.bio}
            </p>
          )}
          {writer.links?.length ? (
            <ul className="mt-3 flex flex-wrap gap-3">
              {writer.links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline text-blue-600 dark:text-blue-400 hover:opacity-80"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      {/* 記事一覧 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">記事一覧</h2>

        {articles.length === 0 ? (
          <p className="text-sm text-gray-500">この記者の記事はまだありません。</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}`}
                className="group overflow-hidden rounded-2xl border hover:shadow-md transition"
              >
                {a.cover && (
                  <div className="relative h-44 w-full">
                    <Image
                      src={a.cover}
                      alt={a.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                )}

                <div className="p-4">
                  <div className="text-xs text-gray-500">
                    {new Date(a.date).toLocaleDateString()} ・ {a.readMin}分
                  </div>
                  <h3 className="mt-1 font-semibold leading-snug">{a.title}</h3>
                  {a.excerpt && (
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {a.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="pt-4">
          <Link href="/writers" className="text-sm underline">
            ← 記者一覧へ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}

