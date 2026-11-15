import { mount } from "@vue/test-utils";
import BlessSystemStatus, { worstState } from "./BlessSystemStatus.vue";

test("worstState: the whole service takes the worst state", () => {
  expect(worstState([])).toBe("operational");
  expect(worstState(["operational", "maintenance"])).toBe("maintenance");
  expect(worstState(["degraded", "major", "partial"])).toBe("major");
});

test("BlessSystemStatus: one line for the whole, a state in words for each part, and the time", () => {
  const w = mount(BlessSystemStatus, {
    props: {
      updated: "1 minute ago",
      parts: [
        { name: "Website", status: "operational" },
        { name: "Uploads", status: "partial", description: "Large files fail" },
        { name: "Player", status: "degraded" },
      ],
    },
  });
  expect(w.find("[role=status]").text()).toBe("Some systems have a problem: partial outage");
  expect(w.find(".bless-status__overall").classes()).toContain("is-partial");
  expect(
    w.findAll(".bless-status__part").map((p) => p.find(".bless-status__state").text()),
  ).toEqual(["Working", "Partial outage", "Slow"]);
  expect(w.find(".bless-status__desc").text()).toBe("Large files fail");
  expect(w.find(".bless-status__updated").text()).toBe("Checked 1 minute ago");
});

test("BlessSystemStatus: all working, and labels translate", () => {
  const w = mount(BlessSystemStatus, {
    props: {
      parts: [{ name: "x", status: "operational" }],
      labels: { all: "Semua sistem berjalan" },
    },
  });
  expect(w.find("[role=status]").text()).toBe("Semua sistem berjalan");
});
