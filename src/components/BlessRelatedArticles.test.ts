import { mount } from "@vue/test-utils";
import BlessRelatedArticles from "./BlessRelatedArticles.vue";

test("BlessRelatedArticles: a titled section with one link per card, topic and reading time", () => {
  const w = mount(BlessRelatedArticles, {
    props: {
      level: 3,
      articles: [
        { id: "a", title: "Pick a mic", href: "/a", topic: "Gear", minutes: 4, image: "a.png" },
        { id: "b", title: "Edit fast", href: "/b" },
      ],
    },
  });
  const h = w.find("h3");
  expect(h.text()).toBe("Read next");
  expect(w.find("section").attributes("aria-labelledby")).toBe(h.attributes("id"));
  expect(w.findAll("a").map((a) => [a.text(), a.attributes("href")])).toEqual([
    ["Pick a mic", "/a"],
    ["Edit fast", "/b"],
  ]);
  expect(w.find(".bless-related__time").text()).toBe("4 min read");
  expect(w.find("img").attributes("alt")).toBe("");
});
