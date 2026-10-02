import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessHotspots from "./BlessHotspots.vue";
import { stubPopover } from "../test/popover";

beforeAll(() => {
  stubPopover();
  Element.prototype.setPointerCapture = () => {};
});

const spots = () => [
  { id: "a", x: 10, y: 20, label: "Engine" },
  { id: "b", x: 60, y: 50, label: "Wheel" },
];
let w: VueWrapper<any>;
const mk = (props = {}) => {
  w = mount(BlessHotspots, {
    props: {
      modelValue: spots(),
      active: null,
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v }),
      "onUpdate:active": (v: unknown) => w.setProps({ active: v }),
      src: "x.png",
      alt: "Car",
      ...props,
    },
    slots: { spot: '<template #spot="{ spot }">About {{ spot.label }}</template>' },
    attachTo: document.body,
  });
  // a 200 x 100 stage at the origin
  w.element.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100 }) as DOMRect;
  return w;
};
afterEach(() => w?.unmount());
const pin = (i: number) => w.findAll(".bless-hotspots__pin")[i];
const mouse = (el: Element, type: string, x = 0, y = 0) => {
  el.dispatchEvent(new MouseEvent(type, { clientX: x, clientY: y, bubbles: true }));
  return nextTick();
};

test("pins are numbered, named, and placed in percent", () => {
  mk();
  expect(pin(0).text()).toBe("1");
  expect(pin(1).attributes("aria-label")).toBe("Wheel");
  expect(w.findAll(".bless-hotspots__spot")[0].attributes("style")).toContain("left: 10%");
  expect(w.find("img").attributes("alt")).toBe("Car");
});

test("clicking a pin opens its popover with the slot content; another pin replaces it", async () => {
  mk();
  await pin(0).trigger("click");
  expect(w.props("active")).toBe("a");
  await nextTick();
  expect(w.find(".bless-popover[data-open]").text()).toBe("About Engine");
  await pin(1).trigger("click");
  expect(w.props("active")).toBe("b");
  await pin(1).trigger("click");
  expect(w.props("active")).toBe(null);
});

test("read-only: the stage does not add, keys do not move or remove", async () => {
  mk();
  await mouse(w.element, "click", 100, 50);
  await pin(0).trigger("keydown", { key: "ArrowRight" });
  await pin(0).trigger("keydown", { key: "Delete" });
  expect(w.props("modelValue")).toEqual(spots());
});

test("editable: clicking the stage adds a pin there and opens it", async () => {
  mk({ editable: true });
  await w.element.dispatchEvent(
    new MouseEvent("click", { clientX: 100, clientY: 25, bubbles: true }),
  );
  await nextTick();
  const v = w.props("modelValue") as { id: string; x: number; y: number; label: string }[];
  expect(v).toHaveLength(3);
  expect(v[2]).toMatchObject({ x: 50, y: 25, label: "Spot 3" });
  expect(w.props("active")).toBe(v[2].id);
  expect(w.emitted("add")![0][0]).toEqual(v[2]);
});

test("editable: clicking a pin does not add another", async () => {
  mk({ editable: true });
  await pin(0).trigger("click");
  expect(w.props("modelValue")).toHaveLength(2);
});

test("editable: dragging a pin moves it and the click that ends the drag is ignored", async () => {
  mk({ editable: true });
  const el = pin(0).element;
  await mouse(el, "pointerdown", 20, 20);
  await mouse(el, "pointermove", 22, 20); // under the threshold
  expect((w.props("modelValue") as { x: number }[])[0].x).toBe(10);
  await mouse(el, "pointermove", 100, 50);
  await mouse(el, "pointerup", 100, 50);
  expect(w.props("modelValue")[0]).toMatchObject({ x: 50, y: 50 });
  await pin(0).trigger("click"); // the click after a drag
  expect(w.props("active")).toBe(null);
  await pin(0).trigger("click"); // a real click
  expect(w.props("active")).toBe("a");
});

test("editable: arrows nudge (Shift by 5), Delete removes and emits", async () => {
  mk({ editable: true });
  await pin(0).trigger("keydown", { key: "ArrowRight" });
  await pin(0).trigger("keydown", { key: "ArrowUp", shiftKey: true });
  expect(w.props("modelValue")[0]).toMatchObject({ x: 11, y: 15 });
  await pin(0).trigger("keydown", { key: "ArrowLeft", shiftKey: true });
  await pin(0).trigger("keydown", { key: "ArrowLeft", shiftKey: true });
  expect(w.props("modelValue")[0].x).toBe(1); // clamped at 0 would be -4
  await pin(1).trigger("keydown", { key: "Delete" });
  expect((w.props("modelValue") as unknown[]).length).toBe(1);
  expect(w.emitted("remove")![0][0]).toMatchObject({ id: "b" });
});
