import { mount } from "@vue/test-utils";
import BlessFaqSearch, { markParts } from "./BlessFaqSearch.vue";

test("markParts: marks every match, any case, and quotes special letters", () => {
  expect(markParts("Mic or mic?", "MIC")).toEqual([
    { text: "Mic", hit: true },
    { text: " or ", hit: false },
    { text: "mic", hit: true },
    { text: "?", hit: false },
  ]);
  expect(markParts("a (b)", "(b")).toEqual([
    { text: "a ", hit: false },
    { text: "(b", hit: true },
    { text: ")", hit: false },
  ]);
  expect(markParts("x", " ")).toEqual([{ text: "x", hit: false }]);
});

const items = [
  { question: "Which microphone do you use?", answer: "A USB one under $100." },
  { question: "How long is an episode?", answer: "About 45 minutes." },
  { question: "Can I be a guest?", answer: "Write to us with your microphone setup." },
];

test("BlessFaqSearch: a search filters, opens the matches, marks the words, and counts them", async () => {
  const w = mount(BlessFaqSearch, { props: { items } });
  expect(w.findAll("details")).toHaveLength(3);
  expect(w.findAll("details").every((d) => d.attributes("open") === undefined)).toBe(true);
  await w.find("input").setValue("microphone");
  const d = w.findAll("details");
  expect(d).toHaveLength(2);
  expect(d.every((x) => x.attributes("open") !== undefined)).toBe(true);
  expect(w.findAll("mark").map((m) => m.text())).toEqual(["microphone", "microphone"]);
  expect(w.find("[role=status]").text()).toBe("2 of 3 questions");
  await w.find("input").setValue("zzz");
  expect(w.find("[role=status]").text()).toBe("No question matches. Try other words.");
});
