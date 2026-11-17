import { mount } from "@vue/test-utils";
import BlessEligibilityCheck from "./BlessEligibilityCheck.vue";

const questions = [
  {
    id: "age",
    text: "Are you 18 or older?",
    options: [
      { label: "Yes", next: "home" },
      { label: "No", next: "young" },
    ],
  },
  {
    id: "home",
    text: "Do you live in Jakarta?",
    hint: "Your KTP shows it.",
    options: [
      { label: "Yes", next: "ok" },
      { label: "No", next: "away" },
    ],
  },
];
const outcomes = [
  {
    id: "ok",
    title: "Apply for the grant",
    eligible: true,
    href: "/apply",
    cta: "Start your request",
  },
  { id: "young", title: "Ask a parent to apply", eligible: false },
  { id: "away", title: "Apply in your own city", eligible: false },
];

test("BlessEligibilityCheck: one question at a time, an error without a choice, back, an outcome, and start again", async () => {
  const w = mount(BlessEligibilityCheck, {
    props: { questions, outcomes },
    attachTo: document.body,
  });
  expect(w.find("legend").text()).toBe("Question 1Are you 18 or older?");
  await w.find("form").trigger("submit");
  expect(w.find(".bless-elig__error").text()).toBe("Choose an answer.");
  expect(w.find("fieldset").attributes("aria-describedby")).toBe(
    w.find(".bless-elig__error").attributes("id"),
  );
  await w.findAll("input")[0]!.setValue(true);
  await w.find("form").trigger("submit");
  expect(w.find("legend").text()).toBe("Question 2Do you live in Jakarta?");
  expect(document.activeElement?.textContent).toBe("Do you live in Jakarta?");
  await w.find(".bless-elig__actions button:not(.is-main)").trigger("click");
  expect(w.find("legend").text()).toContain("Are you 18");
  expect((w.findAll("input")[0]!.element as HTMLInputElement).checked).toBe(true);
  await w.find("form").trigger("submit");
  await w.findAll("input")[0]!.setValue(true);
  await w.find("form").trigger("submit");
  expect(w.find(".bless-elig__verdict").text()).toBe("✓ You can apply");
  expect(w.find(".bless-elig__actions a").text()).toBe("Start your request");
  expect(w.emitted("result")).toEqual([["ok", { age: "Yes", home: "Yes" }]]);
  await w.findAll(".bless-elig__actions button")[1]!.trigger("click");
  expect(w.find("legend").text()).toContain("Question 1");
  w.unmount();
});
