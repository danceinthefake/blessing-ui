import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessReasoning from "./BlessReasoning.vue";

afterEach(() => vi.useRealTimers());

test("BlessReasoning: open while it streams, then it closes and shows the time", async () => {
  vi.useFakeTimers();
  const w = mount(BlessReasoning, { props: { text: "Step one", streaming: true } });
  expect(w.find("details").attributes("open")).toBeDefined();
  expect(w.find(".bless-reasoning__title").text()).toBe("Thinking…");
  expect(w.find(".bless-reasoning__body").attributes("aria-busy")).toBe("true");
  vi.advanceTimersByTime(12_400);
  await w.setProps({ streaming: false });
  expect(w.find("details").attributes("open")).toBeUndefined();
  expect(w.find(".bless-reasoning__title").text()).toBe("Thought for 12 s");
  expect(w.find(".bless-reasoning__body").text()).toBe("Step one");
});

test("BlessReasoning: a reader who opened it keeps it open at the end", async () => {
  const w = mount(BlessReasoning, { props: { text: "x", streaming: true } });
  const d = w.find("details").element as HTMLDetailsElement;
  d.open = false;
  await w.find("details").trigger("toggle");
  d.open = true;
  await w.find("details").trigger("toggle");
  await w.setProps({ streaming: false });
  await nextTick();
  expect(w.find("details").attributes("open")).toBeDefined();
  expect(w.emitted("update:open")!.at(-1)).toEqual([true]);
});

test("BlessReasoning: from history it starts closed, with a given duration or no time, and labels translate", () => {
  const a = mount(BlessReasoning, { props: { text: "x", duration: 0 } });
  expect(a.find("details").attributes("open")).toBeUndefined();
  expect(a.find(".bless-reasoning__title").text()).toBe("Thought for a moment");
  const b = mount(BlessReasoning, {
    props: { labels: { done: "Penalaran" } },
    slots: { default: "<p>slot</p>" },
  });
  expect(b.find(".bless-reasoning__title").text()).toBe("Penalaran");
  expect(b.find(".bless-reasoning__body p").text()).toBe("slot");
});
