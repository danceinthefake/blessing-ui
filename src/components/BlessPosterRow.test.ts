import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessPosterRow from "./BlessPosterRow.vue";

const items = [
  { id: "a", title: "Season 1", image: "a.png", href: "/s1", meta: "2025 · 12 episodes" },
  { id: "b", title: "Season 2", image: "b.png", href: "/s2" },
];

test("BlessPosterRow: a section named by its title, one link per poster, and scroll buttons", async () => {
  const w = mount(BlessPosterRow, {
    props: { title: "Seasons", items, shape: "wide" },
    attachTo: document.body,
  });
  const section = w.find("section");
  expect(section.classes()).toContain("is-wide");
  expect(w.find(`#${section.attributes("aria-labelledby")}`).text()).toBe("Seasons");
  expect(w.findAll("a").map((a) => [a.text().replace(/\s+/g, " "), a.attributes("href")])).toEqual([
    ["Season 1 2025 · 12 episodes", "/s1"],
    ["Season 2", "/s2"],
  ]);
  await nextTick();
  // jsdom has no layout: the row does not scroll, so both ends are reached
  const [back, on] = w.findAll(".bless-posters__nav button");
  expect(back!.attributes("aria-label")).toBe("Scroll back");
  expect(on!.attributes("disabled")).toBeDefined();
  w.unmount();
});
