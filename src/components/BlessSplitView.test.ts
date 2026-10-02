import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessSplitView from "./BlessSplitView.vue";

let width = 800;
let fire: (() => void) | undefined;
beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(cb: () => void) {
        fire = cb;
      }
      observe() {}
      disconnect() {}
    },
  );
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get: () => width,
  });
});
afterAll(() => vi.unstubAllGlobals());
beforeEach(() => {
  width = 800;
  localStorage.clear();
});

let w: VueWrapper<any>;
const mk = async (props = {}) => {
  w = mount(BlessSplitView, {
    props: {
      size: 35,
      detail: false,
      "onUpdate:detail": (v: boolean) => w.setProps({ detail: v }),
      ...props,
    },
    slots: {
      master:
        '<template #master="{ open, stacked }"><button class="item" @click="open">Item {{ stacked }}</button></template>',
      detail: '<template #detail><p class="body">Detail</p></template>',
    },
    attachTo: document.body,
  });
  await flushPromises();
};
afterEach(() => w?.unmount());

test("wide: both panes with a divider, master 35%", async () => {
  await mk();
  expect(w.classes()).not.toContain("bless-split--stacked");
  expect(w.find(".item").text()).toBe("Item false");
  expect(w.find(".body").exists()).toBe(true);
  expect(w.find('[role="separator"]').attributes("aria-valuenow")).toBe("35");
});

test("narrow: one pane at a time; opening an item shows the detail and a Back button", async () => {
  width = 400;
  await mk();
  expect(w.classes()).toContain("bless-split--stacked");
  const panes = () =>
    w
      .findAll(".bless-split__pane")
      .map((p) => p.attributes("style")?.includes("display: none") ?? false);
  expect(panes()).toEqual([false, true]); // master shown, detail hidden
  expect(w.find('[role="separator"]').exists()).toBe(false);
  await w.find(".item").trigger("click");
  expect(w.props("detail")).toBe(true);
  expect(panes()).toEqual([true, false]);
  await nextTick();
  expect(document.activeElement).toBe(w.findAll(".bless-split__pane")[1].element);
  await w.find(".bless-split__back").trigger("click");
  expect(w.props("detail")).toBe(false);
  expect(w.emitted("back")).toHaveLength(1);
  await nextTick();
  expect(document.activeElement).toBe(w.findAll(".bless-split__pane")[0].element);
});

test("crossing the breakpoint switches layout when the view is resized", async () => {
  await mk({ breakpoint: 600 });
  expect(w.classes()).not.toContain("bless-split--stacked");
  width = 500;
  fire!();
  await nextTick();
  expect(w.classes()).toContain("bless-split--stacked");
  width = 700;
  fire!();
  await nextTick();
  expect(w.classes()).not.toContain("bless-split--stacked");
});

test("storageKey restores the divider and saves it; a bad stored value is ignored", async () => {
  localStorage.setItem("split-a", "42");
  await mk({ storageKey: "split-a" });
  expect(w.emitted("update:modelValue")![0]).toEqual([42]); // restored on mount
  await w.setProps({ modelValue: 30 });
  expect(localStorage.getItem("split-a")).toBe("30");
  w.unmount();
  localStorage.setItem("split-b", "999");
  await mk({ storageKey: "split-b" });
  expect(w.emitted("update:modelValue")).toBeUndefined();
});
