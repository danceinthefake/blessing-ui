import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import BlessCalendar from "./BlessCalendar.vue";
import BlessDatePicker from "./BlessDatePicker.vue";
import BlessInputOTP from "./BlessInputOTP.vue";
import { stubPopover } from "../test/popover";

beforeAll(() => {
  stubPopover();
  window.matchMedia = () =>
    ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }) as unknown as MediaQueryList;
  globalThis.requestAnimationFrame = (fn: FrameRequestCallback) => (fn(0), 0);
});

test("BlessCalendar renders month, selects, keyboard moves and wraps months, min disables", async () => {
  const w = mount(BlessCalendar, {
    props: { modelValue: "2019-09-25", min: "2019-09-10", locale: "en-US" },
    attachTo: document.body,
  });
  expect(w.find(".bless-calendar__month").text()).toBe("September 2019");
  expect(w.findAll('[role="gridcell"]')).toHaveLength(42);
  const sel = w.find(".bless-calendar__day--selected");
  expect(sel.text()).toBe("25");
  expect(sel.attributes("tabindex")).toBe("0");
  expect(w.findAll('[role="gridcell"]:disabled').length).toBeGreaterThan(0);

  const grid = w.find('[role="grid"]');
  (sel.element as HTMLElement).focus();
  await grid.trigger("keydown", { key: "ArrowRight" });
  expect(document.activeElement?.textContent?.trim()).toBe("26");
  await grid.trigger("keydown", { key: "ArrowDown" });
  expect(w.find(".bless-calendar__month").text()).toBe("October 2019"); // wrapped
  await grid.trigger("keydown", { key: "Enter" });
  expect(w.emitted("update:modelValue")![0]).toEqual(["2019-10-03"]);
  await w.find(".bless-calendar__nav").trigger("click");
  expect(w.find(".bless-calendar__month").text()).toBe("September 2019");
  w.unmount();
});

test("BlessCalendar range: two clicks emit ordered pair", async () => {
  const w = mount(BlessCalendar, { props: { range: true, month: "2019-09", locale: "en-US" } });
  const day = (n: string) =>
    w
      .findAll('[role="gridcell"]')
      .find((c) => !c.classes("bless-calendar__day--outside") && c.text() === n)!;
  await day("20").trigger("click");
  expect(w.emitted("update:modelValue")).toBeUndefined();
  await day("5").trigger("click");
  expect(w.emitted("update:modelValue")![0]).toEqual([["2019-09-05", "2019-09-20"]]);
});

test("BlessDatePicker shows formatted value, opens popover, clears", async () => {
  const w = mount(BlessDatePicker, {
    props: { modelValue: "2019-09-25", locale: "en-US" },
    attachTo: document.body,
  });
  expect(w.find(".bless-datepicker__text").text()).toBe("Sep 25, 2019");
  await w.find(".bless-datepicker__trigger").trigger("click");
  await nextTick();
  await nextTick();
  expect(w.find(".bless-datepicker__panel").attributes("data-open")).toBeDefined();
  await w.find(".bless-datepicker__clear").trigger("click");
  expect(w.emitted("update:modelValue")![0]).toEqual([undefined]);
  w.unmount();
});

test("BlessInputOTP typing advances, backspace retreats, paste fills, complete emits", async () => {
  const w = mount(BlessInputOTP, { props: { length: 4 }, attachTo: document.body });
  const cells = w.findAll("input");
  expect(cells).toHaveLength(4);
  expect(cells[0].attributes("autocomplete")).toBe("one-time-code");
  await cells[0].setValue("1");
  expect(w.emitted("update:modelValue")![0]).toEqual(["1"]);
  expect(document.activeElement).toBe(cells[1].element);
  await cells[1].trigger("keydown", { key: "Backspace" });
  expect(document.activeElement).toBe(cells[0].element);

  const paste = new Event("paste") as ClipboardEvent;
  Object.defineProperty(paste, "clipboardData", { value: { getData: () => "9876" } });
  cells[0].element.dispatchEvent(paste);
  await nextTick();
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual(["9876"]);
  expect(w.emitted("complete")![0]).toEqual(["9876"]);
  w.unmount();
});

test("BlessInputOTP: clearing a middle cell keeps later digits in place", async () => {
  const w = mount(BlessInputOTP, {
    props: { length: 4, modelValue: "1234" },
    attachTo: document.body,
  });
  const cells = w.findAll("input");
  await cells[1].trigger("keydown", { key: "Delete" });
  expect(cells[3].element.value).toBe("4");
  expect(cells[1].element.value).toBe("");
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toBe("134");
  expect(w.emitted("complete")).toBeUndefined();
  w.unmount();
});

test("BlessCalendar server HTML doesn't depend on the day it was rendered", async () => {
  const { renderToString } = await import("vue/server-renderer");
  const { createSSRApp } = await import("vue");
  vi.useFakeTimers({ toFake: ["Date"] });
  const html = async (props: Record<string, unknown>, day: string) => {
    vi.setSystemTime(new Date(`${day}T12:00:00`));
    return renderToString(createSSRApp(() => h(BlessCalendar, props)));
  };
  try {
    for (const props of [{ range: true, month: "2019-09" }, { modelValue: "2019-09-25" }, {}])
      expect(await html(props, "2026-09-22")).toBe(await html(props, "2026-09-25"));
    // a calendar with nothing to anchor it still shows the right month once mounted
    vi.setSystemTime(new Date("2026-09-25T12:00:00"));
    const w = mount(BlessCalendar, { props: { locale: "en-US" } });
    await nextTick();
    expect(w.find(".bless-calendar__month").text()).toBe("September 2026");
    expect(w.find(".bless-calendar__day--today").text()).toBe("25");
  } finally {
    vi.useRealTimers();
  }
});
