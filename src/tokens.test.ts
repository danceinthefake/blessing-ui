import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "./composables/contrast";

const css = readFileSync(resolve(import.meta.dirname, "../tokens.css"), "utf8");

function blockOf(selector: string) {
  const start = css.indexOf(selector);
  expect(start, `selector ${selector} not found`).toBeGreaterThanOrEqual(0);
  const open = css.indexOf("{", start);
  let depth = 1;
  let i = open + 1;
  while (i < css.length && depth > 0) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") depth--;
    i++;
  }
  return css.slice(open + 1, i - 1);
}

function token(block: string, name: string) {
  const m = block.match(new RegExp(`${name}:\\s*([^;]+);`));
  expect(m, `token ${name} not found`).not.toBeNull();
  return m![1].replace(/\/\*[\s\S]*?\*\//g, "").trim();
}

describe("tokens.css — Revamp 2026-11 Revision 2 (Unified v3 · Lively)", () => {
  const root = blockOf(":root {");
  const dark = blockOf(':root[data-theme="dark"] {');
  const golden = blockOf(':root[data-theme="golden"] {');
  const reduced = blockOf("@media (prefers-reduced-motion: reduce)");
  const calm = blockOf('[data-motion="calm"] {');

  it("defines the three-voice typography stack and glass/art elevation tokens", () => {
    expect(token(root, "--bless-font-sans")).toContain("Plus Jakarta Sans");
    expect(token(root, "--bless-font-serif")).toContain("Newsreader");
    expect(token(root, "--bless-font-mono")).toContain("monospace");
    expect(token(root, "--bless-color-surface-glass")).toContain("rgb(");
    expect(token(root, "--bless-shadow-art")).toContain("color-mix(");
    expect(token(root, "--bless-color-hover")).toContain("rgb(");
  });

  it("retires 0.6 hover opacity washout and zeroes hover lift under reduced/calm motion", () => {
    expect(Number(token(root, "--bless-hover-opacity"))).toBe(1);
    expect(token(root, "--bless-hover-lift")).toBe("-1.5px");
    expect(token(reduced, "--bless-hover-lift")).toBe("0px");
    expect(token(calm, "--bless-hover-lift")).toBe("0px");
  });

  it("meets WCAG AA (>= 4.5:1) for text, muted text, and all 6 palettes across all 3 moods", () => {
    const moods = {
      daylight: {
        bg: token(root, "--bless-color-bg"),
        surface: token(root, "--bless-color-surface"),
        text: token(root, "--bless-color-text"),
        muted: token(root, "--bless-color-text-muted"),
      },
      golden: {
        bg: token(golden, "--bless-color-bg"),
        surface: token(golden, "--bless-color-surface"),
        text: token(golden, "--bless-color-text"),
        muted: token(golden, "--bless-color-text-muted"),
      },
      night: {
        bg: token(dark, "--bless-color-bg"),
        surface: token(dark, "--bless-color-surface"),
        text: token(dark, "--bless-color-text"),
        muted: token(dark, "--bless-color-text-muted"),
      },
    };

    for (const [name, m] of Object.entries(moods)) {
      expect(contrastRatio(m.text, m.bg), `${name} text/bg`).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(m.text, m.surface), `${name} text/surface`).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(m.muted, m.bg), `${name} muted/bg`).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(m.muted, m.surface), `${name} muted/surface`).toBeGreaterThanOrEqual(4.5);
    }

    const lightAccents: Record<string, { fill: string; text: string }> = {
      megumi: { fill: token(root, "--bless-color-accent"), text: token(root, "--bless-color-accent-text") },
      utaha: {
        fill: token(blockOf(':root[data-palette="utaha"]'), "--bless-color-accent"),
        text: token(blockOf(':root[data-palette="utaha"]'), "--bless-color-accent-text"),
      },
      izumi: {
        fill: token(blockOf(':root[data-palette="izumi"]'), "--bless-color-accent"),
        text: token(blockOf(':root[data-palette="izumi"]'), "--bless-color-accent-text"),
      },
      michiru: {
        fill: token(blockOf(':root[data-palette="michiru"]'), "--bless-color-accent"),
        text: token(blockOf(':root[data-palette="michiru"]'), "--bless-color-accent-text"),
      },
      eriri: {
        fill: token(blockOf(':root[data-palette="eriri"]'), "--bless-color-accent"),
        text: token(blockOf(':root[data-palette="eriri"]'), "--bless-color-accent-text"),
      },
      tomoya: {
        fill: token(blockOf(':root[data-palette="tomoya"]'), "--bless-color-accent"),
        text: token(blockOf(':root[data-palette="tomoya"]'), "--bless-color-accent-text"),
      },
    };

    for (const [pal, { fill, text }] of Object.entries(lightAccents)) {
      expect(contrastRatio(fill, "#ffffff"), `${pal} white/accent`).toBeGreaterThanOrEqual(4.5);
      for (const mood of [moods.daylight, moods.golden]) {
        expect(contrastRatio(text, mood.bg), `${pal} text/bg`).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(text, mood.surface), `${pal} text/surface`).toBeGreaterThanOrEqual(4.5);
      }
    }

    const darkAccentBlock = css.slice(css.lastIndexOf(':root[data-theme="dark"] {'));
    const darkTexts = [
      token(darkAccentBlock, "--bless-color-accent-text"),
      ...["utaha", "tomoya", "izumi", "michiru", "eriri"].map((p) => {
        const m = darkAccentBlock.match(new RegExp(`&\\[data-palette="${p}"\\]\\s*\\{[^}]*--bless-color-accent-text:\\s*([^;]+);`));
        expect(m, `dark accent-text for ${p}`).not.toBeNull();
        return m![1].trim();
      }),
    ];
    for (const dt of darkTexts) {
      expect(contrastRatio(dt, moods.night.bg), `night ${dt}/bg`).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(dt, moods.night.surface), `night ${dt}/surface`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
