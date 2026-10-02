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
