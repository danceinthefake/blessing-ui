import { mount } from "@vue/test-utils";
import BlessFeatureGrid from "./BlessFeatureGrid.vue";

test("BlessFeatureGrid: headings, links, columns, and the icon slot", () => {
  const w = mount(BlessFeatureGrid, {
    props: {
      columns: 2,
      features: [
        { title: "Fast", text: "Loads in a second.", href: "/fast" },
        { title: "Small", text: "No packages." },
      ],
    },
    slots: { icon: "<svg data-x='{{ index }}'></svg>" },
  });
  expect(w.find("ul").attributes("style")).toContain("--_cols: 2");
  expect(w.findAll("h3").map((h) => h.text())).toEqual(["Fast", "Small"]);
  expect(w.find("h3 a").attributes("href")).toBe("/fast");
  expect(w.findAll(".bless-features__icon")).toHaveLength(2);
  expect(w.find(".bless-features__icon").attributes("aria-hidden")).toBe("true");
  const plain = mount(BlessFeatureGrid, { props: { features: [{ title: "A", text: "B" }] } });
  expect(plain.find(".bless-features__icon").exists()).toBe(false);
});
