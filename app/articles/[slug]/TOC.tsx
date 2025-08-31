// app/articles/[slug]/TOC.tsx
import Link from "next/link";

type Heading = {
  id?: string;      // rehype-slug が付けた id（無い場合あり）
  text: string;     // 見出しテキスト
  depth: number;    // 2..4 など
};

// 深さごとのインデント（Tailwind は動的クラス NG なので固定で）
const INDENT: Record<number, string> = {
  2: "pl-0",
  3: "pl-4",
  4: "pl-8",
};

// 簡易 slugify（id が無いときに生成）
function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // 記号除去
    .replace(/\s+/g, "-");      // 空白→ハイフン
}

// 重複 id を -2, -3 ... で解消
function withUniqueIds(items: Heading[]) {
  const seen = new Map<string, number>();
  return items.map((h) => {
    const base = (h.id && h.id.trim()) ? h.id : slugify(h.text) || "heading";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const uniqueId = count === 0 ? base : `${base}-${count + 1}`;
    return { ...h, id: uniqueId };
  });
}

export default function TOC({ headings }: { headings: Heading[] }) {
  if (!headings?.length) return null;

  const safe = withUniqueIds(headings);

  return (
    <nav
      aria-label="目次"
      className="rounded-xl border bg-white/60 p-4 text-sm shadow-sm
                 dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div className="mb-2 font-semibold tracking-wide text-gray-500 dark:text-gray-400">
        目次
      </div>
      <ul className="space-y-1">
        {safe.map((h, idx) => (
          <li key={`${h.id}-${idx}`} className={INDENT[h.depth] ?? "pl-0"}>
            <Link
              href={`#${h.id}`}
              className="block rounded px-2 py-1 transition
                         hover:bg-gray-100 dark:hover:bg-gray-800/60"
            >
              {h.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
