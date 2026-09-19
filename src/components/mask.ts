const isToken = (c: string) => c === "#" || c === "A" || c === "*";
const fits = (t: string, c: string) =>
  t === "#" ? /\d/.test(c) : t === "A" ? /\p{L}/u.test(c) : /[\p{L}\d]/u.test(c);

/** # digit · A letter · * letter or digit · anything else is a literal */
export function applyMask(mask: string, input: string): string {
  let out = "";
  let i = 0;
  for (const m of mask) {
    if (i >= input.length) break;
    if (isToken(m)) {
      while (i < input.length && !fits(m, input[i])) i++;
      if (i >= input.length) break;
      out += input[i++];
    } else {
      out += m;
      if (input[i] === m) i++;
    }
  }
  return out;
}

/** strip literals from a masked value */
export const unmask = (mask: string, masked: string) =>
  [...masked].filter((_, k) => isToken(mask[k] ?? "")).join("");
