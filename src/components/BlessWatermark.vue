<script setup lang="ts">
defineOptions({ name: "BlessWatermark" });

withDefaults(
  defineProps<{
    text: string;
    position?: "top-end" | "top-start" | "bottom-end" | "bottom-start";
  }>(),
  { position: "top-end" },
);
</script>

<template>
  <span class="bless-watermark" :class="`bless-watermark--${position}`" aria-hidden="true">{{
    text
  }}</span>
</template>

<style>
.bless-watermark {
  position: absolute;
  z-index: 0;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-display);
  font-weight: var(--bless-font-weight-thin);
  letter-spacing: var(--bless-tracking-tight);
  line-height: var(--bless-leading-none);
  color: var(--bless-color-watermark);
  --bless-skew: var(--bless-lean); /* big display type leans at rest */
  transform: skewX(var(--bless-skew));
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}
.bless-watermark--top-end {
  top: -0.2em;
  inset-inline-end: -0.05em;
}
.bless-watermark--top-start {
  top: -0.2em;
  inset-inline-start: -0.05em;
}
.bless-watermark--bottom-end {
  bottom: -0.2em;
  inset-inline-end: -0.05em;
}
.bless-watermark--bottom-start {
  bottom: -0.2em;
  inset-inline-start: -0.05em;
}
</style>
