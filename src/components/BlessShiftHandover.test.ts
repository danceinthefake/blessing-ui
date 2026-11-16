import { mount } from "@vue/test-utils";
import BlessShiftHandover, { type BlessHandoverIssue } from "./BlessShiftHandover.vue";

const issues: BlessHandoverIssue[] = [
  { id: "a", text: "Low glue", level: "info" },
  { id: "b", text: "Press 2 jams", level: "stop", owner: "Dimas" },
  { id: "c", text: "Old note", level: "watch", closed: true },
];

test("BlessShiftHandover: stop issues first, levels in words, close an issue, and acknowledge", async () => {
  const w = mount(BlessShiftHandover, {
    props: {
      title: "Night → Morning",
      by: "Ana, 06:00",
      notes: "Line 2 slow.",
      facts: [{ label: "Output", value: "1 840 / 2 000" }],
      issues,
      "onUpdate:issues": (v: BlessHandoverIssue[]) => w.setProps({ issues: v }),
    },
  });
  expect(w.find("[role=status]").text()).toBe("2 issues open");
  const rows = w.findAll(".bless-handover__list li");
  expect(rows.map((r) => r.find(".bless-handover__level").text())).toEqual([
    "✕ Stop",
    "i Info",
    "! Watch",
  ]);
  expect(rows[0]!.find(".bless-handover__text").text()).toBe("Press 2 jams · owner Dimas");
  expect(rows[0]!.find("input").attributes("aria-label")).toBe("Closed: Press 2 jams");
  await rows[0]!.find("input").setValue(true);
  expect(w.find("[role=status]").text()).toBe("1 issue open");
  await w.find(".bless-handover__foot button").trigger("click");
  expect(w.emitted("acknowledge")).toHaveLength(1);
  await w.setProps({ readBy: "Budi" });
  expect(w.find(".bless-handover__read").text()).toBe("✓ Taken over by Budi");
});
