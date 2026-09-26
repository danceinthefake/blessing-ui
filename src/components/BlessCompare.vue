<script setup lang="ts">
defineOptions({ name: "BlessCompare" });
withDefaults(defineProps<{ label?: string; orientation?: "horizontal" | "vertical" }>(), {
  label: "Compare",
  orientation: "horizontal",
});
/** 0–100, how much of the "after" side is revealed */
const pos = defineModel<number>({ default: 50 });
</script>

<template>
  <div
    class="bless-compare"
    :class="`bless-compare--${orientation}`"
    :style="{ '--_p': `${pos}%` }"
  >
    <div class="bless-compare__before"><slot name="before" /></div>
    <div class="bless-compare__after"><slot name="after" /></div>
    <div class="bless-compare__handle" aria-hidden="true" />
    <input
      v-model.number="pos"
      type="range"
      min="0"
      max="100"
      class="bless-compare__range"
      :aria-label="label"
      :aria-valuetext="`${pos}% after`"
      :aria-orientation="orientation"
    />
  </div>
</template>

<style>
.bless-compare {
  border-radius: var(--bless-radius);
  position: relative;
  display: grid;
  overflow: hidden;
  user-select: none;
  color: var(--bless-color-text);
}
.bless-compare__before,
.bless-compare__after {
  grid-area: 1 / 1;
  min-width: 0;
}
.bless-compare :is(img, video) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bless-compare--horizontal .bless-compare__after {
  clip-path: inset(0 calc(100% - var(--_p)) 0 0);
}
/* the range and the handle count from the inline start; so must the reveal */
[dir="rtl"] .bless-compare--horizontal .bless-compare__after {
  clip-path: inset(0 0 0 calc(100% - var(--_p)));
}
.bless-compare--vertical .bless-compare__after {
  clip-path: inset(0 0 calc(100% - var(--_p)) 0);
}
/* ink with a page-coloured edge, so it reads on dark and light frames; accent while dragged */
.bless-compare__handle {
  position: absolute;
  background: var(--bless-color-text);
  box-shadow: 0 0 0 1px var(--bless-color-bg);
  pointer-events: none;
}
.bless-compare:has(.bless-compare__range:active) .bless-compare__handle {
  background: var(--bless-color-accent);
}
.bless-compare--horizontal .bless-compare__handle {
  top: 0;
  bottom: 0;
  inset-inline-start: var(--_p);
  width: 2px;
}
.bless-compare--vertical .bless-compare__handle {
  inset-inline-start: 0;
  inset-inline-end: 0;
  top: var(--_p);
  height: 2px;
}
.bless-compare__range {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: ew-resize;
}
.bless-compare--vertical .bless-compare__range {
  cursor: ns-resize;
  writing-mode: vertical-lr; /* min at the top, like the handle and the reveal */
}
.bless-compare:has(.bless-compare__range:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
