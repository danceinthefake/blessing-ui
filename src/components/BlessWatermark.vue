<script setup lang="ts">
defineOptions({ name: "BlessWatermark" });

withDefaults(
  defineProps<{
    text: string;
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  }>(),
  { position: "top-right" },
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
  transform: skewX(var(--bless-skew));
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}
.bless-watermark--top-right {
  top: -0.2em;
  right: -0.05em;
}
.bless-watermark--top-left {
  top: -0.2em;
  left: -0.05em;
}
.bless-watermark--bottom-right {
  bottom: -0.2em;
  right: -0.05em;
}
.bless-watermark--bottom-left {
  bottom: -0.2em;
  left: -0.05em;
}
</style>
