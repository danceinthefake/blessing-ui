import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessAnnotator from "./BlessAnnotator.vue";
import type { Region } from "../composables/annotate";

let w: VueWrapper;
const mk = (props: Record<string, unknown> = {}) => {
  w = mount(BlessAnnotator, {
    props: {
      src: "/x.png",
      alt: "Floor plan",
      modelValue: [] as Region[],
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as Region[] }),
      "onUpdate:selected": (v: unknown) => w.setProps({ selected: v as string | null }),
      "onUpdate:tool": (v: unknown) => w.setProps({ tool: v as string }),
      ...props,
    },
    attachTo: document.body,
  });
  // a 1000 x 500 image at the page's origin
  (w.find(".bless-annot__stage").element as HTMLElement).getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 1000, height: 500, right: 1000, bottom: 500 }) as DOMRect;
  return w;
};
afterEach(() => w?.unmount());
beforeAll(() => {
  Element.prototype.setPointerCapture = () => {};
});
const regions = () => (w.props() as { modelValue: Region[] }).modelValue;
const marks = () => w.findAll("[data-region]");
const ptr = async (el: Element, type: string, x: number, y: number) => {
  el.dispatchEvent(
    Object.assign(new MouseEvent(type, { clientX: x, clientY: y, bubbles: true }), {
      pointerId: 1,
    }),
  );
  await nextTick();
};
const stage = () => w.find(".bless-annot__stage").element;
const drawBox = async (x1: number, y1: number, x2: number, y2: number) => {
  await ptr(stage(), "pointerdown", x1, y1);
  await ptr(stage(), "pointermove", x2, y2);
  await ptr(stage(), "pointerup", x2, y2);
};
const box = (id = "r1"): Region => ({ id, x: 0.2, y: 0.2, w: 0.4, h: 0.4, label: "Kitchen" });

test("an image with a toolbar, and no marks to start", () => {
  mk();
  expect(w.find("img").attributes("alt")).toBe("Floor plan");
  expect(w.find("[role=toolbar]").exists()).toBe(true);
  expect(marks()).toHaveLength(0);
  expect(w.find(".bless-annot__stage").attributes("aria-label")).toBe("Annotated image");
});

test("dragging on the image draws a box, in fractions of the image, and selects it", async () => {
  mk();
  await drawBox(100, 50, 500, 250);
  expect(regions()).toEqual([{ id: "r1", label: "", x: 0.1, y: 0.1, w: 0.4, h: 0.4 }]);
  expect(w.props("selected" as never)).toBe("r1");
  expect(marks()[0]!.attributes("aria-label")).toBe("Box 1");
  expect(marks()[0]!.attributes("style")).toContain("left: 10%");
  expect(w.find(".bless-annot__live").text()).toBe("Box 1 added");
});

test("a drag that is only a flick draws nothing", async () => {
  mk();
  await drawBox(100, 100, 105, 102);
  expect(regions()).toEqual([]);
});

test("the Pin tool drops a pin where you click", async () => {
  mk({ tool: "pin" });
  await ptr(stage(), "pointerdown", 250, 125);
  expect(regions()[0]).toMatchObject({ x: 0.25, y: 0.25 });
  expect(regions()[0]!.w).toBeUndefined();
  expect(marks()[0]!.attributes("aria-label")).toBe("Pin 1");
});

test("the Select tool draws nothing; clicking empty image clears the selection", async () => {
  mk({ tool: "select", modelValue: [box()], selected: "r1" });
  await drawBox(500, 300, 800, 450);
  expect(regions()).toHaveLength(1);
  expect(w.props("selected" as never)).toBeNull();
});

test("dragging a mark moves it, and it stops at the image edge", async () => {
  mk({ modelValue: [box()] });
  const m = marks()[0]!.element;
  await ptr(m, "pointerdown", 300, 150);
  await ptr(stage(), "pointermove", 400, 150); // +0.1 across
  expect(regions()[0]).toMatchObject({ x: 0.3, y: 0.2 });
  await ptr(stage(), "pointermove", 1000, 150); // far past the edge
  expect(regions()[0]!.x).toBeCloseTo(0.6); // x + w = 1
  await ptr(stage(), "pointerup", 1000, 150);
});

test("the corner handle resizes a selected box", async () => {
  mk({ modelValue: [box()], selected: "r1" });
  const h = w.find(".bless-annot__handle").element;
  await ptr(h, "pointerdown", 600, 300);
  await ptr(stage(), "pointermove", 700, 350);
  expect(regions()[0]).toMatchObject({ w: 0.5, h: 0.5 });
  await ptr(stage(), "pointerup", 700, 350);
});

test("keyboard: arrows move, Alt+arrows resize, Shift is bigger, Delete removes and focus moves on", async () => {
  mk({ modelValue: [box("r1"), box("r2")] });
  const first = marks()[0]!;
  (first.element as HTMLElement).focus();
  await first.trigger("keydown", { key: "ArrowRight" });
  expect(regions()[0]!.x).toBeCloseTo(0.21);
  await first.trigger("keydown", { key: "ArrowDown", shiftKey: true });
  expect(regions()[0]!.y).toBeCloseTo(0.25);
  await first.trigger("keydown", { key: "ArrowRight", altKey: true });
  expect(regions()[0]!.w).toBeCloseTo(0.41);
  expect(w.find(".bless-annot__live").text()).toContain("% down");
  await first.trigger("keydown", { key: "Delete" });
  await nextTick();
  expect(regions().map((r) => r.id)).toEqual(["r2"]);
  expect(document.activeElement).toBe(marks()[0]!.element);
  expect(w.find(".bless-annot__live").text()).toBe("Box 1: Kitchen removed");
});

test("Add at centre works without a pointer, and the name field edits the label", async () => {
  mk();
  await w.findAll("[role=toolbar] button")[3]!.trigger("click"); // Add at centre (box tool)
  await nextTick();
  expect(regions()).toHaveLength(1);
  expect(document.activeElement).toBe(w.find(".bless-annot__input").element);
  await w.find(".bless-annot__input").setValue("Garden");
  expect(regions()[0]!.label).toBe("Garden");
  expect(marks()[0]!.attributes("aria-label")).toBe("Box 1: Garden");
});

test("the list of marks selects and focuses one", async () => {
  mk({ modelValue: [box("r1"), box("r2")] });
  await w.findAll(".bless-annot__item")[1]!.trigger("click");
  await nextTick();
  expect(w.props("selected" as never)).toBe("r2");
  expect(document.activeElement).toBe(marks()[1]!.element);
  expect(marks().filter((m) => m.attributes("tabindex") === "0")).toHaveLength(1);
});

test("read-only shows and selects but never changes anything", async () => {
  mk({ editable: false, modelValue: [box()] });
  expect(w.find("[role=toolbar]").exists()).toBe(false);
  await drawBox(600, 300, 900, 450);
  await ptr(marks()[0]!.element, "pointerdown", 300, 150);
  await ptr(stage(), "pointermove", 500, 150);
  expect(regions()).toEqual([box()]);
  expect(w.props("selected" as never)).toBe("r1");
  await marks()[0]!.trigger("keydown", { key: "Delete" });
  expect(regions()).toHaveLength(1);
});

test("wording can be replaced", async () => {
  mk({
    modelValue: [box()],
    labels: {
      regionName: (k: string, n: number, l: string) =>
        `${k === "box" ? "Kotak" : "Pin"} ${n} ${l}`.trim(),
    },
  });
  expect(marks()[0]!.attributes("aria-label")).toBe("Kotak 1 Kitchen");
});
