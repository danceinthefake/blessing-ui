import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessAttachment from "./BlessAttachment.vue";
import BlessBubble from "./BlessBubble.vue";
import BlessMarker from "./BlessMarker.vue";
import BlessMessage from "./BlessMessage.vue";
import BlessMessageScroller from "./BlessMessageScroller.vue";
import BlessQuestionnaire from "./BlessQuestionnaire.vue";
import type { BlessQuestion } from "./questionnaire";

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof ResizeObserver;
  Element.prototype.scrollTo = function (this: Element, o?: ScrollToOptions | number) {
    if (typeof o === "object" && o?.top != null) this.scrollTop = o.top;
  } as typeof Element.prototype.scrollTo;
});

test("BlessMessage: header, align, compact hides avatar", () => {
  const w = mount(BlessMessage, {
    props: { name: "Eriri", time: "12:00", align: "end" },
    slots: { default: "hi", actions: "<button>x</button>" },
  });
  expect(w.classes()).toContain("bless-message--end");
  expect(w.find(".bless-message__header strong").text()).toBe("Eriri");
  expect(w.find(".bless-message__avatar").exists()).toBe(true);
  const c = mount(BlessMessage, { props: { name: "E", compact: true }, slots: { default: "x" } });
  expect(c.find(".bless-message__avatar").exists()).toBe(false);
  expect(c.find(".bless-message__header").exists()).toBe(false);
});

test("BlessBubble: collapsible toggles, reactions emit", async () => {
  const w = mount(BlessBubble, {
    props: { collapsible: true, reactions: [{ emoji: "👍", count: 2, active: true }] },
    slots: { default: "long" },
  });
  expect(w.classes()).toContain("bless-bubble--clamped");
  await w.find(".bless-bubble__more").trigger("click");
  expect(w.classes()).not.toContain("bless-bubble--clamped");
  const r = w.find(".bless-bubble__reaction");
  expect(r.attributes("aria-pressed")).toBe("true");
  await r.trigger("click");
  expect(w.emitted("react")![0][0]).toMatchObject({ emoji: "👍" });
});

test("BlessMarker variants", () => {
  const w = mount(BlessMarker, {
    props: { variant: "separator", color: "accent" },
    slots: { default: "Today" },
  });
  expect(w.attributes("role")).toBe("note");
  expect(w.classes()).toContain("bless-marker--separator");
  expect(w.classes()).toContain("bless-marker--accent");
});

test("BlessAttachment: ext fallback, uploading, error, remove", async () => {
  const w = mount(BlessAttachment, { props: { name: "op.pdf", removable: true } });
  expect(w.find(".bless-attachment__ext").text()).toBe("PDF");
  await w.find(".bless-attachment__remove").trigger("click");
  expect(w.emitted("remove")).toHaveLength(1);
  const u = mount(BlessAttachment, { props: { name: "a.png", state: "uploading", progress: 40 } });
  expect(u.attributes("aria-busy")).toBe("true");
  expect(u.find(".bless-progress").exists()).toBe(true);
  const e = mount(BlessAttachment, { props: { name: "a.png", state: "error" } });
  expect(e.find(".bless-attachment__desc").text()).toBe("Upload failed");
});

test("BlessAttachment with href: the name is the link, the remove button is outside it", () => {
  const w = mount(BlessAttachment, { props: { name: "a.pdf", href: "/a.pdf", removable: true } });
  expect(w.element.tagName).toBe("DIV");
  expect(w.find("a").text()).toBe("a.pdf");
  expect(w.find("a button").exists()).toBe(false);
  expect(w.find(".bless-attachment__remove").attributes("aria-label")).toBe("Remove a.pdf");
});

test("BlessMessageScroller: jump button appears when scrolled up, reach-top emits once", async () => {
  const w = mount(BlessMessageScroller, { slots: { default: "<p>m</p>" } });
  const vp = w.find(".bless-message-scroller__viewport").element as HTMLElement;
  Object.defineProperty(vp, "scrollHeight", { value: 1000, configurable: true });
  Object.defineProperty(vp, "clientHeight", { value: 400, configurable: true });
  vp.scrollTop = 0;
  await w.find(".bless-message-scroller__viewport").trigger("scroll");
  expect(w.find(".bless-message-scroller__jump").exists()).toBe(true);
  expect(w.emitted("reach-top")).toHaveLength(1);
  await w.find(".bless-message-scroller__viewport").trigger("scroll");
  expect(w.emitted("reach-top")).toHaveLength(1);
  await w.find(".bless-message-scroller__jump").trigger("click");
  expect(vp.scrollTop).toBe(1000);
  await w.find(".bless-message-scroller__viewport").trigger("scroll");
  expect(w.find(".bless-message-scroller__jump").exists()).toBe(false);
});

const qs: BlessQuestion[] = [
  {
    name: "fav",
    title: "Favourite?",
    type: "single",
    choices: [
      { value: "a", label: "A" },
      { value: "b", label: "B" },
    ],
  },
  { name: "why", title: "Why?", type: "freeform", skippable: true },
];

test("BlessQuestionnaire: required blocks, shortcut picks, skip, submit", async () => {
  const w = mount(BlessQuestionnaire, { props: { questions: qs } });
  await w.find("form").trigger("submit");
  expect(w.find(".bless-questionnaire__error").exists()).toBe(true);
  expect(w.emitted("update:step")).toBeUndefined();
  await w.find("form").trigger("keydown", { key: "2" });
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toEqual({ fav: "b" });
  await w.setProps({ modelValue: { fav: "b" } });
  await w.find("form").trigger("submit");
  await nextTick();
  expect(w.find(".bless-questionnaire__title").text()).toBe("Why?");
  const skipBtn = w.findAll("button").find((b) => b.text() === "Skip")!;
  await skipBtn.trigger("click");
  expect(w.emitted("skip")).toHaveLength(1);
  expect(w.emitted("submit")).toHaveLength(1);
});

test("BlessQuestionnaire: Ctrl+digit is left to the browser; controls are named by the question", async () => {
  const w = mount(BlessQuestionnaire, {
    props: {
      questions: [
        { name: "a", title: "Pick one", type: "single", choices: [{ label: "Yes", value: "y" }] },
      ],
    },
  });
  await w.find("form").trigger("keydown", { key: "1", ctrlKey: true });
  expect(w.emitted("update:modelValue")).toBeUndefined();
  const legend = w.find("legend");
  expect(w.find("[role=radiogroup]").attributes("aria-labelledby")).toBe(legend.attributes("id"));
});
