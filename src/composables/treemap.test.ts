import { neighbour, squarify, totalOf } from "./treemap";

const areaOf = (r: { w: number; h: number }) => r.w * r.h;

test("tiles fill the whole area, in proportion to their values", () => {
  const values = [6, 6, 4, 3, 2, 2, 1];
  const rects = squarify(values, 400, 300);
  const sum = rects.reduce((a, r) => a + areaOf(r), 0);
  expect(sum).toBeCloseTo(400 * 300, 4);
  const total = values.reduce((a, b) => a + b, 0);
  rects.forEach((r, i) => expect(areaOf(r)).toBeCloseTo((values[i]! / total) * 400 * 300, 3));
});

test("rects stay inside the box and do not overlap", () => {
  const rects = squarify([5, 3, 8, 1, 2, 9, 4], 320, 200);
  for (const r of rects) {
    expect(r.x).toBeGreaterThanOrEqual(-1e-6);
    expect(r.y).toBeGreaterThanOrEqual(-1e-6);
    expect(r.x + r.w).toBeLessThanOrEqual(320 + 1e-6);
    expect(r.y + r.h).toBeLessThanOrEqual(200 + 1e-6);
  }
  for (let i = 0; i < rects.length; i++)
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i]!;
      const b = rects[j]!;
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      expect(ox > 1e-6 && oy > 1e-6).toBe(false);
    }
});

test("tiles stay near square (no sliver for ordinary data)", () => {
  const rects = squarify([10, 8, 7, 6, 5, 4, 3, 2], 300, 300);
  for (const r of rects) expect(Math.max(r.w / r.h, r.h / r.w)).toBeLessThan(4);
});

test("zero values and an empty box take no room", () => {
  const rects = squarify([4, 0, 4], 100, 100);
  expect(rects[1]).toEqual({ x: 0, y: 0, w: 0, h: 0 });
  expect(areaOf(rects[0]!) + areaOf(rects[2]!)).toBeCloseTo(10000, 4);
  expect(squarify([1, 2], 0, 50).every((r) => !r.w)).toBe(true);
  expect(squarify([], 10, 10)).toEqual([]);
});

test("totalOf sums leaves up through the tree", () => {
  expect(
    totalOf({
      id: "r",
      label: "r",
      children: [
        { id: "a", label: "a", value: 3 },
        { id: "b", label: "b", children: [{ id: "c", label: "c", value: 4 }] },
      ],
    }),
  ).toBe(7);
  expect(totalOf({ id: "x", label: "x", value: -5 })).toBe(0);
});

test("neighbour walks to the next tile that way, and stays put at an edge", () => {
  const rects = [
    { x: 0, y: 0, w: 100, h: 100 },
    { x: 100, y: 0, w: 100, h: 100 },
    { x: 0, y: 100, w: 100, h: 100 },
  ];
  expect(neighbour(rects, 0, "right")).toBe(1);
  expect(neighbour(rects, 0, "down")).toBe(2);
  expect(neighbour(rects, 1, "left")).toBe(0);
  expect(neighbour(rects, 0, "up")).toBe(0);
  expect(neighbour(rects, 2, "right")).toBe(1); // nearest centre to the right, even if offset
});
