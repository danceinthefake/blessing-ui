import { mount } from "@vue/test-utils";
import BlessBatteryLevel from "./BlessBatteryLevel.vue";

test("BlessBatteryLevel: a meter with the value, low and charging in words", () => {
  const w = mount(BlessBatteryLevel, { props: { level: 62.4, label: "Door sensor" } });
  expect(w.attributes()).toMatchObject({
    role: "meter",
    "aria-valuenow": "62",
    "aria-valuetext": "62%",
    "aria-label": "Battery, Door sensor",
  });
  expect(w.find(".bless-battery__fill").attributes("style")).toContain("inline-size: 62%");
  const low = mount(BlessBatteryLevel, { props: { level: 12 } });
  expect(low.classes()).toContain("is-low");
  expect(low.attributes("aria-valuetext")).toBe("12%, Low");
  expect(low.find(".bless-battery__text").text()).toBe("12% · Low");
  // a battery on charge is not called low
  const ch = mount(BlessBatteryLevel, { props: { level: 12, charging: true } });
  expect(ch.attributes("aria-valuetext")).toBe("12%, Charging");
  expect(ch.classes()).not.toContain("is-low");
  expect(mount(BlessBatteryLevel, { props: { level: 140 } }).attributes("aria-valuenow")).toBe(
    "100",
  );
});
