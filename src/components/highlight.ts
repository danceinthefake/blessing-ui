// Where search terms are in a text, with no regard to case or accents: "cafe" finds "Café".

const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** [start, end) ranges in `text` that match a term, sorted, with overlaps merged */
export function highlightRanges(text: string, terms: string[]): [number, number][] {
  // fold the text one character at a time and keep where each folded unit came from
  let folded = "";
  const from: number[] = [];
  const to: number[] = [];
  for (let i = 0; i < text.length;) {
    const ch = String.fromCodePoint(text.codePointAt(i)!);
    const f = fold(ch);
    for (let k = 0; k < f.length; k++) (from.push(i), to.push(i + ch.length));
    folded += f;
    i += ch.length;
  }
  const found: [number, number][] = [];
  for (const term of terms.map(fold).filter(Boolean)) {
    for (let at = folded.indexOf(term); at >= 0; at = folded.indexOf(term, at + term.length))
      found.push([from[at]!, to[at + term.length - 1]!]);
  }
  found.sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [];
  for (const r of found) {
    const last = out[out.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else out.push([...r]);
  }
  return out;
}
