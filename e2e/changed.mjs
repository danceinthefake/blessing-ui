// The fast check for one change: the sweep, axe, and the block suite in Chromium, only on the pages
// that the changes in the working tree reach (e2e/affected.mjs). A change that reaches every page,
// for example to tokens or the config, is left to CI. Needs the docs preview on :4173.
// Usage: pnpm e2e:changed [git ref]
import { execFileSync } from "node:child_process";

const only = execFileSync("node", ["e2e/affected.mjs", ...process.argv.slice(2)], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"],
}).trim();
if (only === "*") {
  console.log("This change reaches every page. CI checks it on the push.");
  process.exit(0);
}
if (only === "-") process.exit(0);
const env = { ...process.env, E2E_ONLY: only, AXE_TABS: process.env.AXE_TABS ?? "1" };
for (const args of [["e2e/sweep.mjs", "chromium"], ["e2e/axe.mjs"], ["e2e/blocks.mjs", "chromium"]])
  execFileSync("node", args, { stdio: "inherit", env });
