import { mount } from "@vue/test-utils";
import BlessRouteSteps from "./BlessRouteSteps.vue";

test("BlessRouteSteps: total, distances by size, arrow angles, and the current step", () => {
  const w = mount(BlessRouteSteps, {
    props: {
      current: 1,
      steps: [
        { turn: "start", text: "Head north", distance: 120, duration: 60 },
        { turn: "left", text: "Turn left", distance: 2340, duration: 3300 },
        { turn: "arrive", text: "Arrive", distance: 0, duration: 0 },
      ],
    },
  });
  expect(w.find(".bless-route__total").text()).toBe("2.5 km · 56 min");
  expect(w.findAll(".bless-route__dist").map((d) => d.text())).toEqual(["120 m", "2.3 km", "0 m"]);
  expect(w.findAll("li")[1]!.attributes("aria-current")).toBe("step");
  expect(w.findAll("li")[0]!.classes()).toContain("is-past");
  expect(w.findAll("li")[1]!.find("path").attributes("transform")).toBe("rotate(-90 12 12)");
  const long = mount(BlessRouteSteps, {
    props: { steps: [{ turn: "straight", text: "Go", distance: 90000, duration: 5400 }] },
  });
  expect(long.find(".bless-route__total").text()).toBe("90 km · 1 hr 30 min");
});
