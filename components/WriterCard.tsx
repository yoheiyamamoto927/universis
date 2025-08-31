// components/WriterCard.tsx
import Image from "next/image";
import { getWriterBySlug } from "@/lib/writers";

type Props = {
  slug: string; // writers.ts の slug
};

export default function WriterCard({ slug }: Props) {
  const writer = getWriterBySlug(slug);
  if (!writer) return null;

  return (
    <div className="mt-16 rounded-xl border bg-gray-50 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
      <div className="flex items-center gap-4">
        {writer.avatar && (
          <Image
            src={writer.avatar}
            alt={writer.name}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-semibold text-lg">{writer.name}</div>
          {writer.bio && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {writer.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
