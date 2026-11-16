import { mount } from "@vue/test-utils";
import BlessMindMap from "./BlessMindMap.vue";

const root = {
  label: "Launch",
  children: [
    { label: "Product", children: [{ label: "Mic" }, { label: "Stand" }] },
    { label: "Price" },
    { label: "Shops", children: [{ label: "Online" }] },
  ],
};

test("BlessMindMap: branches on two sides and the tree as nested lists", () => {
  const w = mount(BlessMindMap, { props: { root } });
  const labels = w.findAll("text");
  expect(labels.map((t) => t.text())).toEqual([
    "Mic",
    "Stand",
    "Product",
    "Price",
    "Online",
    "Shops",
    "Launch",
  ]);
  const anchor = (s: string) => labels.find((t) => t.text() === s)!.attributes("text-anchor");
  expect(anchor("Product")).toBe("start");
  expect(anchor("Shops")).toBe("end");
  expect(w.find("svg").attributes("aria-hidden")).toBe("true");
  expect(w.find(".bless-sr").text().replace(/\s+/g, " ")).toBe(
    "LaunchProductMicStandPriceShopsOnline",
  );
  expect(w.findAll(".bless-sr li")).toHaveLength(7);
});
