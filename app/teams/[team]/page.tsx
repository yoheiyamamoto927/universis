// app/teams/[team]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles } from "@/lib/mdx";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function TeamArticlesPage({ params }: { params: { team: string } }) {
  const team = params.team.toLowerCase();

  // 該当チームの記事だけ抽出（frontmatterの teams: ["teikyo","meiji"] など）
  const articles = getAllArticles().filter((a) =>
    (a.teams || []).map((t) => t.toLowerCase()).includes(team)
  );

  if (articles.length === 0) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4">チーム別: {team}</h1>

      <ul className="space-y-4">
        {articles.map((a) => (
          <li key={a.slug} className="rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition">
            <div className="text-xs text-gray-500">
              {new Date(a.date).toLocaleDateString()} ・ {a.readMin}分
            </div>
            <Link href={`/articles/${a.slug}`} className="block mt-1 font-semibold text-lg leading-snug">
              {a.title}
            </Link>
            {a.excerpt && <p className="text-sm text-gray-600 mt-1">{a.excerpt}</p>}
          </li>
        ))}
      </ul>

      <div className="pt-4">
        <Link href="/teams" className="text-sm text-blue-600 hover:underline">← チーム一覧へ戻る</Link>
      </div>
    </main>
  );
}

