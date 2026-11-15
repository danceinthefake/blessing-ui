import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessLightbox from "./BlessLightbox.vue";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

const items = [{ src: "/a.jpg", alt: "A" }, { src: "/b.jpg" }, { src: "/c.jpg", caption: "C" }];
const src = (w: ReturnType<typeof mount>) => w.find(".bless-lightbox__image").attributes("src");
const ptr = (el: Element, type: string, x: number, y = 0) =>
  el.dispatchEvent(new MouseEvent(type, { clientX: x, clientY: y, button: 0 }));

function make(props: Record<string, unknown> = {}) {
  const w = mount(BlessLightbox, {
    props: {
      items,
      modelValue: 0,
      "onUpdate:modelValue": (i: number) => w.setProps({ modelValue: i }),
      ...props,
    },
    attachTo: document.body,
  });
  return w;
}

test("BlessLightbox: opens at the index, names the image, and the keys and arrows step", async () => {
  const w = make();
  await nextTick();
  expect(w.find("dialog").attributes("open")).toBeDefined();
  expect(w.find("dialog").attributes("aria-label")).toBe("A");
  await w.find(".bless-lightbox__nav--prev").trigger("click");
  expect(src(w)).toBe("/c.jpg");
  expect(w.find(".bless-lightbox__count").text()).toBe("3 / 3");
  await w.find(".bless-lightbox__zoom").trigger("keydown", { key: "ArrowRight" });
  expect(src(w)).toBe("/a.jpg");
  await w.setProps({ modelValue: 1 });
  expect(w.find("dialog").attributes("aria-label")).toBe("Image 2 of 3");
  w.unmount();
});

test("BlessLightbox: a swipe to the side steps; a short or upward drag does not", async () => {
  const w = make({ loop: false });
  await nextTick();
  const stage = w.find(".bless-lightbox__stage").element;
  ptr(stage, "pointerdown", 300);
  ptr(stage, "pointerup", 200);
  await nextTick();
  expect(src(w)).toBe("/b.jpg");
  ptr(stage, "pointerdown", 300);
  ptr(stage, "pointerup", 270);
  ptr(stage, "pointerdown", 300, 0);
  ptr(stage, "pointerup", 230, 200);
  await nextTick();
  expect(src(w)).toBe("/b.jpg");
  ptr(stage, "pointerdown", 100);
  ptr(stage, "pointerup", 300);
  await nextTick();
  expect(src(w)).toBe("/a.jpg");
  // no loop: no step back from the first image
  ptr(stage, "pointerdown", 100);
  ptr(stage, "pointerup", 300);
  await nextTick();
  expect(src(w)).toBe("/a.jpg");
  w.unmount();
});

test("BlessLightbox: zoom scales the image, a drag pans it, and a new image resets it", async () => {
  const w = make({ zoom: 3 });
  await nextTick();
  const zoom = w.find(".bless-lightbox__zoom");
  expect(zoom.attributes("aria-label")).toBe("Zoom in");
  await zoom.trigger("click");
  expect(zoom.attributes("aria-pressed")).toBe("true");
  expect(zoom.attributes("aria-label")).toBe("Zoom out");
  const stage = w.find(".bless-lightbox__stage").element;
  ptr(stage, "pointerdown", 100, 100);
  ptr(stage, "pointermove", 40, 130);
  ptr(stage, "pointerup", 40, 130);
  await nextTick();
  // zoomed: the drag pans and does not step
  expect(src(w)).toBe("/a.jpg");
  expect(w.find(".bless-lightbox__image").attributes("style")).toContain(
    "translate(-60px, 30px) scale(3)",
  );
  await w.find(".bless-lightbox__nav--next").trigger("click");
  expect(w.find(".bless-lightbox__image").attributes("style")).toBeUndefined();
  await w.find(".bless-lightbox__stage").trigger("dblclick");
  expect(w.find(".bless-lightbox__image").attributes("style")).toContain("scale(3)");
  w.unmount();
});
