import { mount } from "@vue/test-utils";
import BlessColorSwatches from "./BlessColorSwatches.vue";

test("BlessColorSwatches: a radio group of named colors; the model picks one, in any case", async () => {
  const w = mount(BlessColorSwatches, {
    props: {
      swatches: ["#e85078", { value: "#a759ff", label: "Purple" }],
      modelValue: "#E85078",
      "onUpdate:modelValue": (v: string | null) => w.setProps({ modelValue: v }),
    },
  });
  expect(w.attributes("role")).toBe("radiogroup");
  expect(w.attributes("aria-label")).toBe("Colors");
  const inputs = w.findAll("input[type=radio]");
  expect(inputs.map((i) => i.attributes("aria-label"))).toEqual(["#e85078", "Purple"]);
  expect(new Set(inputs.map((i) => i.attributes("name"))).size).toBe(1);
  expect((inputs[0]!.element as HTMLInputElement).checked).toBe(true);
  expect(w.findAll("label")[1]!.attributes("title")).toBe("Purple");
  await inputs[1]!.trigger("change");
  expect(w.props("modelValue")).toBe("#a759ff");
  expect(w.findAll("label")[1]!.classes()).toContain("bless-swatches__swatch--on");
});

test("BlessColorSwatches: size, disabled, and the group name", () => {
  const w = mount(BlessColorSwatches, {
    props: { swatches: ["red"], size: "sm", disabled: true, labels: { label: "Warna" } },
  });
  expect(w.classes()).toContain("bless-swatches--sm");
  expect(w.attributes("aria-label")).toBe("Warna");
  expect(w.find("input").attributes("disabled")).toBeDefined();
});
