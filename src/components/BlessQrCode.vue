<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "BlessQrCode" });

const props = withDefaults(
  defineProps<{
    /** boolean module grid, e.g. `encode(text).data` from uqr */
    matrix: boolean[][];
    /** what the code encodes — used for the accessible label */
    value?: string;
    size?: number;
    /** quiet zone in modules */
    border?: number;
    /** module colour — dark on light scans best, so this ignores the theme by default */
    color?: string;
    background?: string;
    /** skewed accent frame */
    frame?: boolean;
    label?: string;
  }>(),
  { size: 160, border: 2, color: "#1a1b1d", background: "#fff", frame: false },
);
const n = computed(() => props.matrix.length);
const path = computed(() => {
  let d = "";
  props.matrix.forEach((row, y) =>
    row.forEach((on, x) => on && (d += `M${x + props.border} ${y + props.border}h1v1h-1z`)),
  );
  return d;
});
const view = computed(() => n.value + props.border * 2);
</script>

<template>
  <span class="bless-qr" :class="{ 'bless-qr--frame': frame }" :style="{ '--_s': `${size}px` }">
    <svg
      class="bless-qr__svg"
      :viewBox="`0 0 ${view} ${view}`"
      :width="size"
      :height="size"
      shape-rendering="crispEdges"
      role="img"
      :aria-label="label ?? (value ? `QR code: ${value}` : 'QR code')"
    >
      <rect width="100%" height="100%" :fill="background" />
      <path :d="path" :fill="color" />
    </svg>
  </span>
</template>

<style>
.bless-qr {
  display: inline-block;
  color: var(--bless-color-text);
  line-height: 0;
}
.bless-qr__svg {
  display: block;
}
/* modules stay square (scanners), only the frame skews */
.bless-qr--frame {
  position: relative;
  padding: var(--bless-space-2);
}
.bless-qr--frame::before {
  content: "";
  position: absolute;
  inset: 0;
  border: var(--bless-border-width) solid var(--bless-color-accent);
  transform: skewX(var(--bless-skew));
  pointer-events: none;
}
</style>
