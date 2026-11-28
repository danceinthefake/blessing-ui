// Cut a blessing-ui release in one command:
//   pnpm release [patch|minor|major|X.Y.Z] [--dry-run] [--push] [--skip-checks]
// Validates git state & CHANGELOG.md, runs test/build/consumer checks (updating sizes.json),
// bumps package.json, promotes "## Unreleased", commits `chore: release X.Y.Z`, and tags `vX.Y.Z`.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  bumpVersion,
  extractReleaseNotes,
  inferBump,
  promoteChangelog,
  updatePackageVersion,
} from "./release-lib.mjs";

const root = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const positional = args.filter((a) => !a.startsWith("--"));

const knownFlags = new Set(["--dry-run", "--push", "--skip-checks", "--help"]);
for (const f of flags) {
  if (!knownFlags.has(f)) {
    console.error(`Unknown option: ${f}`);
    process.exit(1);
  }
}
if (flags.has("--help") || positional.length > 1) {
  console.log("Usage: pnpm release [patch|minor|major|X.Y.Z] [--dry-run] [--push] [--skip-checks]");
  process.exit(0);
}

const dryRun = flags.has("--dry-run");
const shouldPush = flags.has("--push");
const skipChecks = flags.has("--skip-checks");

const run = (cmd, cmdArgs, opts = {}) =>
  execFileSync(cmd, cmdArgs, { cwd: root, stdio: "inherit", ...opts });
const capture = (cmd, cmdArgs) =>
  execFileSync(cmd, cmdArgs, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();

const branch = capture("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
if (branch !== "main") {
  console.error(`Refusing to release from branch "${branch}". Switch to "main" first.`);
  process.exit(1);
}

const status = capture("git", ["status", "--porcelain"]);
if (status) {
  console.error("Working tree is not clean. Commit or stash changes before releasing:\n" + status);
  process.exit(1);
}

try {
  capture("git", ["fetch", "--tags", "origin"]);
  const behind = Number(capture("git", ["rev-list", "--count", "HEAD..origin/main"]));
  if (behind > 0) {
    console.error(`Local main is behind origin/main by ${behind} commit(s). Pull or rebase first.`);
    process.exit(1);
  }
} catch {
  console.warn("Warning: could not fetch origin; continuing with local refs.");
}

const pkgPath = resolve(root, "package.json");
const changelogPath = resolve(root, "CHANGELOG.md");
const pkgText = readFileSync(pkgPath, "utf8");
const changelogText = readFileSync(changelogPath, "utf8");
const currentVersion = JSON.parse(pkgText).version;

const unreleasedNotes = extractReleaseNotes(changelogText, "Unreleased");
if (!unreleasedNotes) {
  console.error('CHANGELOG.md has no release notes under "## Unreleased".');
  process.exit(1);
}

const bumpArg = positional[0] ?? inferBump(unreleasedNotes);
const nextVersion = bumpVersion(currentVersion, bumpArg);
const tag = `v${nextVersion}`;

let tagExists = false;
try {
  capture("git", ["rev-parse", "-q", "--verify", `refs/tags/${tag}`]);
  tagExists = true;
} catch {
  tagExists = false;
}
if (tagExists) {
  console.error(`Tag ${tag} already exists.`);
  process.exit(1);
}

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const { changelog: nextChangelog, notes } = promoteChangelog(changelogText, nextVersion, today);
const nextPkgText = updatePackageVersion(pkgText, nextVersion);

console.log(`Release plan: ${currentVersion} → ${nextVersion} (${tag}) on ${today}`);
console.log(
  positional[0]
    ? `  bump: ${positional[0]} (explicit)`
    : `  bump: ${bumpArg} (inferred from CHANGELOG.md)`,
);
console.log("\nRelease notes:\n" + notes + "\n");

if (dryRun) {
  console.log("Dry run complete — no files modified.");
  process.exit(0);
}

if (!skipChecks) {
  run("pnpm", ["test"]);
  run("pnpm", ["build"]);
  run("node", ["e2e/consumer/check.mjs"]);
}

writeFileSync(pkgPath, nextPkgText);
writeFileSync(changelogPath, nextChangelog);

// Re-verify the exact notes parser used by .github/workflows/release.yml
if (!extractReleaseNotes(readFileSync(changelogPath, "utf8"), nextVersion)) {
  console.error(`Release notes check failed for ${nextVersion} in CHANGELOG.md.`);
  process.exit(1);
}

const filesToStage = ["package.json", "CHANGELOG.md"];
const dirty = capture("git", ["status", "--porcelain"]);
if (dirty.includes("docs/.vitepress/sizes.json")) {
  filesToStage.push("docs/.vitepress/sizes.json");
}

run("git", ["add", ...filesToStage]);
run("git", ["commit", "-m", `chore: release ${nextVersion}`]);
run("git", ["tag", tag]);

console.log(`\n✓ Created release commit and tag ${tag}`);
if (shouldPush) {
  run("git", ["push", "origin", "main", tag]);
  console.log(
    `\n✓ Pushed main and ${tag}.\n` +
      `Next: once the release workflow stages ${tag} on npm, approve it with 2FA:\n` +
      `  npm stage list && npm stage approve <id>\n` +
      `  or https://www.npmjs.com/package/blessing-ui`,
  );
} else {
  console.log(`\nNext:\n  git push origin main ${tag}`);
}
