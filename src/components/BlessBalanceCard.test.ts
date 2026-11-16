import { mount } from "@vue/test-utils";
import BlessBalanceCard from "./BlessBalanceCard.vue";

const norm = (s: string) => s.replace(/\s/g, " ");

test("BlessBalanceCard: the amount, the change with a sign and a word, and actions", () => {
  const w = mount(BlessBalanceCard, {
    props: { label: "Main", amount: 1250.5, change: -40, period: "this week" },
    slots: { default: "<button>Send</button>" },
  });
  expect(w.find(".bless-balance__amount").text()).toBe("$1,250.50");
  expect(norm(w.find(".bless-balance__change").text())).toBe("−$40.00 down · this week");
  expect(w.find(".bless-balance__change").classes()).toContain("is-down");
  expect(w.find(".bless-balance__actions button").text()).toBe("Send");
});

test("BlessBalanceCard: the eye hides the amount and the change", async () => {
  const w = mount(BlessBalanceCard, {
    props: {
      label: "Main",
      amount: 10,
      change: 2,
      "onUpdate:masked": (v: boolean) => w.setProps({ masked: v }),
    },
  });
  expect(w.find(".bless-balance__change").text()).toContain("+$2.00 up");
  await w.find(".bless-balance__eye").trigger("click");
  expect(w.find(".bless-balance__eye").attributes("aria-pressed")).toBe("true");
  expect(w.find(".bless-balance__eye").attributes("aria-label")).toBe("Show the balance");
  expect(w.find(".bless-balance__amount").text()).toBe("••••••Hidden");
  expect(w.find(".bless-balance__change").exists()).toBe(false);
});
