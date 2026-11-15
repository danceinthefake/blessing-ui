import { mount } from "@vue/test-utils";
import BlessSlotPicker from "./BlessSlotPicker.vue";

const slots = ["14:00", "09:30", { time: "11:00", disabled: true }, "18:15"];

test("BlessSlotPicker: times sorted in groups of radios; a pick sets v-model; a taken slot is off", async () => {
  const w = mount(BlessSlotPicker, {
    props: {
      slots,
      modelValue: null,
      "onUpdate:modelValue": (v: string | null) => w.setProps({ modelValue: v }),
    },
  });
  expect(w.findAll("legend").map((l) => l.text())).toEqual(["Morning", "Afternoon", "Evening"]);
  expect(w.findAll("label").map((l) => l.text())).toEqual(["09:30", "11:00", "14:00", "18:15"]);
  const radios = w.findAll("input[type=radio]");
  expect(new Set(radios.map((r) => r.attributes("name"))).size).toBe(1);
  expect(radios[1]!.attributes("disabled")).toBeDefined();
  await radios[2]!.setValue(true);
  expect(w.props("modelValue")).toBe("14:00");
  expect(w.findAll("label")[2]!.classes()).toContain("bless-slots__slot--on");
});

test("BlessSlotPicker: a locale formats the times, and no slots says so", () => {
  const w = mount(BlessSlotPicker, { props: { slots: ["13:05"], locale: "en" } });
  expect(w.find("label").text()).toBe("1:05 PM");
  const e = mount(BlessSlotPicker, { props: { slots: [], labels: { none: "Penuh" } } });
  expect(e.text()).toBe("Penuh");
});
