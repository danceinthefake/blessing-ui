import { mount } from "@vue/test-utils";
import BlessPaywall from "./BlessPaywall.vue";

test("BlessPaywall: a faded preview, a section named by its title, plan radios, subscribe, and sign in", async () => {
  const w = mount(BlessPaywall, {
    props: {
      plans: [
        { id: "m", name: "Monthly", price: "$5 / month" },
        { id: "y", name: "Yearly", price: "$48 / year", note: "Save 20%" },
      ],
      pick: "y",
      signInHref: "/login",
    },
    slots: { default: "<p>Free text</p>" },
  });
  expect(w.find(".bless-paywall__preview p").text()).toBe("Free text");
  const section = w.find("section");
  expect(w.find(`#${section.attributes("aria-labelledby")}`).text()).toBe(
    "Read the rest of this article",
  );
  const radios = w.findAll("input[type=radio]");
  expect((radios[1]!.element as HTMLInputElement).checked).toBe(true);
  expect(w.find(".bless-paywall__note").text()).toBe("Save 20%");
  await radios[0]!.setValue(true);
  await w.find("form").trigger("submit");
  expect(w.emitted("subscribe")).toEqual([["m"]]);
  expect(w.find(".bless-paywall__signin").attributes("href")).toBe("/login");
});

test("BlessPaywall picks a plan when the plans load after mount", async () => {
  const plans = [
    { id: "m", name: "Monthly", price: "$5 / month" },
    { id: "y", name: "Yearly", price: "$48 / year" },
  ];
  const w = mount(BlessPaywall, { props: { plans: [] as typeof plans, pick: "y" } });
  await w.setProps({ plans });
  expect((w.findAll("input[type=radio]")[1]!.element as HTMLInputElement).checked).toBe(true);
  await w.setProps({ plans: plans.slice(0, 1) });
  expect((w.find("input[type=radio]").element as HTMLInputElement).checked).toBe(true);
});
