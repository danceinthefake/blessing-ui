import { mount } from "@vue/test-utils";
import BlessEyecatch from "./BlessEyecatch.vue";

test("BlessEyecatch: kicker, title at the heading level, and a slot", () => {
  const w = mount(BlessEyecatch, {
    props: { kicker: "Episode 01", title: "Your apps", headingLevel: 1 },
    slots: { default: "<p>lead</p>" },
  });
  expect(w.find(".bless-eyecatch__kicker").text()).toBe("Episode 01");
  expect(w.find("h1.bless-eyecatch__title").text()).toBe("Your apps");
  expect(w.find(".bless-eyecatch__text p:not(.bless-eyecatch__kicker)").text()).toBe("lead");
  // negative control: the default level is h2, and no kicker means no empty line
  const d = mount(BlessEyecatch, { props: { title: "x" } });
  expect(d.find("h2").exists()).toBe(true);
  expect(d.find(".bless-eyecatch__kicker").exists()).toBe(false);
});

test("BlessEyecatch: the number and the slash are decoration", () => {
  const w = mount(BlessEyecatch, { props: { title: "x", num: "07" } });
  const num = w.find(".bless-eyecatch__num");
  expect(num.attributes("aria-hidden")).toBe("true");
  expect(num.attributes("data-num")).toBe("07");
  // the number is generated content, so it is not text of the band
  expect(w.text()).not.toContain("07");
  expect(w.find(".bless-eyecatch__slash").attributes("aria-hidden")).toBe("true");
  expect(mount(BlessEyecatch, { props: { title: "x" } }).find(".bless-eyecatch__num").exists()).toBe(false);
});

test("BlessEyecatch: accent swaps the ground", () => {
  expect(mount(BlessEyecatch, { props: { title: "x", accent: true } }).classes()).toContain(
    "bless-eyecatch--accent",
  );
  expect(mount(BlessEyecatch, { props: { title: "x" } }).classes()).not.toContain("bless-eyecatch--accent");
});
