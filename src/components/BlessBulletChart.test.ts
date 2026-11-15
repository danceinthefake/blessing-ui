import { mount } from "@vue/test-utils";
import BlessBulletChart from "./BlessBulletChart.vue";

test("BlessBulletChart: a meter with the value, target and band in words, bands and a target line", () => {
  const w = mount(BlessBulletChart, {
    props: {
      label: "Completion",
      value: 72,
      target: 80,
      bands: [50, 80, 100],
      format: (v: number) => `${v}%`,
    },
  });
  const m = w.find("[role=meter]");
  expect(m.attributes()).toMatchObject({
    "aria-label": "Completion",
    "aria-valuenow": "72",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuetext": "72%, target 80%, fair",
  });
  expect(w.findAll(".bless-bullet__band")).toHaveLength(3);
  expect(w.find(".bless-bullet__band").attributes("style")).toContain("--_k: 32%");
  expect(w.find(".bless-bullet__bar").attributes("style")).toContain("inline-size: 72%");
  expect(w.find(".bless-bullet__target").attributes("style")).toContain("inset-inline-start: 80%");
  expect(w.find(".bless-bullet__value").text()).toBe("72%");
});

test("BlessBulletChart: no bands takes a round max, clamps the bar, and labels translate", () => {
  const w = mount(BlessBulletChart, {
    props: { label: "Plays", value: 870, target: 1000, labels: { target: "target" } },
  });
  expect(w.find("[role=meter]").attributes("aria-valuemax")).toBe("1000");
  expect(w.find("[role=meter]").attributes("aria-valuetext")).toBe("870, target 1,000");
  const over = mount(BlessBulletChart, { props: { label: "x", value: 150, max: 100 } });
  expect(over.find(".bless-bullet__bar").attributes("style")).toContain("inline-size: 100%");
});

test("BlessBulletChart: a band count other than three names the band by its place", () => {
  const w = mount(BlessBulletChart, { props: { label: "x", value: 5, bands: [4, 8] } });
  expect(w.find("[role=meter]").attributes("aria-valuetext")).toBe("5, band 2 of 2");
});
