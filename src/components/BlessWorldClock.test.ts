import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessWorldClock from "./BlessWorldClock.vue";

// 23:30 UTC on 14 November: already the next morning in Jakarta and Tokyo
const now = Date.UTC(2026, 10, 14, 23, 30);

test("BlessWorldClock: the time, the day against the reader, the offset, and night hours", () => {
  const w = mount(BlessWorldClock, {
    props: {
      now,
      hour12: false,
      zones: ["UTC", { zone: "Asia/Jakarta", label: "Studio" }, "America/Los_Angeles"],
    },
  });
  const z = w.findAll(".bless-clock__zone");
  expect(z.map((x) => x.find(".bless-clock__name").text())).toEqual([
    "UTC",
    "Studio",
    "Los Angeles",
  ]);
  expect(z.map((x) => x.find(".bless-clock__time").text())).toEqual(["23:30", "06:30", "15:30"]);
  expect(z[1]!.find(".bless-clock__meta").text()).toContain("GMT+7");
  expect(z[0]!.classes()).toContain("is-night");
  expect(z[1]!.classes()).not.toContain("is-night");
});

test("BlessWorldClock: the day words compare with the zone of the reader, in the locale", () => {
  const w = mount(BlessWorldClock, {
    props: { now, zones: ["Asia/Tokyo", "UTC"], locale: "id", home: "UTC" },
  });
  const meta = w.findAll(".bless-clock__meta").map((m) => m.text());
  expect(meta).toEqual(["besok · GMT+9", "hari ini · GMT+0"]);
});

test("BlessWorldClock: with no fixed time the clock starts at mount", async () => {
  const w = mount(BlessWorldClock, { props: { zones: ["UTC"] } });
  await nextTick();
  expect(w.find(".bless-clock__time").text()).toMatch(/\d:\d\d/);
  w.unmount();
});
