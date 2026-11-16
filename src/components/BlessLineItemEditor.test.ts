import { mount } from "@vue/test-utils";
import BlessLineItemEditor, { lineTotals, type BlessLineItem } from "./BlessLineItemEditor.vue";

test("lineTotals: gross, discount, net, tax on the net, and total", () => {
  expect(
    lineTotals([
      { id: "a", product: "Mic", quantity: 2, price: 100, discount: 10, tax: 10 },
      { id: "b", product: "Fix", quantity: 1, price: 50 },
    ]),
  ).toEqual({ gross: 250, discount: 20, net: 230, tax: 18, total: 248 });
});

const sheet = (lines: BlessLineItem[]) => {
  const w = mount(BlessLineItemEditor, {
    attachTo: document.body,
    props: {
      modelValue: lines,
      "onUpdate:modelValue": (v: BlessLineItem[]) => w.setProps({ modelValue: v }),
    },
  });
  return w;
};
const lines = (w: ReturnType<typeof sheet>) => w.props("modelValue") as BlessLineItem[];

test("BlessLineItemEditor: fields named with the line, edits, the amount, add, remove, and totals", async () => {
  const w = sheet([{ id: "a", product: "Mic", quantity: 1, unit: "pcs", price: 100, tax: 11 }]);
  const qty = w.find('[aria-label="Qty, line 1"]');
  await qty.setValue("3");
  await qty.trigger("change");
  expect(lines(w)[0]!.quantity).toBe(3);
  expect(w.find(".bless-lines__amount").text()).toBe("$300.00");
  expect(w.find(".is-total dd").text()).toBe("$333.00");
  await w.find(".bless-lines__add").trigger("click");
  expect(lines(w)[1]).toMatchObject({ product: "", quantity: 1, unit: "pcs", price: 0, tax: 11 });
  await w.find('[aria-label="Remove line 1"]').trigger("click");
  expect(lines(w)).toHaveLength(1);
  w.unmount();
});
