import { mount } from "@vue/test-utils";
import BlessMedicationSchedule from "./BlessMedicationSchedule.vue";

const doses = [
  { id: "b", medicine: "Vitamin D", amount: "1 tablet", time: "20:00" },
  { id: "a", medicine: "Metformin", amount: "500 mg", time: "08:00", note: "with food" },
  { id: "c", medicine: "Aspirin", amount: "1 tablet", time: "08:00" },
];

test("BlessMedicationSchedule: groups by time, late in words, mark taken, and the count", async () => {
  const w = mount(BlessMedicationSchedule, {
    props: {
      doses,
      now: "12:00",
      "onUpdate:modelValue": (v: string[]) => w.setProps({ modelValue: v }),
    },
  });
  expect(w.findAll(".bless-meds__time").map((t) => t.text())).toEqual(["08:00", "20:00"]);
  const first = w.findAll(".bless-meds__dose")[0]!;
  expect(first.find(".bless-meds__amount").text()).toBe("500 mg · with food");
  expect(first.find(".bless-meds__late").text()).toBe("late");
  expect(first.find("input").attributes("aria-label")).toBe("Metformin at 08:00");
  expect(w.find("[role=status]").text()).toBe("0 of 3 doses taken");
  await first.find("input").setValue(true);
  expect(w.props("modelValue")).toEqual(["a"]);
  expect(w.findAll(".bless-meds__dose")[0]!.find(".bless-meds__late").exists()).toBe(false);
  expect(w.find("[role=status]").text()).toBe("1 of 3 doses taken");
  // a dose later in the day is not late
  expect(w.findAll(".bless-meds__dose")[2]!.classes()).not.toContain("is-late");
});
