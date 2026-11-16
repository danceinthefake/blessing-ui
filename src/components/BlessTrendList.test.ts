import { mount } from "@vue/test-utils";
import BlessTrendList from "./BlessTrendList.vue";

test("BlessTrendList: an ordered list with category, a linked topic, and a short post count", () => {
  const w = mount(BlessTrendList, {
    props: {
      trends: [
        { id: "a", topic: "#homestudio", category: "Music · Trending", posts: 15300, href: "/t/a" },
        { id: "b", topic: "Episode 41", posts: 820 },
      ],
    },
  });
  expect(w.find("ol").exists()).toBe(true);
  const items = w.findAll(".bless-trends__item");
  expect(items[0]!.find(".bless-trends__category").text()).toBe("Music · Trending");
  expect(items[0]!.find("a").attributes("href")).toBe("/t/a");
  expect(items[0]!.find(".bless-trends__posts").text()).toBe("15.3K posts");
  expect(items[1]!.find("strong").text()).toBe("Episode 41");
  expect(items[1]!.find(".bless-trends__rank").text()).toBe("2");
});
