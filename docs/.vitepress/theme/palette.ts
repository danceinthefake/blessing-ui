// Derives a palette from one petal color, keeping the accent contract of docs/guide/tokens.md:
// white on `accent` ≥ 4.5:1, `accent-text` ≥ 4.5:1 on bg and surface in each theme, chart-1 ≥ 3:1.
import { contrastRatio, hexToRgb } from "blessing-ui";

export const grays = {
  light: { bg: "#f5f5f6", surface: "#e7e8ea" },
  dark: { bg: "#17181a", surface: "#232529" },
};

const hex = (c: number[]) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
/** toward black (t < 1) by scaling the channels */
const shade = (h: string, t: number) => hex(hexToRgb(h)!.map((v) => v * t));
/** toward white by t (0–1) */
const tint = (h: string, t: number) => hex(hexToRgb(h)!.map((v) => v + (255 - v) * t));
/** the lowest contrast of `h` on the two grays of a theme */
export const onGrays = (h: string, g: { bg: string; surface: string }) =>
  Math.min(contrastRatio(h, g.bg)!, contrastRatio(h, g.surface)!);

/** step from `h` until `ok`, darker (`shade`) or lighter (`tint`) */
function until(h: string, ok: (c: string) => boolean, step: "shade" | "tint") {
  for (let i = 0; i <= 100; i++) {
    const c = step === "shade" ? shade(h, 1 - i / 100) : tint(h, i / 100);
    if (ok(c)) return c;
  }
  return step === "shade" ? "#000000" : "#ffffff";
}

export type Palette = {
  accent: string;
  "accent-text": string;
  "accent-soft": string;
  "accent-2": string;
  badge: string;
  "chart-1": string;
  /** accent-text on the dark grays */
  dark: string;
};

export function derive(petal: string): Palette {
  const accent = until(petal, (c) => contrastRatio(c, "#ffffff")! >= 4.5, "shade");
  // a petal too pale for white text (Eriri's) is the soft tone itself
  const pale = contrastRatio(petal, "#ffffff")! < 3;
  return {
    accent,
    "accent-text": until(petal, (c) => onGrays(c, grays.light) >= 4.5, "shade"),
    "accent-soft": pale ? petal : tint(petal, 0.45),
    "accent-2": pale ? tint(accent, 0.15) : tint(petal, 0.15),
    badge: accent,
    "chart-1": until(petal, (c) => onGrays(c, grays.light) >= 3, "shade"),
    dark: until(petal, (c) => onGrays(c, grays.dark) >= 4.5, "tint"),
  };
}

/** The CSS a user pastes after tokens.css. */
export function css(name: string, p: Palette) {
  const sel = `:root[data-palette="${name}"]`;
  const light = (["accent", "accent-text", "accent-soft", "accent-2", "badge", "chart-1"] as const)
    .map((k) => `  --bless-color-${k}: ${p[k]};`)
    .join("\n");
  const dark = `--bless-color-accent-text: ${p.dark};`;
  return `${sel} {
${light}
}
${sel}[data-theme="dark"] {
  ${dark}
}
@media (prefers-color-scheme: dark) {
  ${sel}:not([data-theme="light"]) {
    ${dark}
  }
}
`;
}
