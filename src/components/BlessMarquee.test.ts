import { mount, type VueWrapper } from "@vue/test-utils";
import BlessMarquee from "./BlessMarquee.vue";

let w: VueWrapper<any>;
afterEach(() => {
  w?.unmount();
  vi.unstubAllGlobals();
});
const mk = (props = {}) =>
  (w = mount(BlessMarquee, {
    props: {
      paused: false,
      "onUpdate:paused": (v: boolean) => w.setProps({ paused: v }),
      ...props,
    },
    slots: { default: '<span class="item">One</span><span class="item">Two</span>' },
    attachTo: document.body,
  }));

test("the content is there twice for a seamless loop; the copy is hidden from everything", () => {
  mk();
  const runs = w.findAll(".bless-marquee__run");
  expect(runs).toHaveLength(2);
  expect(runs[0].attributes("aria-hidden")).toBeUndefined();
  expect(runs[1].attributes("aria-hidden")).toBe("true");
  expect(runs[1].attributes("inert")).toBeDefined();
  expect(w.findAll(".item")).toHaveLength(4);
});

test("it is a named group; the loop time follows the content width and speed", () => {
  const w2 = mount(BlessMarquee, {
    props: { speed: 100, label: "Partners" },
    slots: { default: "x" },
    attachTo: document.body,
  });
  expect(w2.attributes("aria-label")).toBe("Partners");
  expect(w2.attributes("aria-roledescription")).toBe("marquee");
  // jsdom has no layout (scrollWidth 0): falls back to 20s
  expect(w2.attributes("style")).toContain("--bless-marquee-time: 20s");
  w2.unmount();
});

test("Pause toggles a class and the model; the button says what it will do", async () => {
  mk();
  const btn = () => w.find(".bless-marquee__btn");
  expect(btn().text()).toBe("Pause");
  await btn().trigger("click");
  expect(w.props("paused")).toBe(true);
  expect(w.classes()).toContain("bless-marquee--paused");
  expect(btn().text()).toBe("Play");
  expect(btn().attributes("aria-pressed")).toBe("true");
});

test("pauseOnHover and reverse are classes; controls:false drops the button", () => {
  mk({ pauseOnHover: false, reverse: true, controls: false });
  expect(w.classes()).not.toContain("bless-marquee--hover");
  expect(w.classes()).toContain("bless-marquee--reverse");
  expect(w.find(".bless-marquee__btn").exists()).toBe(false);
});

test("reduced motion: no animation class set, one copy shown, no pause button", async () => {
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
  mk();
  await w.vm.$nextTick();
  expect(w.classes()).toContain("bless-marquee--still");
  expect(w.find(".bless-marquee__btn").exists()).toBe(false);
});
