import { mount } from "@vue/test-utils";
import BlessPresenceCursors from "./BlessPresenceCursors.vue";

const cursors = [
  { id: "ana", name: "Ana", x: 0.25, y: 0.5 },
  { id: "budi", name: "Budi", x: 1.4, y: -1, color: "accent" },
  { id: "cici", name: "Cici", x: 0, y: 0, color: "#123456" },
];

test("BlessPresenceCursors: one tag per person at their spot, clamped to the area, hidden from screen readers", () => {
  const w = mount(BlessPresenceCursors, { props: { cursors }, slots: { default: "<p>doc</p>" } });
  expect(w.find("p").text()).toBe("doc");
  const tags = w.findAll(".bless-presence__cursor");
  expect(tags.map((t) => t.text())).toEqual(["Ana", "Budi", "Cici"]);
  expect(tags[0]!.attributes("style")).toContain("inset-inline-start: 25%");
  expect(tags[0]!.attributes("style")).toContain("inset-block-start: 50%");
  expect(tags[1]!.attributes("style")).toContain("inset-inline-start: 100%");
  expect(tags[1]!.attributes("style")).toContain("inset-block-start: 0%");
  expect(w.find(".bless-presence__layer").attributes("aria-hidden")).toBe("true");
});

test("BlessPresenceCursors: a token name or a CSS color, else a chart color that stays with the id", () => {
  const w = mount(BlessPresenceCursors, { props: { cursors } });
  const style = (i: number) => w.findAll(".bless-presence__cursor")[i]!.attributes("style");
  expect(style(0)).toMatch(/--_c: var\(--bless-color-chart-[1-5]\)/);
  expect(style(1)).toContain("--_c: var(--bless-color-accent)");
  expect(style(2)).toContain("--_c: #123456");
  const again = mount(BlessPresenceCursors, { props: { cursors: [cursors[0]!] } });
  expect(again.find(".bless-presence__cursor").attributes("style")).toBe(style(0));
});

test("BlessPresenceCursors: move reports the local pointer as fractions, then null on leave", async () => {
  const w = mount(BlessPresenceCursors, { props: { cursors: [] } });
  const el = w.element as HTMLElement;
  el.getBoundingClientRect = () => ({ left: 100, top: 50, width: 200, height: 100 }) as DOMRect;
  const move = () =>
    el.dispatchEvent(new MouseEvent("pointermove", { clientX: 150, clientY: 125 }));
  move();
  await w.trigger("pointerleave");
  expect(w.emitted("move")).toEqual([[{ x: 0.25, y: 0.75 }], [null]]);
  await w.setProps({ track: false });
  move();
  expect(w.emitted("move")).toHaveLength(2);
});
