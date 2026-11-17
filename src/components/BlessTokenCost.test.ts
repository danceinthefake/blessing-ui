import { mount } from "@vue/test-utils";
import BlessTokenCost, { tokenCost } from "./BlessTokenCost.vue";

test("tokenCost: each kind from prices per million, cached at its own price or the input price", () => {
  expect(
    tokenCost(
      { input: 1_000_000, output: 500_000, cached: 2_000_000 },
      { input: 3, output: 15, cached: 0.3 },
    ),
  ).toEqual({
    input: 3,
    cached: 0.6,
    output: 7.5,
    total: 11.1,
  });
  expect(tokenCost({ input: 0, output: 0, cached: 1e6 }, { input: 2, output: 8 }).cached).toBe(2);
});

test("BlessTokenCost: rows, small costs with three digits, the total, and the caption", () => {
  const w = mount(BlessTokenCost, {
    props: {
      model: "Model X",
      usage: { input: 1200, output: 450, cached: 8000 },
      prices: { input: 3, output: 15, cached: 0.3 },
    },
  });
  expect(w.find("caption").text()).toBe("Cost of the request, Model X");
  const rows = w.findAll("tbody tr").map((r) => r.findAll("th, td").map((c) => c.text()));
  expect(rows).toEqual([
    ["Input", "1,200", "$3.00", "$0.0036"],
    ["Cached input", "8,000", "$0.30", "$0.0024"],
    ["Output", "450", "$15.00", "$0.00675"],
  ]);
  expect(w.findAll("tfoot td").map((c) => c.text())).toEqual(["9,650", "", "$0.0128"]);
});
