// @vitest-environment node
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, expect, it } from "vitest";
import { add } from "../bin/blessing-ui.mjs";

const from = resolve(__dirname, "../docs/blocks");
let dir = "";
afterEach(() => rmSync(dir, { recursive: true, force: true }));
const fresh = () => (dir = mkdtempSync(join(tmpdir(), "bless-add-")));

it("copies a block with its parts, without meta.ts", () => {
  const r = add(["course"], { dir: fresh(), from });
  expect(r.copied).toEqual(["course"]);
  expect(existsSync(join(dir, "course/index.vue"))).toBe(true);
  expect(existsSync(join(dir, "course/parts/LessonPane.vue"))).toBe(true);
  expect(existsSync(join(dir, "course/meta.ts"))).toBe(false);
});

it("brings the sibling blocks a block imports", () => {
  const r = add(["site"], { dir: fresh(), from });
  expect(r.copied).toEqual(expect.arrayContaining(["site", "news", "story", "staff"]));
});

it("names the packages to install beyond vue and blessing-ui", () => {
  expect(add(["dashboard"], { dir: fresh(), from }).packages).toEqual(["@unovis/vue"]);
  expect(add(["chat"], { dir, from }).packages).toEqual([]);
});

it("keeps an existing folder unless forced", () => {
  add(["chat"], { dir: fresh(), from });
  writeFileSync(join(dir, "chat/index.vue"), "mine");
  expect(add(["chat"], { dir, from }).skipped).toEqual(["chat"]);
  expect(readFileSync(join(dir, "chat/index.vue"), "utf8")).toBe("mine");
  add(["chat"], { dir, from, force: true });
  expect(readFileSync(join(dir, "chat/index.vue"), "utf8")).not.toBe("mine");
});

it("refuses an unknown block", () => {
  expect(() => add(["nope"], { dir: fresh(), from })).toThrow(/No block "nope"/);
});
