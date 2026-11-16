import { mount } from "@vue/test-utils";
import BlessQuiz from "./BlessQuiz.vue";

const questions = [
  {
    question: "Which room is best?",
    choices: ["Bathroom", "Wardrobe"],
    answer: 1,
    explain: "Clothes stop echo.",
  },
  { question: "Loudness for apps?", choices: ["-16 LUFS", "-6 LUFS"], answer: 0 },
];

test("BlessQuiz: check marks right and wrong with the reason, then next, then the score", async () => {
  const w = mount(BlessQuiz, { props: { questions }, attachTo: document.body });
  expect(w.find(".bless-quiz__progress").text()).toBe("Question 1 of 2");
  expect(w.find("button[type=submit]").attributes("disabled")).toBeDefined();
  await w.findAll("input[type=radio]")[0]!.setValue(true);
  await w.find("form").trigger("submit");
  expect(w.find("[role=status]").text()).toBe(
    "Not this one. The answer is: WardrobeClothes stop echo.",
  );
  expect(w.findAll(".bless-quiz__choice")[1]!.classes()).toContain("is-right");
  expect(w.findAll(".bless-quiz__choice")[0]!.classes()).toContain("is-wrong");
  expect(w.find("input[type=radio]").attributes("disabled")).toBeDefined();
  expect(w.find("button[type=submit]").text()).toBe("Next question");
  await w.find("form").trigger("submit");
  expect(w.find(".bless-quiz__progress").text()).toBe("Question 2 of 2");
  await w.findAll("input[type=radio]")[0]!.setValue(true);
  await w.find("form").trigger("submit");
  expect(w.find("[role=status]").text()).toBe("Right!");
  expect(w.find("button[type=submit]").text()).toBe("See the score");
  await w.find("form").trigger("submit");
  expect(w.find(".bless-quiz__score").text()).toBe("You got 1 of 2 right.");
  expect(w.emitted("finish")).toEqual([[1, 2]]);
  await w.find(".bless-quiz__end button").trigger("click");
  expect(w.find(".bless-quiz__progress").text()).toBe("Question 1 of 2");
  w.unmount();
});
