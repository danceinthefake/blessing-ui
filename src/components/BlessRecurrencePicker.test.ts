import { mount } from "@vue/test-utils";
import BlessRecurrencePicker, { toRRule, type BlessRecurrence } from "./BlessRecurrencePicker.vue";

const sheet = (rule: BlessRecurrence, props = {}) => {
  const w = mount(BlessRecurrencePicker, {
    props: {
      modelValue: rule,
      "onUpdate:modelValue": (v: BlessRecurrence) => w.setProps({ modelValue: v }),
      ...props,
    },
  });
  return w;
};
const last = (w: ReturnType<typeof sheet>) =>
  w.emitted("update:modelValue")!.at(-1)![0] as BlessRecurrence;

test("toRRule: the rule in RFC 5545 form", () => {
  expect(
    toRRule({ freq: "weekly", interval: 2, days: [3, 0], end: { type: "count", count: 10 } }),
  ).toBe("FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TH;COUNT=10");
  expect(
    toRRule({ freq: "monthly", interval: 1, end: { type: "until", until: "2026-12-31" } }),
  ).toBe("FREQ=MONTHLY;UNTIL=20261231");
});

test("BlessRecurrencePicker: the sentence follows the rule", () => {
  const w = sheet({ freq: "weekly", interval: 2, days: [0, 3], end: { type: "count", count: 10 } });
  expect(w.find("[role=status]").text()).toBe("Every 2 weeks, on Monday and Thursday, 10 times");
  const days = w.findAll(".bless-repeat__day");
  expect(days).toHaveLength(7);
  expect(days[0]!.attributes("aria-pressed")).toBe("true");
  expect(days[1]!.attributes("aria-pressed")).toBe("false");
  expect(days[3]!.attributes("aria-label")).toBe("Thursday");
});

test("BlessRecurrencePicker: days toggle but one stays, the interval and the end change", async () => {
  const w = sheet({ freq: "weekly", interval: 1, days: [0], end: { type: "never" } });
  const days = () => w.findAll(".bless-repeat__day");
  await days()[0]!.trigger("click");
  expect(last(w).days).toEqual([0]); // the last day cannot go
  await days()[4]!.trigger("click");
  expect(last(w).days).toEqual([0, 4]);
  await w.find("input[type=number]").setValue("3");
  await w.find("input[type=number]").trigger("change");
  expect(last(w).interval).toBe(3);
  await w.find("select").setValue("monthly");
  expect(last(w).freq).toBe("monthly");
  expect(w.find(".bless-repeat__days").exists()).toBe(false);
  const radios = w.findAll("input[type=radio]");
  await radios[1]!.trigger("change");
  expect(last(w).end).toEqual({ type: "count", count: 10 });
  expect(w.find("[role=status]").text()).toBe("Every 3 months, 10 times");
});

test("BlessRecurrencePicker: an end date in the locale, and labels translate", () => {
  const w = sheet(
    { freq: "daily", interval: 1, end: { type: "until", until: "2026-12-31" } },
    {
      locale: "id",
      labels: {
        everyUnit: (n: number, u: string) => `Setiap ${n} ${u}`,
        unit: () => "hari",
        endUntil: (d: string) => `sampai ${d}`,
      },
    },
  );
  expect(w.find("[role=status]").text()).toBe("Setiap 1 hari, sampai 31 Des 2026");
});
