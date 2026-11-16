import { mount } from "@vue/test-utils";
import BlessThermostat from "./BlessThermostat.vue";

const sheet = (props = {}) => {
  const w = mount(BlessThermostat, {
    props: {
      current: 24,
      modelValue: 22,
      "onUpdate:modelValue": (v: number) => w.setProps({ modelValue: v }),
      "onUpdate:mode": (v: unknown) => w.setProps({ mode: v as never }),
      ...props,
    },
  });
  return w;
};

test("BlessThermostat: the status follows the mode and the gap, and the buttons step the target", async () => {
  const w = sheet();
  expect(w.find(".bless-thermo__now").text()).toBe("Now 24 °C");
  expect(w.find("[role=status]").text()).toBe("Cooling to 22 °C");
  await w.find('[aria-label="Higher"]').trigger("click");
  expect(w.props("modelValue")).toBe(22.5);
  await w.setProps({ modelValue: 26 });
  expect(w.find("[role=status]").text()).toBe("Heating to 26 °C");
  // in cool mode, a target above the room just holds
  await w.findAll("input[type=radio]")[1]!.setValue(true);
  expect(w.props("mode")).toBe("cool");
  expect(w.find("[role=status]").text()).toBe("Holding 26 °C");
  await w.findAll("input[type=radio]")[3]!.setValue(true);
  expect(w.find("[role=status]").text()).toBe("The system is off");
  expect(w.find('[aria-label="Lower"]').attributes("disabled")).toBeDefined();
});

test("BlessThermostat: the target stays within min and max", async () => {
  const w = sheet({ modelValue: 30, max: 30 });
  expect(w.find('[aria-label="Higher"]').attributes("disabled")).toBeDefined();
});
