import { currencyDigits, moneyFormat } from "./money";

test("moneyFormat: fixed decimals for each currency, and options can lower the maximum", () => {
  expect(currencyDigits("idr")).toBe(0);
  expect(currencyDigits("KWD")).toBe(3);
  expect(currencyDigits("USD")).toBe(2);
  expect(moneyFormat("en", "IDR").format(1299000.4).replace(/\s/g, " ")).toBe("IDR 1,299,000");
  expect(moneyFormat("en", "USD").format(3)).toBe("$3.00");
  expect(moneyFormat("en", "USD", { maximumFractionDigits: 0 }).format(3.4)).toBe("$3");
});
