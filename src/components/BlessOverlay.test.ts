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
  expect(w.attributes("aria-label")).toBe("Nav");
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
