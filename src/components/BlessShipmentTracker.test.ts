import { mount } from "@vue/test-utils";
import BlessShipmentTracker from "./BlessShipmentTracker.vue";

const events = [
  { time: "14 Nov, 09:12", text: "Out for delivery", place: "Jakarta" },
  { time: "13 Nov, 20:40", text: "Arrived at the hub", place: "Jakarta" },
];

test("BlessShipmentTracker: five stages, the done ones checked, the current one marked, with dates", () => {
  const w = mount(BlessShipmentTracker, {
    props: {
      stage: 3,
      dates: ["10 Nov", "11 Nov", "12 Nov", "14 Nov"],
      events,
      carrier: "JNE",
      tracking: "JN123",
      trackingUrl: "#t",
    },
  });
  const stages = w.findAll(".bless-ship__stage");
  expect(stages.map((s) => s.find(".bless-ship__name").text())).toEqual([
    "Ordered",
    "Packed",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ]);
  expect(stages.map((s) => s.classes().includes("is-done"))).toEqual([
    true,
    true,
    true,
    false,
    false,
  ]);
  expect(stages[3]!.attributes("aria-current")).toBe("step");
  expect(stages[3]!.find(".bless-sr").text()).toBe(", current step");
  expect(stages[0]!.find(".bless-sr").text()).toBe(", done");
  expect(stages[3]!.find(".bless-ship__date").text()).toBe("14 Nov");
  expect(w.find(".bless-ship__stages").attributes("style")).toContain("--_done: 0.75");
  expect(w.find(".bless-ship__latest").text()).toContain("Out for delivery");
  expect(w.find(".bless-ship__latest").text()).toContain("Jakarta · 14 Nov, 09:12");
  expect(w.find(".bless-ship__history summary").text()).toBe("All updates (2)");
  expect(w.find(".bless-ship__tracking").text()).toBe("Tracking number (JNE): JN123");
  expect(w.find(".bless-ship__tracking a").attributes("href")).toBe("#t");
});

test("BlessShipmentTracker: a problem is an alert on the current stage, delivered is done, and labels translate", () => {
  const p = mount(BlessShipmentTracker, { props: { stage: 3, problem: "Nobody was home" } });
  expect(p.find("[role=alert]").text()).toBe("Nobody was home");
  expect(p.find(".is-current .bless-ship__dot").text()).toBe("!");
  expect(p.find(".bless-ship__history").exists()).toBe(false);
  const d = mount(BlessShipmentTracker, { props: { stage: 9, labels: { delivered: "Diterima" } } });
  const last = d.findAll(".bless-ship__stage").at(-1)!;
  expect(last.classes()).toContain("is-done");
  expect(last.find(".bless-ship__name").text()).toBe("Diterima");
});
