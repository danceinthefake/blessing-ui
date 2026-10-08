import { edgeKey, edgePath, linkProblem, reaches, snapTo } from "./graph";

const e = (from: string, to: string) => ({ from, to });

test("reaches follows edges forward only", () => {
  const edges = [e("a", "b"), e("b", "c")];
  expect(reaches(edges, "a", "c")).toBe(true);
  expect(reaches(edges, "c", "a")).toBe(false);
  expect(reaches([e("a", "b"), e("b", "a")], "a", "z")).toBe(false); // loops end
});

test("linkProblem: self, duplicate, and (when asked) a loop", () => {
  const edges = [e("a", "b"), e("b", "c")];
  expect(linkProblem(edges, "a", "a")).toBe("self");
  expect(linkProblem(edges, "a", "b")).toBe("exists");
  expect(linkProblem(edges, "c", "a")).toBeNull();
  expect(linkProblem(edges, "c", "a", true)).toBe("cycle");
  expect(linkProblem(edges, "a", "c", true)).toBeNull();
});

test("edgePath leaves rightward and arrives rightward, and edgeKey names it", () => {
  expect(edgePath({ x: 0, y: 0 }, { x: 200, y: 100 })).toBe("M0 0C100 0 100 100 200 100");
  expect(edgePath({ x: 0, y: 0 }, { x: 10, y: 0 })).toBe("M0 0C48 0 -38 0 10 0"); // short links still bow out
  expect(edgeKey(e("a", "b"))).toBe("a->b");
});

test("snapTo rounds to the grid and 0 leaves the value alone", () => {
  expect(snapTo(13, 8)).toBe(16);
  expect(snapTo(13, 0)).toBe(13);
});
