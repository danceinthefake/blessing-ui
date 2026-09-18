<script setup lang="ts">
import { computed, ref } from "vue";

defineOptions({ name: "BlessResizable" });

const props = withDefaults(
  defineProps<{
    direction?: "horizontal" | "vertical";
    /** first pane size in % */
    min?: number;
    max?: number;
    step?: number;
    label?: string;
  }>(),
  { direction: "horizontal", min: 10, max: 90, step: 2, label: "Resize" },
);

/** first pane size in % */
const size = defineModel<number>({ default: 50 });
const root = ref<HTMLElement>();
const dragging = ref(false);
const clamp = (v: number) => Math.min(props.max, Math.max(props.min, v));
const horizontal = computed(() => props.direction === "horizontal");

function onDown(e: PointerEvent) {
  dragging.value = true;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}
function onMove(e: PointerEvent) {
  if (!dragging.value || !root.value) return;
  const r = root.value.getBoundingClientRect();
  const pct = horizontal.value
    ? ((e.clientX - r.left) / r.width) * 100
    : ((e.clientY - r.top) / r.height) * 100;
  size.value = clamp(Math.round(pct * 10) / 10);
}
function onUp() {
  dragging.value = false;
}
function onKey(e: KeyboardEvent) {
  const dec = horizontal.value ? "ArrowLeft" : "ArrowUp";
  const inc = horizontal.value ? "ArrowRight" : "ArrowDown";
  if (e.key === dec) size.value = clamp(size.value - props.step);
  else if (e.key === inc) size.value = clamp(size.value + props.step);
  else if (e.key === "Home") size.value = props.min;
  else if (e.key === "End") size.value = props.max;
  else if (e.key === "Enter") size.value = 50;
  else return;
  e.preventDefault();
}
</script>

<template>
  <div
    ref="root"
    class="bless-resizable"
    :class="[`bless-resizable--${direction}`, { 'bless-resizable--dragging': dragging }]"
    :style="{ '--_a': `${size}%` }"
  >
    <div class="bless-resizable__pane bless-resizable__pane--a"><slot name="a" /></div>
    <div
      class="bless-resizable__handle"
      role="separator"
      :aria-orientation="horizontal ? 'vertical' : 'horizontal'"
      :aria-valuenow="Math.round(size)"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-label="label"
      tabindex="0"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
      @keydown="onKey"
      @dblclick="size = 50"
    >
      <span class="bless-resizable__grip" aria-hidden="true" />
    </div>
    <div class="bless-resizable__pane bless-resizable__pane--b"><slot name="b" /></div>
  </div>
</template>

<style>
.bless-resizable {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
}
.bless-resizable--vertical {
  flex-direction: column;
}
.bless-resizable__pane {
  min-width: 0;
  min-height: 0;
  overflow: auto;
}
.bless-resizable__pane--a {
  flex: 0 0 var(--_a);
}
.bless-resizable__pane--b {
  flex: 1 1 0;
}
.bless-resizable__handle {
  position: relative;
  flex: none;
  display: grid;
  place-items: center;
  background: var(--bless-color-border);
  touch-action: none;
  user-select: none;
  transition: background var(--bless-duration-base);
}
.bless-resizable--horizontal > .bless-resizable__handle {
  width: 6px;
  cursor: col-resize;
}
.bless-resizable--vertical > .bless-resizable__handle {
  height: 6px;
  cursor: row-resize;
}
.bless-resizable__handle:hover,
.bless-resizable--dragging > .bless-resizable__handle {
  background: var(--bless-color-accent);
}
.bless-resizable__handle:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-resizable__grip {
  width: 2px;
  height: 24px;
  background: var(--bless-color-bg);
  transform: skewX(var(--bless-skew));
}
.bless-resizable--vertical .bless-resizable__grip {
  width: 24px;
  height: 2px;
}
.bless-resizable--dragging {
  cursor: inherit;
}
.bless-resizable--dragging .bless-resizable__pane {
  pointer-events: none;
}
</style>
