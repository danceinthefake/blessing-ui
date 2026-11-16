import { mount } from "@vue/test-utils";
import BlessLyrics from "./BlessLyrics.vue";

beforeAll(() => {
  window.matchMedia ??= (() => ({ matches: false })) as never;
  HTMLElement.prototype.scrollTo ??= () => {};
});

const lines = [
  { time: 0, text: "One" },
  { time: 10, text: "Two" },
  { time: 75, text: "Three" },
];

test("BlessLyrics: the current line follows the position, and a line seeks to its time", async () => {
  const w = mount(BlessLyrics, { props: { lines, position: 12 } });
  const current = () =>
    w.findAll(".bless-lyrics__line").findIndex((b) => b.attributes("aria-current") === "true");
  expect(current()).toBe(1);
  expect(w.findAll(".bless-lyrics__line")[0]!.classes()).toContain("is-past");
  await w.setProps({ position: 80 });
  expect(current()).toBe(2);
  expect(w.findAll(".bless-lyrics__line")[2]!.attributes("title")).toBe("Play from 1:15");
  await w.findAll(".bless-lyrics__line")[0]!.trigger("click");
  expect(w.emitted("seek")).toEqual([[0]]);
});
