import { mount } from "@vue/test-utils";
import BlessUnitConverter, { splitUnits } from "./BlessUnitConverter.vue";

const units = [
  { id: "pcs", name: "pcs", perBase: 1 },
  { id: "box", name: "box", perBase: 12 },
  { id: "ctn", name: "carton", perBase: 144 },
];

test("splitUnits: the largest whole units first, and the rest", () => {
  expect(splitUnits(293, units).parts.map((p) => [p.unit.id, p.count])).toEqual([
    ["ctn", 2],
    ["pcs", 5],
  ]);
  expect(splitUnits(2.5, [{ id: "a", name: "a", perBase: 1 }]).rest).toBe(0.5);
});

test("BlessUnitConverter: the result, whole units, swap, and a new unit", async () => {
  const w = mount(BlessUnitConverter, {
    props: {
      units,
      amount: 3,
      from: "ctn",
      to: "box",
      "onUpdate:amount": (v: number) => w.setProps({ amount: v }),
      "onUpdate:from": (v: unknown) => w.setProps({ from: v as string }),
      "onUpdate:to": (v: unknown) => w.setProps({ to: v as string }),
    },
  });
  expect(w.find("output").text().replace(/\s+/g, " ")).toBe("3 carton = 36 box");
  await w.find("input").setValue("2.5");
  expect(w.find("output").text().replace(/\s+/g, " ")).toBe("2.5 carton = 30 box");
  expect(w.find(".bless-units__split").text()).toBe("In whole units: 2 carton, 6 box");
  await w.find(".bless-units__swap").trigger("click");
  expect(w.find("output").text().replace(/\s+/g, " ")).toBe("2.5 box = 0.208 carton");
});
