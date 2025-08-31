// app/teams/page.tsx
import Link from "next/link";
import { getAllArticles } from "@/lib/mdx";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function TeamsIndexPage() {
  // すべての記事から team 値を集めて重複を除去
  const articles = getAllArticles();
  const teamSet = new Set<string>();
  articles.forEach((a) => (a.teams || []).forEach((t) => teamSet.add(t.toLowerCase())));
  const teams = Array.from(teamSet).sort();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">チーム別</h1>
      {teams.length === 0 ? (
        <p className="text-sm text-gray-500">まだチーム情報付きの記事がありません。</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {teams.map((t) => (
            <Link
              key={t}
              href={`/teams/${t}`}
              className="px-3 py-1 rounded-full border border-gray-300 text-sm hover:bg-gray-50"
            >
              {t}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
