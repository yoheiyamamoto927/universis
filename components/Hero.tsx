// components/Hero.tsx
export default function Hero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border p-10 md:p-14 bg-gradient-to-tr from-sky-50 to-indigo-50 dark:from-white/[0.04] dark:to-white/[0.02] dark:border-white/10">
      {/* 装飾 */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl dark:bg-indigo-500/10" />
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-gray-600 md:text-lg dark:text-gray-300">
          {subtitle}
        </p>
      )}
    </section>
  );
}
