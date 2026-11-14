import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessReadMore from "./BlessReadMore.vue";

// jsdom has no layout: give the text a height and a content height
const sized = (scroll: number) => {
  Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
    configurable: true,
    get: () => scroll,
  });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    get: () => 60,
  });
};
afterEach(() => {
  delete (HTMLElement.prototype as { scrollHeight?: number }).scrollHeight;
  delete (HTMLElement.prototype as { clientHeight?: number }).clientHeight;
});

test("BlessReadMore: cut text gets a button that opens and closes it", async () => {
  sized(200);
  const w = mount(BlessReadMore, { props: { lines: 2 }, slots: { default: "Long text" } });
  await nextTick();
  const text = w.find(".bless-readmore__text");
  expect(text.attributes("style")).toContain("--_lines: 2");
  expect(text.classes()).toContain("bless-readmore__text--cut");
  const b = w.find("button");
  expect(b.text()).toBe("Read more");
  expect(b.attributes("aria-expanded")).toBe("false");
  expect(b.attributes("aria-controls")).toBe(text.attributes("id"));
  await b.trigger("click");
  expect(w.emitted("update:open")).toEqual([[true]]);
  await w.setProps({ open: true });
  expect(text.classes()).not.toContain("bless-readmore__text--cut");
  expect(b.text()).toBe("Show less");
  expect(b.attributes("aria-expanded")).toBe("true");
});

test("BlessReadMore: text that fits has no button", async () => {
  sized(60);
  const w = mount(BlessReadMore, { slots: { default: "Short" } });
  await nextTick();
  expect(w.find("button").exists()).toBe(false);
});
