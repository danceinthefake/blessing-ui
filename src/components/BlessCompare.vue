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
      :aria-orientation="orientation"
    />
  </div>
</template>

<style>
.bless-compare {
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
.bless-compare--vertical .bless-compare__after {
  clip-path: inset(0 0 calc(100% - var(--_p)) 0);
}
.bless-compare__handle {
  position: absolute;
  background: var(--bless-color-accent);
  pointer-events: none;
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
  writing-mode: vertical-lr;
  direction: rtl;
}
.bless-compare:has(.bless-compare__range:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
