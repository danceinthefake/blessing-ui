import { mount } from "@vue/test-utils";
import BlessPictogram, { iconFills } from "./BlessPictogram.vue";

test("iconFills: whole icons, then the rest", () => {
  expect(iconFills(3400, 1000)).toEqual([1, 1, 1, 0.4]);
  expect(iconFills(2000, 1000)).toEqual([1, 1]);
  expect(iconFills(0, 1000)).toEqual([]);
});

test("BlessPictogram: a row of icons per item, a part icon, the value, and the key", () => {
  const w = mount(BlessPictogram, {
    props: {
      unit: 1000,
      noun: "listeners",
      label: "Listeners by city",
      data: [
        { label: "Jakarta", value: 4500 },
        { label: "Bandung", value: 2000, color: "chart-3" },
      ],
    },
  });
  expect(w.find(".bless-picto__key").text()).toBe("One icon = 1,000 listeners");
  const rows = w.findAll(".bless-picto__row");
  expect(rows[0]!.findAll(".bless-picto__icons .bless-picto__icon")).toHaveLength(5);
  const part = rows[0]!.find(".is-part");
  expect(part.attributes("style")).toContain("--_f: 50%");
  expect(rows[1]!.attributes("style")).toContain("chart-3");
  expect(rows.map((r) => r.text())).toEqual(["Jakarta4,500", "Bandung2,000"]);
  expect(w.attributes("aria-label")).toBe("Listeners by city");
});
