import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessHeatmapCalendar from "./BlessHeatmapCalendar.vue";

const mk = (props = {}) =>
  mount(BlessHeatmapCalendar, {
    props: { end: "2026-10-02", weeks: 5, locale: "en", ...props },
    attachTo: document.body,
  });

test("shows every day up to end, none after; Monday-first columns", () => {
  const w = mk(); // 2026-10-02 is a Friday: last column holds Mon 28 .. Fri 2
  const cells = w.findAll(".bless-heat__grid .bless-heat__cell");
  expect(cells.at(-1)!.attributes("data-date")).toBe("2026-10-02");
  expect(cells[0].attributes("data-date")).toBe("2026-08-31"); // a Monday, 4 weeks earlier
  expect(cells).toHaveLength(4 * 7 + 5);
  w.unmount();
});

test("levels scale to the largest value, zero stays level 0", () => {
  const w = mk({ data: { "2026-10-01": 10, "2026-09-30": 3, "2026-09-29": 1 } });
  const lv = (d: string) => w.find(`[data-date="${d}"]`).attributes("data-level");
  expect([lv("2026-10-01"), lv("2026-09-30"), lv("2026-09-29"), lv("2026-09-28")]).toEqual([
    "4",
    "2",
    "1",
    "0",
  ]);
  expect(w.find('[data-date="2026-10-01"]').attributes("aria-label")).toBe(
    "10 contributions on Thu, Oct 1, 2026",
  );
  expect(w.find('[data-date="2026-09-29"]').attributes("aria-label")).toContain(
    "1 contribution on",
  );
  w.unmount();
});

test("click picks a day and click again clears it", async () => {
  const w = mk();
  const cell = () => w.find('[data-date="2026-09-30"]');
  await cell().trigger("click");
  expect(w.emitted("update:modelValue")![0]).toEqual(["2026-09-30"]);
  await w.setProps({ modelValue: "2026-09-30" });
  expect(cell().attributes("aria-pressed")).toBe("true");
  await cell().trigger("click");
  expect(w.emitted("update:modelValue")![1]).toEqual([null]);
  w.unmount();
});

test("one tab stop; arrows move by day and week, clamped to the range", async () => {
  const w = mk();
  const stops = () => w.findAll('[tabindex="0"]').map((c) => c.attributes("data-date"));
  expect(stops()).toEqual(["2026-10-02"]);
  await w.find('[data-date="2026-10-02"]').trigger("keydown", { key: "ArrowUp" });
  await nextTick();
  expect(stops()).toEqual(["2026-10-01"]);
  await w.find('[data-date="2026-10-01"]').trigger("keydown", { key: "ArrowLeft" });
  await nextTick();
  expect(stops()).toEqual(["2026-09-24"]);
  await w.find('[data-date="2026-09-24"]').trigger("keydown", { key: "ArrowRight" });
  await w.find('[data-date="2026-10-01"]').trigger("keydown", { key: "ArrowRight" }); // past end: stays
  await nextTick();
  expect(stops()).toEqual(["2026-10-01"]);
  w.unmount();
});

test("readout names the hovered day, else the total", async () => {
  const w = mk({ data: { "2026-10-01": 2, "2026-09-01": 3 } });
  expect(w.find(".bless-heat__readout").text()).toBe("5 contributions in 5 weeks");
  await w.find('[data-date="2026-10-01"]').trigger("mouseenter");
  expect(w.find(".bless-heat__readout").text()).toContain("2 contributions on Thu");
  w.unmount();
});
