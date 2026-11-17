import { mount } from "@vue/test-utils";
import BlessAnswerCompare, { type BlessAnswerVote, type BlessComparedAnswer } from "./BlessAnswerCompare.vue";

test("BlessAnswerCompare: blind sources, a vote that shows them, the winner, and thanks", async () => {
  const w = mount(BlessAnswerCompare, {
    props: {
      prompt: "Name a mic",
      answers: [
        { text: "A dynamic mic.", source: "Model 1" },
        { text: "A condenser.", source: "Model 2" },
      ] as [BlessComparedAnswer, BlessComparedAnswer],
      "onUpdate:modelValue": (v: BlessAnswerVote | null) => w.setProps({ modelValue: v }),
    },
  });
  expect(w.findAll("section").map((s) => s.attributes("aria-label"))).toEqual([
    "Answer A",
    "Answer B",
  ]);
  expect(w.find(".bless-ab__source").exists()).toBe(false);
  await w.findAll(".bless-ab__vote button")[1]!.trigger("click");
  expect(w.props("modelValue")).toBe("b");
  expect(w.findAll(".bless-ab__source").map((s) => s.text())).toEqual(["Model 1", "Model 2"]);
  expect(w.findAll("section")[1]!.classes()).toContain("is-won");
  expect(w.findAll(".bless-ab__vote button")[1]!.attributes("aria-pressed")).toBe("true");
  expect(w.find("[role=status]").text()).toContain("Thank you");
  const open = mount(BlessAnswerCompare, {
    props: { blind: false, answers: [{ text: "x", source: "S1" }, { text: "y" }] as [BlessComparedAnswer, BlessComparedAnswer] },
  });
  expect(open.find(".bless-ab__source").text()).toBe("S1");
});
