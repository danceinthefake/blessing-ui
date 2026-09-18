import { mount } from "@vue/test-utils";
import BlessTabs from "./BlessTabs.vue";

const tabs = [
  { value: "a", label: "A" },
  { value: "b", label: "B", disabled: true },
  { value: "c", label: "C" },
];

test("roles, selection, panel visibility", async () => {
  const w = mount(BlessTabs, {
    props: { tabs, modelValue: "a" },
    slots: { default: ({ tab }: { tab: { value: string } }) => `panel ${tab.value}` },
    attachTo: document.body,
  });
  const t = w.findAll('[role="tab"]');
  expect(t).toHaveLength(3);
  expect(t[0].attributes("aria-selected")).toBe("true");
  expect(t[0].attributes("tabindex")).toBe("0");
  expect(t[2].attributes("tabindex")).toBe("-1");
  expect(t[1].attributes("disabled")).toBeDefined();
  const panels = w.findAll('[role="tabpanel"]');
  expect(panels[0].isVisible()).toBe(true);
  expect(panels[2].isVisible()).toBe(false);
  expect(t[0].attributes("aria-controls")).toBe(panels[0].attributes("id"));

  await t[2].trigger("click");
  expect(w.emitted("update:modelValue")![0]).toEqual(["c"]);
  w.unmount();
});

test("arrow keys skip disabled and wrap; Home/End", async () => {
  const w = mount(BlessTabs, { props: { tabs, modelValue: "a" }, attachTo: document.body });
  const list = w.find('[role="tablist"]');
  await list.trigger("keydown", { key: "ArrowRight" });
  expect(w.emitted("update:modelValue")![0]).toEqual(["c"]); // skipped b
  expect(document.activeElement?.textContent).toBe("C");
  await list.trigger("keydown", { key: "ArrowRight" });
  expect(w.emitted("update:modelValue")![1]).toEqual(["a"]); // wrapped
  await list.trigger("keydown", { key: "End" });
  expect(w.emitted("update:modelValue")![2]).toEqual(["c"]);
  w.unmount();
});

test("manual activation moves focus only", async () => {
  const w = mount(BlessTabs, {
    props: { tabs, modelValue: "a", activation: "manual" },
    attachTo: document.body,
  });
  await w.find('[role="tablist"]').trigger("keydown", { key: "ArrowRight" });
  expect(w.emitted("update:modelValue")).toBeUndefined();
  expect(document.activeElement?.textContent).toBe("C");
  w.unmount();
});

test("unknown model falls back to first enabled", () => {
  const w = mount(BlessTabs, {
    props: { tabs: [{ value: "x", label: "X", disabled: true }, ...tabs], modelValue: "zzz" },
  });
  expect(w.find('[aria-selected="true"]').text()).toBe("A");
});
