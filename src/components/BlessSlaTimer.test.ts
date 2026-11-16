import { mount } from "@vue/test-utils";
import BlessSlaTimer, { minutesLeft } from "./BlessSlaTimer.vue";

test("minutesLeft: minutes to the deadline, negative after it", () => {
  expect(minutesLeft("2026-11-16T12:00:00Z", "2026-11-16T10:30:00Z")).toBe(90);
  expect(minutesLeft("2026-11-16T12:00:00Z", "2026-11-16T12:10:00Z")).toBe(-10);
});

const base = { label: "First reply", due: "2026-11-16T12:00:00Z", window: 240, warn: 60 };

test("BlessSlaTimer: ok, at risk, breached, and met, each in words", () => {
  const ok = mount(BlessSlaTimer, { props: { ...base, now: "2026-11-16T09:00:00Z" } });
  expect(ok.find(".bless-sla__time").text()).toBe("◷ 3 h left");
  expect(ok.find(".bless-sla__track span").attributes("style")).toContain("inline-size: 75%");
  const risk = mount(BlessSlaTimer, { props: { ...base, now: "2026-11-16T11:15:00Z" } });
  expect(risk.classes()).toContain("is-warning");
  expect(risk.find(".bless-sla__time").text()).toBe("! 45 min left · At risk");
  const late = mount(BlessSlaTimer, { props: { ...base, now: "2026-11-16T13:20:00Z" } });
  expect(late.find(".bless-sla__time").text()).toBe("✕ Overdue by 1 h 20 min");
  const met = mount(BlessSlaTimer, { props: { ...base, met: true } });
  expect(met.find(".bless-sla__time").text()).toBe("✓ Met");
  expect(met.find(".bless-sla__track").exists()).toBe(false);
});
