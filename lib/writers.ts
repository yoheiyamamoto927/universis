// lib/writers.ts

// Writer 型を定義
export type Writer = {
  slug: string;
  name: string;
  bio?: string;
  avatar: string;
  sns?: {
    x?: string;
    instagram?: string;
  };
};

// ライター配列
export const WRITERS: Writer[] = [
  {
    slug: "imamoto",
    name: "今本",
    bio: "関西出身。FWのセットプレーとディフェンスのミクロ観察が好き。",
    avatar: "/images/writers/imamoto.jpg",
    // sns はオプショナルなので未設定でもOK
  },
  {
    slug: "yamamoto",
    name: "山本 陽平",
    bio: "ユース年代から大学・社会人まで幅広く取材。テンポと勢いの起点を重視。",
    avatar: "/images/writers/yamamoto.jpg",
    // sns はオプショナルなので未設定でもOK
  },
];

// 一覧取得
export const getWriters = (): Writer[] =>
  [...WRITERS].sort((a, b) => a.name.localeCompare(b.name, "ja"));

// 個別取得
export const getWriterBySlug = (slug: string): Writer | null =>
  WRITERS.find((w) => w.slug.toLowerCase() === slug.toLowerCase()) ?? null;
