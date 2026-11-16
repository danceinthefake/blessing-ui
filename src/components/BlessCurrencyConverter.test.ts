import { mount } from "@vue/test-utils";
import BlessCurrencyConverter from "./BlessCurrencyConverter.vue";

const rates = { USD: 1, EUR: 0.5, IDR: 16000 };
const sheet = () => {
  const w = mount(BlessCurrencyConverter, {
    props: {
      rates,
      amount: 10,
      updated: "16 Nov",
      "onUpdate:amount": (v: number) => w.setProps({ amount: v }),
      "onUpdate:from": (v: string) => w.setProps({ from: v }),
      "onUpdate:to": (v: string) => w.setProps({ to: v }),
    },
  });
  return w;
};

test("BlessCurrencyConverter: the result, the rate line, and names in the menus", () => {
  const w = sheet();
  expect(w.find("output").text()).toBe("€5.00");
  expect(w.find(".bless-fx__rate").text()).toBe("$1.00 = €0.50 · Rates of 16 Nov");
  expect(w.find("option").text()).toBe("EUR · Euro");
});

test("BlessCurrencyConverter: type an amount, swap, and pick another currency", async () => {
  const w = sheet();
  await w.find("input").setValue("4");
  expect(w.find("output").text()).toBe("€2.00");
  await w.find(".bless-fx__swap").trigger("click");
  expect(w.emitted("update:from")!.at(-1)).toEqual(["EUR"]);
  expect(w.find("output").text()).toBe("$8.00");
  await w.findAll("select")[1]!.setValue("IDR");
  expect(w.find("output").text().replace(/\s/g, " ")).toBe("IDR 128,000");
});
