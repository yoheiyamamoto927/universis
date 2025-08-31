// components/Ranking.tsx
import Link from "next/link";
import { getAllArticles } from "../lib/mdx";

export default function Ranking() {
  // とりあえず「新しい順」で上位5件をランキング表示
  const items = getAllArticles()
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  if (items.length === 0) return null;

  return (
    <section className="rounded-xl border bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <h3 className="mb-3 text-lg font-semibold">記事ランキング</h3>
      <ol className="space-y-2">
        {items.map((a, idx) => (
          <li key={a.slug} className="flex gap-3">
            <span className="w-6 shrink-0 text-right font-bold text-gray-500">
              {idx + 1}.
            </span>
            <Link
              href={`/articles/${a.slug}`}
              className="flex-1 hover:underline"
              title={a.title}
            >
              <div className="line-clamp-2">{a.title}</div>
              <div className="text-xs text-gray-500">
                {new Date(a.date).toLocaleDateString()}・{a.readMin}分
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

