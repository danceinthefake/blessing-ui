import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessAffix from "./BlessAffix.vue";
import BlessBanner from "./BlessBanner.vue";
import BlessCopyButton from "./BlessCopyButton.vue";
import BlessStat from "./BlessStat.vue";
import BlessToc from "./BlessToc.vue";

class IO {
  static last: IO;
  constructor(
    public cb: (e: Partial<IntersectionObserverEntry>[]) => void,
    public opts?: IntersectionObserverInit,
  ) {
    IO.last = this;
  }
  observe() {}
  disconnect() {}
}
beforeEach(() => {
  globalThis.IntersectionObserver = IO as unknown as typeof IntersectionObserver;
});

test("BlessStat: a falling good number reads as down and stays ink; a falling bad one turns danger", () => {
  const w = mount(BlessStat, {
    props: { label: "Error rate", value: "2%", delta: -0.4, goodWhen: "down" },
  });
  expect(w.find(".bless-stat__delta").text()).toContain("Down");
  expect(w.find(".bless-stat__delta").text()).toContain("0.4%");
  expect(w.find(".bless-stat__delta--bad").exists()).toBe(false);
  const bad = mount(BlessStat, { props: { label: "Signups", value: 3, delta: -8 } });
  expect(bad.find(".bless-stat__delta--bad").exists()).toBe(true);
  expect(bad.attributes("role")).toBe("group");
  expect(bad.attributes("aria-labelledby")).toBe(bad.find(".bless-stat__label").attributes("id"));
});

test("BlessStat: zero is flat, a string delta is shown as given, no delta draws none", () => {
  const flat = mount(BlessStat, { props: { label: "Up", value: 1, delta: 0 } });
  expect(flat.find(".bless-stat__delta").text()).toContain("No change");
  const str = mount(BlessStat, { props: { label: "Plan", value: "Pro", delta: "new" } });
  expect(str.find(".bless-stat__delta").text()).toContain("new");
  expect(
    mount(BlessStat, { props: { label: "A", value: 1 } })
      .find(".bless-stat__delta")
      .exists(),
  ).toBe(false);
});

test("BlessStat: data draws a named sparkline", () => {
  const w = mount(BlessStat, {
    props: { label: "A", value: 1, data: [1, 2, 3], dataLabel: "Last 3 days" },
  });
  expect(w.find("[aria-label^='Last 3 days']").exists()).toBe(true);
});

test("BlessCopyButton: copies, emits, announces, and resets", async () => {
  vi.useFakeTimers();
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const w = mount(BlessCopyButton, { props: { value: "npm i blessing-ui" } });
  await w.find("button").trigger("click");
  await nextTick();
  expect(writeText).toHaveBeenCalledWith("npm i blessing-ui");
  expect(w.emitted("copy")![0]).toEqual(["npm i blessing-ui"]);
  expect(w.find("button").text()).toBe("Copied");
  expect(w.find("[role=status]").text()).toBe("Copied to clipboard");
  // the live region sits outside the button, so it does not join the button name
  expect(w.find("button [role=status]").exists()).toBe(false);
  await vi.advanceTimersByTimeAsync(2100);
  expect(w.find("button").text()).toBe("Copy");
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

test("BlessCopyButton: labels replace the English words", async () => {
  vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  const w = mount(BlessCopyButton, {
    props: { value: "x", labels: { copy: "Salin", copied: "Tersalin" } },
  });
  expect(w.find("button").text()).toBe("Salin");
  await w.find("button").trigger("click");
  await nextTick();
  expect(w.find("button").text()).toBe("Tersalin");
  vi.unstubAllGlobals();
});

test("BlessToc: lists the given items, indents by level, marks the current one", async () => {
  document.body.innerHTML = '<h2 id="a">A</h2><h3 id="b">B</h3>';
  const w = mount(BlessToc, {
    props: {
      items: [
        { id: "a", label: "A" },
        { id: "b", label: "B", level: 1 },
      ],
    },
    attachTo: document.body,
  });
  await nextTick();
  const links = w.findAll("a");
  expect(links.map((l) => l.attributes("href"))).toEqual(["#a", "#b"]);
  expect(w.find("nav").attributes("aria-label")).toBe("On this page");
  expect(links[0].attributes("aria-current")).toBe("location");
  expect(links[1].attributes("aria-current")).toBeUndefined();
  expect(w.findAll("li")[1].attributes("style")).toContain("--_level: 1");
  w.unmount();
});

test("BlessToc: collects headings by selector after mount and skips the ones without an id", async () => {
  document.body.innerHTML = '<h2 id="one">One</h2><h3 id="two">Two</h3><h2>No id</h2>';
  const w = mount(BlessToc, { attachTo: document.body });
  await nextTick();
  expect(w.findAll("a").map((a) => a.text())).toEqual(["One", "Two"]);
  expect(w.findAll("li")[1].attributes("style")).toContain("--_level: 1");
  w.unmount();
});

test("BlessBanner: dismiss hides it, emits, and writes the persist key", async () => {
  localStorage.clear();
  const w = mount(BlessBanner, { props: { persist: "b1" }, slots: { default: "Hello" } });
  await nextTick();
  expect(w.text()).toContain("Hello");
  await w.find(".bless-banner__close").trigger("click");
  expect(w.find(".bless-banner").exists()).toBe(false);
  expect(w.emitted("dismiss")).toHaveLength(1);
  expect(localStorage.getItem("b1")).toBe("1");
});

test("BlessBanner: a persisted dismissal keeps it hidden on the next visit", async () => {
  localStorage.setItem("b2", "1");
  const w = mount(BlessBanner, { props: { persist: "b2" }, slots: { default: "Hello" } });
  await nextTick();
  expect(w.find(".bless-banner").exists()).toBe(false);
  localStorage.clear();
});

test("BlessBanner: without persist it renders at once; dismissible:false has no close button", () => {
  const w = mount(BlessBanner, {
    props: { dismissible: false },
    slots: { default: "Hi", action: "Go" },
  });
  expect(w.find(".bless-banner").attributes("aria-label")).toBe("Announcement");
  expect(w.find(".bless-banner__close").exists()).toBe(false);
  expect(w.find(".bless-banner__action").text()).toBe("Go");
});

test("BlessAffix: the offset sets top, and the probe flips stuck", async () => {
  const w = mount(BlessAffix, {
    props: { offset: 16 },
    attrs: { class: "mine" },
    slots: { default: `<template #default="{ stuck }">{{ stuck ? "S" : "F" }}</template>` },
  });
  const box = w.find(".bless-affix");
  expect(box.attributes("style")).toContain("top: 16px");
  expect(box.classes()).toContain("mine");
  expect(IO.last.opts?.rootMargin).toBe("-16px 0px 0px 0px");
  expect(box.text()).toBe("F");
  IO.last.cb([{ isIntersecting: false }]);
  await nextTick();
  expect(box.classes()).toContain("bless-affix--stuck");
  expect(box.text()).toBe("S");
  IO.last.cb([{ isIntersecting: true }]);
  await nextTick();
  expect(box.text()).toBe("F");
});
