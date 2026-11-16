// The contrast of two colors, as WCAG 2.1 defines it (relative luminance and contrast ratio).

/** `#rgb` or `#rrggbb` as 0–255 channels, or `undefined` for anything else. */
export function hexToRgb(hex: string): [number, number, number] | undefined {
  const m = hex.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return undefined;
  const h = m[1]!.length === 3 ? [...m[1]!].map((c) => c + c).join("") : m[1]!;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

/** The relative luminance of a color, 0 (black) to 1 (white). */
export function luminance([r, g, b]: [number, number, number]): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** The contrast ratio of two hex colors, 1 to 21; `undefined` if one does not parse. */
export function contrastRatio(a: string, b: string): number | undefined {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return undefined;
  const [hi, lo] = [luminance(ra), luminance(rb)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

/** The WCAG 2.1 levels that a ratio passes. */
export const wcagLevels = (ratio: number) => ({
  aaText: ratio >= 4.5,
  aaLarge: ratio >= 3,
  aaaText: ratio >= 7,
  aaaLarge: ratio >= 4.5,
  ui: ratio >= 3,
});
