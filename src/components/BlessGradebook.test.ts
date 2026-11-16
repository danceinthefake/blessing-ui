import { mount } from "@vue/test-utils";
import BlessGradebook, { type BlessScores } from "./BlessGradebook.vue";

const students = [
  { id: "a", name: "Ana" },
  { id: "b", name: "Budi" },
];
const assignments = [
  { id: "q", title: "Quiz", max: 10 },
  { id: "e", title: "Essay" },
];

test("BlessGradebook: missing work, averages with missing as zero, low marks, and editing", async () => {
  const w = mount(BlessGradebook, {
    props: {
      students,
      assignments,
      modelValue: { a: { q: 9, e: 85 }, b: { q: 4 } } as BlessScores,
      editable: false,
      "onUpdate:modelValue": (v: BlessScores) => w.setProps({ modelValue: v }),
    },
  });
  const rows = w.findAll("tbody tr");
  expect(rows[0]!.findAll("td").map((d) => d.text())).toEqual(["9", "85", "88%"]);
  expect(rows[1]!.findAll("td").map((d) => d.text())).toEqual([
    "4",
    "Missing",
    "▼ 20%, below pass",
  ]);
  expect(w.findAll("tfoot td").map((d) => d.text())).toEqual(["65%", "85%", "54%"]);
  await w.setProps({ editable: true });
  const input = w.find('[aria-label="Essay score for Budi"]');
  expect(input.attributes("placeholder")).toBe("Missing");
  await input.setValue("150");
  await input.trigger("change");
  expect(w.props("modelValue")!.b).toEqual({ q: 4, e: 100 });
  expect(w.findAll("tbody tr")[1]!.find(".bless-grades__avg").text()).toBe("70%");
});
