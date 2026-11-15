// Two components that style the same class change each other when an app loads both stylesheets.
// This happened twice (BlessRelativeTime and BlessTimePicker on .bless-time, BlessSpreadsheet and
// BlessSheet on .bless-sheet), so the rules of each block start in one file only.
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const dir = resolve(__dirname, "components");

test("no two component files style the same block of classes", () => {
  const owner = new Map<string, string>();
  const clashes: string[] = [];
  for (const f of readdirSync(dir).filter((f) => /\.(vue|css)$/.test(f))) {
    const src = readFileSync(resolve(dir, f), "utf8");
    const css = f.endsWith(".css") ? src : (src.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "");
    // the block of the class that starts each selector, outside :is() and :not(): the block the rule belongs to
    const own = new Set<string>();
    for (const [, sel] of css.matchAll(/([^{}]+)\{/g)) {
      if (sel!.trim().startsWith("@")) continue;
      let depth = 0;
      let part = "";
      for (const ch of `${sel},`) {
        depth += ch === "(" ? 1 : ch === ")" ? -1 : 0;
        if (ch !== "," || depth) part += ch;
        else {
          const m = part.trim().match(/^\.(bless-[a-z0-9-]+?)(?:__|--|[^a-z0-9-]|$)/);
          if (m) own.add(m[1]!);
          part = "";
        }
      }
    }
    for (const c of own) {
      const at = owner.get(c);
      if (at && at !== f) clashes.push(`.${c}: ${at} and ${f}`);
      else owner.set(c, f);
    }
  }
  expect(clashes).toEqual([]);
});
