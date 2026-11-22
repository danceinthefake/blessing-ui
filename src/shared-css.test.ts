// @vitest-environment node
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, it } from "vitest";
import { linkSharedCss } from "../scripts/shared-css.mjs";

let dir = "";
afterEach(() => rmSync(dir, { recursive: true, force: true }));

function fixture() {
  dir = mkdtempSync(join(tmpdir(), "bless-css-"));
  const src = join(dir, "src");
  const comps = join(dir, "dist");
  mkdirSync(src);
  mkdirSync(comps);
  writeFileSync(join(src, "sr.css"), ".bless-sr{}");
  writeFileSync(join(comps, "sr.css"), ".bless-sr{}");
  writeFileSync(join(src, "BlessA.vue"), '<script setup>\nimport "./sr.css";\n</script>');
  writeFileSync(join(src, "BlessB.vue"), "<script setup></script>");
  writeFileSync(join(comps, "BlessA.js"), 'import "./BlessA.css";\n');
  writeFileSync(join(comps, "BlessB.js"), 'import "./BlessB.css";\n');
  return { src, comps };
}

it("links the shared CSS to each module whose SFC imports it, and returns it for the all-in-one file", () => {
  const { src, comps } = fixture();
  expect(linkSharedCss(src, comps)).toEqual([".bless-sr{}"]);
  expect(readFileSync(join(comps, "BlessA.js"), "utf8")).toBe('import "./sr.css";\nimport "./BlessA.css";\n');
  // negative control: a module that does not import it stays the same
  expect(readFileSync(join(comps, "BlessB.js"), "utf8")).toBe('import "./BlessB.css";\n');
});

it("stops the build when a shared file is missing from the output", () => {
  const { src, comps } = fixture();
  rmSync(join(comps, "sr.css"));
  expect(() => linkSharedCss(src, comps)).toThrow("did not emit sr.css");
});
