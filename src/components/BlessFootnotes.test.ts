import { mount } from "@vue/test-utils";
import BlessFootnoteRef from "./BlessFootnoteRef.vue";
import BlessFootnotes from "./BlessFootnotes.vue";

test("BlessFootnotes: numbered notes with ids, and a back link to each mark", () => {
  const w = mount(BlessFootnotes, {
    props: { notes: ["First source.", "Second source."], id: "ep41" },
  });
  const items = w.findAll("li");
  expect(items.map((i) => i.attributes("id"))).toEqual(["ep41-1", "ep41-2"]);
  expect(items[0]!.text()).toBe("First source.↩");
  const back = items[1]!.find("a");
  expect(back.attributes("href")).toBe("#ep41-ref-2");
  expect(back.attributes("aria-label")).toBe("Back to the text of note 2");
  expect(w.attributes("aria-labelledby")).toBe("ep41-title");
  expect(w.find("#ep41-title").text()).toBe("Notes");
});

test("BlessFootnoteRef: a numbered mark that links to its note and back, and labels translate", () => {
  const w = mount(BlessFootnoteRef, {
    props: { n: 2, id: "ep41", labels: { note: (n: number) => `Catatan ${n}` } },
  });
  const a = w.find("a");
  expect(a.attributes()).toMatchObject({
    id: "ep41-ref-2",
    href: "#ep41-2",
    "aria-label": "Catatan 2",
  });
  expect(a.text()).toBe("2");
  expect(
    mount(BlessFootnoteRef, { props: { n: 1 } })
      .find("a")
      .attributes("href"),
  ).toBe("#fn-1");
});
