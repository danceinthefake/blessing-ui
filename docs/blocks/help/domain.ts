import type { BlessArticleSection, BlessFacet, BlessFaq, BlessSearchHit } from "blessing-ui";

export interface Article {
  id: string;
  title: string;
  kind: "Guide" | "Fix" | "Policy";
  summary: string;
  updated: string;
  sections: BlessArticleSection[];
  related: string[];
}

/** articles that have every word of the query, best match first: title words count double */
export function search(articles: Article[], query: string): Article[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const text = (a: Article) =>
    `${a.title} ${a.summary} ${a.sections.map((s) => s.body).join(" ")}`.toLowerCase();
  const score = (a: Article) =>
    words.reduce((n, w) => n + (a.title.toLowerCase().includes(w) ? 2 : 1), 0);
  return articles
    .filter((a) => words.every((w) => text(a).includes(w)))
    .sort((a, b) => score(b) - score(a));
}

export const toHit = (a: Article): BlessSearchHit => ({
  id: a.id,
  title: a.title,
  href: `#help-${a.id}`,
  kind: a.kind,
  snippet: a.summary,
  date: a.updated,
});

export function facets(found: Article[]): BlessFacet[] {
  const kinds = [...new Set(found.map((a) => a.kind))];
  return [
    {
      id: "kind",
      label: "Kind",
      options: kinds.map((k) => ({
        value: k,
        label: k,
        count: found.filter((a) => a.kind === k).length,
      })),
    },
  ];
}
export type { BlessFaq };
