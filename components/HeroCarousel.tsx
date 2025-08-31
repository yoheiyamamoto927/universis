"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type Article = {
  slug: string;
  title: string;
  excerpt?: string;
  date: string | number | Date;
  readMin?: number;
  cover?: string;
};

export default function HeroCarousel({ items }: { items: Article[] }) {
  if (!items?.length) return null;

  const dateLabel = (d: Article["date"]) => {
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString("ja-JP");
    } catch {
      return "";
    }
  };

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4500 }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="rounded-2xl"
      >
        {items.map((a) => (
          <SwiperSlide key={a.slug}>
            <Link href={`/articles/${a.slug}`}>
              <div className="relative aspect-[16/7] w-full">
                <Image
                  src={a.cover ?? "/images/default.jpg"}
                  alt={a.title}
                  fill
                  className="object-cover rounded-2xl"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black/50 p-4 text-white">
                  <p className="text-sm">
                    {dateLabel(a.date)} ・ {a.readMin}分
                  </p>
                  <h2 className="text-xl font-bold">{a.title}</h2>
                  {a.excerpt && (
                    <p className="mt-1 text-sm line-clamp-2">{a.excerpt}</p>
                  )}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
