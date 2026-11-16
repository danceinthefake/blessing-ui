import { mount } from "@vue/test-utils";
import BlessApprovalFlow, { stepState, type BlessApprovalStep } from "./BlessApprovalFlow.vue";

test("stepState: a rejection rejects, all or any decides the approval", () => {
  const s = (rule: "all" | "any", ds: ("approved" | "rejected" | undefined)[]) =>
    stepState({
      id: "x",
      title: "x",
      rule,
      approvers: ds.map((d, i) => ({ name: `p${i}`, decision: d })),
    });
  expect(s("all", ["approved", undefined])).toBe("pending");
  expect(s("any", ["approved", undefined])).toBe("approved");
  expect(s("any", ["approved", "rejected"])).toBe("rejected");
  expect(s("all", ["approved", "approved"])).toBe("approved");
});

const steps: BlessApprovalStep[] = [
  {
    id: "edit",
    title: "Editor",
    approvers: [{ name: "Budi", decision: "approved", time: "09:10" }],
  },
  {
    id: "prod",
    title: "Producer",
    rule: "any",
    approvers: [{ name: "Ana" }, { name: "Citra", note: "Check the intro." }],
  },
  { id: "legal", title: "Legal", approvers: [{ name: "Dimas" }] },
];

test("BlessApprovalFlow: the steps with marks and words, the current step, and the summary", () => {
  const w = mount(BlessApprovalFlow, { props: { steps } });
  expect(w.find("[role=status]").text()).toBe("Waiting for: Producer");
  const items = w.findAll(".bless-approval__step");
  expect(items.map((i) => i.find(".bless-approval__state").text())).toEqual([
    "Approved",
    "Waiting",
    "Waiting",
  ]);
  expect(items[1]!.attributes("aria-current")).toBe("step");
  expect(items[1]!.find(".bless-approval__rule").text()).toBe("One approval is enough");
  expect(items[1]!.find(".bless-approval__note").text()).toBe("“Check the intro.”");
  expect(w.find(".bless-approval__act").exists()).toBe(false);
});

test("BlessApprovalFlow: a waiting approver of the current step decides with a note", async () => {
  const w = mount(BlessApprovalFlow, { props: { steps, me: "Ana" } });
  await w.find("textarea").setValue("  Good to go  ");
  await w.findAll(".bless-approval__buttons button")[0]!.trigger("click");
  expect(w.emitted("decide")).toEqual([["prod", "approved", "Good to go"]]);
  const other = mount(BlessApprovalFlow, { props: { steps, me: "Dimas" } });
  expect(other.find(".bless-approval__act").exists()).toBe(false);
});
