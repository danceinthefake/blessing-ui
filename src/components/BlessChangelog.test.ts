import { mount } from "@vue/test-utils";
import BlessChangelog from "./BlessChangelog.vue";

const releases = [
  {
    version: "1.2.0",
    date: "2026-11-15",
    title: "Charts",
    changes: [
      { type: "fixed" as const, text: "Dates in RTL" },
      { type: "added" as const, text: "Bar chart" },
      { type: "added" as const, text: "Line chart" },
    ],
  },
  { version: "1.1.0", changes: [{ type: "security" as const, text: "Safer links" }] },
];

test("BlessChangelog: a heading per release, the date, and the changes in Keep a Changelog order", () => {
  const w = mount(BlessChangelog, { props: { releases } });
  expect(w.findAll("h3").map((h) => h.text())).toEqual(["1.2.0 · Charts", "1.1.0"]);
  const time = w.find("time");
  expect(time.attributes("datetime")).toBe("2026-11-15");
  expect(time.text()).toBe("November 15, 2026");
  const first = w.findAll("article")[0]!;
  expect(first.findAll(".bless-changelog__type").map((t) => t.text())).toEqual(["Added", "Fixed"]);
  expect(first.findAll("li").map((l) => l.text())).toEqual([
    "Bar chart",
    "Line chart",
    "Dates in RTL",
  ]);
  expect(w.findAll("article")[1]!.find("time").exists()).toBe(false);
});

test("BlessChangelog: the heading level, the locale, and the labels", () => {
  const w = mount(BlessChangelog, {
    props: { releases, level: 2, locale: "id", labels: { added: "Baru" } },
  });
  expect(w.findAll("h2")).toHaveLength(2);
  expect(w.find("time").text()).toBe("15 November 2026");
  expect(w.find(".bless-changelog__type").text()).toBe("Baru");
});
