import { mount } from "@vue/test-utils";
import BlessPricingTable from "./BlessPricingTable.vue";

const plans = [
  { id: "free", name: "Free", price: { monthly: 0, yearly: 0 }, features: ["1 show"] },
  {
    id: "pro",
    name: "Pro",
    description: "For a weekly show",
    price: { monthly: 12, yearly: 120 },
    features: ["5 shows", "Stats"],
    featured: true,
  },
  {
    id: "team",
    name: "Team",
    price: { monthly: 30, yearly: 324 },
    features: ["Seats"],
    cta: "Talk to us",
  },
];

test("BlessPricingTable: plans with prices per period, free, featured, features, and the saving", async () => {
  const w = mount(BlessPricingTable, {
    props: {
      plans,
      period: "monthly" as const,
      "onUpdate:period": (p: "monthly" | "yearly") => w.setProps({ period: p }),
    },
  });
  expect(w.findAll(".bless-pricing__price").map((p) => p.text())).toEqual([
    "Free",
    "$12/ month",
    "$30/ month",
  ]);
  expect(w.find(".bless-pricing__plan--featured .bless-pricing__badge").text()).toBe(
    "Most popular",
  );
  expect(
    w
      .findAll(".bless-pricing__plan")[1]!
      .findAll("li")
      .map((l) => l.text()),
  ).toEqual(["5 shows", "Stats"]);
  // Pro saves 1 - 120 / 144 = 17%, Team 10%: the switch shows the best
  expect(w.find(".bless-pricing__save").text()).toBe("Save 17%");
  await w.findAll(".bless-toggle")[1]!.trigger("click");
  expect(w.props("period")).toBe("yearly");
  expect(w.findAll(".bless-pricing__price").map((p) => p.text())).toEqual([
    "Free",
    "$120/ year",
    "$324/ year",
  ]);
});

test("BlessPricingTable: a button picks the plan with the period; a click on the on toggle keeps it", async () => {
  const w = mount(BlessPricingTable, {
    props: { plans, period: "yearly" as const, currency: "IDR", locale: "id" },
  });
  const buttons = w.findAll(".bless-pricing__plan .bless-button");
  expect(buttons.map((b) => b.text())).toEqual(["Choose plan", "Choose plan", "Talk to us"]);
  await buttons[2]!.trigger("click");
  expect(w.emitted("select")![0]).toEqual([plans[2], "yearly"]);
  expect(w.findAll(".bless-pricing__price")[1]!.text()).toContain("Rp");
  await w.findAll(".bless-toggle")[1]!.trigger("click");
  expect(w.emitted("update:period")).toBeUndefined();
});
