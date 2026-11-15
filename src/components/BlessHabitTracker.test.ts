import { mount } from "@vue/test-utils";
import BlessHabitTracker, { lastDays, streak } from "./BlessHabitTracker.vue";

test("lastDays and streak", () => {
  expect(lastDays("2026-03-02", 3)).toEqual(["2026-02-28", "2026-03-01", "2026-03-02"]);
  const done = new Set(["2026-11-14", "2026-11-15", "2026-11-16"]);
  expect(streak(done, "2026-11-16")).toBe(3);
  // today is not done yet: the streak up to yesterday still counts
  expect(streak(done, "2026-11-17")).toBe(3);
  expect(streak(done, "2026-11-18")).toBe(0);
});

const habits = [
  { id: "read", name: "Read 30 minutes" },
  { id: "edit", name: "Edit one segment" },
];

test("BlessHabitTracker: a row per habit, a check per day, the streak, and names for each check", () => {
  const w = mount(BlessHabitTracker, {
    props: { habits, end: "2026-11-16", days: 5, done: { read: ["2026-11-15", "2026-11-16"] } },
  });
  expect(w.findAll("thead .bless-habits__day")).toHaveLength(5);
  expect(w.find("thead .bless-habits__day.is-end").text()).toContain("16");
  const checks = w.findAll("tbody tr")[0]!.findAll("input");
  expect(checks.map((c) => (c.element as HTMLInputElement).checked)).toEqual([
    false,
    false,
    false,
    true,
    true,
  ]);
  expect(checks[4]!.attributes("aria-label")).toBe("Read 30 minutes, Monday, November 16");
  expect(w.findAll("td.bless-habits__streak").map((s) => s.find(".bless-sr").text())).toEqual([
    "2 days in a row",
    "0 days in a row",
  ]);
});

test("BlessHabitTracker: a click marks a day and keeps the other habits", async () => {
  const w = mount(BlessHabitTracker, {
    props: {
      habits,
      end: "2026-11-16",
      days: 3,
      done: { read: ["2026-11-16"] },
      "onUpdate:done": (v: Record<string, string[]>) => w.setProps({ done: v }),
    },
  });
  await w.findAll("tbody tr")[1]!.findAll("input")[2]!.trigger("change");
  expect(w.emitted("update:done")!.at(-1)).toEqual([
    { read: ["2026-11-16"], edit: ["2026-11-16"] },
  ]);
  await w.findAll("tbody tr")[0]!.findAll("input")[2]!.trigger("change");
  expect(w.emitted("update:done")!.at(-1)).toEqual([{ read: [], edit: ["2026-11-16"] }]);
});
