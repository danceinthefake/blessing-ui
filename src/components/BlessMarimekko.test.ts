import { mount } from "@vue/test-utils";
import BlessMarimekko from "./BlessMarimekko.vue";

const data = [
  { region: "Java", pod: 60, yt: 40 },
  { region: "Sumatra", pod: 15, yt: 15 },
  { region: "Bali", pod: 10, yt: 0 },
];
const series = [
  { key: "pod", label: "Podcast apps" },
  { key: "yt", label: "YouTube", color: "chart-4" },
];

test("BlessMarimekko: column widths are shares of all, part heights shares of the column", () => {
  const w = mount(BlessMarimekko, { props: { data, x: "region", series, label: "Listeners" } });
  const cols = w.findAll(".bless-mekko__col");
  const grow = cols.map((c) => Number(c.attributes("style")!.match(/flex-grow: ([\d.]+)/)![1]));
  expect(grow[0]).toBeCloseTo(0.714, 3);
  expect(grow[1]).toBeCloseTo(0.214, 3);
  expect(grow[2]).toBeCloseTo(0.071, 3);
  // parts go from the bottom up, so the first series is the last in the column
  const parts = cols[0]!.findAll(".bless-mekko__part");
  expect(parts[1]!.attributes("style")).toContain("flex-grow: 0.6");
  expect(parts[0]!.attributes("style")).toContain("chart-4");
  expect(parts[1]!.find(".bless-mekko__pct").text()).toBe("60%");
  // a thin column hides the numbers in its parts
  expect(cols[2]!.find(".bless-mekko__pct").exists()).toBe(false);
  expect(w.findAll(".bless-mekko__axis span").map((s) => s.text())).toEqual([
    "Java 71%",
    "Sumatra 21%",
    "Bali 7%",
  ]);
  expect(w.findAll("tbody tr")[1]!.text()).toBe("Sumatra15 (50%) 15 (50%) 21%");
});
