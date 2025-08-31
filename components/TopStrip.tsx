import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function TopStrip() {
  return (
    <div
      suppressHydrationWarning
      className="sticky top-0 z-50 w-full border-b border-white/10 
                 bg-blue-3000 text-white/90 backdrop-blur 
                 supports-[backdrop-filter]:bg-blue-900/90"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        {/* 左側: ロゴ */}
        <div className="flex items-center space-x-2">
          <Link href="/" aria-label="ホームへ">
            <div className="flex items-center space-x-2 hover:opacity-80 transition">
              <Image
                src="/images/logo.png"
                alt="Universis Logo"
                width={120}
                height={40}
                className="rounded"
              />
              <span className="text-lg font-bold">UNIVERSIS</span>
            </div>
          </Link>
        </div>

        {/* 中央: ナビゲーション（カテゴリへリンク） */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="hover:underline">
              {c.label}
            </Link>
          ))}
        </nav>

        {/* 右側: 検索バー */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="サイト内検索"
            className="rounded-full px-3 py-1 text-sm text-black focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
