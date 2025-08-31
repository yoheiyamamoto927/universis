// lib/writers.ts
export const WRITERS = [
  {
    slug: "imamoto",
    name: "今本",
    bio: "関西出身。FWのセットプレーとディフェンスのミクロ観察が好き。",
    avatar: "/images/writers/imamoto.jpg",
  },
  {
    slug: "yamamoto",
    name: "山本 陽平",
    bio: "ユース年代から大学・社会人まで幅広く取材。テンポと勢いの起点を重視。",
    avatar: "/images/writers/yamamoto.jpg",
  },
];

// 一覧取得
export const getWriters = () =>
  [...WRITERS].sort((a, b) => a.name.localeCompare(b.name, "ja"));

// 個別取得
export const getWriterBySlug = (slug: string) =>
  WRITERS.find((w) => w.slug.toLowerCase() === slug.toLowerCase());
