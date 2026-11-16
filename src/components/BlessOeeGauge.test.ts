import { mount } from "@vue/test-utils";
import BlessOeeGauge from "./BlessOeeGauge.vue";

test("BlessOeeGauge: OEE is the product of the parts, the goal, and the lowest part named", () => {
  const w = mount(BlessOeeGauge, { props: { availability: 0.9, performance: 0.95, quality: 0.8 } });
  expect(w.find('[role="meter"], [role="img"], .bless-gauge').exists()).toBe(true);
  expect(w.text()).toContain("68.4%");
  expect(w.find(".bless-oee__goal").text()).toBe("↓ Goal 85%");
  const parts = w.findAll(".bless-oee__part");
  expect(parts.map((p) => p.find(".bless-oee__value").text())).toEqual(["90%", "95%", "80%"]);
  expect(parts[2]!.classes()).toContain("is-weak");
  expect(parts[2]!.find("dt").text()).toBe("Quality · Lowest part");
  const met = mount(BlessOeeGauge, {
    props: { availability: 1, performance: 0.95, quality: 0.99 },
  });
  expect(met.find(".bless-oee__goal").classes()).toContain("is-met");
});
