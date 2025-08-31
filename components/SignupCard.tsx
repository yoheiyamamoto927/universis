// components/SignupCard.tsx
'use client';

import { useState } from "react";
import Link from "next/link";

export default function SignupCard() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // ここで実際の登録 API を叩く想定
    setOk(true);
  }

  return (
    <div className="rounded-xl border bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <h3 className="mb-3 text-lg font-semibold">無料メルマガ登録</h3>

      {ok ? (
        <p className="text-sm text-green-600">登録ありがとうございます！</p>
      ) : (
        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-md border px-3 py-2 text-sm
                       dark:border-white/10 dark:bg-white/5"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white
                       hover:opacity-90 dark:bg-white dark:text-black"
          >
            登録する
          </button>
        </form>
      )}

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        登録により <Link href="/terms" className="underline">利用規約</Link> に同意したものとみなされます。
      </p>
    </div>
  );
}
