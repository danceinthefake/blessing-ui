import { mount } from "@vue/test-utils";
import BlessSparkline from "./BlessSparkline.vue";

const mk = (props: Record<string, unknown>) =>
  mount(BlessSparkline, { props: { data: [], ...props } });

test("a line has one move and a line segment per later value, and a name with the extremes", () => {
  const w = mk({ data: [3, 1, 4, 1, 5], label: "Latency", format: (v: number) => `${v} ms` });
  const d = w.find(".bless-sparkline__line").attributes("d")!;
  expect(d.match(/M/g)).toHaveLength(1);
  expect(d.match(/L/g)).toHaveLength(4);
  expect(w.attributes("role")).toBe("img");
  expect(w.attributes("aria-label")).toBe(
    "Latency: 5 values, from 3 ms to 5 ms, low 1 ms, high 5 ms",
  );
});

test("the highest value is drawn at the top and the lowest at the bottom", () => {
  const w = mk({ data: [0, 10], height: 30 });
  const ys = [
    ...w
      .find(".bless-sparkline__line")
      .attributes("d")!
      .matchAll(/ ([\d.]+)/g),
  ].map((m) => +m[1]!);
  expect(ys[0]).toBeGreaterThan(ys[1]!); // 0 sits lower on the page than 10
});

test("fill, the end dot, and a single value (a dot, no line)", () => {
  expect(
    mk({ data: [1, 2], fill: true })
      .find(".bless-sparkline__area")
      .exists(),
  ).toBe(true);
  expect(
    mk({ data: [1, 2], dot: true })
      .find(".bless-sparkline__dot")
      .exists(),
  ).toBe(true);
  const one = mk({ data: [7] });
  expect(one.find(".bless-sparkline__line").exists()).toBe(false);
  expect(one.find(".bless-sparkline__dot").exists()).toBe(true);
});

test("bars grow from zero: positives above it, negatives below, in their own colour", () => {
  const w = mk({ data: [4, -4, 2], type: "bar", height: 40 });
  const bars = w.findAll(".bless-sparkline__bar");
  expect(bars).toHaveLength(3);
  expect(bars[1]!.classes()).toContain("bless-sparkline__bar--neg");
  expect(+bars[0]!.attributes("y")!).toBeLessThan(+bars[1]!.attributes("y")!);
});

test("win/loss draws equal bars and counts them in the name", () => {
  const w = mk({ data: [1, -1, 0, 3], type: "winloss", height: 20 });
  const bars = w.findAll(".bless-sparkline__bar");
  expect(bars[0]!.attributes("height")).toBe(bars[1]!.attributes("height"));
  expect(bars[2]!.attributes("height")).toBe("1"); // a draw is a hairline
  expect(w.attributes("aria-label")).toBe("Trend: 2 up, 1 down of 4");
});

test("no data draws nothing and says so; NaN is ignored", () => {
  const w = mk({ data: [], label: "Visits" });
  expect(w.attributes("aria-label")).toBe("Visits: no data");
  expect(w.find(".bless-sparkline__line").exists()).toBe(false);
  expect(
    mk({ data: [1, NaN, 3] })
      .find(".bless-sparkline__line")
      .attributes("d")!
      .match(/L/g),
  ).toHaveLength(1);
});

test("a token name becomes a var(), anything else is used as is", () => {
  expect(mk({ data: [1, 2], color: "success" }).attributes("style")).toContain(
    "--bless-color-success",
  );
  expect(mk({ data: [1, 2], color: "#ff0000" }).attributes("style")).toContain("#ff0000");
});
