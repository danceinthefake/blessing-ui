// SFC blocks go in the order template, script, style. The Vue style guide lets each project pick one order.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "..");
const rank: Record<string, number> = { template: 0, script: 1, style: 2 };

test("every SFC puts template first, then script, then style", () => {
  const files = execSync('git ls-files "*.vue"', { cwd: root }).toString().trim().split("\n");
  const bad = files.filter((f) => {
    const tags = [
      ...readFileSync(resolve(root, f), "utf8").matchAll(/^<(template|script|style)\b/gm),
    ];
    const ranks = tags.map((m) => rank[m[1]]);
    return ranks.some((r, i) => i > 0 && r < ranks[i - 1]);
  });
  expect(bad).toEqual([]);
});
