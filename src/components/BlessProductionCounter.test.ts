import { mount } from "@vue/test-utils";
import BlessProductionCounter from "./BlessProductionCounter.vue";

test("BlessProductionCounter: count good and scrap, the yield, undo the last tap, and a status", async () => {
  const w = mount(BlessProductionCounter, {
    props: {
      target: 10,
      good: 3,
      "onUpdate:good": (v: number) => w.setProps({ good: v }),
      "onUpdate:scrap": (v: number) => w.setProps({ scrap: v }),
    },
  });
  const [good, scrap] = w.findAll(".bless-prodcount__btn");
  expect(w.find(".bless-prodcount__undo").attributes("disabled")).toBeDefined();
  await good!.trigger("click");
  await scrap!.trigger("click");
  expect(w.props("good")).toBe(4);
  expect(w.props("scrap")).toBe(1);
  expect(w.find(".is-scrap .bless-prodcount__target").text()).toBe("Yield 80%");
  expect(w.find(".bless-prodcount__track span").attributes("style")).toContain("inline-size: 40%");
  expect(w.find("[role=status]").text()).toBe("4 good, 1 scrap");
  await w.find(".bless-prodcount__undo").trigger("click");
  expect(w.props("scrap")).toBe(0);
  expect(w.find("[role=status]").text()).toBe("4 good, 0 scrap");
});
