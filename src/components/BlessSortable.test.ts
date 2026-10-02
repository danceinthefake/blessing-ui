import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessSortable from "./BlessSortable.vue";
import { moveItem, nearestIndex } from "../composables/useSortable";

const mk = (items = ["a", "b", "c"]) =>
  mount(BlessSortable, {
    props: {
      modelValue: items,
      "onUpdate:modelValue": (v: unknown[]) => w.setProps({ modelValue: v }),
    },
    attachTo: document.body,
  });
let w: VueWrapper;
const order = () => w.findAll(".bless-sortable__body").map((e) => e.text());
const grip = (i: number) => w.findAll(".bless-sortable__grip")[i];

beforeAll(() => {
  Element.prototype.setPointerCapture = () => {};
});
afterEach(() => w?.unmount());
// jsdom has no PointerEvent: a MouseEvent stands in
const ptr = async (el: Element, type: string, x = 0, y = 0) => {
  el.dispatchEvent(new MouseEvent(type, { clientX: x, clientY: y, bubbles: true }));
  await nextTick();
};

test("moveItem and nearestIndex", () => {
  expect(moveItem([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
  const r = (left: number, top: number) => ({ left, top, width: 10, height: 10 }) as DOMRect;
  expect(nearestIndex([r(0, 0), r(20, 0), r(0, 20)], 4, 24)).toBe(2);
});

test("keyboard: grab, move, drop", async () => {
  w = mk();
  await grip(0).trigger("keydown", { key: " " });
  expect(grip(0).attributes("aria-pressed")).toBe("true");
  await grip(0).trigger("keydown", { key: "ArrowDown" });
  await nextTick();
  expect(order()).toEqual(["b", "a", "c"]);
  await grip(1).trigger("keydown", { key: " " });
  expect(grip(1).attributes("aria-pressed")).toBe("false");
  expect(w.find(".bless-sortable__live").text()).toContain("Dropped at position 2 of 3");
});

test("keyboard: Escape restores the order", async () => {
  w = mk();
  await grip(0).trigger("keydown", { key: "Enter" });
  await grip(0).trigger("keydown", { key: "ArrowDown" });
  await grip(1).trigger("keydown", { key: "ArrowDown" });
  expect(order()).toEqual(["b", "c", "a"]);
  await grip(2).trigger("keydown", { key: "Escape" });
  expect(order()).toEqual(["a", "b", "c"]);
});

test("arrows do nothing until an item is grabbed; ends clamp", async () => {
  w = mk();
  await grip(0).trigger("keydown", { key: "ArrowDown" });
  expect(order()).toEqual(["a", "b", "c"]);
  await grip(0).trigger("keydown", { key: " " });
  await grip(0).trigger("keydown", { key: "ArrowUp" });
  expect(order()).toEqual(["a", "b", "c"]);
});

test("pointer drag drops on the nearest item and emits move", async () => {
  w = mk();
  const items = w.findAll("[data-sortable-item]");
  items.forEach((el, i) => {
    el.element.getBoundingClientRect = () =>
      ({ left: 0, top: i * 40, width: 100, height: 30 }) as DOMRect;
  });
  await ptr(grip(0).element, "pointerdown");
  await ptr(grip(0).element, "pointermove", 50, 95);
  expect(items[2].classes()).toContain("bless-sortable__item--after");
  await ptr(grip(0).element, "pointerup");
  expect(order()).toEqual(["b", "c", "a"]);
  expect(w.emitted("move")![0]).toEqual([0, 2]);
});

test("a drag cancelled mid-way changes nothing", async () => {
  w = mk();
  await ptr(grip(0).element, "pointerdown");
  await ptr(grip(0).element, "pointercancel");
  await ptr(grip(0).element, "pointerup");
  expect(order()).toEqual(["a", "b", "c"]);
});
