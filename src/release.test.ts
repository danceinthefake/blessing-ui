// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  bumpVersion,
  compareVersions,
  extractReleaseNotes,
  inferBump,
  parseVersion,
  promoteChangelog,
  updatePackageVersion,
} from "../scripts/release-lib.mjs";

describe("release-lib", () => {
  it("parses, compares, and bumps semver versions", () => {
    expect(parseVersion("0.13.0")).toEqual([0, 13, 0]);
    expect(compareVersions("0.13.1", "0.13.0")).toBeGreaterThan(0);
    expect(bumpVersion("0.13.0", "patch")).toBe("0.13.1");
    expect(bumpVersion("0.13.0", "minor")).toBe("0.14.0");
    expect(bumpVersion("0.13.0", "major")).toBe("1.0.0");
    expect(bumpVersion("0.13.0", "0.15.2")).toBe("0.15.2");
  });

  it("rejects malformed or non-advancing versions", () => {
    expect(() => parseVersion("v0.13.0")).toThrow();
    expect(() => parseVersion("01.2.3")).toThrow();
    expect(() => bumpVersion("0.13.0", "0.13.0")).toThrow();
    expect(() => bumpVersion("0.13.0", "0.12.9")).toThrow();
  });

  it("infers minor when Added or Changed has entries, and patch when only Fixed does", () => {
    expect(inferBump("### Fixed\n\n- Fixed a toast.\n")).toBe("patch");
    expect(inferBump("### Added\n\n### Fixed\n\n- Fixed a toast.\n")).toBe("patch");
    expect(inferBump("### Added\n\n- New slot.\n\n### Fixed\n\n- Fixed a toast.\n")).toBe("minor");
    expect(inferBump("### Changed\n\n- Updated spacing.\n")).toBe("minor");
  });

  it("promotes Unreleased into a dated release section matching release.yml extraction", () => {
    const sample = [
      "# Changelog",
      "",
      "## Unreleased",
      "",
      "### Added",
      "",
      "- `BlessQuiz`: before slot.",
      "",
      "### Fixed",
      "",
      "- `BlessToaster`: keep alert inside list item.",
      "",
      "## 0.13.0 — 2026-11-25",
      "",
      "### Changed",
      "",
      "- Unified v3.",
      "",
    ].join("\n");

    const { changelog, notes } = promoteChangelog(sample, "0.14.0", "2026-11-28");
    expect(extractReleaseNotes(sample, "Unreleased")).toContain("`BlessQuiz`: before slot.");
    expect(changelog).toContain("## Unreleased\n\n## 0.14.0 — 2026-11-28\n");
    expect(extractReleaseNotes(changelog, "0.14.0")).toBe(notes);
    expect(notes).toContain("`BlessQuiz`: before slot.");
    expect(notes).toContain("`BlessToaster`: keep alert inside list item.");
    // prior release stays intact
    expect(extractReleaseNotes(changelog, "0.13.0")).toContain("Unified v3.");
    // fresh Unreleased section is empty until new changes arrive
    expect(extractReleaseNotes(changelog, "Unreleased")).toBe("");
  });

  it("rejects empty Unreleased sections, duplicate versions, and invalid dates", () => {
    const empty = "# Changelog\n\n## Unreleased\n\n### Fixed\n\n## 0.13.0 — 2026-11-25\n\n- Old.\n";
    expect(() => promoteChangelog(empty, "0.13.1", "2026-11-28")).toThrow(/no entries/);

    const existing = "# Changelog\n\n## Unreleased\n\n- New.\n\n## 0.13.0 — 2026-11-25\n\n- Old.\n";
    expect(() => promoteChangelog(existing, "0.13.0", "2026-11-28")).toThrow(/already contains/);
    expect(() => promoteChangelog(existing, "0.13.1", "28-11-2026")).toThrow(
      /Invalid release date/,
    );
  });

  it("updates package.json version without disturbing formatting", () => {
    const raw = '{\n  "name": "blessing-ui",\n  "version": "0.13.0",\n  "license": "MIT"\n}\n';
    const next = updatePackageVersion(raw, "0.14.0");
    expect(next).toBe(
      '{\n  "name": "blessing-ui",\n  "version": "0.14.0",\n  "license": "MIT"\n}\n',
    );
  });
});
