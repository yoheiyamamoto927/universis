// lib/categories.ts
export const CATEGORIES = [
  { slug: "kanto-taikosen",  label: "関東大学対抗戦" },
  { slug: "kanto-league",    label: "関東大学リーグ戦" },
  { slug: "kansai-league",   label: "関西大学リーグ" },
  { slug: "japan",           label: "日本代表" },
  { slug: "overseas",        label: "海外" },
  { slug: "sevens",          label: "セブンズ" },
  { slug: "women",           label: "女子" },
  { slug: "practice-game",          label: "練習試合" },
  { slug: "other",           label: "その他" },
] as const;

export type CategorySlug = typeof CATEGORIES[number]["slug"];
