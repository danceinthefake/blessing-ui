export function parseVersion(version: string): [number, number, number];
export function compareVersions(a: string, b: string): number;
export function bumpVersion(current: string, target: string): string;
export function inferBump(unreleasedBody: string): "patch" | "minor";
export function extractReleaseNotes(changelog: string, version: string): string;
export function promoteChangelog(
  changelog: string,
  version: string,
  date: string,
): { changelog: string; notes: string };
export function updatePackageVersion(pkgText: string, nextVersion: string): string;
