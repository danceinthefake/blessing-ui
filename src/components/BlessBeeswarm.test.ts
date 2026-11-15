import { mount } from "@vue/test-utils";
import BlessBeeswarm, { swarm } from "./BlessBeeswarm.vue";

test("swarm: dots at the same x stack around the line without overlap; far dots stay on it", () => {
  const ys = swarm([100, 100, 100, 300], 5);
  expect(ys[3]).toBe(0);
  expect(ys[0]).toBe(0);
  for (let i = 0; i < 3; i++)
    for (let j = i + 1; j < 3; j++)
      expect(Math.abs(ys[i]! - ys[j]!)).toBeGreaterThanOrEqual(10 - 1e-6);
  // the second dot goes up or down by one diameter, the third to the other side
  expect(Math.sign(ys[1]!)).toBe(-Math.sign(ys[2]!));
});

test("BlessBeeswarm: a dot per value colored by group, a legend, and a summary table", () => {
  const w = mount(BlessBeeswarm, {
    props: {
      label: "Episode length",
      groups: [
        { key: "a", label: "Interviews" },
        { key: "b", label: "Solo", color: "chart-4" },
      ],
      data: [
        { value: 30, group: "a", label: "Ep. 1" },
        { value: 50, group: "a" },
        { value: 40, group: "a" },
        { value: 20, group: "b" },
      ],
    },
  });
  const dots = w.findAll(".bless-swarm__dot");
  expect(dots).toHaveLength(4);
  expect(dots[3]!.attributes("style")).toContain("chart-4");
  expect(dots[0]!.find("title").text()).toBe("Ep. 1: 30");
  expect(w.findAll(".bless-swarm__legend li").map((l) => l.text())).toEqual(["Interviews", "Solo"]);
  expect(w.findAll("tbody tr").map((r) => r.text())).toEqual(["Interviews3304050", "Solo1202020"]);
});

test("BlessBeeswarm: plain numbers make one group named All", () => {
  const w = mount(BlessBeeswarm, { props: { data: [3, 1, 2], labels: { all: "Semua" } } });
  expect(w.find(".bless-swarm__legend").exists()).toBe(false);
  expect(w.find("tbody tr").text()).toBe("Semua3123");
});
