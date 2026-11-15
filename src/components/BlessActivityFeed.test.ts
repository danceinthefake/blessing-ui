import { mount } from "@vue/test-utils";
import BlessActivityFeed from "./BlessActivityFeed.vue";

// noon in the zone of the test runner, so the day groups do not depend on the zone
const now = new Date(2026, 10, 15, 12, 0);
const at = (days: number, hours: number) => new Date(2026, 10, 15 - days, hours, 0);
const events = [
  {
    id: 1,
    actor: { name: "Ana" },
    action: "published",
    target: "Episode 41",
    href: "/ep41",
    time: at(0, 10),
  },
  { id: 2, actor: { name: "Budi" }, action: "commented on", target: "the cover", time: at(1, 18) },
  { id: 3, actor: { name: "Citra" }, action: "joined the team", time: at(4, 9) },
  { id: 4, actor: { name: "Ana" }, action: "uploaded", target: "raw.wav", time: at(0, 11) },
];

test("BlessActivityFeed: events newest first in groups by day, with avatars, links, and times", () => {
  const w = mount(BlessActivityFeed, { props: { events, now } });
  const days = w.findAll(".bless-activity__day");
  expect(days.map((d) => d.attributes("aria-label"))).toEqual([
    "Today",
    "Yesterday",
    "Nov 11, 2026",
  ]);
  const today = days[0]!.findAll(".bless-activity__text").map((t) => t.text());
  expect(today).toEqual(["Ana uploaded raw.wav", "Ana published Episode 41"]);
  expect(days[0]!.find("a").attributes("href")).toBe("/ep41");
  expect(days[1]!.find("a").exists()).toBe(false);
  expect(days[0]!.find(".bless-activity__time").text()).toBe("1 hr. ago");
  expect(w.findAll(".bless-avatar")).toHaveLength(4);
});

test("BlessActivityFeed: the day names follow the locale, and a slot replaces the text", () => {
  const w = mount(BlessActivityFeed, {
    props: { events: events.slice(0, 2), now, locale: "id" },
    slots: { event: `<template #event="{ event }">*{{ event.actor.name }}*</template>` },
  });
  expect(w.findAll(".bless-activity__date").map((d) => d.text())).toEqual(["Hari ini", "Kemarin"]);
  expect(w.find(".bless-activity__text").text()).toBe("*Ana*");
});
