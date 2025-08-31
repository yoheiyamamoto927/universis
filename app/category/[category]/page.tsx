// app/category/[category]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllArticles, type ArticleMeta } from "@/lib/mdx";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";

type Params = { category: CategorySlug };

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params> | Params;
}) {
  const resolved = params instanceof Promise ? await params : params;
  const category = resolved?.category;
  if (!category) return notFound();

  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return notFound();

  // MDX frontmatter の category で絞り込み
  const articles: ArticleMeta[] = getAllArticles().filter(
    (a) => a.category === category
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          {cat.label} の記事
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {articles.length} 本
        </p>
      </header>

      {articles.length === 0 ? (
        <p className="text-sm text-gray-500">まだ記事がありません。</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {articles.map((a) => (
            <li
              key={a.slug}
              className="overflow-hidden rounded-2xl border hover:shadow-md transition"
            >
              <Link href={`/articles/${a.slug}`} className="block">
                {a.cover && (
                  <div className="relative h-44 w-full">
                    <Image
                      src={a.cover}
                      alt={a.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="text-xs text-gray-500">
                    {new Date(a.date).toLocaleDateString("ja-JP")}
                    {typeof a.readMin === "number" ? ` ・ ${a.readMin}分` : null}
                  </div>
                  <h3 className="mt-1 font-semibold leading-snug">{a.title}</h3>
                  {a.excerpt && (
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {a.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

// すべてのカテゴリで SSG
export async function generateStaticParams(): Promise<
  Array<{ category: CategorySlug }>
> {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}
