import { mount } from "@vue/test-utils";
import { h, nextTick, ref } from "vue";
import BlessActionSheet from "./BlessActionSheet.vue";
import BlessInfiniteScroll from "./BlessInfiniteScroll.vue";
import BlessLayout from "./BlessLayout.vue";
import BlessPullToRefresh from "./BlessPullToRefresh.vue";
import BlessSlideItem from "./BlessSlideItem.vue";
import BlessTabPanels from "./BlessTabPanels.vue";
import { useLongPress, useSwipe } from "../composables/useGesture";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.hasPointerCapture = () => false;
});

/** pointer sequence helper: down at (0,0), move to (dx,dy), up */
function gesture(el: Element, dx: number, dy: number, type = "touch") {
  const ev = (t: string, x: number, y: number) =>
    el.dispatchEvent(
      new PointerEvent(t, {
        clientX: x,
        clientY: y,
        pointerId: 1,
        pointerType: type,
        bubbles: true,
        cancelable: true,
      }),
    );
  ev("pointerdown", 100, 100);
  ev("pointermove", 100 + dx, 100 + dy);
  ev("pointerup", 100 + dx, 100 + dy);
}

test("useSwipe reports direction past threshold; useLongPress fires after hold", async () => {
  vi.useFakeTimers();
  const swipes: string[] = [];
  let held = 0;
  const C = {
    setup() {
      const el = ref<HTMLElement>();
      useSwipe(el, (d) => swipes.push(d), { threshold: 30 });
      useLongPress(el, () => held++, { ms: 300 });
      return () => h("div", { ref: el }, "x");
    },
  };
  const w = mount(C);
  gesture(w.element, -80, 5);
  gesture(w.element, 10, 60);
  gesture(w.element, 5, 5);
  expect(swipes).toEqual(["left", "down"]);
  w.element.dispatchEvent(
    new PointerEvent("pointerdown", { clientX: 0, clientY: 0, pointerId: 2, bubbles: true }),
  );
  vi.advanceTimersByTime(350);
  expect(held).toBe(1);
  vi.useRealTimers();
});

test("BlessPullToRefresh: pull past threshold emits refresh with done()", async () => {
  const w = mount(BlessPullToRefresh, {
    props: { threshold: 50 },
    slots: { default: "<p>list</p>" },
  });
  gesture(w.element, 0, 200); // dampened ×0.5 → 100 ≥ 50
  await nextTick();
  expect(w.emitted("refresh")).toHaveLength(1);
  expect(w.classes()).toContain("bless-ptr--busy");
  (w.emitted("refresh")![0][0] as () => void)();
  await nextTick();
  expect(w.classes()).not.toContain("bless-ptr--busy");
});

test("BlessSlideItem: swipe left reveals right actions and emits", async () => {
  const w = mount(BlessSlideItem, {
    props: { threshold: 60 },
    slots: {
      default: "<p>row</p>",
      right: "<button>Delete</button>",
      left: "<button>Pin</button>",
    },
  });
  gesture(w.element, -120, 0);
  await nextTick();
  expect(w.emitted("right")).toHaveLength(1);
  (w.emitted("right")![0][0] as () => void)();
  await nextTick();
  expect(w.attributes("style")).toContain("--_x: 0px");
  gesture(w.element, 120, 0);
  expect(w.emitted("left")).toHaveLength(1);
});

test("BlessActionSheet lists actions, select closes, cancel emits", async () => {
  const w = mount(BlessActionSheet, {
    props: {
      open: true,
      actions: [
        { label: "Share", value: "s" },
        { label: "Delete", value: "d", danger: true, disabled: true },
      ],
    },
    attachTo: document.body,
  });
  const items = w.findAll(".bless-actionsheet__item");
  expect(items).toHaveLength(2);
  expect(items[1].attributes("disabled")).toBeDefined();
  await items[0].trigger("click");
  expect(w.emitted("select")![0][0]).toMatchObject({ value: "s" });
  expect(w.emitted("update:open")!.at(-1)![0]).toBe(false);
  expect(w.emitted("cancel")).toBeUndefined(); // a pick is not a cancel
  w.unmount();
  const c = mount(BlessActionSheet, {
    props: { open: true, actions: [{ label: "Share", value: "s" }] },
    attachTo: document.body,
  });
  await c.find(".bless-actionsheet__cancel").trigger("click");
  await nextTick();
  expect(c.emitted("cancel")).toHaveLength(1);
  c.unmount();
});

test("BlessTabPanels: swipe changes panel, loop", async () => {
  const w = mount(BlessTabPanels, {
    props: { panels: ["a", "b", "c"], modelValue: "a", threshold: 40 },
    slots: { default: ({ panel }: { panel: unknown }) => `panel ${panel}` },
  });
  expect(w.text()).toContain("panel a");
  gesture(w.element, -100, 0);
  expect(w.emitted("update:modelValue")![0]).toEqual(["b"]);
  gesture(w.element, 100, 0); // back to a
  expect(w.emitted("update:modelValue")![1]).toEqual(["a"]);
  gesture(w.element, 100, 0); // prev from first, no loop → nothing
  expect(w.emitted("update:modelValue")).toHaveLength(2);
  await w.setProps({ loop: true });
  gesture(w.element, 100, 0);
  expect(w.emitted("update:modelValue")!.at(-1)![0]).toBe("c");
});

test("BlessInfiniteScroll fires load when the sentinel intersects, done(true) finishes", async () => {
  let cb: (e: { isIntersecting: boolean }[]) => void = () => {};
  globalThis.IntersectionObserver = class {
    constructor(f: typeof cb) {
      cb = f;
    }
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof IntersectionObserver;
  const w = mount(BlessInfiniteScroll, {
    props: { doneText: "end" },
    slots: { default: "<p>items</p>" },
  });
  cb([{ isIntersecting: true }]);
  await nextTick();
  expect(w.emitted("load")).toHaveLength(1);
  expect(w.find(".bless-spinner").exists()).toBe(true);
  (w.emitted("load")![0][0] as (f?: boolean) => void)(true);
  await nextTick();
  expect(w.find(".bless-infinite__done").text()).toBe("end");
  cb([{ isIntersecting: true }]);
  expect(w.emitted("load")).toHaveLength(1);
});

test("BlessLayout: drawers inert when narrow and closed, backdrop closes, Esc closes", async () => {
  window.matchMedia = ((q: string) => ({
    matches: q.includes("max-width"),
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia;
  const w = mount(BlessLayout, {
    props: { left: true },
    slots: { header: "<b>H</b>", left: "<nav>L</nav>", default: "<p>page</p>", footer: "F" },
    attachTo: document.body,
  });
  await nextTick();
  expect(w.classes()).toContain("bless-layout--narrow");
  expect(w.find(".bless-layout__drawer--left").attributes("inert")).toBeUndefined();
  await w.find(".bless-layout__backdrop").trigger("click");
  expect(w.emitted("update:left")![0]).toEqual([false]);
  await w.setProps({ left: false });
  expect(w.find(".bless-layout__drawer--left").attributes("inert")).toBeDefined();
  await w.setProps({ left: true });
  await w.trigger("keydown", { key: "Escape" });
  expect(w.emitted("update:left")!.at(-1)![0]).toBe(false);
  w.unmount();
});

test("BlessLayout: an overlay drawer takes focus on open and gives it back on close", async () => {
  window.matchMedia = ((q: string) => ({
    matches: q.includes("max-width"),
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia;
  const w = mount(
    {
      components: { BlessLayout },
      data: () => ({ l: false }),
      template: `<BlessLayout v-model:left="l"><template #left><a href="#a" class="in">A</a></template><button class="menu" @click="l = true">menu</button></BlessLayout>`,
    },
    { attachTo: document.body },
  );
  const menu = w.find(".menu");
  (menu.element as HTMLElement).focus();
  await menu.trigger("click");
  await nextTick();
  await nextTick();
  expect(document.activeElement?.className).toBe("in");
  await w.find(".bless-layout").trigger("keydown", { key: "Escape" });
  await nextTick();
  await nextTick();
  expect(document.activeElement).toBe(menu.element);
  w.unmount();
});

test("BlessActionSheet: picking an action is not also a cancel", async () => {
  const w = mount(
    {
      components: { BlessActionSheet },
      data: () => ({ o: true }),
      template: `<BlessActionSheet v-model:open="o" :actions="[{ label: 'Share', value: 's' }]" @select="s = 1" @cancel="c = (c ?? 0) + 1" />`,
    },
    { attachTo: document.body },
  );
  await w.find(".bless-actionsheet__item").trigger("click");
  await nextTick();
  await nextTick(); // the drawer closes and fires its close event
  expect(w.findComponent({ name: "BlessActionSheet" }).emitted("cancel")).toBeUndefined();
  w.unmount();
});

test("BlessInfiniteScroll: says it's loading; re-enabling resumes; a button where scrolling can't load", async () => {
  const IO = globalThis.IntersectionObserver;
  // @ts-expect-error: simulate a browser without IntersectionObserver
  delete globalThis.IntersectionObserver;
  try {
    const w = mount(BlessInfiniteScroll, { props: { disabled: false } });
    await nextTick();
    const more = w.find(".bless-infinite__more");
    expect(more.text()).toBe("Load more");
    await more.trigger("click");
    expect(w.emitted("load")).toHaveLength(1);
    expect(w.find("[role=status]").text()).toContain("Loading more");
    await w.setProps({ disabled: true });
    await w.setProps({ disabled: false });
    (w.emitted("load")![0][0] as (end?: boolean) => void)();
    await nextTick();
    expect(w.find(".bless-infinite__more").exists()).toBe(true);
  } finally {
    globalThis.IntersectionObserver = IO;
  }
});

test("BlessSlideItem: tabbing into the actions slides them into view; leaving puts them back", async () => {
  const w = mount(BlessSlideItem, {
    slots: { default: "<p>row</p>", right: "<button class='del'>Delete</button>" },
    attachTo: document.body,
  });
  await w.find(".bless-slide__side--right").trigger("focusin");
  expect(w.attributes("style")).toContain("--_x: -80px");
  await w.trigger("focusout", { relatedTarget: document.body });
  expect(w.attributes("style")).toContain("--_x: 0px");
  w.unmount();
});
