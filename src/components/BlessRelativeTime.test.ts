import { mount } from "@vue/test-utils";
import { createSSRApp, h, nextTick } from "vue";
import { renderToString } from "vue/server-renderer";
import BlessRelativeTime from "./BlessRelativeTime.vue";
import { refreshEvery, relativeParts } from "./relativeTime";

const NOW = new Date("2026-10-12T12:00:00Z");
const ago = (s: number) => new Date(+NOW - s * 1000);

test("relativeParts picks the unit and rounds to a whole number", () => {
  expect(relativeParts(-5)).toEqual([-5, "second"]);
  expect(relativeParts(-59)).toEqual([-59, "second"]);
  expect(relativeParts(-60)).toEqual([-1, "minute"]);
  expect(relativeParts(-3599)).toEqual([-60, "minute"]);
  expect(relativeParts(-3600)).toEqual([-1, "hour"]);
  expect(relativeParts(-86400)).toEqual([-1, "day"]);
  expect(relativeParts(-86400 * 29)).toEqual([-29, "day"]);
  expect(relativeParts(-86400 * 40)).toEqual([-1, "month"]);
  expect(relativeParts(-86400 * 800)).toEqual([-2, "year"]);
  expect(relativeParts(7200)).toEqual([2, "hour"]); // the future is positive
  expect(relativeParts(0)).toEqual([0, "second"]);
  expect(Object.is(relativeParts(-0.2)[0], 0)).toBe(true); // 0, never -0
});

test("refreshEvery waits longer when the text changes slowly", () => {
  expect(refreshEvery(-10)).toBe(5_000);
  expect(refreshEvery(-600)).toBe(30_000);
  expect(refreshEvery(-7200)).toBe(300_000);
  expect(refreshEvery(-86400 * 3)).toBe(3_600_000);
});

test("BlessRelativeTime: writes relative text in a time element with the exact datetime", async () => {
  const w = mount(BlessRelativeTime, { props: { value: ago(3 * 3600), now: NOW } });
  const el = w.find("time");
  expect(el.text()).toBe("3 hours ago");
  expect(el.attributes("datetime")).toBe("2026-10-12T09:00:00.000Z");
  await nextTick();
  expect(el.attributes("title")).toContain("2026"); // the full date, in the time zone of the reader
});

test("BlessRelativeTime: numeric auto says yesterday and now; always does not", () => {
  const day = ago(86400);
  expect(mount(BlessRelativeTime, { props: { value: day, now: NOW } }).text()).toBe("yesterday");
  expect(
    mount(BlessRelativeTime, { props: { value: day, now: NOW, numeric: "always" } }).text(),
  ).toBe("1 day ago");
  expect(mount(BlessRelativeTime, { props: { value: NOW, now: NOW } }).text()).toBe("now");
});

test("BlessRelativeTime: locale, format, a future date, and a timestamp or string value", () => {
  expect(
    mount(BlessRelativeTime, { props: { value: ago(7200), now: NOW, locale: "de" } }).text(),
  ).toBe("vor 2 Stunden");
  expect(
    mount(BlessRelativeTime, { props: { value: ago(7200), now: NOW, format: "short" } }).text(),
  ).toBe("2 hr. ago");
  expect(
    mount(BlessRelativeTime, { props: { value: new Date(+NOW + 2 * 86400000), now: NOW } }).text(),
  ).toBe("in 2 days");
  expect(mount(BlessRelativeTime, { props: { value: +ago(120), now: NOW } }).text()).toBe(
    "2 minutes ago",
  );
  expect(
    mount(BlessRelativeTime, { props: { value: ago(120).toISOString(), now: NOW } }).text(),
  ).toBe("2 minutes ago");
});

test("BlessRelativeTime: server rendering writes a plain UTC date, so the server and the browser agree", async () => {
  const html = await renderToString(
    createSSRApp({ render: () => h(BlessRelativeTime, { value: "2026-10-09T23:30:00Z" }) }),
  );
  expect(html).toContain("Oct 9, 2026");
  expect(html).toContain('datetime="2026-10-09T23:30:00.000Z"');
  expect(html).not.toContain("ago");
  // a fixed `now` is the same on both sides, so it can show relative text at once
  const fixed = await renderToString(
    createSSRApp({ render: () => h(BlessRelativeTime, { value: ago(7200), now: NOW }) }),
  );
  expect(fixed).toContain("2 hours ago");
});

test("BlessRelativeTime: an invalid date renders nothing; live updates the text as time passes", async () => {
  expect(
    mount(BlessRelativeTime, { props: { value: "not a date" } })
      .find("time")
      .exists(),
  ).toBe(false);
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
  const w = mount(BlessRelativeTime, { props: { value: ago(10) } });
  await nextTick();
  expect(w.text()).toBe("10 seconds ago");
  vi.setSystemTime(+NOW + 60_000);
  await vi.advanceTimersByTimeAsync(5_100);
  expect(w.text()).toBe("1 minute ago");
  w.unmount();
  vi.useRealTimers();
});

// Found by blessing.id: a list reused the component for a newer value, and it said "in 1 second".
test("BlessRelativeTime: a new value counts from the time now, not from the time of the old value", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
  const w = mount(BlessRelativeTime, { props: { value: ago(5), live: false } });
  await nextTick();
  expect(w.text()).toBe("5 seconds ago");
  // time goes on with no timer, then the parent passes a value from this moment
  vi.setSystemTime(+NOW + 30_000);
  await w.setProps({ value: new Date(+NOW + 30_000) });
  expect(w.text()).toBe("now");
  w.unmount();
  vi.useRealTimers();
});
