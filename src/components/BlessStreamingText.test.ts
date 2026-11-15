import { mount } from "@vue/test-utils";
import BlessStreamingText from "./BlessStreamingText.vue";

afterEach(() => vi.useRealTimers());

test("BlessStreamingText: shows each part at once with a caret, busy until done", async () => {
  const w = mount(BlessStreamingText, { props: { text: "Hel" } });
  expect(w.text()).toBe("Hel");
  expect(w.find(".bless-streaming__caret").exists()).toBe(true);
  expect(w.attributes("aria-busy")).toBe("true");
  expect(w.attributes("aria-live")).toBe("polite");
  await w.setProps({ text: "Hello" });
  expect(w.text()).toBe("Hello");
  await w.setProps({ done: true });
  expect(w.find(".bless-streaming__caret").exists()).toBe(false);
  expect(w.attributes("aria-busy")).toBe("false");
});

test("BlessStreamingText: pace shows the text at an even rate, done shows the rest, new text starts over", async () => {
  vi.useFakeTimers();
  const w = mount(BlessStreamingText, { props: { text: "", pace: 100 } });
  await w.setProps({ text: "abcdefghij" });
  expect(w.text()).toBe("");
  vi.advanceTimersByTime(30);
  await w.vm.$nextTick();
  expect(w.text()).toBe("abc");
  vi.advanceTimersByTime(60);
  await w.vm.$nextTick();
  expect(w.text()).toBe("abcdefghi");
  await w.setProps({ text: "abcdefghijklmnop", done: true });
  expect(w.text()).toBe("abcdefghijklmnop");
  await w.setProps({ text: "New", done: false, pace: 0 });
  expect(w.text()).toBe("New");
});

test("BlessStreamingText: the slot gets the shown text, for Markdown", () => {
  const w = mount(BlessStreamingText, {
    props: { text: "**hi**", done: true },
    slots: { default: `<template #default="{ text }"><b>{{ text.length }}</b></template>` },
  });
  expect(w.find("b").text()).toBe("6");
});
