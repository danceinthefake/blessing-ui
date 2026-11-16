import { mount } from "@vue/test-utils";
import BlessForumTopics from "./BlessForumTopics.vue";

test("BlessForumTopics: pinned first, flags in words, tags, short counts, and the last post", () => {
  const w = mount(BlessForumTopics, {
    props: {
      topics: [
        {
          id: "a",
          title: "Best cheap mic?",
          href: "/t/a",
          author: "Ana",
          replies: 1520,
          views: 48200,
          solved: true,
          tags: ["gear"],
          last: { author: "Budi", time: "2 h" },
        },
        { id: "b", title: "Rules", author: "Mod", replies: 0, pinned: true, locked: true },
      ],
    },
  });
  const topics = w.findAll(".bless-forum__topic");
  expect(topics[0]!.find(".bless-forum__title").text()).toBe("Rules");
  expect(topics[0]!.find(".bless-forum__flags").text().replace(/\s+/g, " ")).toBe(
    "📌︎ Pinned 🔒︎ Locked",
  );
  const a = topics[1]!;
  expect(a.find("a").attributes("href")).toBe("/t/a");
  expect(a.find(".bless-forum__flags").text()).toBe("✓ Solved");
  expect(a.find(".bless-forum__meta").text().replace(/\s+/g, " ")).toBe("by Ana · #gear");
  expect(a.findAll(".bless-forum__stats span").map((s) => s.text())).toEqual([
    "1.5K replies",
    "48.2K views",
    "Last post by Budi, 2 h",
  ]);
});
