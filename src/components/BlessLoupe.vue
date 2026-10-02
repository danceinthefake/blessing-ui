<script setup lang="ts">
import { computed, ref } from "vue";

defineOptions({ name: "BlessLoupe" });

const props = withDefaults(
  defineProps<{
    src: string;
    alt: string;
    /** a larger version of the same picture for the lens; defaults to `src` */
    zoomSrc?: string;
    /** magnification */
    zoom?: number;
    /** side of the square lens, in px */
    size?: number;
  }>(),
  { zoom: 2.5, size: 140 },
);

const root = ref<HTMLElement>();
/** the point under the finger / pointer, in px from the picture's top-left; null = lens hidden */
const at = ref<{ x: number; y: number } | null>(null);
const box = ref({ w: 1, h: 1 });
const touching = ref(false);
/** where a key-driven lens sits, as fractions, so it survives a resize */
const key = ref({ x: 0.5, y: 0.5 });

function place(x: number, y: number) {
  const r = root.value!.getBoundingClientRect();
  box.value = { w: r.width, h: r.height };
  at.value = {
    x: Math.min(r.width, Math.max(0, x - r.left)),
    y: Math.min(r.height, Math.max(0, y - r.top)),
  };
}
function onMove(e: PointerEvent) {
  touching.value = e.pointerType === "touch" || e.pointerType === "pen";
  place(e.clientX, e.clientY);
}
const hide = () => (at.value = null);

function showKey() {
  const r = root.value!.getBoundingClientRect();
  place(r.left + key.value.x * r.width, r.top + key.value.y * r.height);
}
function onKey(e: KeyboardEvent) {
  const s = e.shiftKey ? 0.2 : 0.05;
  const d: Record<string, [number, number]> = {
    ArrowLeft: [-s, 0],
    ArrowRight: [s, 0],
    ArrowUp: [0, -s],
    ArrowDown: [0, s],
  };
  if (e.key === "Escape") return hide();
  if (!d[e.key]) return;
  e.preventDefault();
  touching.value = false;
  key.value = {
    x: Math.min(1, Math.max(0, key.value.x + d[e.key]![0])),
    y: Math.min(1, Math.max(0, key.value.y + d[e.key]![1])),
  };
  showKey();
}

const lens = computed(() => {
  const p = at.value;
  if (!p) return undefined;
  const { zoom, size } = props;
  // a finger would cover the spot it points at: lift the lens above it
  const lift = touching.value ? size / 2 + 28 : 0;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${p.x - size / 2}px`,
    top: `${p.y - size / 2 - lift}px`,
    backgroundImage: `url(${props.zoomSrc ?? props.src})`,
    backgroundSize: `${box.value.w * zoom}px ${box.value.h * zoom}px`,
    backgroundPosition: `${size / 2 - p.x * zoom}px ${size / 2 - p.y * zoom}px`,
  };
});
</script>

<template>
  <div
    ref="root"
    class="bless-loupe"
    tabindex="0"
    @pointerenter="onMove"
    @pointermove="onMove"
    @pointerleave="hide"
    @pointercancel="hide"
    @pointerup="touching && hide()"
    @focus="showKey"
    @blur="hide"
    @keydown="onKey"
  >
    <img :src :alt class="bless-loupe__img" draggable="false" />
    <span v-if="lens" class="bless-loupe__lens" :style="lens" aria-hidden="true"></span>
  </div>
</template>

<style>
.bless-loupe {
  position: relative;
  display: inline-block;
  max-width: 100%;
  line-height: 0;
  cursor: zoom-in;
  touch-action: pan-y pinch-zoom;
  user-select: none;
}
.bless-loupe:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-loupe__img {
  display: block;
  max-width: 100%;
  height: auto;
}
.bless-loupe__lens {
  position: absolute;
  z-index: 1;
  pointer-events: none;
  background-repeat: no-repeat;
  background-color: var(--bless-color-surface);
  border: 2px solid var(--bless-color-bg);
  outline: 1px solid var(--bless-color-text);
  box-shadow: var(--bless-shadow-plate);
}
</style>
