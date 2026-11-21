// Code goes in the order template, script, style: in each SFC, in each `vue` code sample, and in each
// VitePress page (the page text is the template). The Vue style guide lets each project pick one order.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "..");
const ls = (glob: string) =>
  execSync(`git ls-files "${glob}"`, { cwd: root }).toString().trim().split("\n");
const read = (f: string) => readFileSync(resolve(root, f), "utf8");
const sorted = (ranks: number[]) => ranks.every((r, i) => i === 0 || r >= ranks[i - 1]);
const tagRanks = (src: string) =>
  [...src.matchAll(/^<(template|script|style)\b/gm)].map((m) =>
    m[1] === "template" ? 0 : m[1] === "script" ? 1 : 2,
  );

test("every SFC puts template first, then script, then style", () => {
  expect(ls("*.vue").filter((f) => !sorted(tagRanks(read(f))))).toEqual([]);
});

test("every markdown page and vue code sample puts template first, then script, then style", () => {
  const bad: string[] = [];
  for (const f of ls("*.md")) {
    const ranks: number[] = [];
    let fence: { mark: string; vue: boolean; body: string[] } | null = null;
    let block = "";
    for (const line of read(f)
      .replace(/^---\n[\s\S]*?\n---\n/, "")
      .split("\n")) {
      if (fence) {
        if (line.trim() !== fence.mark) fence.body.push(line);
        else {
          if (fence.vue && !sorted(tagRanks(fence.body.join("\n")))) bad.push(`${f} (code sample)`);
          fence = null;
        }
        continue;
      }
      if (block) {
        if (line.startsWith(`</${block}>`)) block = "";
        continue;
      }
      const open = line.match(/^\s*(`{3,})(\S*)/);
      const tag = line.match(/^<(script|style)\b/);
      if (open) fence = { mark: open[1], vue: open[2].startsWith("vue"), body: [] };
      else if (tag) {
        ranks.push(tag[1] === "script" ? 1 : 2);
        if (!line.includes(`</${tag[1]}>`)) block = tag[1];
      }
      if (!tag && line.trim()) ranks.push(0);
    }
    if (!sorted(ranks)) bad.push(f);
  }
  expect(bad).toEqual([]);
});
