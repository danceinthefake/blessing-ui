import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import BlessField from "./BlessField.vue";
import BlessCheckbox from "./BlessCheckbox.vue";
import BlessRadio from "./BlessRadio.vue";
import BlessRadioGroup from "./BlessRadioGroup.vue";
import BlessSelect from "./BlessSelect.vue";
import BlessSlider from "./BlessSlider.vue";
import BlessSwitch from "./BlessSwitch.vue";

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
  // the native checked state is what a role=switch checkbox reports; no aria-checked to drift
  expect((i.element as HTMLInputElement).checked).toBe(false);
  expect(i.attributes("aria-checked")).toBeUndefined();
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

test("BlessRadioGroup in a Field: the field names the group, radios keep their own labels", async () => {
  const { default: BlessField } = await import("./BlessField.vue");
  const { h } = await import("vue");
  const w = mount(BlessField, {
    props: { label: "Plan", error: "Pick one" },
    slots: {
      default: () =>
        h(BlessRadioGroup, null, () => [
          h(BlessRadio, { value: "free" }, () => "Free"),
          h(BlessRadio, { value: "pro" }, () => "Pro"),
        ]),
    },
  });
  const group = w.find("[role=radiogroup]");
  const label = w.find(".bless-field__label");
  expect(group.attributes("aria-labelledby")).toBe(label.attributes("id"));
  expect(label.attributes("for")).toBe(group.attributes("id")); // not the first radio
  expect(group.attributes("aria-invalid")).toBe("true");
  expect(group.attributes("aria-describedby")).toMatch(/-err$/);
  const radios = w.findAll("input[type=radio]");
  expect(radios.map((r) => r.attributes("id"))).not.toContain(group.attributes("id"));
});

test("BlessSelect: a required select on its placeholder is invalid and reads as undefined", async () => {
  const w = mount(BlessSelect, {
    props: { placeholder: "Choose", options: [{ label: "A", value: "a" }] },
    attrs: { required: true },
  });
  const el = w.find("select").element as HTMLSelectElement;
  expect(el.value).toBe("");
  expect(el.checkValidity()).toBe(false);
  await w.find("select").setValue("a");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual(["a"]);
  expect(el.checkValidity()).toBe(true);
});

test("BlessTextarea counter speaks only near the limit", async () => {
  const { default: BlessTextarea } = await import("./BlessTextarea.vue");
  const w = mount(BlessTextarea, { props: { maxlength: 200, counter: true, modelValue: "hi" } });
  expect(w.find(".bless-textarea__counter").attributes("aria-live")).toBe("off");
  await w.setProps({ modelValue: "x".repeat(185) });
  expect(w.find(".bless-textarea__counter").attributes("aria-live")).toBe("polite");
});

test("BlessTable stacked keeps table roles; BlessTabs ids survive values with spaces", async () => {
  const { default: BlessTable } = await import("./BlessTable.vue");
  const { default: BlessTabs } = await import("./BlessTabs.vue");
  const t = mount(BlessTable, {
    props: {
      columns: [
        { key: "n", label: "Name", header: true },
        { key: "e", label: "Ep" },
      ],
      rows: [{ n: "A", e: 1 }],
    },
  });
  expect(t.attributes("role")).toBe("table");
  expect(t.find("tbody tr").attributes("role")).toBe("row");
  expect(t.findAll("tbody tr > *").map((c) => c.attributes("role"))).toEqual(["rowheader", "cell"]);
  expect(
    mount(BlessTable, { props: { columns: [], rows: [], stack: false } }).attributes("role"),
  ).toBeUndefined();
  const tabs = mount(BlessTabs, {
    props: { tabs: [{ value: "first tab", label: "One" }], modelValue: "first tab" },
  });
  const tab = tabs.find("[role=tab]");
  expect(tab.attributes("aria-controls")).not.toContain(" ");
  expect(
    tabs.find(`#${CSS.escape(tab.attributes("aria-controls")!)}`).attributes("aria-labelledby"),
  ).toBe(tab.attributes("id"));
});

test("BlessCheckbox in an invalid field: red box, and both its line and the error are read", () => {
  const w = mount(BlessField, {
    props: { label: "Terms", error: "Required" },
    slots: { default: () => h(BlessCheckbox, { description: "to continue" }, () => "I agree") },
  });
  expect(w.find(".bless-checkbox").classes()).toContain("bless-checkbox--invalid");
  const ids = w.find("input").attributes("aria-describedby")!.split(" ");
  expect(ids).toHaveLength(2);
  for (const i of ids) expect(w.find(`[id="${i}"]`).exists()).toBe(true);
});
