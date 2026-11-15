import { mount } from "@vue/test-utils";
import BlessPresetRange, { defaultPresets } from "./BlessPresetRange.vue";

const names = {
  today: "Today",
  yesterday: "Yesterday",
  last7: "Last 7 days",
  last30: "Last 30 days",
  thisMonth: "This month",
  lastMonth: "Last month",
};

test("defaultPresets: the common ranges for a day, across a month and a year", () => {
  expect(defaultPresets("2026-11-16", names).map((p) => p.range)).toEqual([
    ["2026-11-16", "2026-11-16"],
    ["2026-11-15", "2026-11-15"],
    ["2026-11-10", "2026-11-16"],
    ["2026-10-18", "2026-11-16"],
    ["2026-11-01", "2026-11-16"],
    ["2026-10-01", "2026-10-31"],
  ]);
  expect(defaultPresets("2026-01-03", names)[5]!.range).toEqual(["2025-12-01", "2025-12-31"]);
});

test("BlessPresetRange: a preset sets the range, the matching one is pressed, and the range reads as text", async () => {
  const w = mount(BlessPresetRange, {
    props: {
      today: "2026-11-16",
      "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as never }),
    },
  });
  expect(w.find("[role=status]").text()).toBe("No dates chosen");
  const presets = w.findAll(".bless-presetrange__preset");
  expect(presets).toHaveLength(6);
  await presets[2]!.trigger("click");
  expect(w.props("modelValue")).toEqual(["2026-11-10", "2026-11-16"]);
  expect(w.findAll(".bless-presetrange__preset")[2]!.attributes("aria-pressed")).toBe("true");
  expect(w.find("[role=status]").text().replace(/\s/g, " ")).toBe("Nov 10 – 16, 2026");
  expect(w.findComponent({ name: "BlessCalendar" }).props("month")).toBe("2026-11");
});

test("BlessPresetRange: your own presets, and labels translate", () => {
  const w = mount(BlessPresetRange, {
    props: {
      presets: [{ label: "Season 1", range: ["2026-01-05", "2026-04-27"] }],
      labels: { none: "Belum ada tanggal" },
    },
  });
  expect(w.findAll(".bless-presetrange__preset").map((b) => b.text())).toEqual(["Season 1"]);
  expect(w.find("[role=status]").text()).toBe("Belum ada tanggal");
});
