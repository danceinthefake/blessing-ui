import { mount } from "@vue/test-utils";
import BlessPortfolioGrid from "./BlessPortfolioGrid.vue";

const works = [
  { id: "1", title: "Logo", kind: "Brand", image: "/1.png", href: "/w/1", year: 2025 },
  { id: "2", title: "Site", kind: "Web", image: "/2.png" },
  { id: "3", title: "Pack", kind: "Brand", image: "/3.png" },
];

test("BlessPortfolioGrid: filter buttons from kinds, pressed state, count, and links", async () => {
  const w = mount(BlessPortfolioGrid, {
    props: { works, "onUpdate:filter": (v: string) => w.setProps({ filter: v }) },
  });
  const buttons = w.findAll(".bless-folio__filters button");
  expect(buttons.map((b) => b.text())).toEqual(["All", "Brand", "Web"]);
  expect(buttons[0]!.attributes("aria-pressed")).toBe("true");
  expect(w.find("[role=status]").text()).toBe("3 works");
  expect(w.find("a.bless-folio__card").attributes("href")).toBe("/w/1");
  expect(w.find(".bless-folio__meta").text()).toBe("Brand · 2025");
  await buttons[2]!.trigger("click");
  expect(w.findAll(".bless-folio__title").map((t) => t.text())).toEqual(["Site"]);
  expect(w.find("[role=status]").text()).toBe("1 work");
  expect(w.findAll(".bless-folio__filters button")[2]!.attributes("aria-pressed")).toBe("true");
});
