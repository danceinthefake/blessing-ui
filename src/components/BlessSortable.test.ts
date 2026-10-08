import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
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

describe("group: two lists trade items", () => {
  const rect = (x: number, y: number, w: number, h: number) =>
    ({ left: x, top: y, right: x + w, bottom: y + h, width: w, height: h }) as DOMRect;
  const pair = (a = ["a1", "a2"], b = ["b1"]) => {
    const Host = defineComponent({
      data: () => ({ a, b }),
      render() {
        return h("div", [
          h(BlessSortable, {
            class: "A",
            label: "Todo",
            group: "g",
            modelValue: this.a,
            "onUpdate:modelValue": (v: unknown[]) => (this.a = v as string[]),
          }),
          h(BlessSortable, {
            class: "B",
            label: "Done",
            group: "g",
            modelValue: this.b,
            "onUpdate:modelValue": (v: unknown[]) => (this.b = v as string[]),
          }),
        ]);
      },
    });
    return mount(Host, { attachTo: document.body });
  };
  // list A sits left (x 0-100), list B right (x 200-300); rows are 20 tall
  const layout = (host: VueWrapper) => {
    const place = (cls: string, x: number) => {
      const root = host.find(cls).element as HTMLElement;
      root.getBoundingClientRect = () => rect(x, 0, 100, 200);
      root.querySelectorAll<HTMLElement>("[data-sortable-item]").forEach((el, i) => {
        el.getBoundingClientRect = () => rect(x, i * 20, 100, 20);
      });
    };
    place(".A", 0);
    place(".B", 200);
  };
  const texts = (host: VueWrapper, cls: string) =>
    host.findAll(`${cls} .bless-sortable__body`).map((e) => e.text());

  test("dragging onto the other list moves the item there", async () => {
    const host = pair();
    layout(host);
    const g = host.findAll(".A .bless-sortable__grip")[0]!.element;
    await ptr(g, "pointerdown", 10, 10);
    await ptr(g, "pointermove", 250, 5); // upper half of B's only row: lands before it
    expect(host.find(".B .bless-sortable__item--before").exists()).toBe(true);
    await ptr(g, "pointerup", 250, 5);
    expect(texts(host, ".A")).toEqual(["a2"]);
    expect(texts(host, ".B")).toEqual(["a1", "b1"]);
    host.unmount();
  });

  test("an empty list is a target too", async () => {
    const host = pair(["a1"], []);
    layout(host);
    const g = host.find(".A .bless-sortable__grip").element;
    await ptr(g, "pointerdown", 10, 10);
    await ptr(g, "pointermove", 250, 100);
    expect(host.find(".B").classes()).toContain("bless-sortable--receiving");
    await ptr(g, "pointerup", 250, 100);
    expect(texts(host, ".A")).toEqual([]);
    expect(texts(host, ".B")).toEqual(["a1"]);
    host.unmount();
  });

  test("Alt+→ sends the held item on, Esc puts every list back", async () => {
    const host = pair();
    const grip = host.findAll(".A .bless-sortable__grip")[1]!;
    await grip.trigger("keydown", { key: " " });
    await grip.trigger("keydown", { key: "ArrowRight", altKey: true });
    await nextTick();
    expect(texts(host, ".A")).toEqual(["a1"]);
    expect(texts(host, ".B")).toEqual(["b1", "a2"]);
    expect(host.find(".B .bless-sortable__live").text()).toBe("Moved to Done, position 2 of 2");
    await host.findAll(".B .bless-sortable__grip")[1]!.trigger("keydown", { key: "Escape" });
    expect(texts(host, ".A")).toEqual(["a1", "a2"]);
    expect(texts(host, ".B")).toEqual(["b1"]);
    host.unmount();
  });
});

test("a grip held near the bottom of the window scrolls the page, and letting go stops it", async () => {
  let frame: FrameRequestCallback = () => {};
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => ((frame = cb), 7));
  const cancel = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  const by = vi.spyOn(window, "scrollBy").mockImplementation(() => {});
  w = mk();
  const g = grip(0)!.element;
  await ptr(g, "pointerdown", 10, 10);
  await ptr(g, "pointermove", 10, window.innerHeight - 4);
  frame(0);
  expect(by).toHaveBeenCalled();
  expect(by.mock.calls[0]![1]).toBeGreaterThan(0); // downward
  cancel.mockClear();
  await ptr(g, "pointerup", 10, window.innerHeight - 4);
  expect(cancel).toHaveBeenCalled();
  vi.restoreAllMocks();
});
