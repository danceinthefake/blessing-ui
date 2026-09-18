import { mount } from "@vue/test-utils";
import { h } from "vue";
import { BlessCard, BlessList, BlessListItem } from "../index";

test("BlessCard label, link mode, slots", () => {
  const c = mount(BlessCard, {
    props: { label: "News", href: "/n" },
    slots: { default: "body", footer: "f" },
  });
  expect(c.element.tagName).toBe("A");
  expect(c.find(".bless-card__label").text()).toBe("News");
  expect(c.find(".bless-card__label").classes()).toContain("bless-skew--text");
  expect(c.find(".bless-card__footer").text()).toBe("f");
  expect(c.find(".bless-card__media").exists()).toBe(false);

  const d = mount(BlessCard, { props: { as: "article", bordered: false, surface: "surface" } });
  expect(d.element.tagName).toBe("ARTICLE");
  expect(d.classes()).not.toContain("bless-card--bordered");
  expect(d.classes()).toContain("bless-card--surface");
});

test("BlessList + BlessListItem render meta/dash/badge and link", () => {
  const w = mount(BlessList, {
    slots: {
      default: () => [
        h(BlessListItem, { meta: "04.04", badge: true, href: "/a" }, () => "first"),
        h(BlessListItem, () => "second"),
      ],
    },
  });
  expect(w.classes()).toContain("bless-list--divided");
  const items = w.findAll(".bless-list-item");
  expect(items).toHaveLength(2);

  const a = items[0];
  expect(a.find("a.bless-list-item__row").attributes("href")).toBe("/a");
  expect(a.find(".bless-list-item__meta").text()).toContain("04.04");
  expect(a.find(".bless-dash").exists()).toBe(true);
  expect(a.find(".bless-badge").text()).toBe("NEW!");

  const b = items[1];
  expect(b.find("div.bless-list-item__row").exists()).toBe(true);
  expect(b.find(".bless-list-item__meta").exists()).toBe(false);

  // bare `badge` attribute must cast to true
  const c = mount(BlessListItem, { attrs: { badge: "" }, slots: { default: "x" } });
  expect(c.find(".bless-badge").text()).toBe("NEW!");
});
