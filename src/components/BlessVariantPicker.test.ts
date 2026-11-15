import { mount } from "@vue/test-utils";
import BlessVariantPicker from "./BlessVariantPicker.vue";

const options = [
  {
    key: "color",
    name: "Color",
    values: [
      { value: "black", label: "Black", color: "#111" },
      { value: "sand", label: "Sand", color: "#d8c8a8", soldOut: true },
    ],
  },
  {
    key: "size",
    name: "Size",
    values: [
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L", soldOut: true },
    ],
  },
];

test("BlessVariantPicker: a radio group per option, the chosen value in the legend, sold out disabled", () => {
  const w = mount(BlessVariantPicker, { props: { options, modelValue: { color: "black" } } });
  const groups = w.findAll("fieldset");
  expect(groups.map((g) => g.find("legend").text())).toEqual(["Color: Black", "Size"]);
  const radios = groups[0]!.findAll("input[type=radio]");
  expect(radios[0]!.attributes("name")).toBe(radios[1]!.attributes("name"));
  expect((radios[0]!.element as HTMLInputElement).checked).toBe(true);
  expect(radios[1]!.attributes("disabled")).toBeDefined();
  expect(groups[0]!.findAll("label")[1]!.text()).toBe("Sand, sold out");
  expect(groups[0]!.find(".bless-variant__swatch").attributes("style")).toContain(
    "background: rgb(17, 17, 17)",
  );
  expect(groups[1]!.findAll("input")[0]!.attributes("name")).not.toBe(
    radios[0]!.attributes("name"),
  );
});

test("BlessVariantPicker: a pick keeps the other choices, and labels translate", async () => {
  const w = mount(BlessVariantPicker, {
    props: { options, modelValue: { color: "black" }, labels: { soldOut: "habis" } },
  });
  await w.findAll("fieldset")[1]!.findAll("input")[1]!.trigger("change");
  expect(w.emitted("update:modelValue")).toEqual([[{ color: "black", size: "m" }]]);
  expect(w.findAll("fieldset")[1]!.findAll("label")[2]!.text()).toBe("L, habis");
});
