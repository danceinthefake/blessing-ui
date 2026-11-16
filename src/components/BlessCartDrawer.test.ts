import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessCartDrawer, { type BlessCartLine } from "./BlessCartDrawer.vue";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});

const sheet = (lines: BlessCartLine[]) => {
  const w = mount(BlessCartDrawer, {
    attachTo: document.body,
    props: {
      open: true,
      modelValue: lines,
      max: 3,
      "onUpdate:modelValue": (v: BlessCartLine[]) => w.setProps({ modelValue: v }),
    },
  });
  return w;
};
const lines = (w: ReturnType<typeof sheet>) => w.props("modelValue") as BlessCartLine[];

test("BlessCartDrawer: title with the count, line sums, subtotal, and checkout", async () => {
  const w = sheet([
    { id: "a", name: "Mic", price: 50, quantity: 2, variant: "Black" },
    { id: "b", name: "Cable", price: 5, quantity: 1 },
  ]);
  await nextTick();
  expect(document.body.textContent).toContain("Cart (3)");
  expect(w.findAll(".bless-cart__sum").map((s) => s.text())).toEqual(["$100.00", "$5.00"]);
  expect(w.find(".bless-cart__total strong").text()).toBe("$105.00");
  expect(w.find(".bless-cart__variant").text()).toBe("Black");
  await w.find(".bless-cart__foot button").trigger("click");
  expect(w.emitted("checkout")).toHaveLength(1);
  w.unmount();
});

test("BlessCartDrawer: more, less, a typed quantity within 1 and max, remove, and the empty state", async () => {
  const w = sheet([{ id: "a", name: "Mic", price: 50, quantity: 1 }]);
  await nextTick();
  const qty = () => w.findAll(".bless-cart__qty button");
  expect(qty()[0]!.attributes("disabled")).toBeDefined();
  expect(qty()[1]!.attributes("aria-label")).toBe("One more Mic");
  await qty()[1]!.trigger("click");
  expect(lines(w)[0]!.quantity).toBe(2);
  await w.find(".bless-cart__qty input").setValue("9");
  await w.find(".bless-cart__qty input").trigger("change");
  expect(lines(w)[0]!.quantity).toBe(3);
  await w.find(".bless-cart__remove").trigger("click");
  expect(lines(w)).toEqual([]);
  expect(w.find(".bless-cart__empty").text()).toBe("Your cart is empty.");
  expect(w.find(".bless-cart__foot button").attributes("disabled")).toBeDefined();
  w.unmount();
});
