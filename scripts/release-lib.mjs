// Pure release helpers used by scripts/release.mjs and verified by src/release.test.ts.

export function parseVersion(version) {
  if (typeof version !== "string") throw new Error(`Invalid version: ${String(version)}`);
  const m = version.trim().match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/);
  if (!m) throw new Error(`Invalid semver version: "${version}"`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

export function compareVersions(a, b) {
  const va = parseVersion(a);
  const vb = parseVersion(b);
  for (let i = 0; i < 3; i++) {
    if (va[i] !== vb[i]) return va[i] - vb[i];
  }
  return 0;
}

export function bumpVersion(current, target) {
  const [maj, min, pat] = parseVersion(current);
  if (target === "patch") return `${maj}.${min}.${pat + 1}`;
  if (target === "minor") return `${maj}.${min + 1}.0`;
  if (target === "major") return `${maj + 1}.0.0`;
  parseVersion(target);
  if (compareVersions(target, current) <= 0) {
    throw new Error(`Target version ${target} must be greater than current version ${current}`);
  }
  return target;
}

export function inferBump(unreleasedBody) {
  let section = "";
  for (const raw of unreleasedBody.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const h = line.match(/^###\s+(.+)$/);
    if (h) {
      section = h[1].trim().toLowerCase();
      continue;
    }
    if (section === "added" || section === "changed") return "minor";
  }
  return "patch";
}

// Mirrors the awk check in .github/workflows/release.yml:
// awk -v v="$v" '/^## /{p = index($0, "## " v " ") == 1; next} p' CHANGELOG.md
export function extractReleaseNotes(changelog, version) {
  const lines = changelog.split(/\r?\n/);
  const out = [];
  let active = false;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      active = line === `## ${version}` || line.startsWith(`## ${version} `);
      continue;
    }
    if (active) out.push(line);
  }
  return out.join("\n").trim();
}

function hasReleaseEntries(body) {
  return body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .some((l) => l.length > 0 && !l.startsWith("### "));
}

export function promoteChangelog(changelog, version, date) {
  parseVersion(version);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid release date "${date}" (expected YYYY-MM-DD)`);
  }
  if (extractReleaseNotes(changelog, version).length > 0) {
    throw new Error(`CHANGELOG.md already contains a section for ${version}`);
  }

  const lines = changelog.split(/\r?\n/);
  const unreleasedIdx = lines.findIndex((l) => /^## Unreleased\s*$/.test(l));
  if (unreleasedIdx === -1) {
    throw new Error('CHANGELOG.md is missing an "## Unreleased" section');
  }

  let nextHeadingIdx = lines.length;
  for (let i = unreleasedIdx + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) {
      nextHeadingIdx = i;
      break;
    }
  }

  const bodyLines = lines.slice(unreleasedIdx + 1, nextHeadingIdx);
  const body = bodyLines.join("\n").trim();
  if (!hasReleaseEntries(body)) {
    throw new Error('"## Unreleased" in CHANGELOG.md has no entries to release');
  }

  const before = lines.slice(0, unreleasedIdx);
  const after = lines.slice(nextHeadingIdx);
  const promoted = [
    ...before,
    "## Unreleased",
    "",
    `## ${version} — ${date}`,
    "",
    body,
    ...(after.length ? ["", ...after] : [""]),
  ];
  const nextChangelog = promoted.join("\n").replace(/\n*$/, "\n");
  const notes = extractReleaseNotes(nextChangelog, version);
  if (!notes) {
    throw new Error(`Failed to verify extracted release notes for ${version}`);
  }
  return { changelog: nextChangelog, notes };
}

export function updatePackageVersion(pkgText, nextVersion) {
  parseVersion(nextVersion);
  const parsed = JSON.parse(pkgText);
  if (typeof parsed.version !== "string") {
    throw new Error('package.json is missing a string "version" field');
  }
  const updated = pkgText.replace(/("version"\s*:\s*")([^"]+)(")/, `$1${nextVersion}$3`);
  if (JSON.parse(updated).version !== nextVersion) {
    throw new Error(`Failed to update version in package.json to ${nextVersion}`);
  }
  return updated;
}
