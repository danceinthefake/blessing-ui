import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessRadialMenu from "./BlessRadialMenu.vue";
import { keepInside, polar, sectorAt } from "../composables/radial";
import { stubPopover } from "../test/popover";

test("polar lays items out clockwise from the top", () => {
  expect(polar(0, 4, 100)).toEqual({ x: 0, y: -100 });
  expect(polar(1, 4, 100)).toEqual({ x: 100, y: 0 });
  expect(polar(2, 4, 100)).toEqual({ x: 0, y: 100 });
  expect(polar(3, 4, 100)).toEqual({ x: -100, y: 0 });
});

test("sectorAt: dead centre aims at nothing; each item owns the wedge around it", () => {
  expect(sectorAt(5, 5, 4)).toBeNull();
  expect(sectorAt(0, -80, 4)).toBe(0);
  expect(sectorAt(80, 5, 4)).toBe(1);
  expect(sectorAt(-3, 80, 4)).toBe(2);
  expect(sectorAt(-80, -10, 4)).toBe(3);
  expect(sectorAt(10, -80, 6)).toBe(0); // slightly right of up, still the top wedge of six
  expect(sectorAt(0, 0, 0)).toBeNull();
});

test("keepInside pushes the centre away from the screen edge", () => {
  expect(keepInside(5, 5, 60, 800, 600)).toEqual({ x: 68, y: 68 });
  expect(keepInside(790, 590, 60, 800, 600)).toEqual({ x: 732, y: 532 });
  expect(keepInside(400, 300, 60, 800, 600)).toEqual({ x: 400, y: 300 });
});

beforeAll(stubPopover);
const items = [
  { id: "a", label: "Reply", icon: "↩" },
  { id: "b", label: "Forward", icon: "→" },
  { id: "c", label: "Delete", icon: "✕", disabled: true },
  { id: "d", label: "Archive", icon: "▤" },
];
let w: VueWrapper<any>;
const mk = (props = {}) =>
  (w = mount(BlessRadialMenu, {
    props: {
      items,
      open: false,
      "onUpdate:open": (v: boolean) => w.setProps({ open: v }),
      ...props,
    },
    slots: { default: '<p class="target">Message</p>' },
    attachTo: document.body,
  }));
afterEach(() => {
  w?.unmount();
  vi.useRealTimers();
});
const panel = () => w.find(".bless-radial");
const btns = () => w.findAll('[role="menuitem"]');
const tick = async () => {
  await nextTick();
  await nextTick();
};
const ctx = async (x = 300, y = 200) => {
  w.find(".bless-radial__area").element.dispatchEvent(
    new MouseEvent("contextmenu", { clientX: x, clientY: y, bubbles: true, cancelable: true }),
  );
  await tick();
};

test("right-click opens the menu centred on the pointer, with the native menu suppressed", async () => {
  mk();
  const ev = new MouseEvent("contextmenu", {
    clientX: 300,
    clientY: 200,
    bubbles: true,
    cancelable: true,
  });
  w.find(".bless-radial__area").element.dispatchEvent(ev);
  await tick();
  expect(ev.defaultPrevented).toBe(true);
  expect(w.props("open")).toBe(true);
  expect(panel().attributes("data-open")).toBeDefined();
  // 84 + 22 = 106 half-size: centre (300, 200) -> left/top 194 / 94
  expect(panel().attributes("style")).toContain("left: 194px");
  expect(panel().attributes("style")).toContain("top: 94px");
  expect(btns()).toHaveLength(4);
  expect(panel().attributes("role")).toBe("menu");
});

test("near the screen edge the menu is pulled back inside", async () => {
  mk();
  await ctx(2, 2);
  expect(panel().attributes("style")).toContain("left: 8px"); // centre 114 - 106
});

test("keyboard: focus lands on the first item, arrows skip disabled ones and wrap, Enter selects", async () => {
  mk();
  await ctx();
  expect(document.activeElement).toBe(btns()[0].element);
  await panel().trigger("keydown", { key: "ArrowRight" });
  await tick();
  expect(document.activeElement).toBe(btns()[1].element);
  await panel().trigger("keydown", { key: "ArrowRight" }); // skips the disabled Delete
  await tick();
  expect(document.activeElement).toBe(btns()[3].element);
  await panel().trigger("keydown", { key: "ArrowRight" });
  await tick();
  expect(document.activeElement).toBe(btns()[0].element);
  await panel().trigger("keydown", { key: "ArrowLeft" });
  await tick();
  expect(document.activeElement).toBe(btns()[3].element);
  await btns()[3].trigger("click"); // Enter on a button is a click
  expect(w.emitted("select")![0][0]).toMatchObject({ id: "d" });
  expect(w.props("open")).toBe(false);
});

test("Escape closes without selecting; a disabled item cannot be picked", async () => {
  mk();
  await ctx();
  await btns()[2].trigger("click");
  expect(w.emitted("select")).toBeUndefined();
  expect(w.props("open")).toBe(true);
  await panel().trigger("keydown", { key: "Escape" });
  expect(w.props("open")).toBe(false);
});

test("the menu key and Shift+F10 open it at the focused element", async () => {
  mk();
  const target = w.find(".target");
  target.element.getBoundingClientRect = () =>
    ({ left: 100, top: 100, width: 200, height: 40 }) as DOMRect;
  await target.trigger("keydown", { key: "ContextMenu" });
  await tick();
  expect(w.props("open")).toBe(true);
  expect(panel().attributes("style")).toContain("left: 94px"); // 200 - 106
  await panel().trigger("keydown", { key: "Escape" });
  await target.trigger("keydown", { key: "F10", shiftKey: true });
  await tick();
  expect(w.props("open")).toBe(true);
});

const touch = (el: Element, type: string, x: number, y: number) => {
  const e = new MouseEvent(type, { clientX: x, clientY: y, bubbles: true });
  Object.defineProperty(e, "pointerType", { value: "touch" });
  el.dispatchEvent(e);
};

test("touch: hold opens, slide to a wedge and let go picks it; moving early cancels the hold", async () => {
  vi.useFakeTimers();
  mk();
  const area = w.find(".bless-radial__area").element;
  touch(area, "pointerdown", 300, 200);
  await vi.advanceTimersByTimeAsync(460);
  await nextTick();
  expect(w.props("open")).toBe(true);
  // slide right: wedge 1 (Forward), then release anywhere
  window.dispatchEvent(
    Object.assign(new MouseEvent("pointermove", { clientX: 380, clientY: 202 })),
  );
  await nextTick();
  expect(btns()[1].classes()).toContain("bless-radial__item--on");
  expect(w.find(".bless-radial__core").text()).toBe("Forward");
  window.dispatchEvent(new MouseEvent("pointerup", { clientX: 380, clientY: 202 }));
  await nextTick();
  expect(w.emitted("select")![0][0]).toMatchObject({ id: "b" });
  expect(w.props("open")).toBe(false);

  touch(area, "pointerdown", 300, 200);
  touch(area, "pointermove", 330, 200); // a drag: not a hold
  await vi.advanceTimersByTimeAsync(600);
  expect(w.props("open")).toBe(false);
});

test("touch: a cancelled pointer (the browser took over) counts as letting go", async () => {
  vi.useFakeTimers();
  mk();
  touch(w.find(".bless-radial__area").element, "pointerdown", 300, 200);
  await vi.advanceTimersByTimeAsync(460);
  await nextTick();
  window.dispatchEvent(new MouseEvent("pointermove", { clientX: 300, clientY: 120 })); // straight up: Reply
  await nextTick();
  window.dispatchEvent(new MouseEvent("pointercancel"));
  await nextTick();
  expect(w.emitted("select")![0][0]).toMatchObject({ id: "a" });
  expect(w.props("open")).toBe(false);
});

test("a mouse press does not start the hold; disabled never opens", async () => {
  vi.useFakeTimers();
  mk();
  const down = new MouseEvent("pointerdown", { clientX: 5, clientY: 5, bubbles: true });
  Object.defineProperty(down, "pointerType", { value: "mouse" });
  w.find(".bless-radial__area").element.dispatchEvent(down);
  await vi.advanceTimersByTimeAsync(600);
  expect(w.props("open")).toBe(false);
  w.unmount();
  mk({ disabled: true });
  await ctx();
  expect(w.props("open")).toBe(false);
});
