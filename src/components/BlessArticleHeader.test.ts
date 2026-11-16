import { mount } from "@vue/test-utils";
import BlessArticleHeader from "./BlessArticleHeader.vue";

test("BlessArticleHeader: topic, a heading at the level, summary, author, dates in time elements, and minutes", () => {
  const w = mount(BlessArticleHeader, {
    props: {
      title: "Treat your room",
      topic: "Gear",
      topicHref: "/gear",
      summary: "Soft things stop echo.",
      author: { name: "Ana", href: "/ana" },
      date: "2026-11-16",
      updated: "2026-11-17",
      minutes: 6,
      level: 2,
    },
  });
  expect(w.find("h2").text()).toBe("Treat your room");
  expect(w.find(".bless-article__topic a").attributes("href")).toBe("/gear");
  expect(w.find(".bless-article__author a").text()).toBe("By Ana");
  const times = w.findAll("time");
  expect(times.map((t) => t.attributes("datetime"))).toEqual(["2026-11-16", "2026-11-17"]);
  expect(w.find(".bless-article__when").text().replace(/\s+/g, " ")).toBe(
    "November 16, 2026 · 6 min read · Updated November 17, 2026",
  );
});

test("BlessArticleHeader: the title is h1 by default and the meta row is optional", () => {
  const w = mount(BlessArticleHeader, { props: { title: "Hello" } });
  expect(w.find("h1").text()).toBe("Hello");
  expect(w.find(".bless-article__meta").exists()).toBe(false);
});
