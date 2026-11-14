import { mount } from "@vue/test-utils";
import BlessSankey from "./BlessSankey.vue";
import { layoutSankey } from "./sankey";

const links = [
  { source: "visit", target: "signup", value: 60 },
  { source: "visit", target: "leave", value: 40 },
  { source: "signup", target: "buy", value: 20 },
  { source: "signup", target: "leave", value: 40 },
];

test("layoutSankey: columns by path, ends in the last column, heights by flow", () => {
  const { nodes, links: laid } = layoutSankey(links, [], 400, 200, 10, 0);
  const at = (id: string) => nodes.find((n) => n.id === id)!;
  expect(nodes.map((n) => [n.id, n.col])).toEqual([
    ["visit", 0],
    ["signup", 1],
    ["leave", 2],
    ["buy", 2],
  ]);
  expect(at("visit").value).toBe(100);
  expect(at("leave").value).toBe(80);
  // the tallest column fills the height: visit 100 and the last column 80 + 20
  expect(at("visit").h).toBe(200);
  expect(at("leave").h + at("buy").h).toBe(200);
  expect(at("visit").x).toBe(0);
  expect(at("buy").x).toBe(390);
  expect(laid).toHaveLength(4);
  expect(laid[0]!.d).toMatch(/^M10,\d+(\.\d)?C/);
});

test("layoutSankey: zero flows and loops to self are dropped; a cycle does not hang", () => {
  const { nodes, links: laid } = layoutSankey(
    [
      { source: "a", target: "b", value: 0 },
      { source: "a", target: "a", value: 5 },
      { source: "x", target: "y", value: 1 },
      { source: "y", target: "x", value: 1 },
    ],
    [],
    300,
    100,
  );
  expect(nodes.map((n) => n.id)).toEqual(["x", "y"]);
  expect(laid).toHaveLength(2);
});

test("BlessSankey: a band per link, a node per id, and a table of the flows for screen readers", () => {
  const w = mount(BlessSankey, {
    props: {
      links,
      nodes: [{ id: "visit", label: "Visits", color: "accent" }],
      format: (v: number) => `${v}k`,
      label: "Sign-up flow",
    },
  });
  expect(w.find("svg").attributes("aria-hidden")).toBe("true");
  expect(w.findAll(".bless-sankey__link")).toHaveLength(4);
  expect(w.findAll(".bless-sankey__node")).toHaveLength(4);
  expect(w.find(".bless-sankey__label").text()).toBe("Visits 100k");
  expect(w.find("g").attributes("style")).toContain("--_c: var(--bless-color-accent)");
  expect(w.find("caption").text()).toBe("Sign-up flow");
  expect(
    w
      .findAll("tbody tr")[0]!
      .findAll("td")
      .map((d) => d.text()),
  ).toEqual(["Visits", "signup", "60k"]);
  expect(w.find("title").text()).toBe("Visits → signup: 60k");
});
