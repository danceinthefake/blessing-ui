import { mount } from "@vue/test-utils";
import BlessCountdownBanner, { splitSpan } from "./BlessCountdownBanner.vue";

afterEach(() => vi.useRealTimers());

test("splitSpan: days, hours, minutes, seconds, and zero in the past", () => {
  expect(splitSpan((2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000)).toEqual({ d: 2, h: 3, m: 4, s: 5 });
  expect(splitSpan(-5000)).toEqual({ d: 0, h: 0, m: 0, s: 0 });
});

const to = Date.UTC(2026, 10, 28, 12, 30);

test("BlessCountdownBanner: the time left, the date for screen readers, and a banner around it", () => {
  const w = mount(BlessCountdownBanner, {
    props: {
      to,
      title: "Live recording",
      now: to - (26 * 3600 + 5 * 60 + 7) * 1000,
      label: "Event",
    },
    slots: { action: "<a href='#'>Get a ticket</a>" },
  });
  expect(w.find(".bless-countdown__title").text()).toBe("Live recording");
  expect(w.findAll(".bless-countdown__part").map((p) => p.text())).toEqual([
    "01d",
    "02h",
    "05m",
    "07s",
  ]);
  expect(w.find(".bless-sr").text()).toMatch(/^Starts Saturday, November 28, 2026/);
  expect(w.find(".bless-banner").attributes("aria-label")).toBe("Event");
  expect(w.find(".bless-banner__action a").text()).toBe("Get a ticket");
});

test("BlessCountdownBanner: no days part under a day, live after the start, and the start event", async () => {
  const short = mount(BlessCountdownBanner, { props: { to, title: "x", now: to - 90_000 } });
  expect(short.findAll(".bless-countdown__part").map((p) => p.text())).toEqual([
    "00h",
    "01m",
    "30s",
  ]);
  const after = mount(BlessCountdownBanner, {
    props: { to, title: "x", now: to + 1, labels: { live: "Siaran langsung" } },
  });
  expect(after.find(".bless-countdown__live").text()).toBe("Siaran langsung");

  vi.useFakeTimers();
  vi.setSystemTime(to - 1500);
  const w = mount(BlessCountdownBanner, { props: { to, title: "x" } });
  vi.advanceTimersByTime(2000);
  await w.vm.$nextTick();
  expect(w.emitted("start")).toHaveLength(1);
  expect(w.find(".bless-countdown__live").exists()).toBe(true);
  w.unmount();
});
