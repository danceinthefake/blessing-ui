import { mount } from "@vue/test-utils";
import BlessContextMeter from "./BlessContextMeter.vue";

const parts = [
  { label: "System", tokens: 4_000 },
  { label: "Chat", tokens: 120_000 },
  { label: "Files", tokens: 36_000, color: "chart-4" },
];

test("BlessContextMeter: a ring button with the use in words, and a breakdown with the free tokens", () => {
  const w = mount(BlessContextMeter, { props: { parts, max: 200_000 } });
  const b = w.find("button.bless-ctx");
  expect(b.attributes("aria-label")).toBe("Context: 160K of 200K tokens used (80%)");
  expect(b.classes()).toContain("bless-ctx--warning");
  expect(w.find(".bless-ctx__pct").text()).toBe("80%");
  const rows = w.findAll(".bless-ctx__list > div").map((r) => r.text());
  expect(rows).toEqual(["System4K", "Chat120K", "Files36K", "Free40K"]);
  expect(w.findAll(".bless-ctx__bar span")[2]!.attributes("style")).toContain("chart-4");
});

test("BlessContextMeter: the level follows the share, the ring stops at full, and labels translate", () => {
  const ok = mount(BlessContextMeter, { props: { parts: [{ label: "a", tokens: 10 }], max: 100 } });
  expect(ok.find("button").classes()).toContain("bless-ctx--ok");
  const full = mount(BlessContextMeter, {
    props: { parts: [{ label: "a", tokens: 150 }], max: 100, labels: { free: "Sisa" } },
  });
  expect(full.find("button").classes()).toContain("bless-ctx--danger");
  expect(full.find(".bless-ctx__pct").text()).toBe("100%");
  expect(full.findAll(".bless-ctx__list > div").at(-1)!.text()).toBe("Sisa0");
});
