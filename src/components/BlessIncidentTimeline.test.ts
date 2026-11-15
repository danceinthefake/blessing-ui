import { mount } from "@vue/test-utils";
import BlessIncidentTimeline from "./BlessIncidentTimeline.vue";

const updates = [
  { status: "monitoring" as const, time: "09:40", text: "A fix is out." },
  { status: "identified" as const, time: "09:10", text: "A full disk on one server." },
  { status: "investigating" as const, time: "08:55", text: "Uploads fail." },
];

test("BlessIncidentTimeline: the title, impact and state in words, the parts, and the updates newest first", () => {
  const w = mount(BlessIncidentTimeline, {
    props: {
      title: "Uploads fail",
      impact: "major",
      affected: ["Uploads", "Transcripts"],
      updates,
    },
  });
  expect(w.find("h3").text()).toBe("Uploads fail");
  expect(w.find(".bless-incident__impact").text()).toBe("Impact: Major");
  expect(w.find(".bless-incident__state").text()).toBe("Monitoring");
  expect(w.find(".bless-incident__affected").text()).toBe("Affected: Uploads, Transcripts");
  expect(w.findAll(".bless-incident__update").map((u) => u.text())).toEqual([
    "Monitoring09:40A fix is out.",
    "Identified09:10A full disk on one server.",
    "Investigating08:55Uploads fail.",
  ]);
  expect(w.classes()).toContain("is-major");
});

test("BlessIncidentTimeline: resolved changes the edge, and labels translate", () => {
  const w = mount(BlessIncidentTimeline, {
    props: {
      title: "x",
      updates: [{ status: "resolved", time: "10:00", text: "Done." }],
      labels: { resolved: "Selesai" },
    },
  });
  expect(w.classes()).toContain("is-resolved");
  expect(w.find(".bless-incident__state").text()).toBe("Selesai");
});
