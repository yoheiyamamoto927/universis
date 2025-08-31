// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
      <h1 className="text-2xl font-bold">ページが見つかりません</h1>
      <p className="text-gray-600">URL やフィルタ条件をご確認ください。</p>
      <div className="space-x-4">
        <Link href="/" className="text-blue-600 hover:underline">ホームへ</Link>
        <Link href="/articles" className="text-blue-600 hover:underline">記事一覧へ</Link>
      </div>
    </main>
  );
}
