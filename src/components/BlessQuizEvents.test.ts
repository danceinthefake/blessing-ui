import { mount } from "@vue/test-utils";
import BlessQuiz from "./BlessQuiz.vue";

const questions = [
  { question: "One?", choices: ["a", "b"], answer: 1 },
  { question: "Two?", choices: ["c", "d"], answer: 0 },
];

test("BlessQuiz: answer and question events, and the before slot", async () => {
  const w = mount(BlessQuiz, {
    props: { questions },
    slots: { before: `<template #before="{ question, index }"><pre class="snip">{{ index }} {{ question.question }}</pre></template>` },
  });
  expect(w.emitted("question")![0]).toEqual([0]);
  expect(w.get(".snip").text()).toBe("0 One?");
  await w.findAll("input[type=radio]")[0]!.setValue(true);
  await w.get("form").trigger("submit");
  expect(w.emitted("answer")![0]).toEqual([0, false]);
  await w.get("form").trigger("submit");
  expect(w.emitted("question")![1]).toEqual([1]);
  expect(w.get(".snip").text()).toBe("1 Two?");
  await w.findAll("input[type=radio]")[0]!.setValue(true);
  await w.get("form").trigger("submit");
  expect(w.emitted("answer")![1]).toEqual([1, true]);
});
