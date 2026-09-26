<script setup lang="ts">
import { reducedMotion as reduced } from "../composables/useMedia";
defineOptions({ name: "BlessSlideTransition" });
const props = withDefaults(
  defineProps<{
    /** ms; 0 or reduced motion shows and hides at once */
    duration?: number;
    appear?: boolean;
  }>(),
  { duration: 300 },
);
const px = (el: HTMLElement) => `${el.scrollHeight}px`;

// Animate height between two values. A timeout backs up transitionend, which never fires when
// nothing actually changed — without it a v-if leave would never finish and the element would stay.
function run(el: HTMLElement, from: string, to: string, finish: () => void) {
  if (!props.duration || reduced()) return finish();
  el.style.overflow = "hidden";
  el.style.height = from;
  el.style.transition = `height ${props.duration}ms var(--bless-ease-out)`;
  let timer = 0;
  const end = () => {
    clearTimeout(timer);
    el.removeEventListener("transitionend", onEnd);
    finish();
  };
  // a child's transition bubbles here too; only our own height counts
  const onEnd = (e: TransitionEvent) => e.target === el && e.propertyName === "height" && end();
  el.addEventListener("transitionend", onEnd);
  timer = window.setTimeout(end, props.duration + 50);
  requestAnimationFrame(() => (el.style.height = to));
}
const reset = (el: HTMLElement) => {
  el.style.height = el.style.overflow = el.style.transition = "";
};
function enter(el: Element, done: () => void) {
  const h = el as HTMLElement;
  run(h, "0", px(h), () => (reset(h), done()));
}
function leave(el: Element, done: () => void) {
  const h = el as HTMLElement;
  run(h, px(h), "0", done);
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
