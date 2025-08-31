// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import TopStrip from "@/components/TopStrip";

export const metadata: Metadata = {
  title: "UNIVERSIS",
  description: "ラグビー分析メディア UNIVERSIS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-screen bg-page text-ink">
        {/* 上部固定ストリップ */}
        <TopStrip />

        {/* コンテンツ本体 */}
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
