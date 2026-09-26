import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import { useScrollSpy } from "./useScrollSpy";

test("useScrollSpy: nearest top edge wins, measured live (not from the stale entry rect)", async () => {
  let cb: (entries: Partial<IntersectionObserverEntry>[]) => void = () => {};
  globalThis.IntersectionObserver = class {
    constructor(fn: typeof cb) {
      cb = fn;
    }
    observe() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
  const tops: Record<string, number> = { a: 0, b: 500 };
  const Comp = defineComponent({
    setup() {
      const { active } = useScrollSpy(["a", "b"]);
      return () => [
        h("section", { id: "a" }),
        h("section", { id: "b" }),
        h("output", active.value ?? ""),
      ];
    },
  });
  const w = mount(Comp, { attachTo: document.body });
  for (const id of ["a", "b"])
    Object.defineProperty(document.getElementById(id)!, "getBoundingClientRect", {
      value: () => ({ top: tops[id] }),
    });
  const el = (id: string) => document.getElementById(id)!;
  cb([{ target: el("a"), isIntersecting: true }]);
  await nextTick();
  expect(w.find("output").text()).toBe("a");
  // scroll: a slides up past the top, b arrives at it. Only b's entry fires; a is re-measured.
  tops.a = -380;
  tops.b = 24;
  cb([{ target: el("b"), isIntersecting: true }]);
  await nextTick();
  expect(w.find("output").text()).toBe("b");
  w.unmount();
});

test("useScrollSpy: with a root container, distance is measured from the container's top", async () => {
  let cb: (entries: Partial<IntersectionObserverEntry>[]) => void = () => {};
  globalThis.IntersectionObserver = class {
    constructor(fn: typeof cb) {
      cb = fn;
    }
    observe() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
  const root = ref<HTMLElement>();
  const Comp = defineComponent({
    setup() {
      const { active } = useScrollSpy(["a", "b"], { root });
      return () =>
        h("div", { ref: root }, [
          h("section", { id: "a" }),
          h("section", { id: "b" }),
          h("output", active.value ?? ""),
        ]);
    },
  });
  const w = mount(Comp, { attachTo: document.body });
  // the container sits 400px down the page; a is a tall section still spanning it from above,
  // b has just arrived at the container's top edge — b is the one being read
  const rect = (top: number) => ({ value: () => ({ top }) });
  Object.defineProperty(root.value!, "getBoundingClientRect", rect(400));
  Object.defineProperty(document.getElementById("a")!, "getBoundingClientRect", rect(0));
  Object.defineProperty(document.getElementById("b")!, "getBoundingClientRect", rect(420));
  cb([
    { target: document.getElementById("a")!, isIntersecting: true },
    { target: document.getElementById("b")!, isIntersecting: true },
  ]);
  await nextTick();
  expect(w.find("output").text()).toBe("b");
  w.unmount();
});
