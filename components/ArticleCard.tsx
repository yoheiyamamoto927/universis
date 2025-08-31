import Link from "next/link";
import Image from "next/image";

type ArticleMeta = {
  title?: string;
  slug?: string;
  date?: string;
  author?: string;
  readMin?: number;
  cover?: string;
  excerpt?: string;
};

export default function ArticleCard({ article }: { article?: ArticleMeta }) {
  if (!article) return null;

  const {
    title = "（タイトル未設定）",
    slug,
    date,
    readMin,
    cover,
    excerpt,
  } = article;

  // slug が無いカードはリンクできないので非表示（または div にする）
  if (!slug) return null;

  const dateLabel = date ? new Date(date).toLocaleDateString("ja-JP") : "";

  return (
    <Link
      href={`/articles/${slug}`}
      className="block rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition"
    >
      {cover && (
        <div className="mb-3 overflow-hidden rounded-xl">
          <Image
            src={cover}
            alt={title}
            width={1200}
            height={630}
            className="h-48 w-full object-cover"
          />
        </div>
      )}

      <div className="text-sm text-gray-500">
        {dateLabel}
        {typeof readMin === "number" && ` ・${readMin}分`}
      </div>

      <h3 className="mt-1 line-clamp-2 text-lg font-bold text-gray-900">
        {title}
      </h3>

      {excerpt && (
        <p className="mt-2 line-clamp-2 text-gray-600">{excerpt}</p>
      )}
    </Link>
  );
}
