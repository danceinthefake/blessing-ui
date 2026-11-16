import { mount } from "@vue/test-utils";
import BlessDeviceTile from "./BlessDeviceTile.vue";

test("BlessDeviceTile: a switch named with the device, the state and reading in words", async () => {
  const w = mount(BlessDeviceTile, {
    props: {
      name: "Desk lamp",
      room: "Studio",
      reading: "80%",
      "onUpdate:modelValue": (v: boolean) => w.setProps({ modelValue: v }),
    },
  });
  const sw = w.find("input[role=switch]");
  expect(sw.attributes("aria-label")).toBe("Power, Desk lamp");
  expect(w.find(".bless-device__status").text()).toBe("Off · 80%");
  await sw.setValue(true);
  expect(w.props("modelValue")).toBe(true);
  expect(w.classes()).toContain("is-on");
  expect(w.find(".bless-device__state").text()).toBe("On");
});

test("BlessDeviceTile: offline turns the switch off and says so; a sensor has no switch", () => {
  const off = mount(BlessDeviceTile, { props: { name: "Fan", offline: true, reading: "2" } });
  expect(off.find("input").attributes("disabled")).toBeDefined();
  expect(off.find(".bless-device__status").text()).toBe("Offline");
  const sensor = mount(BlessDeviceTile, {
    props: { name: "Door", sensor: true, reading: "Closed" },
  });
  expect(sensor.find("input").exists()).toBe(false);
  expect(sensor.find(".bless-device__status").text()).toBe("Closed");
});
