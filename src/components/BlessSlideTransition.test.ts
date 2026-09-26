import { mount } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
import BlessSlideTransition from "./BlessSlideTransition.vue";

// a v-if child inside the transition, toggled from outside
const host = (duration: number) => {
  const open = ref(true);
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(BlessSlideTransition, { duration }, () =>
          open.value ? h("div", { class: "panel" }, "x") : null,
        ),
    }),
    // the real Transition, so the hooks run; attached, so a leaving node can be found in the DOM
    { global: { stubs: { transition: false } }, attachTo: document.body },
  );
  return { w, open };
};

test("BlessSlideTransition: duration 0 hides at once", async () => {
  const { w, open } = host(0);
  open.value = false;
  await w.vm.$nextTick();
  expect(!!document.querySelector(".panel")).toBe(false);
  w.unmount();
});

test("BlessSlideTransition: a leave finishes on its timeout even without transitionend", async () => {
  vi.useFakeTimers();
  const { w, open } = host(300);
  open.value = false;
  await w.vm.$nextTick();
  expect(!!document.querySelector(".panel")).toBe(true); // still leaving
  vi.advanceTimersByTime(400);
  await w.vm.$nextTick();
  expect(!!document.querySelector(".panel")).toBe(false);
  vi.useRealTimers();
  w.unmount();
});
