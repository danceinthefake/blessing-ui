import { mount } from "@vue/test-utils";
import BlessHighlight from "./BlessHighlight.vue";
import { highlightRanges } from "./highlight";

test("highlightRanges: case and accents do not matter; overlaps merge", () => {
  expect(highlightRanges("Café au lait", ["CAFE"])).toEqual([[0, 4]]);
  expect(highlightRanges("aaaa", ["aa"])).toEqual([[0, 4]]);
  expect(highlightRanges("Saenai Heroine", ["hero", "roine"])).toEqual([[7, 14]]);
  expect(highlightRanges("a b", [""])).toEqual([]);
  // ß is not "ss": no locale-specific folding
  expect(highlightRanges("Straße", ["ss"])).toEqual([]);
  expect(highlightRanges("𝒜 emoji 🎉 end", ["end"])).toEqual([[12, 15]]);
});

const marks = (w: ReturnType<typeof mount>) => w.findAll("mark").map((m) => m.text());

test("BlessHighlight: each word of a search is marked; the text stays whole", () => {
  const w = mount(BlessHighlight, {
    props: { text: "How to raise a boring girlfriend", query: "  RAISE girl " },
  });
  expect(marks(w)).toEqual(["raise", "girl"]);
  expect(w.text()).toBe("How to raise a boring girlfriend");
});

test("BlessHighlight: a list keeps its terms whole; no query marks nothing; never HTML", () => {
  const w = mount(BlessHighlight, {
    props: { text: "a <b>boring</b> girl", query: ["boring girl"] },
  });
  expect(marks(w)).toEqual([]);
  expect(w.find("b").exists()).toBe(false);
  const v = mount(BlessHighlight, { props: { text: "boring girl", query: ["boring girl"] } });
  expect(marks(v)).toEqual(["boring girl"]);
  expect(marks(mount(BlessHighlight, { props: { text: "x" } }))).toEqual([]);
});
