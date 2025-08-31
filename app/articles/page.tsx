// app/articles/page.tsx
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/mdx";

export default function ArticlesIndexPage() {
  // すべての記事（lib/mdx 側で降順ソート済み想定）
  const articles = getAllArticles();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">記事一覧</h1>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">記事がまだありません。</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <ArticleCard key={a.slug} {...a} />
          ))}
        </div>
      )}
    </main>
  );
}
