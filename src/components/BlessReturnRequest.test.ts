import { mount } from "@vue/test-utils";
import BlessReturnRequest from "./BlessReturnRequest.vue";

const items = [
  { id: "mic", name: "Mic", quantity: 1, price: 50 },
  { id: "cable", name: "Cable", quantity: 3, price: 5 },
];

test("BlessReturnRequest: an empty send says what is missing, then items, quantity, reason, note, and the refund", async () => {
  const w = mount(BlessReturnRequest, { props: { items } });
  await w.find("form").trigger("submit");
  expect(w.find("[role=alert]").text()).toBe("Pick at least one item and a reason.");
  expect(w.find(".bless-return__input").attributes("aria-invalid")).toBe("true");
  expect(w.emitted("submit")).toBeUndefined();

  const boxes = w.findAll("input[type=checkbox]");
  await boxes[1]!.setValue(true);
  // all of a line by default, and a menu to send back fewer
  const qty = w.find(".bless-return__qty");
  expect(qty.attributes("aria-label")).toBe("How many of Cable");
  expect(w.find(".bless-return__refund strong").text()).toBe("$15.00");
  await qty.setValue("2");
  expect(w.find(".bless-return__refund strong").text()).toBe("$10.00");
  await boxes[0]!.setValue(true);
  expect(w.find(".bless-return__refund strong").text()).toBe("$60.00");

  await w.findAll("select").at(-1)!.setValue("Wrong item");
  await w.find("textarea").setValue("  Wrong color  ");
  await w.find("form").trigger("submit");
  expect(w.find("[role=alert]").text()).toBe("");
  expect(w.emitted("submit")).toEqual([
    [
      {
        items: [
          { id: "mic", quantity: 1 },
          { id: "cable", quantity: 2 },
        ],
        reason: "Wrong item",
        note: "Wrong color",
      },
    ],
  ]);
});
