import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessGallery from "./BlessGallery.vue";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

const items = [
  { src: "/a.jpg", thumb: "/a-t.jpg", alt: "A", caption: "cap A" },
  { src: "/b.jpg", alt: "B" },
  { src: "/c.jpg" },
];

test("thumb click opens viewer at index; arrows step and wrap", async () => {
  const w = mount(BlessGallery, { props: { items }, attachTo: document.body });
  const thumbs = w.findAll(".bless-gallery__thumb img");
  expect(thumbs[0].attributes("src")).toBe("/a-t.jpg");
  expect(thumbs[1].attributes("src")).toBe("/b.jpg");
  expect(w.find("dialog").attributes("open")).toBeUndefined();

  await w.findAll(".bless-gallery__thumb")[2].trigger("click");
  await nextTick();
  expect(w.emitted("update:modelValue")![0]).toEqual([2]);
  expect(w.find("dialog").attributes("open")).toBeDefined();
  expect(w.find(".bless-gallery__image").attributes("src")).toBe("/c.jpg");
  expect(w.find(".bless-gallery__count").text()).toBe("3 / 3");

  await w.find(".bless-gallery__nav--next").trigger("click");
  expect(w.find(".bless-gallery__image").attributes("src")).toBe("/a.jpg"); // wrapped
  expect(w.find(".bless-gallery__caption").text()).toBe("cap A");

  await w.find(".bless-modal__close").trigger("keydown", { key: "ArrowLeft" });
  expect(w.find(".bless-gallery__image").attributes("src")).toBe("/c.jpg");

  await w.find(".bless-modal__close").trigger("click");
  await nextTick();
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([-1]);
  w.unmount();
});

test("loop=false disables ends", async () => {
  const w = mount(BlessGallery, {
    props: { items, loop: false, modelValue: 0 },
    attachTo: document.body,
  });
  await nextTick();
  expect(w.find(".bless-gallery__nav--prev").attributes("disabled")).toBeDefined();
  expect(w.find(".bless-gallery__nav--next").attributes("disabled")).toBeUndefined();
  w.unmount();
});
