import { applyRange, blocks, rangeBetween } from "./dayBlocks";

test("rangeBetween is inclusive, either way round, and crosses month ends", () => {
  expect(rangeBetween("2026-01-30", "2026-02-02")).toEqual([
    "2026-01-30",
    "2026-01-31",
    "2026-02-01",
    "2026-02-02",
  ]);
  expect(rangeBetween("2026-03-03", "2026-03-01")).toEqual([
    "2026-03-01",
    "2026-03-02",
    "2026-03-03",
  ]);
  expect(rangeBetween("2026-03-01", "2026-03-01")).toEqual(["2026-03-01"]);
});

test("blocks groups consecutive days and counts them", () => {
  expect(blocks(["2026-05-04", "2026-05-02", "2026-05-03", "2026-05-09", "2026-05-02"])).toEqual([
    { start: "2026-05-02", end: "2026-05-04", count: 3 },
    { start: "2026-05-09", end: "2026-05-09", count: 1 },
  ]);
  expect(blocks([])).toEqual([]);
  expect(blocks(["2026-12-31", "2027-01-01"])).toEqual([
    { start: "2026-12-31", end: "2027-01-01", count: 2 },
  ]);
});

test("applyRange adds or removes, keeps order, and skips days that are refused", () => {
  const cur = ["2026-05-03", "2026-05-05"];
  expect(applyRange(cur, rangeBetween("2026-05-04", "2026-05-06"), "set")).toEqual([
    "2026-05-03",
    "2026-05-04",
    "2026-05-05",
    "2026-05-06",
  ]);
  expect(applyRange(cur, ["2026-05-03", "2026-05-09"], "clear")).toEqual(["2026-05-05"]);
  expect(applyRange(cur, ["2026-05-06", "2026-05-07"], "set", (d) => d !== "2026-05-07")).toEqual([
    "2026-05-03",
    "2026-05-05",
    "2026-05-06",
  ]);
});
