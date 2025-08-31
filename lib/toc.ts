// lib/toc.ts
export type Heading = {
  depth: number; // 2..6
  text: string;
  id: string;
};

/** rehype-slug のアルゴリズムに寄せた簡易 slugify  */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    // remove accents
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    // remove non word except space and -
    .replace(/[^\w\s-]/g, "")
    // spaces -> hyphen
    .replace(/\s+/g, "-")
    // collapse multiple -
    .replace(/-+/g, "-");
}

/** MDX本文から ##〜###### の見出しを抽出して、id を付与 */
export function getHeadingsFromMdx(content: string, minDepth = 2, maxDepth = 4): Heading[] {
  const lines = content.split("\n");
  const out: Heading[] = [];

  for (const line of lines) {
    const m = /^(#{2,6})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const depth = m[1].length;
    if (depth < minDepth || depth > maxDepth) continue;
    const text = m[2].replace(/#+$/g, "").trim();
    out.push({ depth, text, id: slugify(text) });
  }
  return out;
}

