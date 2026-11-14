import { mount } from "@vue/test-utils";
import BlessDescriptions from "./BlessDescriptions.vue";

const items = [
  { label: "Studio", value: "A-1 Pictures" },
  { label: "Episodes", value: 12 },
  { label: "Director" },
];

test("BlessDescriptions: a dl of dt and dd pairs, with a dash for no value", () => {
  const w = mount(BlessDescriptions, { props: { items } });
  expect(w.element.tagName).toBe("DL");
  const pairs = w.findAll(".bless-desc__item");
  expect(pairs).toHaveLength(3);
  expect(pairs[0]!.find("dt").text()).toBe("Studio");
  expect(pairs[1]!.find("dd").text()).toBe("12");
  expect(pairs[2]!.find("dd").text()).toBe("—");
});

test("BlessDescriptions: columns and bordered reach the styles; the value slot gets the item", () => {
  const w = mount(BlessDescriptions, {
    props: { items, columns: 3, bordered: true },
    slots: {
      value: `<template #value="{ item, index }"><b>{{ index }}:{{ item.label }}</b></template>`,
    },
  });
  expect(w.attributes("style")).toContain("--_cols: 3");
  expect(w.classes()).toContain("bless-desc--bordered");
  expect(w.findAll("dd b").map((b) => b.text())).toEqual(["0:Studio", "1:Episodes", "2:Director"]);
});
