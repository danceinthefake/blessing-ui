import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import BlessInfiniteCanvas, { blessCanvasKey } from "./BlessInfiniteCanvas.vue";
import { fitRect, toWorld, zoomAt, type CanvasView } from "../composables/canvasView";

test("toWorld inverts the view, and zoomAt keeps the point under the cursor still", () => {
  const v = { x: 40, y: -20, zoom: 2 };
  expect(toWorld(v, 140, 80)).toEqual({ x: 50, y: 50 });
  const z = zoomAt(v, 1.5, 140, 80, 0.25, 4);
  expect(z.zoom).toBe(3);
  expect(toWorld(z, 140, 80)).toEqual({ x: 50, y: 50 });
});

test("zoomAt stops at the limits", () => {
  expect(zoomAt({ x: 0, y: 0, zoom: 3.5 }, 2, 0, 0, 0.25, 4).zoom).toBe(4);
  expect(zoomAt({ x: 0, y: 0, zoom: 0.3 }, 0.1, 0, 0, 0.25, 4).zoom).toBe(0.25);
});

test("fitRect centres a rectangle and takes the tighter axis", () => {
  const v = fitRect({ x: 0, y: 0, width: 200, height: 100 }, 432, 400, 0.25, 4, 16);
  expect(v.zoom).toBe(2); // (432-32)/200
  expect(v.x).toBe(16);
  expect(v.y).toBe((400 - 200) / 2);
});

const mk = (props: Record<string, unknown> = {}) => {
  const w = mount(BlessInfiniteCanvas, {
    props: {
      view: { x: 0, y: 0, zoom: 1 },
      "onUpdate:view": (v: unknown) => w.setProps({ view: v as CanvasView }),
      ...props,
    },
    slots: { default: () => h("div", { class: "node" }, "n") },
    attachTo: document.body,
  });
  return w;
};
const view = (w: ReturnType<typeof mk>) =>
  w.props("view") as { x: number; y: number; zoom: number };
const layer = (w: ReturnType<typeof mk>) => w.find(".bless-canvas__layer").attributes("style");
const fire = async (el: Element, type: string, x = 0, y = 0, extra: object = {}) => {
  el.dispatchEvent(mouse(type, x, y, extra));
  await nextTick();
};
const wheelEv = async (w: ReturnType<typeof mk>, init: WheelEventInit) => {
  w.element.dispatchEvent(new WheelEvent("wheel", { bubbles: true, cancelable: true, ...init }));
  await nextTick();
};
const mouse = (type: string, x = 0, y = 0, extra: object = {}) =>
  Object.assign(new MouseEvent(type, { clientX: x, clientY: y, bubbles: true }), {
    pointerId: 1,
    ...extra,
  });
beforeAll(() => {
  Element.prototype.setPointerCapture = () => {};
});

test("dragging the background pans the view; dragging a node does not", async () => {
  const w = mk();
  const root = w.element;
  await fire(root, "pointerdown", 10, 10);
  await fire(root, "pointermove", 40, 25);
  await fire(root, "pointerup", 40, 25);
  expect(view(w)).toMatchObject({ x: 30, y: 15 });
  expect(layer(w)).toContain("translate(30px, 15px)");
  const node = w.find(".node").element;
  await fire(node, "pointerdown", 0, 0);
  await fire(root, "pointermove", 90, 90);
  expect(view(w)).toMatchObject({ x: 30, y: 15 });
  w.unmount();
});

test("two fingers pinching apart zoom in", async () => {
  const w = mk();
  const root = w.element;
  await fire(root, "pointerdown", 100, 100, { pointerId: 1 });
  await fire(root, "pointerdown", 200, 100, { pointerId: 2 });
  await fire(root, "pointermove", 50, 100, { pointerId: 1 });
  expect(view(w).zoom).toBeGreaterThan(1);
  w.unmount();
});

test("Ctrl+wheel zooms, plain wheel pans, wheelZoom makes plain wheel zoom", async () => {
  const w = mk();
  await wheelEv(w, { ctrlKey: true, deltaY: -100 });
  expect(view(w).zoom).toBeGreaterThan(1);
  const z = view(w).zoom;
  await wheelEv(w, { deltaY: 50, deltaX: 10 });
  expect(view(w)).toMatchObject({ zoom: z, y: expect.any(Number) });
  expect(view(w).y).toBeLessThan(0);
  const w2 = mk({ wheelZoom: true });
  await wheelEv(w2, { deltaY: -100 });
  expect(view(w2).zoom).toBeGreaterThan(1);
  w.unmount();
  w2.unmount();
});

test("keys: arrows pan, +/- zoom, 0 resets, and the change is announced", async () => {
  const w = mk();
  await w.trigger("keydown", { key: "ArrowRight" });
  expect(view(w).x).toBe(-40);
  await w.trigger("keydown", { key: "+" });
  expect(view(w).zoom).toBe(1.25);
  expect(w.find(".bless-canvas__live").text()).toBe("Zoom 125%");
  await w.trigger("keydown", { key: "0" });
  expect(view(w)).toEqual({ x: 0, y: 0, zoom: 1 });
  w.unmount();
});

test("a key pressed inside a node is left to the node", async () => {
  const w = mk();
  await w.find(".node").trigger("keydown", { key: "ArrowRight" });
  expect(view(w).x).toBe(0);
  w.unmount();
});

test("the buttons zoom and reset, with names", async () => {
  const w = mk({ labels: { zoomIn: "Perbesar" } });
  await w.find("[aria-label=Perbesar]").trigger("click");
  expect(view(w).zoom).toBe(1.25);
  await w.find("[aria-label='Reset view']").trigger("click");
  expect(view(w).zoom).toBe(1);
  expect(mk({ controls: false }).find(".bless-canvas__controls").exists()).toBe(false);
  w.unmount();
});

test("children get the view and a toWorld to place things by pointer", () => {
  let ctx: { toWorld: (x: number, y: number) => { x: number; y: number } } | undefined;
  const Child = {
    inject: { c: { from: blessCanvasKey } },
    render() {
      ctx = (this as unknown as { c: typeof ctx }).c;
      return h("i");
    },
  };
  const w = mount(BlessInfiniteCanvas, {
    props: { view: { x: 100, y: 0, zoom: 2 } },
    slots: { default: () => h(Child) },
  });
  expect(ctx!.toWorld(300, 40)).toEqual({ x: 100, y: 20 });
  w.unmount();
});

test("a name, a role and a hint", () => {
  const w = mk({ label: "Plan" });
  expect(w.attributes("aria-label")).toBe("Plan");
  expect(w.attributes("aria-roledescription")).toBe("canvas");
  expect(w.attributes("tabindex")).toBe("0");
  w.unmount();
});
