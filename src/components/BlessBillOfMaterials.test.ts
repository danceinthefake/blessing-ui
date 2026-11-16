import { mount } from "@vue/test-utils";
import BlessBillOfMaterials, { bomNeeds, type BlessBomPart } from "./BlessBillOfMaterials.vue";

const parts: BlessBomPart[] = [
  {
    id: "body",
    name: "Body",
    quantity: 1,
    children: [
      { id: "screw", name: "Screw", sku: "SCR", quantity: 4, unit: "pcs", cost: 1 },
      { id: "shell", name: "Shell", quantity: 1, cost: 10 },
    ],
  },
  { id: "screw2", name: "Screw", sku: "SCR", quantity: 2, unit: "pcs", cost: 1 },
];

test("bomNeeds: leaves times the path, the same SKU added up, and the cost", () => {
  const n = bomNeeds(parts, 3);
  expect(n.list.map((x) => [x.part.sku ?? x.part.id, x.quantity])).toEqual([
    ["SCR", 18],
    ["shell", 3],
  ]);
  expect(n.cost).toBe(48);
});

test("BlessBillOfMaterials: rows with each and in all, a count that scales them, close a group, and the cost", async () => {
  const w = mount(BlessBillOfMaterials, {
    props: { product: "Mic", parts, "onUpdate:count": (v: number) => w.setProps({ count: v }) },
  });
  const row = (i: number) => w.findAll(".bless-bom__row")[i]!;
  expect(row(1).find(".bless-bom__per").text()).toBe("4 pcs each");
  expect(row(1).find(".bless-bom__total").text()).toBe("4 pcs in all");
  await w.find("input[type=number]").setValue("2");
  await w.find("input[type=number]").trigger("change");
  expect(row(1).find(".bless-bom__total").text()).toBe("8 pcs in all");
  expect(w.find("[role=status]").text()).toBe("Parts cost $32.00");
  const toggle = w.find(".bless-bom__toggle");
  expect(toggle.attributes("aria-expanded")).toBe("true");
  await toggle.trigger("click");
  expect(w.findAll(".bless-bom__row")).toHaveLength(2);
});
