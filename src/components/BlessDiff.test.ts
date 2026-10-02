import { mount } from "@vue/test-utils";
import BlessDiff from "./BlessDiff.vue";
import { diffLines } from "../composables/diffLines";

const sum = (r: ReturnType<typeof diffLines>) =>
  r.map((x) => ({ add: "+", del: "-", same: " " })[x.type] + x.text).join("|");

test("diffLines: identical, empty sides, trailing newline", () => {
  expect(sum(diffLines("a\nb\n", "a\nb"))).toBe(" a| b");
  expect(sum(diffLines("", "x\ny"))).toBe("+x|+y");
  expect(sum(diffLines("x\ny", ""))).toBe("-x|-y");
  expect(diffLines("", "")).toEqual([]);
});

test("diffLines: a change in the middle keeps the rest aligned, with line numbers", () => {
  const r = diffLines("one\ntwo\nthree\nfour", "one\n2\nthree\nfour\nfive");
  expect(sum(r)).toBe(" one|-two|+2| three| four|+five");
  expect(r[1]).toMatchObject({ type: "del", a: 2 });
  expect(r[2]).toMatchObject({ type: "add", b: 2 });
  expect(r[3]).toMatchObject({ type: "same", a: 3, b: 3 });
  expect(r[5]).toMatchObject({ type: "add", b: 5 });
});

test("diffLines: moved and repeated lines still produce a minimal edit", () => {
  expect(sum(diffLines("a\nb\nc\nd", "a\nc\nb\nd"))).toMatch(/^ a\|.*\| d$/);
  const r = diffLines("x\nx\nx", "x\nx");
  expect(r.filter((x) => x.type === "del")).toHaveLength(1);
  expect(r.filter((x) => x.type === "same")).toHaveLength(2);
});

test("diffLines: a huge block degrades to replaced instead of hanging", () => {
  const a = Array.from({ length: 2500 }, (_, i) => `a${i}`).join("\n");
  const b = Array.from({ length: 2500 }, (_, i) => `b${i}`).join("\n");
  const r = diffLines(a, b);
  expect(r).toHaveLength(5000);
  expect(r.every((x) => x.type !== "same")).toBe(true);
});

const mk = (props = {}) =>
  mount(BlessDiff, { props: { a: "one\ntwo\nthree", b: "one\n2\nthree", ...props } });

test("inline: signs, both line numbers, counts announced", () => {
  const w = mk();
  const rows = w.findAll(".bless-diff__row");
  expect(rows.map((r) => r.classes().pop())).toEqual([
    "bless-diff__row--same",
    "bless-diff__row--del",
    "bless-diff__row--add",
    "bless-diff__row--same",
  ]);
  expect(rows[1].find(".bless-diff__sign").text()).toBe("−");
  expect(rows[1].find(".bless-diff__sign").attributes("aria-label")).toBe("removed");
  expect(rows[2].findAll(".bless-diff__no").map((n) => n.text())).toEqual(["", "2"]);
  expect(w.find(".bless-diff__plus").text()).toBe("+1");
  expect(w.find(".bless-diff__sr").text()).toBe("1 lines added, 1 removed");
});

test("split: changed lines sit side by side; an unmatched side is empty", () => {
  const w = mk({ mode: "split", b: "one\n2\n2b\nthree" });
  const rows = w.findAll(".bless-diff__row");
  expect(rows).toHaveLength(4);
  const cells = (i: number) => rows[i].findAll(".bless-diff__text").map((c) => c.text());
  expect(cells(1)).toEqual(["two", "2"]);
  expect(cells(2)).toEqual(["", "2b"]);
  expect(rows[2].findAll(".bless-diff__text")[0].classes()).toContain("bless-diff__cell--empty");
  expect(rows[1].findAll(".bless-diff__text")[0].attributes("aria-label")).toBe("removed: two");
  expect(
    w
      .findAll("thead th")
      .map((t) => t.text())
      .filter(Boolean),
  ).toEqual(["Before", "After"]);
});

test("context folds long unchanged runs into a button that expands them", async () => {
  const lines = Array.from({ length: 20 }, (_, i) => `l${i}`);
  const w = mk({
    a: lines.join("\n"),
    b: lines.map((l, i) => (i === 10 ? "CHANGED" : l)).join("\n"),
    context: 2,
  });
  const texts = () => w.findAll(".bless-diff__text").map((t) => t.text());
  expect(texts()).toEqual(["l8", "l9", "l10", "CHANGED", "l11", "l12"]);
  expect(w.findAll(".bless-diff__fold button").map((b) => b.text())).toEqual([
    "8 unchanged lines",
    "7 unchanged lines",
  ]);
  await w.findAll(".bless-diff__fold button")[0].trigger("click");
  expect(texts()).toHaveLength(6 + 8);
  expect(w.findAll(".bless-diff__fold")).toHaveLength(1);
});

test("lineNumbers off drops the gutter; identical texts show no changes", () => {
  const w = mk({ lineNumbers: false, b: "one\ntwo\nthree" });
  expect(w.findAll(".bless-diff__no")).toHaveLength(0);
  expect(w.find(".bless-diff__plus").text()).toBe("+0");
});
