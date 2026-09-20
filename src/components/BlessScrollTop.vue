<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

defineOptions({ name: "BlessScrollTop" });

const props = withDefaults(
  defineProps<{
    /** px scrolled before the button shows */
    threshold?: number;
    /** scroll container; default window */
    target?: HTMLElement | null;
    label?: string;
    position?: "bottom-right" | "bottom-left";
  }>(),
  { threshold: 300, label: "Back to top", position: "bottom-right" },
);
const visible = ref(false);
const el = () => props.target ?? undefined;
const top = () => (el() ? el()!.scrollTop : window.scrollY);
function check() {
  visible.value = top() > props.threshold;
}
function go() {
  (el() ?? window).scrollTo({ top: 0, behavior: "smooth" });
}
onMounted(() => {
  (el() ?? window).addEventListener("scroll", check, { passive: true });
  check();
});
onBeforeUnmount(() => (el() ?? window).removeEventListener("scroll", check));
</script>

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
      <span aria-hidden="true"><slot>↑</slot></span>
    </button>
  </Transition>
</template>

<style>
.bless-scroll-top {
  border-radius: var(--bless-radius-pill);
  position: fixed;
  bottom: var(--bless-space-6);
  z-index: var(--bless-z-nav);
  width: 40px;
  height: 40px;
  border: 0;
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
  font: inherit;
  font-size: var(--bless-text-md);
  cursor: pointer;
  box-shadow: var(--bless-shadow-plate);
  transform: skewX(var(--bless-skew));
  transition: opacity var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-scroll-top > span {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.bless-scroll-top--bottom-right {
  right: var(--bless-space-6);
}
.bless-scroll-top--bottom-left {
  left: var(--bless-space-6);
}
.bless-scroll-top:hover {
  opacity: var(--bless-hover-opacity);
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
