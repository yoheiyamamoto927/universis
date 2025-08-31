// app/writers/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";
import { getWriters } from "@/lib/writers";

export default function WritersIndexPage() {
  const writers = getWriters();

  return (
    <main className="mx-auto max-w-6xl px-5 lg:px-6">
      {/* 見出し：少しだけ品のあるウェイトと余白 */}
      <h1 className="pt-10 text-3xl md:text-4xl font-extrabold tracking-tight">
        記者別
      </h1>

      {writers.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">記者情報がありません。</p>
      ) : (
        <ul
          className="
            mt-8 grid gap-6
            sm:grid-cols-2
          "
        >
          {writers.map((w) => {
            const href = `/writers/${encodeURIComponent(w.slug)}`;
            return (
              <li key={w.slug}>
                <article
                  className="
                    group relative rounded-2xl
                    border border-gray-200/70 dark:border-white/10
                    bg-white/70 dark:bg-white/5
                    backdrop-blur
                    shadow-sm hover:shadow-md
                    transition
                  "
                >
                  {/* 上段：クリック範囲。落ち着いた配色・余白大きめ */}
                  <Link href={href} className="block p-5 sm:p-6">
                    <div className="flex items-start gap-5">
                      <div
                        className="
                          relative h-20 w-20 shrink-0 overflow-hidden rounded-full
                          ring-1 ring-gray-300/70 dark:ring-white/15
                          bg-gray-50 dark:bg-white/10
                        "
                      >
                        <Image
                          src={w.avatar || "/images/UNIVERSISトップ画像.webp"}
                          alt={w.name}
                          fill
                          sizes="80px"
                          className="
                            object-cover
                            grayscale-[15%] group-hover:grayscale-0
                            transition
                          "
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2
                          className="
                            text-lg md:text-xl font-semibold leading-snug
                            text-gray-900 dark:text-white
                          "
                        >
                          {w.name}
                        </h2>

                        {w.bio && (
                          <p
                            className="
                              mt-1.5 text-sm leading-6
                              text-gray-600 dark:text-gray-300/90
                              line-clamp-3
                            "
                          >
                            {w.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* 下段：SNS リンク。控えめなバッジ */}
                  {w.links?.length ? (
                    <div className="px-5 pb-5 sm:px-6">
                      <ul className="flex flex-wrap gap-2">
                        {w.links.map((l) => (
                          <li key={l.url}>
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                inline-flex items-center gap-1
                                text-xs font-medium
                                rounded-full border
                                px-2.5 py-1
                                border-gray-300/70 dark:border-white/15
                                text-gray-700 dark:text-gray-100
                                bg-white/60 dark:bg-white/5
                                hover:bg-gray-50/90 dark:hover:bg-white/10
                                transition
                              "
                            >
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="h-2" />
                  )}

                  {/* 装飾：さりげない角のハイライト */}
                  <span
                    className="
                      pointer-events-none absolute inset-x-0 -top-px h-px
                      bg-gradient-to-r from-transparent via-gray-300/60 to-transparent
                      dark:via-white/15
                    "
                  />
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
