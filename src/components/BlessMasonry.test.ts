import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BlessMasonry from "./BlessMasonry.vue";

// jsdom has no layout: give the container a width and each card a height, and capture the observer
let observers: { cb: ResizeObserverCallback; targets: Element[] }[] = [];
let heights: number[] = [];
beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      rec: (typeof observers)[number];
      constructor(cb: ResizeObserverCallback) {
        this.rec = { cb, targets: [] };
        observers.push(this.rec);
      }
      observe(t: Element) {
        this.rec.targets.push(t);
      }
      disconnect() {}
      unobserve() {}
    },
  );
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get() {
      const i = Array.from(this.parentElement?.children ?? []).indexOf(this);
      return this.classList.contains("bless-masonry__cell") ? (heights[i] ?? 0) : 0;
    },
  });
});
afterAll(() => vi.unstubAllGlobals());
beforeEach(() => {
  observers = [];
  heights = [100, 50, 70, 30];
});

let w: VueWrapper<any>;
let width = 200;
const mk = async (props = {}) => {
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get: () => width,
  });
  w = mount(BlessMasonry, {
    props: { items: ["a", "b", "c", "d"], columns: 2, gap: 10, ...props },
    attachTo: document.body,
  });
  await flushPromises();
  await nextTick();
};
afterEach(() => w?.unmount());
const cells = () => w.findAll(".bless-masonry__cell");
const at = (i: number) => cells()[i].attributes("style")!;

test("before layout the cards are a plain stack (no JS needed to read them)", () => {
  w = mount(BlessMasonry, { props: { items: ["a"], gap: 10 }, attachTo: document.body });
  expect(w.classes()).not.toContain("bless-masonry--ready");
  w.unmount();
});

test("each card goes into the shortest column, in order", async () => {
  await mk();
  // two columns of (200 - 10) / 2 = 95px; heights 100, 50, 70, 30
  expect(w.classes()).toContain("bless-masonry--ready");
  expect(at(0)).toContain("width: 95px");
  expect(at(0)).toContain("translate(0px, 0px)"); // col 0
  expect(at(1)).toContain("translate(105px, 0px)"); // col 1 (empty)
  expect(at(2)).toContain("translate(105px, 60px)"); // col 1 is shorter: 50 + gap
  expect(at(3)).toContain("translate(0px, 110px)"); // col 0 is now 100 + gap, col 1 is 140
  expect(w.attributes("style")).toContain("height: 140px"); // col 0 ends at 110 + 30 = 140
});

test("columns come from minWidth when not fixed", async () => {
  await mk({ columns: undefined, minWidth: 90 }); // (200 + 10) / (90 + 10) = 2
  expect(at(0)).toContain("width: 95px");
  w.unmount();
  width = 320;
  await mk({ columns: undefined, minWidth: 90 }); // 3 columns of (320 - 20) / 3 = 100
  expect(at(0)).toContain("width: 100px");
  expect(at(2)).toContain("translate(220px, 0px)");
  width = 200;
});

test("a card growing re-places the ones after it; the container resizing re-counts columns", async () => {
  await mk();
  heights[1] = 200;
  observers
    .at(-1)!
    .cb([{ target: cells()[1].element } as ResizeObserverEntry], {} as ResizeObserver);
  await nextTick();
  expect(at(2)).toContain("translate(0px, 110px)"); // col 0 (100) is shorter than col 1 (200) now
  expect(observers.at(-1)!.targets).toContain(cells()[0].element);
});

test("new items are placed and observed; list semantics are there", async () => {
  await mk();
  heights.push(40);
  await w.setProps({ items: ["a", "b", "c", "d", "e"] });
  await flushPromises();
  await nextTick();
  expect(cells()).toHaveLength(5);
  expect(at(4)).toContain("width: 95px");
  expect(w.attributes("role")).toBe("list");
  expect(cells()[0].attributes("role")).toBe("listitem");
});
