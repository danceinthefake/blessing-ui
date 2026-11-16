import { mount } from "@vue/test-utils";
import BlessDeliveryPicker, { type BlessDeliveryDay } from "./BlessDeliveryPicker.vue";

const days: BlessDeliveryDay[] = [
  { date: "2026-11-16", windows: [{ id: "a1", start: "09:00", end: "12:00", fee: 5, full: true }] },
  {
    date: "2026-11-17",
    windows: [
      { id: "b1", start: "09:00", end: "12:00", fee: 0 },
      { id: "b2", start: "18:00", end: "21:00", fee: 3 },
    ],
  },
];

test("BlessDeliveryPicker: a full day is off, the first open day shows, fees and Free, and a pick", async () => {
  const w = mount(BlessDeliveryPicker, {
    props: { days, "onUpdate:modelValue": (v: unknown) => w.setProps({ modelValue: v as string }) },
  });
  const dayBoxes = w.findAll(".bless-delivery__day input");
  expect(dayBoxes[0]!.attributes("disabled")).toBeDefined();
  expect(w.findAll(".bless-delivery__day")[0]!.text().replace(/\s+/g, " ")).toBe("Mon Nov 16 Full");
  expect((dayBoxes[1]!.element as HTMLInputElement).checked).toBe(true);
  expect(w.findAll(".bless-delivery__window").map((x) => x.text().replace(/\s+/g, " "))).toEqual([
    "09:00–12:00 Free",
    "18:00–21:00 $3.00",
  ]);
  await w.findAll(".bless-delivery__window input")[1]!.setValue(true);
  expect(w.props("modelValue")).toBe("b2");
});

test("BlessDeliveryPicker: a chosen window opens its day", () => {
  const w = mount(BlessDeliveryPicker, { props: { days, modelValue: "a1" } });
  expect((w.findAll(".bless-delivery__day input")[0]!.element as HTMLInputElement).checked).toBe(
    true,
  );
  expect(w.find(".bless-delivery__window").text().replace(/\s+/g, " ")).toBe("09:00–12:00 Full");
});
