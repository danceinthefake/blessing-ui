import { mount } from "@vue/test-utils";
import BlessAgentPlan from "./BlessAgentPlan.vue";

const steps = [
  { id: 1, title: "Read the transcript", status: "done" as const },
  { id: 2, title: "Find the chapters", status: "running" as const, detail: "6 found so far" },
  { id: 3, title: "Write the notes", status: "pending" as const },
  { id: 4, title: "Post to the site", status: "failed" as const, detail: "No access" },
  { id: 5, title: "Tweet", status: "skipped" as const },
];

test("BlessAgentPlan: steps with their state, the progress, and the running step announced", () => {
  const w = mount(BlessAgentPlan, { props: { steps, title: "Episode 41 notes" } });
  const items = w.findAll(".bless-plan__step");
  expect(items.map((i) => i.classes().find((c) => c.startsWith("is-")))).toEqual([
    "is-done",
    "is-running",
    "is-pending",
    "is-failed",
    "is-skipped",
  ]);
  expect(items[1]!.attributes("aria-current")).toBe("step");
  expect(items[1]!.find(".bless-spinner").exists()).toBe(true);
  expect(items[3]!.find(".bless-sr").text()).toBe(", Failed");
  expect(items[1]!.find(".bless-plan__detail").text()).toBe("6 found so far");
  expect(w.find(".bless-plan__summary").text()).toBe("1 of 5 steps done");
  expect(w.find(".bless-plan__bar span").attributes("style")).toContain("inline-size: 20%");
  expect(w.find("[role=status]").text()).toBe("Running: Find the chapters");
  expect(w.attributes("aria-label")).toBe("Episode 41 notes");
});

test("BlessAgentPlan: no running step leaves the status empty, and labels translate", () => {
  const w = mount(BlessAgentPlan, {
    props: {
      steps: [steps[0]!],
      labels: { done: "Selesai", summary: (d: number, t: number) => `${d}/${t} selesai` },
    },
  });
  expect(w.find("[role=status]").text()).toBe("");
  expect(w.find(".bless-plan__summary").text()).toBe("1/1 selesai");
  expect(w.find(".bless-plan__step .bless-sr").text()).toBe(", Selesai");
});
