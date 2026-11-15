import { mount } from "@vue/test-utils";
import BlessVenn, { vennRegions } from "./BlessVenn.vue";

const three = [
  { key: "pod", label: "Podcast", size: 100 },
  { key: "yt", label: "YouTube", size: 80 },
  { key: "news", label: "Newsletter", size: 50 },
];
const overlaps = [
  { keys: ["pod", "yt"], size: 30 },
  { keys: ["pod", "news"], size: 20 },
  { keys: ["yt", "news"], size: 15 },
  { keys: ["news", "yt", "pod"], size: 10 },
];

test("vennRegions: inclusion and exclusion for two and three sets", () => {
  expect(
    vennRegions(three.slice(0, 2), [{ keys: ["yt", "pod"], size: 30 }]).map((r) => r.size),
  ).toEqual([70, 50, 30]);
  expect(vennRegions(three, overlaps).map((r) => [r.keys.join("+"), r.size])).toEqual([
    ["pod", 60],
    ["yt", 45],
    ["news", 25],
    ["pod+yt", 20],
    ["pod+news", 10],
    ["yt+news", 5],
    ["pod+yt+news", 10],
  ]);
});

test("BlessVenn: a circle per set, a count in each part, a legend, and a table in words", () => {
  const w = mount(BlessVenn, { props: { sets: three, overlaps, label: "Audience" } });
  expect(w.findAll(".bless-venn__set")).toHaveLength(3);
  expect(w.findAll(".bless-venn__count").map((t) => t.text())).toEqual([
    "60",
    "45",
    "25",
    "20",
    "10",
    "5",
    "10",
  ]);
  expect(w.findAll(".bless-venn__legend li").map((l) => l.text())).toEqual([
    "Podcast 100",
    "YouTube 80",
    "Newsletter 50",
  ]);
  const rows = w.findAll("tbody tr").map((r) => r.text());
  expect(rows[0]).toBe("Only Podcast60");
  expect(rows[3]).toBe("Podcast and YouTube20");
  expect(rows[6]).toBe("Podcast, YouTube, and Newsletter10");
});

test("BlessVenn: two sets, and labels translate", () => {
  const w = mount(BlessVenn, {
    props: {
      sets: three.slice(0, 2),
      overlaps: [{ keys: ["pod", "yt"], size: 30 }],
      labels: { only: (n: string) => `Hanya ${n}`, and: (ns: string[]) => ns.join(" dan ") },
    },
  });
  expect(w.findAll(".bless-venn__set")).toHaveLength(2);
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual([
    "Hanya Podcast70",
    "Hanya YouTube50",
    "Podcast dan YouTube30",
  ]);
});
