<script lang="ts">
import type { InjectionKey, Ref } from "vue";
import type { CanvasView } from "../composables/canvasView";
export type { CanvasView } from "../composables/canvasView";

/** what a canvas hands to the things placed on it */
export interface BlessCanvasContext {
  view: Ref<CanvasView>;
  /** a pointer position in the page -> a point in the canvas' own (world) coordinates */
  toWorld: (clientX: number, clientY: number) => { x: number; y: number };
}
export const blessCanvasKey: InjectionKey<BlessCanvasContext> = Symbol("blessCanvas");
</script>

<script setup lang="ts">
import { computed, provide, ref, useId } from "vue";
import { clampZoom, fitRect, toWorld as worldAt, zoomAt } from "../composables/canvasView";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessInfiniteCanvas" });

const props = withDefaults(
  defineProps<{
    minZoom?: number;
    maxZoom?: number;
    /** draw a dot grid that moves and scales with the view */
    grid?: boolean;
    /** the + / − / fit buttons in the corner */
    controls?: boolean;
    /** turn the plain mouse wheel into zoom (otherwise it pans, and Ctrl+wheel or a pinch zooms) */
    wheelZoom?: boolean;
    label?: string;
    labels?: Partial<{
      zoomIn: string;
      zoomOut: string;
      reset: string;
      zoom: (percent: number) => string;
      hint: string;
    }>;
  }>(),
  { minZoom: 0.25, maxZoom: 4, grid: true, controls: true, label: "Canvas" },
);
const view = defineModel<CanvasView>("view", { default: () => ({ x: 0, y: 0, zoom: 1 }) });
const text = computed(() => ({
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  reset: "Reset view",
  zoom: (p: number) => `Zoom ${p}%`,
  hint: "Arrow keys pan, plus and minus zoom, 0 resets.",
  ...props.labels,
}));

const root = ref<HTMLElement>();
const live = ref("");
const hint = `${useId()}-hint`;
const percent = computed(() => Math.round(view.value.zoom * 100));

const local = (cx: number, cy: number) => {
  const r = root.value?.getBoundingClientRect();
  return { x: cx - (r?.left ?? 0), y: cy - (r?.top ?? 0) };
};
const toWorld = (cx: number, cy: number) => {
  const p = local(cx, cy);
  return worldAt(view.value, p.x, p.y);
};
provide(blessCanvasKey, { view, toWorld });

function setView(v: CanvasView, say = false) {
  view.value = v;
  if (say) live.value = text.value.zoom(Math.round(v.zoom * 100));
}
function zoomBy(factor: number, at?: { x: number; y: number }) {
  const r = root.value?.getBoundingClientRect();
  const p = at ?? { x: (r?.width ?? 0) / 2, y: (r?.height ?? 0) / 2 };
  setView(zoomAt(view.value, factor, p.x, p.y, props.minZoom, props.maxZoom), true);
}
const reset = () => setView({ x: 0, y: 0, zoom: 1 }, true);
/** show a world rectangle, centred and as large as fits */
function fit(rect: { x: number; y: number; width: number; height: number }, pad = 32) {
  const r = root.value?.getBoundingClientRect();
  if (r) setView(fitRect(rect, r.width, r.height, props.minZoom, props.maxZoom, pad), true);
}
/** put a world point in the middle of the viewport */
function centerOn(x: number, y: number) {
  const r = root.value?.getBoundingClientRect();
  if (r)
    setView({
      zoom: view.value.zoom,
      x: r.width / 2 - x * view.value.zoom,
      y: r.height / 2 - y * view.value.zoom,
    });
}
defineExpose({ zoomBy, reset, fit, centerOn, toWorld });

// --- pointer: drag the background to pan, two fingers to pan and pinch ---
const pointers = new Map<number, { x: number; y: number }>();
let pinch = 0;
const panning = ref(false);
function down(e: PointerEvent) {
  // the background only: whatever sits on the canvas keeps its own pointer behaviour
  const onBg = e.target === root.value || (e.target as HTMLElement).closest?.("[data-canvas-bg]");
  if (!onBg && e.button !== 1) return;
  if (e.button > 1) return;
  root.value?.setPointerCapture?.(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  pinch = pointers.size === 2 ? gap() : 0;
  panning.value = true;
  if (e.button === 1) e.preventDefault();
}
const gap = () => {
  const [a, b] = [...pointers.values()];
  return Math.hypot(a!.x - b!.x, a!.y - b!.y);
};
function move(e: PointerEvent) {
  const prev = pointers.get(e.pointerId);
  if (!prev) return;
  const next = { x: e.clientX, y: e.clientY };
  pointers.set(e.pointerId, next);
  if (pointers.size === 2) {
    const g = gap();
    const [a, b] = [...pointers.values()];
    const mid = local((a!.x + b!.x) / 2, (a!.y + b!.y) / 2);
    const v = pinch
      ? zoomAt(view.value, g / pinch, mid.x, mid.y, props.minZoom, props.maxZoom)
      : view.value;
    pinch = g;
    // the midpoint's own drift pans too
    setView({ ...v, x: v.x + (next.x - prev.x) / 2, y: v.y + (next.y - prev.y) / 2 });
  } else
    setView({
      ...view.value,
      x: view.value.x + next.x - prev.x,
      y: view.value.y + next.y - prev.y,
    });
}
function up(e: PointerEvent) {
  pointers.delete(e.pointerId);
  pinch = 0;
  if (!pointers.size) panning.value = false;
}
function wheel(e: WheelEvent) {
  e.preventDefault();
  if (e.ctrlKey || e.metaKey || props.wheelZoom)
    zoomBy(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)), local(e.clientX, e.clientY));
  else setView({ ...view.value, x: view.value.x - e.deltaX, y: view.value.y - e.deltaY });
}
function key(e: KeyboardEvent) {
  if (e.target !== root.value) return; // arrow keys inside a node belong to the node
  const s = e.shiftKey ? 160 : 40;
  const k = e.key;
  if (k === "ArrowLeft") setView({ ...view.value, x: view.value.x + s });
  else if (k === "ArrowRight") setView({ ...view.value, x: view.value.x - s });
  else if (k === "ArrowUp") setView({ ...view.value, y: view.value.y + s });
  else if (k === "ArrowDown") setView({ ...view.value, y: view.value.y - s });
  else if (k === "+" || k === "=") zoomBy(1.25);
  else if (k === "-" || k === "_") zoomBy(0.8);
  else if (k === "0" || k === "Home") reset();
  else return;
  e.preventDefault();
}

const layer = computed(() => ({
  transform: `translate(${view.value.x}px, ${view.value.y}px) scale(${clampZoom(view.value.zoom, props.minZoom, props.maxZoom)})`,
}));
const bg = computed(() => {
  const size = 24 * view.value.zoom;
  return {
    backgroundSize: `${size}px ${size}px`,
    backgroundPosition: `${view.value.x}px ${view.value.y}px`,
  };
});
</script>

<template>
  <div
    ref="root"
    class="bless-canvas"
    :class="{ 'bless-canvas--grid': grid, 'bless-canvas--pan': panning }"
    :style="grid ? bg : undefined"
    role="group"
    aria-roledescription="canvas"
    :aria-label="label"
    :aria-describedby="hint"
    tabindex="0"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="up"
    @wheel="wheel"
    @keydown="key"
  >
    <div class="bless-canvas__layer" :style="layer"><slot :view :zoom="view.zoom" /></div>
    <div v-if="controls" class="bless-canvas__controls" @pointerdown.stop>
      <BlessButton size="sm" variant="outline" :aria-label="text.zoomOut" @click="zoomBy(0.8)"
        >−</BlessButton
      >
      <BlessButton size="sm" variant="outline" :aria-label="text.reset" @click="reset"
        >{{ percent }}%</BlessButton
      >
      <BlessButton size="sm" variant="outline" :aria-label="text.zoomIn" @click="zoomBy(1.25)"
        >+</BlessButton
      >
    </div>
    <span :id="hint" hidden>{{ text.hint }}</span>
    <span class="bless-canvas__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-canvas {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  min-height: 240px;
  background: var(--bless-color-surface);
  border: var(--bless-border-width) solid var(--bless-color-border);
  cursor: grab;
  touch-action: none;
  user-select: none;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-canvas--grid {
  background-image: radial-gradient(
    circle,
    color-mix(in srgb, var(--bless-color-text-muted) 45%, transparent) 1px,
    transparent 1.5px
  );
}
.bless-canvas--pan {
  cursor: grabbing;
}
.bless-canvas:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-canvas__layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  transform-origin: 0 0;
}
.bless-canvas__controls {
  position: absolute;
  inset-block-end: var(--bless-space-2);
  inset-inline-end: var(--bless-space-2);
  display: flex;
  gap: var(--bless-space-1);
  cursor: default;
}
.bless-canvas__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
