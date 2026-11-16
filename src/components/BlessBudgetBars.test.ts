import { mount } from "@vue/test-utils";
import BlessBudgetBars from "./BlessBudgetBars.vue";

test("BlessBudgetBars: spent of budget, left or over in words, a capped bar, and a total row", () => {
  const w = mount(BlessBudgetBars, {
    props: {
      budgets: [
        { name: "Gear", spent: 150, budget: 100 },
        { name: "Food", spent: 30, budget: 120 },
      ],
    },
  });
  const rows = w.findAll(".bless-budget__row");
  expect(rows.map((r) => r.find(".bless-budget__name").text())).toEqual(["Gear", "Food", "Total"]);
  expect(rows[0]!.classes()).toContain("is-over");
  expect(rows[0]!.find(".bless-budget__nums").text()).toBe("$150 of $100");
  expect(rows[0]!.find(".bless-budget__rest").text()).toBe("$50 over");
  expect(rows[0]!.find(".bless-budget__fill").attributes("style")).toContain("inline-size: 100%");
  expect(rows[1]!.find(".bless-budget__rest").text()).toBe("$90 left");
  expect(rows[1]!.find(".bless-budget__fill").attributes("style")).toContain("inline-size: 25%");
  expect(rows[2]!.find(".bless-budget__nums").text()).toBe("$180 of $220");
  expect(rows[2]!.classes()).toContain("is-total");
});
