import { boxFrom, isBox, moveRegion, nextId, resizeRegion, type Region } from "./annotate";

const box: Region = { id: "r1", x: 0.2, y: 0.3, w: 0.4, h: 0.2, label: "" };
const pin: Region = { id: "r2", x: 0.5, y: 0.5, label: "" };

test("boxFrom takes the corners in any order and stays inside the image", () => {
  expect(boxFrom({ x: 0.6, y: 0.7 }, { x: 0.2, y: 0.1 })).toEqual({
    x: 0.2,
    y: 0.1,
    w: 0.4,
    h: 0.6,
  });
  expect(boxFrom({ x: -0.3, y: 0.5 }, { x: 1.4, y: 0.9 })).toEqual({ x: 0, y: 0.5, w: 1, h: 0.4 });
});

test("a box is told from a pin by its size", () => {
  expect(isBox(box)).toBe(true);
  expect(isBox(pin)).toBe(false);
});

test("moveRegion stops a box at the edges by its own size, and a pin at the edge", () => {
  expect(moveRegion(box, 0.1, -0.5)).toMatchObject({ x: 0.3, y: 0 });
  expect(moveRegion(box, 1, 1)).toMatchObject({ x: 0.6, y: 0.8 }); // x + w = 1, y + h = 1
  expect(moveRegion(pin, 1, 1)).toMatchObject({ x: 1, y: 1 });
  expect(moveRegion(pin, 0.1, 0)).toMatchObject({ x: 0.6 });
});

test("resizeRegion keeps a box between its minimum and the image edge; a pin is unchanged", () => {
  expect(resizeRegion(box, 0.1, 0.1)).toMatchObject({ w: 0.5, h: 0.3 });
  expect(resizeRegion(box, 5, 5)).toMatchObject({ w: 0.8, h: 0.7 });
  expect(resizeRegion(box, -5, -5)).toMatchObject({ w: 0.02, h: 0.02 });
  expect(resizeRegion(pin, 0.3, 0.3)).toBe(pin);
});

test("nextId fills the first gap", () => {
  expect(nextId([])).toBe("r1");
  expect(
    nextId([
      { ...box, id: "r1" },
      { ...box, id: "r3" },
    ]),
  ).toBe("r2");
});
