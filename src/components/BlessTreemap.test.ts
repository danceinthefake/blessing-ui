import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessTreemap from "./BlessTreemap.vue";
import type { TreemapNode } from "../composables/treemap";

const data: TreemapNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "ui", label: "ui", value: 60 },
      { id: "lib", label: "lib", value: 30 },
    ],
  },
  { id: "docs", label: "docs", value: 25 },
  { id: "tests", label: "tests", value: 15 },
  { id: "empty", label: "empty", value: 0 },
];
let w: VueWrapper;
const mk = (props: Record<string, unknown> = {}) => {
  w = mount(BlessTreemap, {
    props: {
      data,
      "onUpdate:path": (v: unknown) => w.setProps({ path: v as string[] }),
      ...props,
    },
    attachTo: document.body,
  });
  return w;
};
afterEach(() => w?.unmount());
const tiles = () => w.findAll(".bless-treemap__tile");
const names = () => tiles().map((t) => t.attributes("aria-label")!.split(",")[0]);

test("a tile per node with a size, none for a zero, each named with its share", () => {
  mk({ format: (v: number) => `${v} MB` });
  expect(names().sort()).toEqual(["docs", "src", "tests"]);
  const src = tiles().find((t) => t.attributes("aria-label")!.startsWith("src"))!;
  expect(src.attributes("aria-label")).toBe("src, 90 MB, 69%, contains 2 items, Enter opens");
  const tests = tiles().find((t) => t.attributes("aria-label")!.startsWith("tests"))!;
  expect(tests.attributes("aria-label")).toBe("tests, 15 MB, 12%");
});

test("tile areas follow the values", () => {
  mk({ height: 300 });
  const area = (label: string) => {
    const el = tiles().find((t) => t.attributes("aria-label")!.startsWith(label))!
      .element as HTMLElement;
    return parseFloat(el.style.width) * parseFloat(el.style.height);
  };
  expect(area("src") / area("docs")).toBeCloseTo(90 / 25, 1);
});

test("Enter on a group drills in, the path shows, and a crumb or Backspace goes back", async () => {
  mk();
  const src = tiles().find((t) => t.attributes("aria-label")!.startsWith("src"))!;
  await src.trigger("click");
  await nextTick();
  expect(w.props("path" as never)).toEqual(["src"]);
  expect(names().sort()).toEqual(["lib", "ui"]);
  expect(w.find(".bless-treemap__here").text()).toBe("src");
  expect(w.emitted("select")).toHaveLength(1);

  await tiles()[0]!.trigger("keydown", { key: "Backspace" });
  await nextTick();
  expect(w.props("path" as never)).toEqual([]);
  expect(w.find(".bless-treemap__path").exists()).toBe(false);

  await src.trigger("click");
  await nextTick();
  await w.find(".bless-treemap__crumb").trigger("click");
  await nextTick();
  expect(w.props("path" as never)).toEqual([]);
});

test("a leaf only selects; it does not change the path", async () => {
  mk();
  await tiles()
    .find((t) => t.attributes("aria-label")!.startsWith("docs"))!
    .trigger("click");
  expect(w.emitted("update:path")).toBeUndefined();
  expect(w.emitted("select")![0]![1]).toEqual(["docs"]);
});

test("one tile is in the tab order; arrow keys move to the neighbour that way", async () => {
  mk({ height: 200 });
  expect(tiles().filter((t) => t.attributes("tabindex") === "0")).toHaveLength(1);
  const first = tiles()[0]!;
  const rect = (el: Element) => ({
    x: parseFloat((el as HTMLElement).style.left),
    y: parseFloat((el as HTMLElement).style.top),
  });
  const here = rect(first.element);
  // move in whichever direction has a neighbour, and land on a tile that lies that way
  await first.trigger("keydown", { key: "ArrowRight" });
  await first.trigger("keydown", { key: "ArrowDown" });
  await nextTick();
  const moved = document.activeElement as HTMLElement;
  expect(moved.classList.contains("bless-treemap__tile")).toBe(true);
  const there = rect(moved);
  expect(there.x > here.x || there.y > here.y).toBe(true);
});

test("colours: a child keeps the colour of the top-level node it sits under", async () => {
  mk();
  const color = (el: Element) => (el as HTMLElement).style.getPropertyValue("--_c");
  const top = color(tiles().find((t) => t.attributes("aria-label")!.startsWith("src"))!.element);
  await tiles()
    .find((t) => t.attributes("aria-label")!.startsWith("src"))!
    .trigger("click");
  await nextTick();
  expect(tiles().every((t) => color(t.element) === top)).toBe(true);
});

test("labels translate the tile names", () => {
  mk({
    labels: { tile: (l: string, v: string, s: string) => `${l}: ${v} (${s})` },
  });
  expect(tiles().some((t) => t.attributes("aria-label") === "docs: 25 (19%)")).toBe(true);
});

test("a path to a node that is gone falls back to the top", () => {
  mk({ path: ["missing"] });
  expect(names().sort()).toEqual(["docs", "src", "tests"]);
});
