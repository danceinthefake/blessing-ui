import { mount } from "@vue/test-utils";
import { h } from "vue";
import BlessField from "../components/BlessField.vue";
import BlessInput from "../components/BlessInput.vue";

test("BlessField hands its id to the first control; later controls and explicit ids are untouched", () => {
  const w = mount(BlessField, {
    props: { label: "Name" },
    slots: { default: () => [h(BlessInput), h(BlessInput), h(BlessInput, { id: "custom" })] },
  });
  const labelFor = w.find("label").attributes("for");
  const ids = w.findAll("input").map((i) => i.attributes("id"));
  expect(ids[0]).toBe(labelFor);
  expect(ids[1]).not.toBe(labelFor);
  expect(ids[2]).toBe("custom");
});

test("BlessField hands invalid + describedby to the control inside, no v-slot", async () => {
  const w = mount(BlessField, {
    props: { label: "Email", description: "we won't share it" },
    slots: { default: () => h(BlessInput) },
    attachTo: document.body,
  });
  const input = w.find("input");
  expect(input.attributes("aria-describedby")).toMatch(/-desc$/);
  expect(input.attributes("aria-invalid")).toBeUndefined();
  await w.setProps({ error: "Taken" });
  expect(input.attributes("aria-invalid")).toBe("true");
  expect(input.attributes("aria-describedby")).toMatch(/-err$/);
  w.unmount();
});
