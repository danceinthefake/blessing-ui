<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "BlessWatermarkOverlay" });

const props = withDefaults(
  defineProps<{
    text: string;
    /** tile size in px */
    gap?: number;
    angle?: number;
    fontSize?: number;
    opacity?: number;
    /** any CSS colour; the default follows the text colour, so it flips with the theme */
    color?: string;
  }>(),
  { gap: 180, angle: -22, fontSize: 16, opacity: 0.15, color: "currentColor" },
);
const esc = (s: string) =>
  s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!);
// The tile is a mask, not a background: an SVG drawn as an image can't see the page's colour,
// so `currentColor` in it would always be black. The layer is filled with `color` through it.
const svg = computed(() => {
  const g = props.gap;
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${g}"><text x="50%" y="50%" font-family="Roboto,Noto Sans JP,sans-serif" font-size="${props.fontSize}" font-weight="700" letter-spacing="2" fill="#000" text-anchor="middle" dominant-baseline="middle" transform="rotate(${props.angle} ${g / 2} ${g / 2})">${esc(props.text)}</text></svg>`,
  )}`;
});
</script>

<template>
  <div class="bless-wm-overlay">
    <slot />
    <div
      class="bless-wm-overlay__layer"
      :style="{ '--_tile': `url('${svg}')`, backgroundColor: color, opacity }"
      aria-hidden="true"
    />
  </div>
</template>

<style>
.bless-wm-overlay {
  position: relative;
  color: var(--bless-color-text);
}
.bless-wm-overlay__layer {
  position: absolute;
  inset: 0;
  mask-image: var(--_tile);
  mask-repeat: repeat;
  pointer-events: none;
  user-select: none;
}
</style>
