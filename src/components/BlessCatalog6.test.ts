import { mount } from "@vue/test-utils";
import BlessJsonViewer from "./BlessJsonViewer.vue";
import BlessPoll from "./BlessPoll.vue";
import BlessTagCloud from "./BlessTagCloud.vue";
import { jsonPreview, jsonToNodes } from "./json";

test("jsonToNodes: objects and arrays are branches with their size, primitives are leaves", () => {
  const [root] = jsonToNodes({ a: 1, b: "x", c: [true, null], d: {} }, "data");
  expect(root.label).toBe("data: {4}");
  const labels = root.children!.map((c) => c.label);
  expect(labels).toEqual(["a: 1", 'b: "x"', "c: [2]", "d: {0}"]);
  expect(root.children![2].children!.map((c) => c.label)).toEqual(["0: true", "1: null"]);
  expect(root.children![3].children).toBeUndefined(); // an empty object has nothing to open
});

test("jsonToNodes: openDepth opens the first levels only; ids are paths", () => {
  const [root] = jsonToNodes({ a: { b: { c: 1 } } }, "r", { openDepth: 2 });
  expect(root.open).toBe(true);
  expect(root.children![0].open).toBe(true);
  expect(root.children![0].children![0].open).toBe(false);
  expect(root.children![0].children![0].id).toBe("$/a/b");
});

test("jsonToNodes: limit cuts a long list with a disabled '… n more' line", () => {
  const [root] = jsonToNodes(
    Array.from({ length: 5 }, (_, i) => i),
    "list",
    { limit: 2 },
  );
  expect(root.children).toHaveLength(3);
  expect(root.children![2]).toMatchObject({ label: "… 3 more", disabled: true });
});

test("jsonToNodes: a loop is marked circular, a value used twice is not", () => {
  const loop: Record<string, unknown> = { name: "x" };
  loop.self = loop;
  expect(jsonToNodes(loop)[0].children!.at(-1)!.label).toBe("self: [circular]");
  const shared = { n: 1 };
  const kids = jsonToNodes({ a: shared, b: shared })[0].children!;
  expect(kids.map((k) => k.label)).toEqual(["a: {1}", "b: {1}"]);
});

test("jsonPreview quotes and cuts strings and names odd values", () => {
  expect(jsonPreview("hi")).toBe('"hi"');
  expect(jsonPreview("x".repeat(10), 4)).toBe('"xxxx…"');
  expect(jsonPreview(undefined)).toBe("undefined");
  expect(jsonPreview(10n)).toBe("10n");
  expect(jsonPreview(null)).toBe("null");
});

test("BlessJsonViewer: renders a named tree of the value", () => {
  const w = mount(BlessJsonViewer, { props: { value: { a: 1 }, label: "Response" } });
  expect(w.find("[role=tree]").attributes("aria-label")).toBe("Response");
  expect(w.text()).toContain("root: {1}");
  expect(w.text()).toContain("a: 1");
});

const options = [
  { value: "a", label: "Cats", votes: 3 },
  { value: "b", label: "Dogs", votes: 1 },
];

test("BlessPoll: the Vote button waits for a choice, then shows the results with your vote marked", async () => {
  const w = mount(BlessPoll, { props: { question: "Pets?", options } });
  const vote = w.find("button[type=submit]");
  expect(vote.attributes("disabled")).toBeDefined();
  expect(w.find("figure").exists()).toBe(false);
  await w.findAll("input[type=radio]")[1].setValue(true);
  expect(w.find("button[type=submit]").attributes("disabled")).toBeUndefined();
  await w.find("form").trigger("submit");
  expect(w.emitted("vote")![0]).toEqual(["b"]);
  expect(w.emitted("update:modelValue")![0]).toEqual(["b"]);
  await w.setProps({ modelValue: "b" });
  expect(w.find("form").exists()).toBe(false);
  expect(w.find("figure").attributes("aria-labelledby")).toBeTruthy();
  const rows = w.findAll("li").map((r) => r.text());
  expect(rows[0]).toContain("75% · 3 votes");
  expect(rows[1]).toContain("25% · 1 vote");
  expect(rows[1]).toContain("(your vote)");
  expect(w.findAll(".bless-poll__fill--yours")).toHaveLength(1);
});

test("BlessPoll: closed shows results at once; no votes gives 0%, not NaN", () => {
  const w = mount(BlessPoll, {
    props: { question: "Q", closed: true, options: options.map((o) => ({ ...o, votes: 0 })) },
  });
  expect(w.find("form").exists()).toBe(false);
  expect(w.text()).toContain("0% · 0 votes");
  expect(w.text()).not.toContain("NaN");
});

test("BlessTagCloud: size follows weight between min and max; sort orders the list", () => {
  const tags = [
    { label: "small", weight: 1 },
    { label: "big", weight: 9 },
    { label: "mid", weight: 5 },
  ];
  const w = mount(BlessTagCloud, { props: { tags, min: 1, max: 3, sort: "weight" } });
  const items = w.findAll("li");
  expect(items.map((i) => i.text())).toEqual(["big", "mid", "small"]);
  expect(items[0].find(".bless-cloud__tag").attributes("style")).toContain("font-size: 3rem");
  expect(items[1].find(".bless-cloud__tag").attributes("style")).toContain("font-size: 2rem");
  expect(items[2].find(".bless-cloud__tag").attributes("style")).toContain("font-size: 1rem");
});

test("BlessTagCloud: a tag with href is a link, one without is a button that emits select", async () => {
  const tags = [
    { label: "docs", weight: 2, href: "https://example.com/docs" },
    { label: "vue", weight: 2 },
  ];
  const w = mount(BlessTagCloud, { props: { tags } });
  expect(w.find("a").attributes("href")).toBe("https://example.com/docs");
  await w.find("button").trigger("click");
  expect(w.emitted("select")![0][0]).toMatchObject({ label: "vue" });
  expect(w.find("ul").attributes("aria-label")).toBe("Tags");
  // equal weights fall back to the middle size, not NaN
  expect(w.find(".bless-cloud__tag").attributes("style")).not.toContain("NaN");
});
