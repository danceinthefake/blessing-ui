<template>
  <Transition name="bless-scroll-top">
    <button
      v-if="visible"
      type="button"
      class="bless-scroll-top"
      :class="`bless-scroll-top--${position}`"
      :aria-label="label"
      @click="go"
    >
      <span aria-hidden="true"><slot><BlessIcon name="arrow-up" size="sm" /></slot></span>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { scrollBehavior } from "../composables/useMedia";
import BlessIcon from "./BlessIcon.vue";

defineOptions({ name: "BlessScrollTop" });

const props = withDefaults(
  defineProps<{
    /** px scrolled before the button shows */
    threshold?: number;
    /** scroll container; default window */
    target?: HTMLElement | null;
    label?: string;
    position?: "bottom-end" | "bottom-start";
  }>(),
  { threshold: 300, label: "Back to top", position: "bottom-end" },
);
const visible = ref(false);
const el = () => props.target ?? undefined;
const top = () => (el() ? el()!.scrollTop : window.scrollY);
function check() {
  visible.value = top() > props.threshold;
}
// the button hides once the page is back at the top, taking focus with it: move focus to the
// top too, so Tab carries on from the start of the page (or the container)
function go() {
  (el() ?? window).scrollTo({ top: 0, behavior: scrollBehavior() });
  const start = el() ?? document.body;
  if (!start.hasAttribute("tabindex")) start.setAttribute("tabindex", "-1");
  start.focus({ preventScroll: true });
}
onMounted(() => {
  (el() ?? window).addEventListener("scroll", check, { passive: true });
  check();
});
onBeforeUnmount(() => (el() ?? window).removeEventListener("scroll", check));
</script>

<style>
.bless-scroll-top {
  border-radius: var(--bless-radius-petal);
  position: fixed;
  bottom: var(--bless-space-6);
  z-index: var(--bless-z-nav);
  display: inline-grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
  font: inherit;
  font-size: var(--bless-text-md);
  cursor: pointer;
  box-shadow: var(--bless-shadow-plate);
  transform: skewX(var(--bless-skew));
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-scroll-top > span {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.bless-scroll-top--bottom-end {
  inset-inline-end: var(--bless-space-6);
}
.bless-scroll-top--bottom-start {
  inset-inline-start: var(--bless-space-6);
}
.bless-scroll-top:hover {
  transform: translateY(var(--bless-hover-lift));
  box-shadow: var(--bless-shadow-plate);
}
.bless-scroll-top:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-scroll-top-enter-active,
.bless-scroll-top-leave-active {
  transition: opacity var(--bless-duration-base);
}
.bless-scroll-top-enter-from,
.bless-scroll-top-leave-to {
  opacity: 0;
}
</style>
