// The fast check for one change: sweep, axe, interact, and blocks in Chromium, only on the pages
// that the changes in the working tree reach (e2e/affected.mjs). A change that reaches every page,
// for example to tokens or the config, is left to CI.
// Auto-starts `vitepress preview docs` on :4173 when nothing is listening yet.
// Usage: pnpm e2e:changed [git ref] [--build]
import { execFileSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";

const args = process.argv.slice(2);
const shouldBuild = args.includes("--build");
const refs = args.filter((a) => !a.startsWith("--"));
const baseUrl = process.env.E2E_BASE_URL ?? "http://localhost:4173";
const port = new URL(baseUrl).port || "4173";

const only =
  process.env.E2E_ONLY ??
  execFileSync("node", ["e2e/affected.mjs", ...refs], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
if (only === "*") {
  console.log("This change reaches every page. CI checks it on the push.");
  process.exit(0);
}
if (only === "-") process.exit(0);

if (shouldBuild) {
  execFileSync("pnpm", ["docs:build"], { stdio: "inherit" });
}

async function isUp(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(1000) });
    return res.ok;
  } catch {
    return false;
  }
}

let server;
const stopServer = () => {
  if (server && !server.killed) server.kill("SIGTERM");
};
process.on("SIGINT", () => {
  stopServer();
  process.exit(130);
});
process.on("SIGTERM", () => {
  stopServer();
  process.exit(143);
});

try {
  if (!(await isUp(baseUrl))) {
    if (!existsSync("docs/.vitepress/dist")) {
      console.error(
        "No docs preview running and docs/.vitepress/dist does not exist. Run `pnpm docs:build` or pass `--build`.",
      );
      process.exit(1);
    }
    console.log(`Starting docs preview on ${baseUrl}...`);
    server = spawn("pnpm", ["exec", "vitepress", "preview", "docs", "--port", port], {
      stdio: "ignore",
    });
    const deadline = Date.now() + 15_000;
    while (!(await isUp(baseUrl))) {
      if (server.exitCode !== null) {
        console.error(`vitepress preview exited early with code ${server.exitCode}`);
        process.exit(1);
      }
      if (Date.now() > deadline) {
        console.error(`Timed out waiting for docs preview at ${baseUrl}`);
        process.exit(1);
      }
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  const env = { ...process.env, E2E_ONLY: only, AXE_TABS: process.env.AXE_TABS ?? "1" };
  for (const cmd of [
    ["e2e/sweep.mjs", "chromium", baseUrl],
    ["e2e/axe.mjs", baseUrl],
    ["e2e/interact.mjs", "chromium", baseUrl],
    ["e2e/blocks.mjs", "chromium", baseUrl],
  ]) {
    execFileSync("node", cmd, { stdio: "inherit", env });
  }
} finally {
  stopServer();
}
