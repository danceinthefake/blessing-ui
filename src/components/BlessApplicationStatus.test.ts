import { mount } from "@vue/test-utils";
import BlessApplicationStatus from "./BlessApplicationStatus.vue";

const steps = [
  { label: "Received", date: "3 Nov" },
  { label: "Checked", date: "6 Nov" },
  { label: "Decision" },
];

test("BlessApplicationStatus: state in words, steps done, now, and to come, the action, and next", async () => {
  const w = mount(BlessApplicationStatus, {
    props: {
      title: "Business permit",
      reference: "BP-2026-0417",
      steps,
      current: 1,
      state: "action",
      action: "Send a photo of your lease.",
      actionHref: "/upload",
      actionLabel: "Upload the photo",
      next: "We decide within 10 working days.",
    },
  });
  expect(w.find("section").attributes("aria-label")).toBe("Business permit, BP-2026-0417");
  expect(w.find("[role=status]").text()).toBe("! We need something from you");
  expect(w.find(".bless-appstatus__action a").text()).toBe("Upload the photo");
  const items = w.findAll("li");
  expect(items.map((l) => l.classes()[0])).toEqual(["is-done", "is-now", "is-later"]);
  expect(items[1]!.attributes("aria-current")).toBe("step");
  expect(items[0]!.find(".bless-appstatus__label").text()).toBe("Received, done");
  expect(items[0]!.find(".bless-appstatus__dot").text()).toBe("✓");
  expect(w.find(".bless-appstatus__next").text()).toBe(
    "What happens nextWe decide within 10 working days.",
  );
  await w.setProps({ state: "approved", current: 2, action: undefined });
  expect(w.findAll("li").map((l) => l.classes()[0])).toEqual(["is-done", "is-done", "is-done"]);
  expect(w.find("[aria-current]").exists()).toBe(false);
});
