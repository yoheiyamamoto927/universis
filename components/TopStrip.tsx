import Image from "next/image"

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
          <Image
            src="/images/logo.png"  // public/images/logo.png を置いてください
            alt="Universis Logo"
            width={120}
            height={40}
            className="rounded"
          />
          <span className="text-lg font-bold">UNIVERSIS</span>
        </div>

        {/* 中央: ナビゲーション */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="#" className="hover:underline">関東大学対抗戦</a>
          <a href="#" className="hover:underline">関東大学リーグ戦</a>
          <a href="#" className="hover:underline">関西大学リーグ</a>
          <a href="#" className="hover:underline">日本代表</a>
          <a href="#" className="hover:underline">海外</a>
          <a href="#" className="hover:underline">セブンズ</a>
          <a href="#" className="hover:underline">女子</a>
          <a href="#" className="hover:underline">コラム</a>
          <a href="#" className="hover:underline">その他</a>
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
  )
}
