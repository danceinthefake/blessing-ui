export interface DiffRow {
  type: "same" | "add" | "del";
  /** 1-based line number in the old text (not on `add`) */
  a?: number;
  /** 1-based line number in the new text (not on `del`) */
  b?: number;
  text: string;
}

const lines = (s: string) => (s === "" ? [] : s.replace(/\n$/, "").split("\n"));

/** the longest common subsequence is O(n·m); past this many cells a block is shown as replaced */
const LIMIT = 4_000_000;

/** Line diff of two texts: common prefix and suffix are peeled off, the middle is an LCS. */
export function diffLines(oldText: string, newText: string): DiffRow[] {
  const A = lines(oldText);
  const B = lines(newText);
  let s = 0;
  while (s < A.length && s < B.length && A[s] === B[s]) s++;
  let ea = A.length;
  let eb = B.length;
  while (ea > s && eb > s && A[ea - 1] === B[eb - 1]) (ea--, eb--);

  const rows: DiffRow[] = [];
  for (let i = 0; i < s; i++) rows.push({ type: "same", a: i + 1, b: i + 1, text: A[i]! });

  const n = ea - s;
  const m = eb - s;
  if (n * m > LIMIT || !n || !m) {
    for (let i = s; i < ea; i++) rows.push({ type: "del", a: i + 1, text: A[i]! });
    for (let j = s; j < eb; j++) rows.push({ type: "add", b: j + 1, text: B[j]! });
  } else {
    // lcs[i][j]: length of the LCS of A[s+i..] and B[s+j..]
    const w = m + 1;
    const lcs = new Uint32Array((n + 1) * w);
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        lcs[i * w + j] =
          A[s + i] === B[s + j]
            ? lcs[(i + 1) * w + j + 1]! + 1
            : Math.max(lcs[(i + 1) * w + j]!, lcs[i * w + j + 1]!);
    let i = 0;
    let j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && A[s + i] === B[s + j]) {
        rows.push({ type: "same", a: s + i + 1, b: s + j + 1, text: A[s + i]! });
        i++;
        j++;
      } else if (j < m && (i === n || lcs[i * w + j + 1]! > lcs[(i + 1) * w + j]!)) {
        rows.push({ type: "add", b: s + j + 1, text: B[s + j]! });
        j++;
      } else {
        rows.push({ type: "del", a: s + i + 1, text: A[s + i]! });
        i++;
      }
    }
  }
  for (let k = 0; k < A.length - ea; k++)
    rows.push({ type: "same", a: ea + k + 1, b: eb + k + 1, text: A[ea + k]! });
  return rows;
}
