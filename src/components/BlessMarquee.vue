<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { reducedMotion } from "../composables/useMedia";

defineOptions({ name: "BlessMarquee" });

const props = withDefaults(
  defineProps<{
    /** px per second */
    speed?: number;
    /** run the other way (toward the start of the line) */
    reverse?: boolean;
    /** stop while the pointer is over it or focus is inside */
    pauseOnHover?: boolean;
    /** show the Pause button (needed when it moves for more than five seconds, WCAG 2.2.2) */
    controls?: boolean;
    label?: string;
    labels?: Partial<{ play: string; pause: string }>;
  }>(),
  { speed: 40, pauseOnHover: true, controls: true, label: "Scrolling items" },
);
const text = computed(() => ({ play: "Play", pause: "Pause", ...props.labels }));
/** true while paused by the button */
const paused = defineModel<boolean>("paused", { default: false });

const run = ref<HTMLElement>();
const still = ref(false);
const seconds = ref(20);
let ro: ResizeObserver | undefined;
function measure() {
  const w = run.value?.scrollWidth ?? 0;
  seconds.value = w && props.speed > 0 ? w / props.speed : 20;
}
onMounted(() => {
  still.value = reducedMotion();
  measure();
  if (typeof ResizeObserver !== "undefined" && run.value) {
    ro = new ResizeObserver(measure);
    ro.observe(run.value);
  }
});
onBeforeUnmount(() => ro?.disconnect());
</script>

<template>
  <div
    class="bless-marquee"
    :class="{
      'bless-marquee--paused': paused,
      'bless-marquee--hover': pauseOnHover,
      'bless-marquee--still': still,
      'bless-marquee--reverse': reverse,
    }"
    role="group"
    aria-roledescription="marquee"
    :aria-label="label"
    :style="{ '--bless-marquee-time': `${seconds}s` }"
  >
    <div class="bless-marquee__viewport">
      <div class="bless-marquee__track">
        <div ref="run" class="bless-marquee__run"><slot /></div>
        <div class="bless-marquee__run" aria-hidden="true" inert><slot /></div>
      </div>
    </div>
    <button
      v-if="controls && !still"
      type="button"
      class="bless-marquee__btn"
      :aria-pressed="paused"
      @click="paused = !paused"
    >
      {{ paused ? text.play : text.pause }}
    </button>
  </div>
</template>

<style>
.bless-marquee {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  min-width: 0;
  max-width: 100%;
  --bless-marquee-dir: 1;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
[dir="rtl"] .bless-marquee {
  --bless-marquee-dir: -1;
}
.bless-marquee__viewport {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.bless-marquee__track {
  display: flex;
  width: max-content;
  animation: bless-marquee var(--bless-marquee-time) linear infinite;
}
.bless-marquee--reverse .bless-marquee__track {
  animation-direction: reverse;
}
.bless-marquee__run {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--bless-space-6);
  padding-inline-end: var(--bless-space-6);
}
.bless-marquee--paused .bless-marquee__track,
.bless-marquee--hover:hover .bless-marquee__track,
.bless-marquee--hover:focus-within .bless-marquee__track {
  animation-play-state: paused;
}
.bless-marquee--still .bless-marquee__track {
  animation: none;
  width: auto;
  flex-wrap: wrap;
}
.bless-marquee--still .bless-marquee__run:last-child {
  display: none;
}
.bless-marquee__btn {
  flex: none;
  padding: var(--bless-space-1) var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-xs);
  cursor: pointer;
}
.bless-marquee__btn:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
@keyframes bless-marquee {
  to {
    transform: translateX(calc(var(--bless-marquee-dir) * -50%));
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-marquee__track {
    animation: none;
  }
}
</style>
