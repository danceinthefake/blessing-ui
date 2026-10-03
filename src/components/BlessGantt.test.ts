import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessGantt from "./BlessGantt.vue";

const tasks = [
  { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-05", progress: 40 },
  { id: "b", label: "Build", start: "2026-10-04", end: "2026-10-10" },
  { id: "c", label: "Ship", start: "2026-10-12", end: "2026-10-12", progress: 0 },
];
let w: VueWrapper<any>;
const mk = (props = {}) =>
  (w = mount(BlessGantt, {
    props: {
      tasks,
      locale: "en",
      dayWidth: 20,
      rowHeight: 30,
      from: "2026-09-28",
      to: "2026-10-14",
      ...props,
    },
    attachTo: document.body,
  }));
afterEach(() => w?.unmount());
const bars = () => w.findAll(".bless-gantt__bar");
const style = (i: number) => bars()[i].attributes("style")!;

test("a bar starts on its first day and covers both end days", () => {
  mk();
  // 28 Sep is day 0, so 1 Oct is day 3: left 60px, 5 days wide = 100px
  expect(style(0)).toContain("left: 60px");
  expect(style(0)).toContain("width: 100px");
  expect(style(1)).toContain("left: 120px"); // 4 Oct
  expect(style(1)).toContain("width: 140px"); // 4..10 = 7 days
  expect(style(2)).toContain("width: 20px"); // a one-day task
});

test("rows follow the task order and the plot spans the range", () => {
  mk();
  expect(bars().map((b) => b.attributes("style")!.match(/top: (\d+)px/)![1])).toEqual([
    "6",
    "36",
    "66",
  ]);
  expect(w.find(".bless-gantt__plot").attributes("style")).toContain("width: 340px"); // 17 days
  expect(w.findAll(".bless-gantt__label").map((l) => l.text())).toEqual([
    "Design",
    "Build",
    "Ship",
  ]);
});

test("bars are named with their dates and progress; progress draws a fill", () => {
  mk();
  expect(bars()[0].attributes("aria-label")).toBe("Design: Oct 1 to Oct 5, 40% done");
  expect(bars()[1].attributes("aria-label")).toBe("Build: Oct 4 to Oct 10");
  expect(bars()[0].find(".bless-gantt__done").attributes("style")).toContain("width: 40%");
  expect(bars()[1].find(".bless-gantt__done").exists()).toBe(false);
});

test("month header splits at the 1st; day numbers go when days are narrow", () => {
  mk();
  expect(w.findAll(".bless-gantt__month").map((m) => m.text())).toEqual([
    "September 2026",
    "October 2026",
  ]);
  expect(w.findAll(".bless-gantt__day")).toHaveLength(17);
  expect(w.findAll(".bless-gantt__day--weekend")).toHaveLength(4); // 3, 4, 10 and 11 Oct
});

test("tiny day width drops the day numbers", () => {
  mk({ dayWidth: 8 });
  expect(w.findAll(".bless-gantt__day")).toHaveLength(0);
});

test("the span follows the tasks when from/to are left out; tasks outside are clipped", () => {
  mk({ from: undefined, to: undefined, tasks: [tasks[0], tasks[1]] });
  const plot = parseInt(
    w
      .find(".bless-gantt__plot")
      .attributes("style")!
      .match(/width: (\d+)px/)![1],
  );
  expect(plot % 20).toBe(0);
  w.unmount();
  mk({ from: "2026-10-03", to: "2026-10-06" });
  expect(style(0)).toContain("left: 0px");
  expect(style(0)).toContain("width: 60px"); // 3..5 only
});

test("click selects (and again clears), arrows move one tab stop, Enter selects", async () => {
  mk({ selected: null, "onUpdate:selected": (v: unknown) => w.setProps({ selected: v }) });
  await bars()[1].trigger("click");
  expect(w.props("selected")).toBe("b");
  expect(w.emitted("select")![0][0]).toMatchObject({ id: "b" });
  expect(bars()[1].classes()).toContain("bless-gantt__bar--on");
  await bars()[1].trigger("click");
  expect(w.props("selected")).toBe(null);
  expect(bars().map((b) => b.attributes("tabindex"))).toEqual(["-1", "0", "-1"]);
  await bars()[1].trigger("keydown", { key: "ArrowDown" });
  await nextTick();
  expect(bars().map((b) => b.attributes("tabindex"))).toEqual(["-1", "-1", "0"]);
  await bars()[2].trigger("keydown", { key: "Home" });
  expect(bars()[0].attributes("tabindex")).toBe("0");
  await bars()[0].trigger("keydown", { key: "Enter" });
  expect(w.props("selected")).toBe("a");
});

// --- editing ---
beforeAll(() => {
  Element.prototype.setPointerCapture = () => {};
});
const edit = (props = {}) =>
  mk({
    editable: true,
    tasks,
    "onUpdate:tasks": (v: unknown) => w.setProps({ tasks: v }),
    ...props,
  });
const ptr = (el: Element, type: string, x = 0) => {
  el.dispatchEvent(new MouseEvent(type, { clientX: x, bubbles: true }));
  return nextTick();
};
const dates = (i: number) => [w.props("tasks")[i].start, w.props("tasks")[i].end];

test("read-only: no grips, dragging and Alt+arrows change nothing", async () => {
  mk();
  expect(w.findAll(".bless-gantt__grip")).toHaveLength(0);
  await ptr(bars()[0].element, "pointerdown", 0);
  await ptr(bars()[0].element, "pointermove", 100);
  await ptr(bars()[0].element, "pointerup", 100);
  await bars()[0].trigger("keydown", { key: "ArrowRight", altKey: true });
  expect(w.emitted("update:tasks")).toBeUndefined();
});

test("dragging a bar previews the move, and letting go commits whole days and emits change", async () => {
  edit();
  const el = bars()[0].element; // Design, 1..5 Oct, 20px a day
  await ptr(el, "pointerdown", 0);
  await ptr(el, "pointermove", 65); // 3.25 days: rounds to 3
  expect(style(0)).toContain("left: 120px"); // moved before it is committed
  expect(dates(0)).toEqual(["2026-10-01", "2026-10-05"]);
  await ptr(el, "pointerup", 65);
  expect(dates(0)).toEqual(["2026-10-04", "2026-10-08"]);
  expect(w.emitted("change")![0][1]).toEqual({ start: "2026-10-04", end: "2026-10-08" });
  expect(w.emitted("change")![0][0]).toMatchObject({ id: "a", start: "2026-10-04" });
  await bars()[0].trigger("click"); // the click that ends a drag is not a selection
  expect(w.emitted("select")).toBeUndefined();
});

test("a drag that lands back where it started changes nothing", async () => {
  edit();
  const el = bars()[1].element;
  await ptr(el, "pointerdown", 100);
  await ptr(el, "pointermove", 130);
  await ptr(el, "pointermove", 105);
  await ptr(el, "pointerup", 105);
  expect(w.emitted("update:tasks")).toBeUndefined();
});

test("the grips resize one end and never cross the other", async () => {
  edit();
  const [startGrip, endGrip] = bars()[0].findAll(".bless-gantt__grip");
  await ptr(endGrip.element, "pointerdown", 0);
  await ptr(endGrip.element, "pointermove", 40); // +2 days
  await ptr(endGrip.element, "pointerup", 40);
  expect(dates(0)).toEqual(["2026-10-01", "2026-10-07"]);
  await ptr(startGrip.element, "pointerdown", 0);
  await ptr(startGrip.element, "pointermove", 400); // far past the end
  await ptr(startGrip.element, "pointerup", 400);
  expect(dates(0)).toEqual(["2026-10-07", "2026-10-07"]); // one day, not inverted
  await ptr(endGrip.element, "pointerdown", 0);
  await ptr(endGrip.element, "pointermove", -400);
  await ptr(endGrip.element, "pointerup", -400);
  expect(dates(0)).toEqual(["2026-10-07", "2026-10-07"]);
});

test("Alt+arrows move a day, Alt+Shift+arrows move the end, with an announcement", async () => {
  edit();
  await bars()[1].trigger("keydown", { key: "ArrowRight", altKey: true });
  expect(dates(1)).toEqual(["2026-10-05", "2026-10-11"]);
  expect(w.find(".bless-gantt__live").text()).toBe("Build: Oct 5 to Oct 11");
  await bars()[1].trigger("keydown", { key: "ArrowLeft", altKey: true, shiftKey: true });
  expect(dates(1)).toEqual(["2026-10-05", "2026-10-10"]);
  for (let k = 0; k < 8; k++)
    await bars()[1].trigger("keydown", { key: "ArrowLeft", altKey: true, shiftKey: true });
  expect(dates(1)).toEqual(["2026-10-05", "2026-10-05"]); // stops at one day
  await bars()[1].trigger("keydown", { key: "ArrowDown" }); // plain arrows still move between bars
  expect(bars()[2].attributes("tabindex")).toBe("0");
});

test("after: an arrow per dependency, named in the bar's label, following a drag", async () => {
  edit({ tasks: [tasks[0], { ...tasks[1], after: ["a"] }, { ...tasks[2], after: ["a", "b"] }] });
  expect(w.findAll(".bless-gantt__arrows > path")).toHaveLength(3);
  expect(bars()[1].attributes("aria-label")).toBe("Build: Oct 4 to Oct 10, after Design");
  expect(bars()[2].attributes("aria-label")).toContain("after Design and Build");
  const before = w.find(".bless-gantt__arrows > path").attributes("d");
  await ptr(bars()[0].element, "pointerdown", 0);
  await ptr(bars()[0].element, "pointermove", -40);
  expect(w.find(".bless-gantt__arrows > path").attributes("d")).not.toBe(before);
  await ptr(bars()[0].element, "pointerup", -40);
});

test("a dependency on an unknown id is ignored; no after means no arrows", () => {
  mk({ tasks: [{ ...tasks[0], after: ["nope"] }] });
  expect(w.find(".bless-gantt__arrows").exists()).toBe(false);
});
