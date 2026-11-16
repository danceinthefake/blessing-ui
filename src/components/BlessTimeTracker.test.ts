import { mount } from "@vue/test-utils";
import BlessTimeTracker, { type BlessTimeEntry } from "./BlessTimeTracker.vue";

afterEach(() => vi.useRealTimers());

test("BlessTimeTracker: start, tick, stop into an entry, days with totals, and delete", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 17, 9, 0, 0));
  const old: BlessTimeEntry = {
    id: "o",
    task: "Email",
    start: new Date(2026, 10, 16, 8, 0).getTime(),
    end: new Date(2026, 10, 16, 9, 30).getTime(),
  };
  const w = mount(BlessTimeTracker, {
    props: {
      modelValue: [old],
      "onUpdate:modelValue": (v: BlessTimeEntry[]) => w.setProps({ modelValue: v }),
      "onUpdate:running": (v: { task: string; start: number } | null) => w.setProps({ running: v }),
    },
  });
  await w.find("input").setValue("Mix the podcast");
  await w.find("form").trigger("submit");
  expect(w.find("button[type=submit]").text()).toBe("■ Stop");
  vi.advanceTimersByTime(65 * 60 * 1000 + 5000);
  await w.vm.$nextTick();
  expect(w.find("[role=timer]").text()).toBe("1:05:05");
  await w.find("form").trigger("submit");
  const days = w.findAll("section");
  expect(days.map((d) => d.attributes("aria-label"))).toEqual([
    "Tuesday, November 17",
    "Monday, November 16",
  ]);
  expect(days[0]!.find(".bless-timetrack__head").text()).toBe(
    "Tuesday, November 17Total 1 h 05 min",
  );
  expect(days[0]!.find(".bless-timetrack__task").text()).toBe("Mix the podcast");
  expect(days[1]!.find(".bless-timetrack__dur").text()).toBe("1 h 30 min");
  expect(w.find("[role=timer]").text()).toBe("0:00:00");
  await w.find('[aria-label="Delete Email"]').trigger("click");
  expect(w.findAll("section")).toHaveLength(1);
});
