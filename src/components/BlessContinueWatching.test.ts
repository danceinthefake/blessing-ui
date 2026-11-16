import { mount } from "@vue/test-utils";
import BlessContinueWatching from "./BlessContinueWatching.vue";

const items = [
  {
    id: "a",
    title: "Home Studio",
    subtitle: "S1 · E2",
    image: "a.png",
    href: "/a",
    progress: 0.25,
    minutes: 40,
  },
  { id: "b", title: "Edit Night", image: "b.png", href: "/b", progress: 0.6 },
];

test("BlessContinueWatching: one link per card with where you stopped in words, and remove named with the title", async () => {
  const w = mount(BlessContinueWatching, { props: { items } });
  const links = w.findAll("a");
  expect(links[0]!.text().replace(/\s+/g, " ")).toBe("Home Studio S1 · E2 30 min left");
  expect(links[1]!.text().replace(/\s+/g, " ")).toBe("Edit Night 60% done");
  expect(w.find(".bless-resume__bar span").attributes("style")).toContain("inline-size: 25%");
  const x = w.find(".bless-resume__x");
  expect(x.attributes("aria-label")).toBe("Remove Home Studio from this row");
  await x.trigger("click");
  expect(w.emitted("remove")).toEqual([["a"]]);
  expect(
    mount(BlessContinueWatching, { props: { items: [] } })
      .find("section")
      .exists(),
  ).toBe(false);
});
