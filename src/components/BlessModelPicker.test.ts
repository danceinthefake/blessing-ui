import { mount } from "@vue/test-utils";
import BlessModelPicker from "./BlessModelPicker.vue";

const models = [
  { id: "fast", name: "Swift", description: "Quick answers", speed: 3, cost: 1, tags: ["new"] },
  { id: "deep", name: "Deep", description: "Long documents", speed: 1, cost: 3, tags: ["vision"] },
  { id: "old", name: "Legacy", disabled: true },
];

test("BlessModelPicker: the trigger names the model, and the list shows notes, tags, and marks in words", () => {
  const w = mount(BlessModelPicker, { props: { models, modelValue: "fast" } });
  const b = w.find("button.bless-modelpick");
  expect(b.text()).toBe("Swift");
  expect(b.attributes("aria-label")).toBe("Model: Swift");
  expect(b.attributes("aria-haspopup")).toBe("dialog");
  const opts = w.findAll("[role=option]");
  expect(opts).toHaveLength(3);
  expect(opts[0]!.attributes("aria-selected")).toBe("true");
  expect(opts[1]!.find(".bless-modelpick__desc").text()).toBe("Long documents");
  expect(opts[1]!.find(".bless-modelpick__tag").text()).toBe("vision");
  expect(opts[1]!.findAll(".bless-sr").map((s) => s.text())).toEqual([
    "speed 1 of 3",
    "cost 3 of 3",
  ]);
});

test("BlessModelPicker: a pick sets the model, and labels translate", async () => {
  const w = mount(BlessModelPicker, { props: { models, labels: { choose: "Pilih model" } } });
  expect(w.find("button.bless-modelpick").text()).toBe("Pilih model");
  w.findComponent({ name: "BlessListbox" }).vm.$emit("update:modelValue", "deep");
  await w.vm.$nextTick();
  expect(w.emitted("update:modelValue")).toEqual([["deep"]]);
});
