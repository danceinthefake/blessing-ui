// Types and pure rules of a search. No Vue here.
export interface Doc {
  id: string;
  title: string;
  href: string;
  snippet: string;
  kind: string;
  /** YYYY-MM-DD */
  date: string;
}
export interface Query {
  q: string;
  /** the chosen values of each filter: kind and year */
  selected: Record<string, string[]>;
  sort: "relevance" | "newest";
  page: number;
  pageSize: number;
}
export interface Facet {
  id: string;
  label: string;
  options: { value: string; label: string; count: number }[];
}
export interface Page {
  results: Doc[];
  total: number;
  facets: Facet[];
  suggestion?: string;
}

export const words = (s: string) => s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
const FACETS = [
  { id: "kind", label: "Type", of: (d: Doc) => d.kind },
  { id: "year", label: "Year", of: (d: Doc) => d.date.slice(0, 4) },
];

/** each word of the search must start a word of the doc: a title hit counts 3, a snippet hit 1 */
export function score(doc: Doc, terms: string[]) {
  const title = words(doc.title);
  const body = words(doc.snippet);
  let n = 0;
  for (const t of terms) {
    const hit = (ws: string[]) => ws.some((w) => w.startsWith(t));
    const s = (hit(title) ? 3 : 0) + (hit(body) ? 1 : 0);
    if (!s) return 0;
    n += s;
  }
  return n;
}

/** the number of edits that turn a into b (Levenshtein, 1966) */
export function distance(a: string, b: string) {
  let row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++)
      next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    row = next;
  }
  return row[b.length];
}

/** the search with each unknown word swapped for the nearest known word, or "" when nothing changes */
export function didYouMean(q: string, vocabulary: Set<string>) {
  const terms = words(q);
  const fixed = terms.map((t) => {
    if (t.length < 4 || [...vocabulary].some((w) => w.startsWith(t))) return t;
    let best = t;
    let least = 3;
    for (const w of vocabulary) {
      const d = distance(t, w);
      if (d < least) [best, least] = [w, d];
    }
    return best;
  });
  return fixed.join(" ") === terms.join(" ") ? "" : fixed.join(" ");
}

/** one page of hits, and the filter counts. A filter counts with the other filters applied */
export function search(docs: Doc[], query: Query): Page {
  const terms = words(query.q);
  const scored = docs
    .map((d) => ({ d, s: score(d, terms) }))
    .filter((x) => terms.length && x.s > 0);
  const passes = (d: Doc, skip?: string) =>
    FACETS.every(
      (f) =>
        f.id === skip || !query.selected[f.id]?.length || query.selected[f.id].includes(f.of(d)),
    );
  const facets = FACETS.map((f) => {
    const counts = new Map<string, number>();
    for (const { d } of scored)
      if (passes(d, f.id)) counts.set(f.of(d), (counts.get(f.of(d)) ?? 0) + 1);
    const options = [...counts].map(([value, count]) => ({ value, label: value, count }));
    return {
      id: f.id,
      label: f.label,
      options: options.sort((a, b) => b.count - a.count || b.value.localeCompare(a.value)),
    };
  });
  const hits = scored
    .filter(({ d }) => passes(d))
    .sort((a, b) => (query.sort === "newest" ? b.d.date.localeCompare(a.d.date) : b.s - a.s))
    .map((x) => x.d);
  const start = (query.page - 1) * query.pageSize;
  return { results: hits.slice(start, start + query.pageSize), total: hits.length, facets };
}
