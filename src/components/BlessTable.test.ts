import { mount } from "@vue/test-utils";
import BlessTable from "./BlessTable.vue";

const columns = [
  { key: "station", label: "放送局", header: true },
  { key: "day", label: "曜日" },
  { key: "time", label: "時間", align: "right" as const },
];
const rows = [
  { station: "TOKYO MX", day: "木", time: "24:00" },
  { station: "BS11", day: "金", time: "23:30" },
];

test("renders head, row headers, data-labels, alignment", () => {
  const w = mount(BlessTable, { props: { columns, rows, rowKey: "station", caption: "On Air" } });
  expect(w.find("caption").text()).toBe("On Air");
  expect(w.findAll("thead th").map((t) => t.text())).toEqual(["放送局", "曜日", "時間"]);
  const r = w.findAll("tbody tr");
  expect(r).toHaveLength(2);
  expect(r[0].find("th").attributes("scope")).toBe("row");
  expect(r[0].find("th").text()).toBe("TOKYO MX");
  const tds = r[1].findAll("td");
  expect(tds[0].attributes("data-label")).toBe("曜日");
  expect(tds[1].classes()).toContain("bless-table__cell--right");
  expect(w.classes()).toContain("bless-table--stack");
});

test("per-column cell slot overrides", () => {
  const w = mount(BlessTable, {
    props: { columns, rows, stack: false },
    slots: { "cell-time": ({ value }: { value: unknown }) => `⏰${value}` },
  });
  expect(w.findAll("tbody tr")[0].findAll("td")[1].text()).toBe("⏰24:00");
  expect(w.classes()).not.toContain("bless-table--stack");
});
