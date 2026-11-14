import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessEmojiPicker from "./BlessEmojiPicker.vue";
import type { BlessEmoji } from "./emoji";

// two short groups and a narrow grid, so rows and section edges are easy to count
const emojis: BlessEmoji[] = [
  ...["a", "b", "c", "d", "e"].map((c) => ({
    char: c,
    name: `smile ${c}`,
    group: "smileys" as const,
  })),
  ...["f", "g"].map((c) => ({
    char: c,
    name: `food ${c}`,
    group: "food" as const,
    keywords: ["meal"],
  })),
];
const mk = (props = {}) =>
  mount(BlessEmojiPicker, { props: { emojis, columns: 2, ...props }, attachTo: document.body });
const focused = () => (document.activeElement as HTMLElement).textContent?.trim();

test("BlessEmojiPicker: one section per group, each emoji a named button", () => {
  const w = mk();
  expect(w.findAll(".bless-emoji__title").map((t) => t.text())).toEqual([
    "Smileys",
    "Food and drink",
  ]);
  const b = w.find(".bless-emoji__item");
  expect(b.attributes("aria-label")).toBe("smile a");
  expect(w.findAll('.bless-emoji__item[tabindex="0"]')).toHaveLength(1);
  w.unmount();
});

test("BlessEmojiPicker: arrows move by column and row, and across sections in the same column", async () => {
  const w = mk();
  const grid = w.find(".bless-emoji__grid");
  (w.find(".bless-emoji__item").element as HTMLElement).focus();
  await grid.trigger("keydown", { key: "ArrowRight" });
  await nextTick();
  expect(focused()).toBe("b");
  await grid.trigger("keydown", { key: "ArrowDown" }); // b → d
  await nextTick();
  expect(focused()).toBe("d");
  await grid.trigger("keydown", { key: "ArrowDown" }); // d is in the last full row → next section, column 2: g
  await nextTick();
  expect(focused()).toBe("g");
  await grid.trigger("keydown", { key: "ArrowUp" }); // g → the last row of smileys, column 2, clamped to e
  await nextTick();
  expect(focused()).toBe("e");
  await grid.trigger("keydown", { key: "End" });
  await nextTick();
  expect(focused()).toBe("g");
  w.unmount();
});

test("BlessEmojiPicker: search filters by name and keyword; Enter picks the first", async () => {
  const w = mk();
  const input = w.find("input");
  await input.setValue("meal");
  expect(w.findAll(".bless-emoji__item").map((b) => b.text())).toEqual(["f", "g"]);
  expect(w.find(".bless-emoji__title").text()).toBe("Results");
  await input.trigger("keydown", { key: "Enter" });
  expect(w.emitted("select")![0]![0]).toMatchObject({ char: "f" });
  await input.setValue("zzz");
  expect(w.find(".bless-emoji__empty").text()).toBe("No emoji found");
  w.unmount();
});

test("BlessEmojiPicker: a pick goes to the front of recent, with no repeats and a limit", async () => {
  const w = mk({ recentLimit: 2, recent: ["a"] });
  expect(w.find(".bless-emoji__title").text()).toBe("Recent");
  await w
    .findAll(".bless-emoji__item")
    .find((b) => b.text() === "c")!
    .trigger("click");
  expect(w.emitted("update:recent")!.at(-1)).toEqual([["c", "a"]]);
  await w.setProps({ recent: ["c", "a"] });
  await w
    .findAll(".bless-emoji__item")
    .find((b) => b.text() === "a")!
    .trigger("click");
  expect(w.emitted("update:recent")!.at(-1)).toEqual([["a", "c"]]);
  w.unmount();
});

test("BlessEmojiPicker: the built-in set has eight groups and no repeats", () => {
  const w = mount(BlessEmojiPicker);
  expect(w.findAll(".bless-emoji__group")).toHaveLength(8);
  const chars = w.findAll(".bless-emoji__item").map((b) => b.text());
  expect(new Set(chars).size).toBe(chars.length);
  expect(chars.length).toBeGreaterThan(300);
});
