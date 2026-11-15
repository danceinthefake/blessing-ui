import { mount } from "@vue/test-utils";
import BlessLineChart from "./BlessLineChart.vue";

const data = [
  { day: 3, a: 30, b: 5 },
  { day: 1, a: 10, b: null },
  { day: 2, a: 20, b: 8 },
];
const series = [
  { key: "a", label: "Alpha" },
  { key: "b", color: "danger" },
];

test("BlessLineChart: one line per series in x order, a gap left open, round ticks, and a table", () => {
  const w = mount(BlessLineChart, { props: { data, x: "day", series, height: 200 } });
  const [a, b] = w.findAll(".bless-linechart__line");
  // sorted by x, so the line moves only to the right
  const xs = a!
    .attributes("d")!
    .match(/[ML]([\d.]+)/g)!
    .map((m) => Number(m.slice(1)));
  expect(xs).toEqual([...xs].sort((p, q) => p - q));
  expect(xs).toHaveLength(3);
  // b has no value on day 1: its line starts on day 2
  expect(b!.attributes("d")!.match(/M/g)).toHaveLength(1);
  expect(b!.attributes("d")!.match(/L/g)).toHaveLength(1);
  expect(
    w
      .findAll(".bless-plot__tick")
      .map((t) => t.text())
      .slice(0, 4),
  ).toEqual(["5", "10", "15", "20"]);
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual(["110–", "2208", "3305"]);
  expect(w.find("thead th").text()).toBe("day");
  expect(w.find(".bless-linechart__area").exists()).toBe(false);
});

test("BlessLineChart: area, a crosshair on the nearest point, and a date axis", async () => {
  const w = mount(BlessLineChart, { props: { data, x: "day", series, area: true } });
  expect(w.findAll(".bless-linechart__area")).toHaveLength(2);
  const svg = w.find("svg").element as SVGSVGElement;
  svg.getBoundingClientRect = () => ({ left: 0, width: 640 }) as DOMRect;
  svg.dispatchEvent(new MouseEvent("pointermove", { clientX: 630 }));
  await w.vm.$nextTick();
  expect(w.find(".bless-linechart__tip").text()).toBe("3Alpha 30b 5");
  expect(w.find(".bless-linechart__tip--end").exists()).toBe(true);
  await w.find("svg").trigger("pointerleave");
  expect(w.find(".bless-linechart__tip").exists()).toBe(false);

  await w.setProps({
    data: [
      { d: "2026-01-02", v: 1 },
      { d: "2026-01-01", v: 2 },
    ],
    x: "d",
    series: [{ key: "v" }],
    formatX: (d: number | Date) => (d as Date).toISOString().slice(5, 10),
  });
  expect(w.findAll("tbody th").map((t) => t.text())).toEqual(["01-01", "01-02"]);
});
