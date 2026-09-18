import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { BlessModal } from "../index";

// jsdom lacks showModal/close
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});
afterEach(() => history.replaceState(null, "", "/"));

test("v-model opens/closes dialog, close button emits", async () => {
  const w = mount(BlessModal, {
    props: { modelValue: false, title: "T" },
    slots: { default: "body" },
    attachTo: document.body,
  });
  const d = w.find("dialog");
  expect(d.attributes("open")).toBeUndefined();
  expect(d.attributes("aria-labelledby")).toBe("bless-modal-title");

  await w.setProps({ modelValue: true });
  await nextTick();
  expect(d.attributes("open")).toBeDefined();

  await w.find(".bless-modal__close").trigger("click");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([false]);
  w.unmount();
});

test("cancel (Esc) and backdrop click close; non-dismissible ignores backdrop", async () => {
  const w = mount(BlessModal, { props: { modelValue: true }, attachTo: document.body });
  await nextTick();
  await w.find("dialog").trigger("click"); // target is dialog itself = backdrop
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([false]);

  const n = mount(BlessModal, {
    props: { modelValue: true, dismissible: false },
    attachTo: document.body,
  });
  await nextTick();
  await n.find("dialog").trigger("click");
  expect(n.emitted("update:modelValue")).toBeUndefined();
  await n.find("dialog").trigger("cancel");
  expect(n.emitted("update:modelValue")!.at(-1)).toEqual([false]);
  w.unmount();
  n.unmount();
});

test("hash: opens on matching hash, pushes hash on open, clears on close", async () => {
  history.replaceState(null, "", "/#megumi");
  const w = mount(BlessModal, { props: { hash: "megumi" }, attachTo: document.body });
  await nextTick();
  expect(w.emitted("update:modelValue")![0]).toEqual([true]);
  expect(w.find("dialog").attributes("open")).toBeDefined();

  await w.find(".bless-modal__close").trigger("click");
  await nextTick();
  expect(location.hash).toBe("");
  expect(w.find("dialog").attributes("open")).toBeUndefined();

  // external hash change reopens
  location.hash = "#megumi";
  dispatchEvent(new HashChangeEvent("hashchange"));
  await nextTick();
  await nextTick();
  expect(w.find("dialog").attributes("open")).toBeDefined();
  w.unmount();
});
