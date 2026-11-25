import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import BlessNovelBox from "./BlessNovelBox.vue";

beforeEach(() => {
  vi.useFakeTimers();
  document.documentElement.removeAttribute("data-motion");
});

afterEach(() => {
  vi.useRealTimers();
  document.documentElement.removeAttribute("data-motion");
});

test("BlessNovelBox types out letters, exposes full line to screen readers, and emits done", async () => {
  const w = mount(BlessNovelBox, { props: { name: "Megumi", text: "Hello", speed: 20 } });
  await w.vm.$nextTick();
  expect(w.find(".bless-novel__name").text()).toBe("Megumi");
  expect(w.find(".bless-sr").text()).toBe("Hello");
  expect(w.find('[aria-hidden="true"]').text()).toBe("");
  expect(w.classes()).not.toContain("bless-novel--done");

  vi.advanceTimersByTime(40);
  await w.vm.$nextTick();
  expect(w.find('[aria-hidden="true"]').text()).toBe("He");

  vi.advanceTimersByTime(60);
  await w.vm.$nextTick();
  expect(w.find('[aria-hidden="true"]').text()).toBe("Hello");
  expect(w.classes()).toContain("bless-novel--done");
  expect(w.emitted("done")).toHaveLength(1);
});

test("BlessNovelBox shows immediately under calm motion or instant prop", async () => {
  document.documentElement.dataset.motion = "calm";
  const calm = mount(BlessNovelBox, { props: { text: "Quiet line" } });
  await calm.vm.$nextTick();
  expect(calm.find('[aria-hidden="true"]').text()).toBe("Quiet line");
  expect(calm.classes()).toContain("bless-novel--done");

  document.documentElement.removeAttribute("data-motion");
  const inst = mount(BlessNovelBox, { props: { text: "Now", instant: true } });
  await inst.vm.$nextTick();
  expect(inst.find('[aria-hidden="true"]').text()).toBe("Now");
  expect(inst.classes()).toContain("bless-novel--done");
});

test("BlessNovelBox interactive button finishes typing first, then emits next", async () => {
  const w = mount(BlessNovelBox, {
    props: { text: "Three new tracks.", speed: 30, interactive: true },
  });
  await w.vm.$nextTick();
  const btn = w.find("button");
  expect(btn.attributes("aria-label")).toBe("Show full line");
  await btn.trigger("click");
  expect(w.find('[aria-hidden="true"]').text()).toBe("Three new tracks.");
  expect(w.emitted("done")).toHaveLength(1);
  expect(w.emitted("next")).toBeUndefined();

  expect(btn.attributes("aria-label")).toBe("Next line");
  await btn.trigger("click");
  expect(w.emitted("next")).toHaveLength(1);
});

test("BlessNovelBox renders default slot when text prop is omitted", () => {
  const w = mount(BlessNovelBox, { slots: { default: "Static <em>narration</em>" } });
  expect(w.find(".bless-novel__name").exists()).toBe(false);
  expect(w.find("em").text()).toBe("narration");
  expect(w.classes()).toContain("bless-novel--done");
});

test("BlessNovelBox renders optional portrait medallion via avatar, emblem, or slot", () => {
  const av = mount(BlessNovelBox, { props: { name: "Megumi", avatar: "/m.jpg", text: "Hi", instant: true } });
  expect(av.classes()).toContain("bless-novel--portrait");
  expect(av.find(".bless-novel__avatar").attributes("src")).toBe("/m.jpg");

  const em = mount(BlessNovelBox, { props: { name: "Blessing", emblem: true, text: "Welcome", instant: true } });
  expect(em.classes()).toContain("bless-novel--portrait");
  expect(em.find(".bless-novel__emblem").exists()).toBe(true);

  const sl = mount(BlessNovelBox, {
    props: { text: "Custom", instant: true },
    slots: { portrait: '<span class="custom-p">P</span>' },
  });
  expect(sl.classes()).toContain("bless-novel--portrait");
  expect(sl.find(".custom-p").text()).toBe("P");
});
