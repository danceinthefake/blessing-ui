import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import {
  BlessCheckbox,
  BlessRadio,
  BlessRadioGroup,
  BlessSelect,
  BlessSlider,
  BlessSwitch,
} from "../index";

test("BlessCheckbox boolean, array, indeterminate", async () => {
  const b = mount(BlessCheckbox, { props: { modelValue: false }, slots: { default: "x" } });
  await b.find("input").setValue(true);
  expect(b.emitted("update:modelValue")![0]).toEqual([true]);

  const a = mount(BlessCheckbox, { props: { modelValue: ["a"], value: "b" } });
  await a.find("input").setValue(true);
  expect(a.emitted("update:modelValue")![0]).toEqual([["a", "b"]]);

  const i = mount(BlessCheckbox, { props: { indeterminate: true } });
  expect((i.find("input").element as HTMLInputElement).indeterminate).toBe(true);
});

test("BlessRadioGroup shares name, selects, disables", async () => {
  const w = mount(BlessRadioGroup, {
    props: { modelValue: "b", label: "Pick" },
    slots: {
      default: () => [
        h(BlessRadio, { value: "a" }, () => "A"),
        h(BlessRadio, { value: "b" }, () => "B"),
      ],
    },
  });
  const inputs = w.findAll("input");
  expect(inputs[0].attributes("name")).toBe(inputs[1].attributes("name"));
  expect((inputs[1].element as HTMLInputElement).checked).toBe(true);
  await inputs[0].trigger("change");
  expect(w.emitted("update:modelValue")![0]).toEqual(["a"]);
  await w.setProps({ disabled: true });
  expect(inputs[0].attributes("disabled")).toBeDefined();
});

test("BlessSwitch role and toggle", async () => {
  const w = mount(BlessSwitch, { props: { modelValue: false }, slots: { default: "Dark" } });
  const i = w.find("input");
  expect(i.attributes("role")).toBe("switch");
  expect(i.attributes("aria-checked")).toBe("false");
  await i.setValue(true);
  expect(w.emitted("update:modelValue")![0]).toEqual([true]);
});

test("BlessSelect options, groups, placeholder, v-model", async () => {
  const w = mount(BlessSelect, {
    props: {
      placeholder: "Choose",
      options: [
        { value: "a", label: "A" },
        { label: "G", options: [{ value: "b", label: "B", disabled: true }] },
      ],
    },
  });
  expect(w.findAll("option").map((o) => o.text())).toEqual(["Choose", "A", "B"]);
  expect(w.find("optgroup").attributes("label")).toBe("G");
  expect(w.findAll("option")[2].attributes("disabled")).toBeDefined();
  await w.find("select").setValue("a");
  expect(w.emitted("update:modelValue")![0]).toEqual(["a"]);
});

test("BlessSlider percent var, value output, format", async () => {
  const w = mount(BlessSlider, {
    props: { modelValue: 25, min: 0, max: 50, showValue: true, format: (v: number) => `${v}%` },
  });
  expect(w.attributes("style")).toContain("--_p: 50%");
  expect(w.find("output").text()).toBe("25%");
  expect(w.find("input").attributes("aria-valuetext")).toBe("25%");
  await w.find("input").setValue("40");
  expect(w.emitted("update:modelValue")![0]).toEqual([40]);
  await nextTick();
});
