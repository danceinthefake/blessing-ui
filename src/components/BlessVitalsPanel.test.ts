import { mount } from "@vue/test-utils";
import BlessVitalsPanel, { vitalState } from "./BlessVitalsPanel.vue";

test("vitalState: low, high, normal, and none for text values", () => {
  expect(vitalState({ id: "a", label: "", value: 50, normal: [60, 100] })).toBe("low");
  expect(vitalState({ id: "a", label: "", value: 120, normal: [60, 100] })).toBe("high");
  expect(vitalState({ id: "a", label: "", value: 72, normal: [60, 100] })).toBe("normal");
  expect(vitalState({ id: "a", label: "", value: "120/80" })).toBeUndefined();
});

test("BlessVitalsPanel: values with units, state in words, the range, and a bar", () => {
  const w = mount(BlessVitalsPanel, {
    props: {
      vitals: [
        {
          id: "hr",
          label: "Heart rate",
          value: 112,
          unit: "bpm",
          normal: [60, 100],
          time: "08:10",
        },
        { id: "bp", label: "Blood pressure", value: "118/76", unit: "mmHg" },
      ],
    },
  });
  const [hr, bp] = w.findAll(".bless-vitals__card");
  expect(hr!.classes()).toContain("is-high");
  expect(hr!.find(".bless-vitals__value").text()).toBe("112 bpm");
  expect(hr!.find(".bless-vitals__state").text()).toBe("▲ High");
  expect(hr!.find(".bless-vitals__meta").text()).toBe("normal 60–100 · 08:10");
  // the band covers the middle half, and 112 sits past it
  expect(hr!.find(".bless-vitals__band").attributes("style")).toContain("inset-inline-start: 25%");
  expect(hr!.find(".bless-vitals__dot").attributes("style")).toContain("inset-inline-start: 90%");
  expect(bp!.find(".bless-vitals__state").exists()).toBe(false);
  expect(bp!.find(".bless-vitals__bar").exists()).toBe(false);
});
