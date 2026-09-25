import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessAlertDialog from "./BlessAlertDialog.vue";
import BlessDrawer from "./BlessDrawer.vue";
import BlessSheet from "./BlessSheet.vue";
import BlessToaster from "./BlessToaster.vue";
import { useToast } from "../composables/useToast";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

test("BlessSheet side class, open/close, backdrop", async () => {
  const w = mount(BlessSheet, {
    props: { modelValue: true, side: "left", title: "Nav" },
    slots: { default: "x" },
    attachTo: document.body,
  });
  await nextTick();
  expect(w.classes()).toContain("bless-sheet--left");
  expect(w.attributes("open")).toBeDefined();
  expect(document.getElementById(w.attributes("aria-labelledby")!)?.textContent?.trim()).toBe(
    "Nav",
  );
  await w.trigger("click");
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([false]);
  w.unmount();
});

test("BlessDrawer is bottom sheet with handle; drag down closes", async () => {
  const w = mount(BlessDrawer, { props: { modelValue: true }, attachTo: document.body });
  await nextTick();
  expect(w.find(".bless-sheet--bottom").exists()).toBe(true);
  const h = w.find(".bless-sheet__handle");
  (h.element as HTMLElement).setPointerCapture = () => {};
  const ev = (type: string, clientY: number) =>
    h.element.dispatchEvent(new MouseEvent(type, { clientY, bubbles: true }));
  ev("pointerdown", 100);
  ev("pointermove", 250);
  ev("pointerup", 250);
  await nextTick();
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([false]);
  w.unmount();
});

test("BlessAlertDialog confirm/cancel, no close button", async () => {
  const w = mount(BlessAlertDialog, {
    props: { modelValue: true, title: "Delete?", description: "gone" },
    attachTo: document.body,
  });
  await nextTick();
  expect(w.find("dialog").attributes("role")).toBe("alertdialog");
  const btns = w.findAll("footer button");
  expect(btns.map((b) => b.text())).toEqual(["Cancel", "Confirm"]);
  await btns[1].trigger("click");
  expect(w.emitted("confirm")).toHaveLength(1);
  expect(w.emitted("cancel")).toBeUndefined();
  await btns[0].trigger("click");
  await nextTick();
  expect(w.emitted("update:modelValue")!.at(-1)).toEqual([false]);
  w.unmount();
});

test("useToast + BlessToaster render, auto-dismiss, action", async () => {
  vi.useFakeTimers();
  const { toast, success, clear } = useToast();
  clear();
  const w = mount(BlessToaster, { attachTo: document.body });
  const fn = vi.fn();
  toast({ title: "Saved", duration: 100, action: { label: "Undo", onClick: fn } });
  success("Done");
  await nextTick();
  const items = w.findAll(".bless-toast");
  expect(items).toHaveLength(2);
  expect(items[1].classes()).toContain("bless-toast--success");
  await items[0].find(".bless-toast__action").trigger("click");
  expect(fn).toHaveBeenCalled();
  await nextTick();
  expect(w.findAll(".bless-toast")).toHaveLength(1);
  vi.advanceTimersByTime(5000);
  await nextTick();
  expect(w.findAll(".bless-toast")).toHaveLength(0);
  vi.useRealTimers();
  w.unmount();
});

test("BlessSheet: a swipe on the handle doesn't close a non-dismissible sheet; slot title names it", async () => {
  const w = mount(BlessSheet, {
    props: { modelValue: true, handle: true, dismissible: false },
    slots: { title: "<em>Filters</em>" },
    attachTo: document.body,
  });
  await nextTick();
  expect(document.getElementById(w.attributes("aria-labelledby")!)?.textContent?.trim()).toBe(
    "Filters",
  );
  const h = w.find(".bless-sheet__handle").element as HTMLElement;
  h.setPointerCapture = () => {};
  const ev = (type: string, y: number) => {
    const e = new MouseEvent(type, { clientY: y, bubbles: true });
    Object.defineProperty(e, "pointerId", { value: 1 });
    h.dispatchEvent(e);
  };
  ev("pointerdown", 10);
  ev("pointermove", 200);
  ev("pointerup", 200);
  await nextTick();
  expect(w.emitted("update:modelValue")).toBeUndefined();
  w.unmount();
});

test("toasts pause while the pointer or focus is in the toaster, then finish their time", async () => {
  const { useToast, pauseToasts, resumeToasts } = await import("../composables/useToast");
  vi.useFakeTimers();
  try {
    const { toast, items, clear } = useToast();
    clear();
    toast({ title: "Saved", duration: 100 });
    vi.advanceTimersByTime(50);
    pauseToasts();
    vi.advanceTimersByTime(500);
    expect(items.value).toHaveLength(1); // held while paused
    resumeToasts();
    vi.advanceTimersByTime(40);
    expect(items.value).toHaveLength(1); // 10ms of its 100 still left
    vi.advanceTimersByTime(20);
    expect(items.value).toHaveLength(0);
  } finally {
    vi.useRealTimers();
  }
});
