import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessScheduler from "./BlessScheduler.vue";
import type { ScheduleEvent } from "../composables/schedule";

const ev = (
  id: string,
  start: number,
  end: number,
  date = "2026-05-06",
  title = id,
): ScheduleEvent => ({
  id,
  title,
  date,
  start,
  end,
});
let w: VueWrapper;
const mk = (props: Record<string, unknown> = {}) => {
  w = mount(BlessScheduler, {
    props: {
      modelValue: [] as ScheduleEvent[],
      date: "2026-05-06",
      dayStart: 8,
      dayEnd: 18,
      locale: "en-GB",
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as ScheduleEvent[] }),
      "onUpdate:date": (v: unknown) => w.setProps({ date: v as string }),
      "onUpdate:selected": (v: unknown) => w.setProps({ selected: v as string | null }),
      ...props,
    },
    attachTo: document.body,
  });
  // seven 100px columns, 48px per hour from 08:00: y 0 = 08:00, y 48 = 09:00
  (w.find(".bless-sched__cols").element as HTMLElement).getBoundingClientRect = () =>
    ({
      left: 0,
      top: 0,
      width: (prop("view") === "day" ? 1 : 7) * 100,
      height: 480,
      right: 700,
      bottom: 480,
    }) as DOMRect;
  return w;
};
afterEach(() => w?.unmount());
beforeAll(() => {
  Element.prototype.setPointerCapture = () => {};
});
const prop = (k: string) => (w.props() as Record<string, unknown>)[k];
const events = () => (w.props() as { modelValue: ScheduleEvent[] }).modelValue;
const evs = () => w.findAll("[data-event]");
const cols = () => w.findAll(".bless-sched__col");
const ptr = async (el: Element, type: string, x: number, y: number) => {
  el.dispatchEvent(
    Object.assign(new MouseEvent(type, { clientX: x, clientY: y, bubbles: true }), {
      pointerId: 1,
    }),
  );
  await nextTick();
};

test("a week: seven named columns, hours down the side, events named with day and time", () => {
  mk({ modelValue: [ev("e1", 540, 600, "2026-05-06", "Standup")] });
  expect(w.findAll(".bless-sched__day")).toHaveLength(7);
  expect(w.findAll(".bless-sched__day")[0]!.text()).toBe("Mon 4");
  expect(w.findAll(".bless-sched__hour")).toHaveLength(10);
  expect(w.find(".bless-sched__title").text()).toBe("4 May 2026 – 10 May 2026");
  expect(evs()[0]!.attributes("aria-label")).toBe("Standup, Wednesday 6 May, 9:00 to 10:00");
});

test("an event sits at its time and has its length", () => {
  mk({ modelValue: [ev("e1", 540, 630)] }); // 09:00 – 10:30
  const s = evs()[0]!.attributes("style")!;
  expect(s).toContain("top: 48px");
  expect(s).toContain("height: 72px");
  expect(cols()[2]!.find("[data-event]").exists()).toBe(true); // Wednesday
});

test("day view shows a single column", () => {
  mk({ view: "day" });
  expect(cols()).toHaveLength(1);
  expect(w.find(".bless-sched__title").text()).toBe("6 May 2026");
});

test("overlapping events share the width", () => {
  mk({ modelValue: [ev("e1", 540, 660), ev("e2", 600, 720)] });
  expect(evs()[0]!.attributes("style")).toContain("width: calc(50% - 3px)");
  expect(evs()[1]!.attributes("style")).toContain("left: calc(50% + 1px)");
});

test("dragging over empty time makes an event, snapped, and selects it with its title ready", async () => {
  mk();
  const col = cols()[2]!.element; // Wednesday
  await ptr(col, "pointerdown", 250, 50); // ~09:00
  await ptr(w.find(".bless-sched__cols").element, "pointermove", 250, 146); // ~11:00
  expect(w.find(".bless-sched__event--draft").exists()).toBe(true);
  await ptr(w.find(".bless-sched__cols").element, "pointerup", 250, 146);
  expect(events()).toEqual([
    { id: "e1", title: "New event", date: "2026-05-06", start: 540, end: 660 },
  ]);
  expect(prop("selected")).toBe("e1");
  expect(w.emitted("create")).toHaveLength(1);
  expect(w.find(".bless-sched__live").text()).toBe("New event added");
});

test("a flick makes nothing", async () => {
  mk();
  await ptr(cols()[1]!.element, "pointerdown", 150, 100);
  await ptr(w.find(".bless-sched__cols").element, "pointerup", 150, 102);
  expect(events()).toEqual([]);
});

test("dragging an event moves it in time and across days, keeping its length", async () => {
  mk({ modelValue: [ev("e1", 540, 600)] });
  await ptr(evs()[0]!.element, "pointerdown", 250, 60);
  await ptr(w.find(".bless-sched__cols").element, "pointermove", 350, 108); // +48px = +1h, one column on
  expect(events()[0]).toMatchObject({ date: "2026-05-07", start: 600, end: 660 });
  await ptr(w.find(".bless-sched__cols").element, "pointerup", 350, 108);
  expect(w.find(".bless-sched__live").text()).toContain("Thursday 7 May, 10:00 to 11:00");
  expect(w.emitted("change")!.length).toBeGreaterThan(0);
});

test("the foot of an event resizes it, down to the snap", async () => {
  mk({ modelValue: [ev("e1", 540, 600)] });
  await ptr(w.find(".bless-sched__foot").element, "pointerdown", 250, 94);
  await ptr(w.find(".bless-sched__cols").element, "pointermove", 250, 142); // +1h
  expect(events()[0]).toMatchObject({ start: 540, end: 660 });
  await ptr(w.find(".bless-sched__cols").element, "pointermove", 250, -500);
  expect(events()[0]!.end).toBe(555);
});

test("keyboard: arrows move by the snap and by day, Alt+arrows resize, focus follows to a new day", async () => {
  mk({ modelValue: [ev("e1", 540, 600)] });
  (evs()[0]!.element as HTMLElement).focus();
  await evs()[0]!.trigger("keydown", { key: "ArrowDown" });
  expect(events()[0]).toMatchObject({ start: 555, end: 615 });
  await evs()[0]!.trigger("keydown", { key: "ArrowRight" });
  await nextTick();
  expect(events()[0]!.date).toBe("2026-05-07");
  // the event was rebuilt in the Thursday column; focus followed it
  expect(document.activeElement).toBe(evs()[0]!.element);
  await evs()[0]!.trigger("keydown", { key: "ArrowDown", altKey: true });
  expect(events()[0]!.end).toBe(630);
  expect(w.find(".bless-sched__live").text()).toContain("Thursday 7 May, 9:15 to 10:30");
});

test("keyboard stops at the ends of the shown week, and of the day", async () => {
  mk({ modelValue: [ev("e1", 540, 600, "2026-05-10")] }); // Sunday, last column
  await evs()[0]!.trigger("keydown", { key: "ArrowRight" });
  expect(events()[0]!.date).toBe("2026-05-10");
  await evs()[0]!.trigger("keydown", { key: "ArrowUp", shiftKey: false });
  for (let i = 0; i < 40; i++) await evs()[0]!.trigger("keydown", { key: "ArrowUp" });
  expect(events()[0]!.start).toBe(480);
});

test("Delete removes it and focus moves to a neighbour; the panel edits the title", async () => {
  mk({ modelValue: [ev("e1", 540, 600), ev("e2", 700, 760, "2026-05-07")] });
  await evs()[0]!.trigger("focus");
  await w.find(".bless-sched__input").setValue("Planning");
  expect(events()[0]!.title).toBe("Planning");
  await evs()[0]!.trigger("keydown", { key: "Delete" });
  await nextTick();
  expect(events().map((e) => e.id)).toEqual(["e2"]);
  expect(w.find(".bless-sched__live").text()).toBe("Planning removed");
});

test("Add event works without a pointer", async () => {
  mk();
  await w.find(".bless-sched__add").trigger("click");
  await nextTick();
  expect(events()[0]).toMatchObject({ date: "2026-05-04", start: 540, end: 600 });
});

test("previous / next move by a week, by a day in day view", async () => {
  mk();
  await w.find("[aria-label='Next']").trigger("click");
  expect(prop("date")).toBe("2026-05-13");
  w.unmount();
  mk({ view: "day" });
  await w.find("[aria-label='Previous']").trigger("click");
  expect(prop("date")).toBe("2026-05-05");
});

test("read-only has no add button, no drag, no keys", async () => {
  mk({ editable: false, modelValue: [ev("e1", 540, 600)] });
  expect(w.find(".bless-sched__add").exists()).toBe(false);
  expect(w.find(".bless-sched__foot").exists()).toBe(false);
  await ptr(evs()[0]!.element, "pointerdown", 250, 60);
  await ptr(w.find(".bless-sched__cols").element, "pointermove", 350, 108);
  await evs()[0]!.trigger("keydown", { key: "Delete" });
  expect(events()[0]).toMatchObject({ date: "2026-05-06", start: 540 });
});

test("wording can be replaced", () => {
  mk({
    modelValue: [ev("e1", 540, 600)],
    labels: {
      eventName: (t: string, _d: string, a: string, b: string) => `${t} ${a}-${b}`,
      today: "Hari ini",
    },
  });
  expect(evs()[0]!.attributes("aria-label")).toBe("e1 9:00-10:00");
  expect(w.text()).toContain("Hari ini");
});
