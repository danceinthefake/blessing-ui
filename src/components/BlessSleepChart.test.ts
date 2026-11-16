import { mount } from "@vue/test-utils";
import BlessSleepChart, { sleepSpans } from "./BlessSleepChart.vue";

const spans = [
  { stage: "light" as const, start: "23:30", end: "00:10" },
  { stage: "deep" as const, start: "00:10", end: "01:20" },
  { stage: "awake" as const, start: "01:20", end: "01:30" },
  { stage: "rem" as const, start: "01:30", end: "02:00" },
];

test("sleepSpans: minutes from the first start, across midnight", () => {
  expect(sleepSpans(spans).map((s) => [s.from, s.to])).toEqual([
    [0, 40],
    [40, 110],
    [110, 120],
    [120, 150],
  ]);
});

test("BlessSleepChart: a row per stage, hour ticks, totals in words, and a summary name", () => {
  const w = mount(BlessSleepChart, { props: { spans } });
  expect(w.findAll(".bless-sleep__row").map((r) => r.text())).toEqual([
    "Awake",
    "REM",
    "Light",
    "Deep",
  ]);
  expect(w.findAll("rect")).toHaveLength(4);
  expect(w.findAll(".bless-sleep__tick").map((t) => t.text())).toEqual(["00:00", "01:00", "02:00"]);
  expect(w.find(".bless-sleep__totals strong").text()).toBe("Asleep 2 h 20 min");
  expect(w.findAll(".bless-sleep__total").map((t) => t.text())).toEqual([
    "Awake 10 min",
    "REM 30 min",
    "Light 40 min",
    "Deep 1 h 10 min",
  ]);
  expect(w.find("svg").attributes("aria-label")).toBe(
    "Sleep: Asleep 2 h 20 min. Awake 10 min, REM 30 min, Light 40 min, Deep 1 h 10 min.",
  );
});
