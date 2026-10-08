export type FormulaErrorCode =
  | "empty"
  | "unexpected"
  | "unclosed"
  | "unknown-variable"
  | "unknown-function"
  | "arity"
  | "divide-by-zero"
  | "not-finite";

export interface FormulaError {
  code: FormulaErrorCode;
  /** where in the source it went wrong (0-based), and how many characters */
  pos: number;
  length: number;
  /** the variable or function the error is about, or the unexpected text */
  name?: string;
  /** the closest known name, when there is one */
  suggestion?: string;
}

export type FormulaResult = { ok: true; value: number } | { ok: false; error: FormulaError };
export type FormulaFns = Record<string, (...args: number[]) => number>;

export const builtins: FormulaFns = {
  sum: (...a) => a.reduce((x, y) => x + y, 0),
  min: (...a) => Math.min(...a),
  max: (...a) => Math.max(...a),
  avg: (...a) => a.reduce((x, y) => x + y, 0) / a.length,
  abs: (x) => Math.abs(x!),
  sqrt: (x) => Math.sqrt(x!),
  floor: (x) => Math.floor(x!),
  ceil: (x) => Math.ceil(x!),
  round: (x, d = 0) => {
    const k = 10 ** d;
    return Math.round(x! * k) / k;
  },
};

type Tok = { t: "num" | "id" | "op" | "end"; v: string; pos: number };

function tokenize(src: string): Tok[] | FormulaError {
  const out: Tok[] = [];
  const re = /\s+|(\d+\.?\d*|\.\d+)|([A-Za-z_][A-Za-z0-9_]*)|([-+*/^(),])|(.)/gy;
  let m: RegExpExecArray | null;
  while (re.lastIndex < src.length && (m = re.exec(src))) {
    if (m[1]) out.push({ t: "num", v: m[1], pos: m.index });
    else if (m[2]) out.push({ t: "id", v: m[2], pos: m.index });
    else if (m[3]) out.push({ t: "op", v: m[3], pos: m.index });
    else if (m[4]) return { code: "unexpected", pos: m.index, length: 1, name: m[4] };
  }
  out.push({ t: "end", v: "", pos: src.length });
  return out;
}

/** Edit distance, to offer "did you mean" for a mistyped name. */
function distance(a: string, b: string): number {
  const d = Array.from(
    { length: a.length + 1 },
    (_, i) => [i, ...Array(b.length).fill(0)] as number[],
  );
  for (let j = 1; j <= b.length; j++) d[0]![j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i]![j] = Math.min(
        d[i - 1]![j]! + 1,
        d[i]![j - 1]! + 1,
        d[i - 1]![j - 1]! + (a[i - 1]!.toLowerCase() === b[j - 1]!.toLowerCase() ? 0 : 1),
      );
  // two neighbouring letters swapped ("mxa" for "max") is one slip, not two
  for (let i = 2; i <= a.length; i++)
    for (let j = 2; j <= b.length; j++)
      if (a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        d[i]![j] = Math.min(d[i]![j]!, d[i - 2]![j - 2]! + 1);
  return d[a.length]![b.length]!;
}
export function closest(name: string, known: readonly string[]): string | undefined {
  let best: string | undefined;
  let min = Math.min(2, Math.max(1, Math.floor(name.length / 3)));
  for (const k of known) {
    const d = distance(name, k);
    if (d <= min) ((min = d), (best = k));
  }
  return best;
}

class Stop extends Error {
  constructor(readonly error: FormulaError) {
    super(error.code);
  }
}

/**
 * Evaluate `+ - * / ^`, brackets, numbers, named values and functions. There is no `eval`: the
 * source is parsed by recursive descent, so only numbers can come out and nothing can run.
 */
export function evaluate(
  src: string,
  vars: Readonly<Record<string, number>> = {},
  fns: FormulaFns = {},
): FormulaResult {
  const functions: FormulaFns = Object.assign(Object.create(null), builtins, fns);
  const toks = tokenize(src);
  if (!Array.isArray(toks)) return { ok: false, error: toks };
  if (toks.length === 1) return { ok: false, error: { code: "empty", pos: 0, length: 0 } };
  let i = 0;
  const peek = () => toks[i]!;
  const next = () => toks[i++]!;
  const fail = (e: FormulaError): never => {
    throw new Stop(e);
  };
  const at = (t: Tok, code: FormulaErrorCode, extra: Partial<FormulaError> = {}) =>
    fail({ code, pos: t.pos, length: Math.max(1, t.v.length), name: t.v || undefined, ...extra });
  const finite = (n: number, t: Tok) => (Number.isFinite(n) ? n : at(t, "not-finite"));

  function expr(): number {
    let v = term();
    while (peek().t === "op" && (peek().v === "+" || peek().v === "-")) {
      const op = next().v;
      const r = term();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  }
  function term(): number {
    let v = unary();
    while (peek().t === "op" && (peek().v === "*" || peek().v === "/")) {
      const op = next();
      const r = unary();
      if (op.v === "/" && r === 0) at(op, "divide-by-zero");
      v = op.v === "*" ? v * r : v / r;
    }
    return v;
  }
  // unary minus binds looser than ^, so -2^2 is -4
  function unary(): number {
    if (peek().t === "op" && (peek().v === "-" || peek().v === "+")) {
      const op = next().v;
      const v = unary();
      return op === "-" ? -v : v;
    }
    return power();
  }
  function power(): number {
    const base = primary();
    if (peek().t === "op" && peek().v === "^") {
      const op = next();
      return finite(base ** unary(), op);
    }
    return base;
  }
  function primary(): number {
    const t = next();
    if (t.t === "num") return Number(t.v);
    if (t.t === "id") {
      if (peek().t === "op" && peek().v === "(") {
        next();
        const args: number[] = [];
        if (!(peek().t === "op" && peek().v === ")")) {
          do args.push(expr());
          while (peek().t === "op" && peek().v === "," && next());
        }
        if (!(peek().t === "op" && peek().v === ")")) at(peek(), "unclosed");
        next();
        const fn = Object.hasOwn(functions, t.v) ? functions[t.v] : undefined;
        if (!fn)
          return at(t, "unknown-function", { suggestion: closest(t.v, Object.keys(functions)) });
        if (!args.length && fn.length > 0) return at(t, "arity");
        return finite(fn(...args), t);
      }
      // own properties only: "constructor" and "toString" are not values
      if (!Object.hasOwn(vars, t.v))
        return at(t, "unknown-variable", { suggestion: closest(t.v, Object.keys(vars)) });
      return vars[t.v]!;
    }
    if (t.t === "op" && t.v === "(") {
      const v = expr();
      if (!(peek().t === "op" && peek().v === ")")) at(peek(), "unclosed");
      next();
      return v;
    }
    return at(t, t.t === "end" ? "unexpected" : "unexpected");
  }

  try {
    const v = expr();
    if (peek().t !== "end") at(peek(), "unexpected");
    return { ok: true, value: finite(v, toks[0]!) };
  } catch (e) {
    if (e instanceof Stop) return { ok: false, error: e.error };
    throw e;
  }
}

/** The names the formula refers to as values (not function names). */
export function usedNames(src: string): string[] {
  const toks = tokenize(src);
  if (!Array.isArray(toks)) return [];
  return [
    ...new Set(
      toks
        .filter((t, k) => t.t === "id" && !(toks[k + 1]?.t === "op" && toks[k + 1]?.v === "("))
        .map((t) => t.v),
    ),
  ];
}
