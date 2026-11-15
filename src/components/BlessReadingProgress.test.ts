import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessReadingProgress from "./BlessReadingProgress.vue";

function box(words: number) {
  const el = document.createElement("div");
  el.style.overflowY = "auto";
  el.textContent = Array.from({ length: words }, () => "word").join(" ");
  Object.defineProperties(el, {
    scrollHeight: { value: 1100, configurable: true },
    clientHeight: { value: 100, configurable: true },
  });
  document.body.append(el);
  return el;
}

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (f: FrameRequestCallback) => (f(0), 0));
});
afterEach(() => vi.unstubAllGlobals());

test("BlessReadingProgress: a box that scrolls by itself fills the bar and counts down the minutes", async () => {
  const el = box(2300);
  const w = mount(BlessReadingProgress, {
    props: { target: el, minutes: true, position: "sticky" },
  });
  await nextTick();
  const bar = w.find("[role=progressbar]");
  expect(bar.attributes("aria-valuenow")).toBe("0");
  expect(w.find(".bless-reading__left").text()).toBe("10 min left");
  el.scrollTop = 500;
  el.dispatchEvent(new Event("scroll"));
  await nextTick();
  expect(bar.attributes("aria-valuenow")).toBe("50");
  expect(bar.attributes("aria-valuetext")).toBe("50%, 5 min left");
  expect(w.find(".bless-reading__bar").attributes("style")).toContain("scaleX(0.5)");
  expect(w.classes()).toContain("bless-reading--sticky");
  el.scrollTop = 1000;
  el.dispatchEvent(new Event("scroll"));
  await nextTick();
  expect(w.emitted("done")).toHaveLength(1);
  expect(w.find(".bless-reading__left").text()).toBe("Less than a minute left");
  w.unmount();
  el.remove();
});

test("BlessReadingProgress: a selector target, no minutes by default, and labels translate", async () => {
  const el = box(10);
  el.id = "post";
  const w = mount(BlessReadingProgress, {
    props: { target: "#post", labels: { label: "Progres baca" } },
  });
  await nextTick();
  expect(w.find(".bless-reading__left").exists()).toBe(false);
  expect(w.find("[role=progressbar]").attributes("aria-label")).toBe("Progres baca");
  expect(w.find("[role=progressbar]").attributes("aria-valuetext")).toBeUndefined();
  w.unmount();
  el.remove();
});
