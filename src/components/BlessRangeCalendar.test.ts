import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessRangeCalendar from "./BlessRangeCalendar.vue";

let w: VueWrapper;
const mk = (props: Record<string, unknown> = {}) => {
  w = mount(BlessRangeCalendar, {
    props: {
      month: "2026-05",
      modelValue: [] as string[],
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as string[] }),
      ...props,
    },
    attachTo: document.body,
  });
  return w;
};
afterEach(() => {
  w?.unmount();
  vi.restoreAllMocks();
});
beforeAll(() => {
  Element.prototype.setPointerCapture = () => {};
});
const day = (n: number) => w.find(`[data-day="2026-05-${String(n).padStart(2, "0")}"]`);
const model = () => (w.props() as { modelValue: string[] }).modelValue;
const ptr = async (el: Element, type: string) => {
  el.dispatchEvent(Object.assign(new MouseEvent(type, { bubbles: true }), { pointerId: 1 }));
  await nextTick();
};
/** drag from one day to another: the pointer is "over" the target when it moves */
const paintDrag = async (a: number, b: number) => {
  document.elementFromPoint = () => day(b).element;
  await ptr(day(a).element, "pointerdown");
  await ptr(day(b).element, "pointermove");
  await ptr(day(b).element, "pointerup");
};

test("a month of days in a labelled grid, Monday first, with blanks before the 1st", () => {
  mk();
  expect(w.findAll("[data-day]")).toHaveLength(31);
  expect(w.find("[role=grid]").exists()).toBe(true);
  expect(w.find(".bless-range__title").text()).toBe("May 2026");
  expect(w.findAll(".bless-range__head")[0]!.text()).toBe("Mon");
  // 1 May 2026 is a Friday: four blanks in the first row
  expect(w.findAll(".bless-range__row")[1]!.findAll(".bless-range__gap")).toHaveLength(4);
  expect(day(1).attributes("aria-label")).toBe("Friday, May 1, 2026");
});

test("a click toggles one day", async () => {
  mk();
  await ptr(day(12).element, "pointerdown");
  await ptr(day(12).element, "pointerup");
  expect(model()).toEqual(["2026-05-12"]);
  expect(day(12).attributes("aria-selected")).toBe("true");
  await ptr(day(12).element, "pointerdown");
  await ptr(day(12).element, "pointerup");
  expect(model()).toEqual([]);
});

test("dragging across days adds the whole stretch, and previews it first", async () => {
  mk();
  document.elementFromPoint = () => day(8).element;
  await ptr(day(5).element, "pointerdown");
  await ptr(day(8).element, "pointermove");
  expect(day(6).classes()).toContain("bless-range__day--set");
  expect(model()).toEqual([]); // nothing committed until release
  await ptr(day(8).element, "pointerup");
  expect(model()).toEqual(["2026-05-05", "2026-05-06", "2026-05-07", "2026-05-08"]);
  expect(w.emitted("change")!.at(-1)![0]).toEqual([
    { start: "2026-05-05", end: "2026-05-08", count: 4 },
  ]);
});

test("a drag that starts on a chosen day clears instead; separate drags make separate blocks", async () => {
  mk({ modelValue: ["2026-05-05", "2026-05-06", "2026-05-07", "2026-05-08"] });
  await paintDrag(6, 7);
  expect(model()).toEqual(["2026-05-05", "2026-05-08"]);
  await paintDrag(20, 21);
  expect(model()).toEqual(["2026-05-05", "2026-05-08", "2026-05-20", "2026-05-21"]);
  expect(w.find(".bless-range__summary").text()).toBe("4 days in 3 blocks");
});

test("days outside min / max / disabledDates cannot be painted", async () => {
  mk({ min: "2026-05-10", disabledDates: (d: string) => d === "2026-05-12" });
  expect(day(9).attributes("aria-disabled")).toBe("true");
  await paintDrag(9, 13); // starts on a disabled day: nothing happens
  expect(model()).toEqual([]);
  await paintDrag(10, 13); // crosses a disabled day: it is skipped
  expect(model()).toEqual(["2026-05-10", "2026-05-11", "2026-05-13"]);
});

test("keyboard: Space toggles the focused day; arrows move; Shift+arrows paint", async () => {
  mk();
  (day(10).element as HTMLElement).focus();
  await day(10).trigger("keydown", { key: " " });
  expect(model()).toEqual(["2026-05-10"]);
  await day(10).trigger("keydown", { key: "ArrowRight" });
  await nextTick();
  expect(document.activeElement).toBe(day(11).element);
  await day(11).trigger("keydown", { key: "ArrowDown", shiftKey: true }); // paints 11 and the day a week on
  await nextTick();
  expect(model()).toEqual(["2026-05-10", "2026-05-11", "2026-05-18"]);
  expect(document.activeElement).toBe(day(18).element);
});

test("Shift+arrow starting on a chosen day clears as it goes", async () => {
  mk({ modelValue: ["2026-05-10", "2026-05-11", "2026-05-12"] });
  await day(10).trigger("keydown", { key: "ArrowRight", shiftKey: true });
  await nextTick();
  await day(11).trigger("keydown", { key: "ArrowRight", shiftKey: true });
  await nextTick();
  expect(model()).toEqual([]);
});

test("Page Down opens the next month and focuses the same day", async () => {
  mk();
  (day(14).element as HTMLElement).focus();
  await day(14).trigger("keydown", { key: "PageDown" });
  await nextTick();
  expect(w.find(".bless-range__title").text()).toBe("June 2026");
  expect(document.activeElement?.getAttribute("data-day")).toBe("2026-06-14");
});

test("the month buttons move the month; one day is a tab stop", async () => {
  mk();
  await w.find("[aria-label='Next month']").trigger("click");
  expect(w.find(".bless-range__title").text()).toBe("June 2026");
  expect(w.findAll("[data-day]").filter((d) => d.attributes("tabindex") === "0")).toHaveLength(1);
});

test("Clear all empties it; the summary and the wording can be replaced", async () => {
  mk({
    modelValue: ["2026-05-01", "2026-05-02"],
    labels: { summary: (d: number, b: number) => `${d} hari, ${b} blok`, clear: "Hapus semua" },
  });
  expect(w.find(".bless-range__summary").text()).toBe("2 hari, 1 blok");
  await w.findAll(".bless-range__foot button")[0]!.trigger("click");
  expect(model()).toEqual([]);
});
