<script setup lang="ts">
defineOptions({ name: "BlessSlideTransition" });
withDefaults(defineProps<{ duration?: number; appear?: boolean }>(), { duration: 300 });
const px = (el: Element) => `${(el as HTMLElement).scrollHeight}px`;
function enter(el: Element, done: () => void) {
  const h = el as HTMLElement;
  h.style.height = "0";
  h.style.overflow = "hidden";
  requestAnimationFrame(() => {
    h.style.height = px(h);
    h.addEventListener(
      "transitionend",
      () => ((h.style.height = ""), (h.style.overflow = ""), done()),
      { once: true },
    );
  });
}
function leave(el: Element, done: () => void) {
  const h = el as HTMLElement;
  h.style.height = px(h);
  h.style.overflow = "hidden";
  requestAnimationFrame(() => {
    h.style.height = "0";
    h.addEventListener("transitionend", () => done(), { once: true });
  });
}
</script>

<template>
  <Transition :appear :css="false" @enter="enter" @leave="leave">
    <slot />
  </Transition>
</template>

<style>
/* the transitioned element needs its own `transition: height` — set via the duration prop on the slot root */
</style>
