import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessDock, { magnify } from "./BlessDock.vue";

const items = [
  { id: "mail", label: "Mail", icon: "✉", badge: 3 },
  { id: "docs", label: "Docs", icon: "▤", href: "/docs" },
  { id: "chat", label: "Chat", icon: "☻" },
  { id: "off", label: "Off", icon: "∅", disabled: true },
];
let w: VueWrapper;
const mk = (props: Record<string, unknown> = {}) => {
  w = mount(BlessDock, { props: { items, ...props }, attachTo: document.body });
  return w;
};
afterEach(() => {
  w?.unmount();
  vi.restoreAllMocks();
});
const els = () => w.findAll(".bless-dock__item");
const focus = (i: number) => (els()[i]!.element as HTMLElement).focus();
const move = async (x: number, y = 0) => {
  w.element.dispatchEvent(new MouseEvent("pointermove", { clientX: x, clientY: y, bubbles: true }));
  await nextTick();
};
// four 40px items in a row, centres at 20, 60, 100, 140
const layout = (vertical = false) =>
  els().forEach((e, i) => {
    e.element.getBoundingClientRect = () =>
      (vertical
        ? { left: 0, width: 40, top: i * 40, height: 40 }
        : { top: 0, height: 40, left: i * 40, width: 40 }) as DOMRect;
  });
const mm = (reduce: boolean) =>
  (window.matchMedia = ((q: string) => ({
    matches: reduce && /reduce/.test(q),
    media: q,
  })) as never);
const scale = (i: number) =>
  +(
    els()
      [i]!.attributes("style")!
      .match(/--_s: ([\d.]+)/)?.[1] ?? 1
  );

test("magnify: biggest at the pointer, 1 beyond the radius, falling in between", () => {
  expect(magnify(0, 100, 2)).toBe(2);
  expect(magnify(100, 100, 2)).toBe(1);
  expect(magnify(-300, 100, 2)).toBe(1);
  expect(magnify(25, 100, 2)).toBeGreaterThan(magnify(75, 100, 2));
  expect(magnify(50, 100, 2)).toBeCloseTo(1.5);
});

test("a toolbar of named items: links for hrefs, buttons for the rest, a badge, one tab stop", () => {
  mk();
  expect(w.attributes("role")).toBe("toolbar");
  expect(els().map((e) => e.attributes("aria-label"))).toEqual(["Mail", "Docs", "Chat", "Off"]);
  expect(els()[1]!.element.tagName).toBe("A");
  expect(els()[0]!.element.tagName).toBe("BUTTON");
  expect(w.find(".bless-dock__badge").text()).toBe("3");
  expect(els().filter((e) => e.attributes("tabindex") === "0")).toHaveLength(1);
  expect(els()[3]!.attributes("disabled")).toBeDefined();
});

test("arrow keys move focus along the dock, wrap, and Home / End jump", async () => {
  mk();
  focus(0);
  await els()[0]!.trigger("keydown", { key: "ArrowRight" });
  expect(document.activeElement).toBe(els()[1]!.element);
  await els()[1]!.trigger("keydown", { key: "End" }); // the last item is disabled: skipped
  expect(document.activeElement).toBe(els()[2]!.element);
  await els()[2]!.trigger("keydown", { key: "ArrowRight" });
  expect(document.activeElement).toBe(els()[0]!.element);
  await els()[0]!.trigger("keydown", { key: "ArrowLeft" });
  expect(document.activeElement).toBe(els()[2]!.element);
  await els()[2]!.trigger("keydown", { key: "ArrowUp" }); // wrong axis: ignored
  expect(document.activeElement).toBe(els()[2]!.element);
});

test("a side dock is navigated with up and down, and says so", async () => {
  mk({ position: "left" });
  expect(w.attributes("aria-orientation")).toBe("vertical");
  focus(0);
  await els()[0]!.trigger("keydown", { key: "ArrowDown" });
  expect(document.activeElement).toBe(els()[1]!.element);
});

test("the tab stop follows focus", async () => {
  mk();
  focus(2);
  await els()[2]!.trigger("focusin");
  await nextTick();
  expect(els()[2]!.attributes("tabindex")).toBe("0");
  expect(els()[0]!.attributes("tabindex")).toBe("-1");
});

test("clicking selects, except a disabled item", async () => {
  mk();
  await els()[0]!.trigger("click");
  await els()[3]!.trigger("click");
  expect(w.emitted("select")).toHaveLength(1);
  expect((w.emitted("select")![0] as unknown[])[0]).toMatchObject({ id: "mail" });
});

test("the pointer grows the nearest icons and leaving calms them", async () => {
  mm(false);
  mk({ magnification: 2, radius: 80 });
  layout();
  await move(60); // on the second item's centre
  expect(scale(1)).toBe(2);
  expect(scale(0)).toBeLessThan(2);
  expect(scale(0)).toBeGreaterThan(1);
  expect(scale(3)).toBe(1); // 80px away: out of reach
  await w.trigger("pointerleave");
  expect(scale(1)).toBe(1);
});

test("a side dock measures along the vertical axis", async () => {
  mm(false);
  mk({ position: "right", magnification: 2, radius: 80 });
  layout(true);
  await move(0, 100); // third item's centre
  expect(scale(2)).toBe(2);
});

test("no growth with magnification 1, under reduced motion, or for touch", async () => {
  mm(false);
  mk({ magnification: 1 });
  layout();
  await move(60);
  expect(scale(1)).toBe(1);
  w.unmount();
  mm(true);
  mk({ magnification: 2 });
  layout();
  await move(60);
  expect(scale(1)).toBe(1);
  w.unmount();
  mm(false);
  mk({ magnification: 2 });
  layout();
  const e = new MouseEvent("pointermove", { clientX: 60, bubbles: true });
  Object.defineProperty(e, "pointerType", { value: "touch" });
  w.element.dispatchEvent(e);
  await nextTick();
  expect(scale(1)).toBe(1);
});
