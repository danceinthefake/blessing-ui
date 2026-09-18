import { mount } from "@vue/test-utils";
import BlessSection from "./BlessSection.vue";
import BlessWatermark from "./BlessWatermark.vue";

test("BlessWatermark is decorative and positioned", () => {
  const w = mount(BlessWatermark, { props: { text: "News", position: "bottom-left" } });
  expect(w.attributes("aria-hidden")).toBe("true");
  expect(w.text()).toBe("News");
  expect(w.classes()).toContain("bless-watermark--bottom-left");
});

test("BlessSection uses title as watermark and heading", () => {
  const w = mount(BlessSection, { props: { title: "News" }, slots: { default: "body" } });
  expect(w.find(".bless-watermark").text()).toBe("News");
  expect(w.find("h2.bless-section__title").text()).toBe("News");
  expect(w.text()).toContain("body");
});

test("BlessSection watermark override / hide / heading level", () => {
  const o = mount(BlessSection, {
    props: { title: "スタッフ", watermark: "Staff & Cast", headingLevel: 3 },
  });
  expect(o.find(".bless-watermark").text()).toBe("Staff & Cast");
  expect(o.find("h3").exists()).toBe(true);

  const h = mount(BlessSection, { props: { title: "x", watermark: "" } });
  expect(h.find(".bless-watermark").exists()).toBe(false);

  const n = mount(BlessSection);
  expect(n.find(".bless-watermark").exists()).toBe(false);
  expect(n.find(".bless-section__title").exists()).toBe(false);
});
