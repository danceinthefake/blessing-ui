import { boxStats, chartColor, niceTicks, quantile, scale } from "./chart";

test("niceTicks: round steps that cover the data, from zero for one value, with no float noise", () => {
  expect(niceTicks(0, 87)).toEqual([0, 20, 40, 60, 80, 100]);
  expect(niceTicks(-12, 30)).toEqual([-20, -10, 0, 10, 20, 30]);
  expect(niceTicks(0.1, 0.7)).toEqual([0, 0.2, 0.4, 0.6, 0.8]);
  expect(niceTicks(0, 1, 4)).toEqual([0, 0.25, 0.5, 0.75, 1]);
  expect(niceTicks(5, 5)).toEqual([0, 1, 2, 3, 4, 5]);
  expect(niceTicks(0, 0)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);
  expect(niceTicks(NaN, 3)).toEqual([0, 1]);
});

test("scale and chartColor", () => {
  expect(scale([0, 100], [200, 0])(25)).toBe(150);
  expect(scale([3, 3], [0, 10])(3)).toBe(5);
  expect(chartColor(undefined, 6)).toBe("var(--bless-color-chart-2)");
  expect(chartColor("success", 0)).toBe("var(--bless-color-success)");
  expect(chartColor("#abc", 0)).toBe("#abc");
});

test("quantile and boxStats: quartiles, whiskers inside 1.5 IQR, and outliers", () => {
  expect(quantile([1, 2, 3, 4], 0.5)).toBe(2.5);
  const s = boxStats([1, 2, 3, 4, 5, 6, 7, 8, 9, 40, NaN])!;
  expect(s).toMatchObject({ q1: 3.25, median: 5.5, q3: 7.75, min: 1, max: 9, outliers: [40] });
  expect(boxStats([])).toBeUndefined();
});
