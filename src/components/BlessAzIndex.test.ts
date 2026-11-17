import { mount } from "@vue/test-utils";
import BlessAzIndex from "./BlessAzIndex.vue";

test("BlessAzIndex: groups by letter without accents, other signs, collation, and the bar", () => {
  const w = mount(BlessAzIndex, {
    props: {
      items: [
        { label: "Visa", href: "/visa" },
        { label: "Évian water" },
        { label: "passport", href: "/p" },
        { label: "Passport 10 years" },
        { label: "Passport 2 years" },
        { label: "112 emergency" },
      ],
    },
  });
  const groups = w.findAll("section");
  expect(groups.map((g) => g.find("h3 span").text())).toEqual(["E", "P", "V", "#"]);
  expect(groups[1]!.findAll("li").map((l) => l.text())).toEqual([
    "passport",
    "Passport 2 years",
    "Passport 10 years",
  ]);
  expect(groups[3]!.find("h3").text()).toBe("#Other");
  const bar = w.find("nav");
  expect(bar.findAll("a").map((a) => a.text())).toEqual(["E", "P", "V", "#"]);
  expect(bar.findAll("span[aria-hidden=true]")).toHaveLength(23);
  expect(bar.findAll("a")[1]!.attributes("href")).toBe(`#${groups[1]!.attributes("id")}`);
});
