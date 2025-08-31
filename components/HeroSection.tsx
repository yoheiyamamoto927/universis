"use client";

import dynamic from "next/dynamic";

// Swiper（HeroCarousel）はクライアントでのみ読み込む
const HeroCarousel = dynamic(() => import("./HeroCarousel"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-7xl px-4 pt-4">
      <div className="aspect-[16/7] w-full animate-pulse rounded-2xl bg-gray-200/70 dark:bg-white/10" />
    </div>
  ),
});

type Article = {
  slug: string;
  title: string;
  excerpt?: string;
  date: string | number | Date;
  readMin?: number;
  cover?: string;
};

export default function HeroSection({ items }: { items: Article[] }) {
  if (!items?.length) return null;
  return <HeroCarousel items={items} />;
}
