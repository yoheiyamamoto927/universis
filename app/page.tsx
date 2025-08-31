// app/page.tsx
import HeroSection from "@/components/HeroSection";
import Ranking from "@/components/Ranking";
import AdSlot from "@/components/AdSlot";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/mdx";

export default function HomePage() {
  const articles = getAllArticles();

  // ヒーロー（最大3件）
  const heroItems = articles.slice(0, Math.min(3, articles.length));

  // 最新記事（重複OKで先頭から最大6件）
  const latest = articles.slice(0, Math.min(6, articles.length));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* ヒーロースライダー（クライアント側ラッパー経由） */}
      <HeroSection items={heroItems} />

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
        {/* 最新記事（左2カラム） */}
        <section className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">最新記事</h2>
          {latest.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </section>

        {/* 右サイド：ランキング + 広告 */}
        <aside className="space-y-6">
          <Ranking />
          <AdSlot
            kind="side"
            href="https://example.com"
            imgSrc="/images/ad-sample.jpg"
          />
        </aside>
      </div>
    </main>
  );
}
