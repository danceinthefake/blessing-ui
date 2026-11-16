import { mount } from "@vue/test-utils";
import BlessFacetFilter, { type BlessFacet } from "./BlessFacetFilter.vue";

const facets: BlessFacet[] = [
  {
    id: "brand",
    label: "Brand",
    options: [
      { value: "a", label: "Alpha", count: 4 },
      { value: "b", label: "Beta", count: 0 },
    ],
  },
];
const sheet = () => {
  const w = mount(BlessFacetFilter, {
    props: {
      facets,
      priceRange: true,
      "onUpdate:modelValue": (v: Record<string, string[]>) => w.setProps({ modelValue: v }),
      "onUpdate:price": (v: [number | undefined, number | undefined]) => w.setProps({ price: v }),
    },
  });
  return w;
};

test("BlessFacetFilter: check with counts, an empty option is off, clear one facet and clear all", async () => {
  const w = sheet();
  const boxes = w.findAll("input[type=checkbox]");
  expect(boxes[1]!.attributes("disabled")).toBeDefined();
  expect(w.findAll(".bless-facets__count").map((c) => c.text())).toEqual(["4", "0"]);
  await boxes[0]!.setValue(true);
  expect(w.props("modelValue")).toEqual({ brand: ["a"] });
  expect(w.find(".bless-facets__one").attributes("aria-label")).toBe("Clear: Brand");
  expect(w.find(".bless-facets__top button").text()).toBe("Clear all (1)");
  await w.find(".bless-facets__one").trigger("click");
  expect(w.props("modelValue")).toEqual({ brand: [] });
  expect(w.find(".bless-facets__top button").exists()).toBe(false);
});

test("BlessFacetFilter: the price range sets each end, counts as one filter, and clears", async () => {
  const w = sheet();
  const [lo, hi] = w.findAll("input[type=number]");
  await lo!.setValue("10");
  await lo!.trigger("change");
  await hi!.setValue("");
  await hi!.trigger("change");
  expect(w.props("price")).toEqual([10, undefined]);
  expect(w.find(".bless-facets__money [aria-hidden]").text()).toBe("$");
  expect(w.find(".bless-facets__top button").text()).toBe("Clear all (1)");
  await w.find(".bless-facets__top button").trigger("click");
  expect(w.props("price")).toEqual([undefined, undefined]);
});
