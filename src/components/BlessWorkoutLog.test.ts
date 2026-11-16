import { mount } from "@vue/test-utils";
import BlessWorkoutLog, { type BlessWorkoutSet } from "./BlessWorkoutLog.vue";

const sheet = (sets: BlessWorkoutSet[]) => {
  const w = mount(BlessWorkoutLog, {
    props: {
      exercise: "Squat",
      previous: [{ weight: 60, reps: 8 }],
      modelValue: sets,
      "onUpdate:modelValue": (v: BlessWorkoutSet[]) => w.setProps({ modelValue: v }),
    },
  });
  return w;
};
const sets = (w: ReturnType<typeof sheet>) => w.props("modelValue") as BlessWorkoutSet[];

test("BlessWorkoutLog: last time, edit weight and reps, done, volume, add copies, and remove", async () => {
  const w = sheet([{ weight: 62.5, reps: 8 }]);
  expect(w.find(".bless-workout__last").text()).toBe("60 × 8");
  const [weight, reps] = w.findAll("input[type=number]");
  expect(weight!.attributes("aria-label")).toBe("Weight, set 1");
  await reps!.setValue("6");
  await reps!.trigger("change");
  expect(sets(w)[0]).toMatchObject({ weight: 62.5, reps: 6 });
  await w.find("input[type=checkbox]").setValue(true);
  expect(w.find(".bless-workout__volume").text()).toBe("Volume 375 kg");
  await w.find(".bless-workout__add").trigger("click");
  expect(sets(w)[1]).toEqual({ weight: 62.5, reps: 6, done: false });
  expect(w.findAll(".bless-workout__last")[1]!.text()).toBe("–");
  await w.findAll(".bless-workout__remove")[1]!.trigger("click");
  expect(sets(w)).toHaveLength(1);
});
