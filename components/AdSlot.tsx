// components/AdSlot.tsx
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

type Props = {
  /** 配置の違いでスタイルを切り替え */
  kind?: "inline" | "side";
  /** クリック時の遷移先（無ければ #） */
  href?: string;
  /** 画像パス（無ければ /images/ad-sample.jpg） */
  imgSrc?: string;
  /** alt 文言 */
  alt?: string;
  /** 小さく「広告」ラベルを出すか */
  showLabel?: boolean;
};

export default function AdSlot({
  kind = "inline",
  href = "#",
  imgSrc = "/images/ad-sample.jpg",
  alt = "sponsored",
  showLabel = true,
}: Props) {
  const wrapper = clsx(
    "card overflow-hidden relative",
    kind === "inline" && "aspect-[16/5] w-full",
    kind === "side" && "aspect-[4/5] w-full"
  );

  return (
    <div className={wrapper}>
      {showLabel && (
        <span className="absolute left-2 top-2 z-10 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
          広告
        </span>
      )}
      <Link href={href} className="block h-full w-full" target="_blank">
        {/* 画像は fill でオブジェクトフィット */}
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes={kind === "side" ? "(min-width: 1024px) 320px, 100vw" : "100vw"}
          className="object-cover"
          priority={kind === "inline"}
        />
      </Link>
    </div>
  );
}
