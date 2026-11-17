import { mount } from "@vue/test-utils";
import BlessSearchResults from "./BlessSearchResults.vue";

const results = [
  { id: "1", title: "Renew a passport", href: "/a" },
  { id: "2", title: "Passport fees", href: "/b" },
];

test("BlessSearchResults: count, list, pages, sort, suggestion, and no results", async () => {
  const w = mount(BlessSearchResults, {
    props: {
      query: "passport",
      results,
      total: 32,
      page: 2,
      sorts: [
        { value: "best", label: "Best match" },
        { value: "new", label: "Newest" },
      ],
      sort: "best",
      suggestion: "passports",
      facets: [
        { id: "kind", label: "Kind", options: [{ value: "guide", label: "Guide", count: 4 }] },
      ],
      "onUpdate:sort": (v: string | undefined) => w.setProps({ sort: v }),
    },
  });
  expect(w.find("[role=status]").text()).toBe("11–12 of 32 results for “passport”");
  expect(w.findAll(".bless-result")).toHaveLength(2);
  expect(w.find(".bless-result mark").text()).toBe("passport");
  expect(w.find(".bless-pagination, nav").exists()).toBe(true);
  await w.find(".bless-results__sort select").setValue("new");
  expect(w.props("sort")).toBe("new");
  await w.find(".bless-results__suggest button").trigger("click");
  expect(w.emitted("suggest")).toEqual([["passports"]]);
  expect(w.find("details summary").text()).toBe("Filters");
  await w.setProps({ total: 0, results: [] });
  expect(w.find("[role=status]").text()).toBe("No results for “passport”.");
  expect(w.find(".bless-results__tips").exists()).toBe(true);
});
