<template>
  <div class="bless-map">
    <div
      ref="box"
      class="bless-map__view"
      :style="{ blockSize: `${height}px` }"
      role="region"
      :aria-label="text.map"
      :aria-describedby="hint"
      tabindex="0"
      @pointerdown="down"
      @pointermove="move"
      @pointerup="drag = undefined"
      @pointercancel="drag = undefined"
      @keydown="key"
    >
      <img
        v-for="t in tileList"
        :key="t.key"
        :src="t.src"
        alt=""
        draggable="false"
        class="bless-map__tile"
        :style="{ transform: `translate(${t.x}px, ${t.y}px)` }"
      />
      <button
        v-for="p in placed"
        :key="p.id"
        type="button"
        class="bless-map__pin"
        :class="{ 'is-on': selected === p.id }"
        :style="{ transform: `translate(${p.x}px, ${p.y}px)` }"
        :aria-pressed="selected === p.id"
        @click="selected = selected === p.id ? undefined : p.id"
      >
        <svg viewBox="0 0 24 32" aria-hidden="true">
          <path d="M12 31C12 31 2 18 2 11a10 10 0 0 1 20 0c0 7-10 20-10 20z" />
          <circle cx="12" cy="11" r="4" />
        </svg>
        <span class="bless-map__label">{{ p.label }}</span>
      </button>
      <span :id="hint" class="bless-sr">{{ text.keys }}</span>
      <div class="bless-map__zoom">
        <button type="button" :aria-label="text.zoomIn" :disabled="z >= 19" @click="zoom = z + 1">
          +
        </button>
        <button type="button" :aria-label="text.zoomOut" :disabled="z <= 1" @click="zoom = z - 1">
          −
        </button>
      </div>
      <a class="bless-map__credit" :href="attributionUrl" target="_blank" rel="noopener">{{
        attribution
      }}</a>
    </div>
  </div>
</template>

<script lang="ts">
export interface BlessMapPin {
  id: string;
  lat: number;
  lng: number;
  label: string;
}

/** Web Mercator (EPSG:3857): a point on the world in pixels at a zoom level, with 256-pixel tiles. */
export function project(lat: number, lng: number, zoom: number) {
  const size = 256 * 2 ** zoom;
  const s = Math.sin((Math.max(-85.0511, Math.min(85.0511, lat)) * Math.PI) / 180);
  return {
    x: ((lng + 180) / 360) * size,
    y: (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * size,
  };
}
/** The opposite of project: pixels at a zoom level back to latitude and longitude. */
export function unproject(x: number, y: number, zoom: number) {
  const size = 256 * 2 ** zoom;
  const lng = (x / size) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / size;
  return { lat: (180 / Math.PI) * Math.atan(Math.sinh(n)), lng };
}
</script>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { useWidth } from "./chart";
import "./sr.css";

defineOptions({ name: "BlessMapPins" });
const pack = useLabelPack("BlessMapPins");

const props = withDefaults(
  defineProps<{
    pins?: BlessMapPin[];
    height?: number;
    /** a tile URL with {z}, {x}, and {y}; the default is the OpenStreetMap tile server */
    tiles?: string;
    /** the credit that the tile server asks for, as text */
    attribution?: string;
    attributionUrl?: string;
    labels?: Partial<{ map: string; zoomIn: string; zoomOut: string; keys: string }>;
  }>(),
  {
    pins: () => [],
    height: 360,
    tiles: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
    attributionUrl: "https://www.openstreetmap.org/copyright",
  },
);
const center = defineModel<[number, number]>("center", { required: true });
const zoom = defineModel<number>("zoom", { default: 13 });
const selected = defineModel<string | undefined>("selected");

const text = computed(() => ({
  map: "Map",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  keys: "Use the arrow keys to move the map.",
  ...pack(),
  ...props.labels,
}));
const hint = useId();
const box = ref<HTMLElement>();
const width = useWidth(box);
const z = computed(() => Math.round(Math.min(19, Math.max(1, zoom.value))));
const mid = computed(() => project(center.value[0], center.value[1], z.value));
const left = computed(() => mid.value.x - width.value / 2);
const top = computed(() => mid.value.y - props.height / 2);
const tileList = computed(() => {
  const n = 2 ** z.value;
  const out: { key: string; src: string; x: number; y: number }[] = [];
  for (
    let ty = Math.floor(top.value / 256);
    ty <= Math.floor((top.value + props.height) / 256);
    ty++
  ) {
    if (ty < 0 || ty >= n) continue;
    for (
      let tx = Math.floor(left.value / 256);
      tx <= Math.floor((left.value + width.value) / 256);
      tx++
    ) {
      const wx = ((tx % n) + n) % n;
      out.push({
        key: `${z.value}/${tx}/${ty}`,
        src: props.tiles
          .replace("{z}", String(z.value))
          .replace("{x}", String(wx))
          .replace("{y}", String(ty)),
        x: tx * 256 - left.value,
        y: ty * 256 - top.value,
      });
    }
  }
  return out;
});
const placed = computed(() =>
  props.pins.map((p) => {
    const q = project(p.lat, p.lng, z.value);
    return { ...p, x: q.x - left.value, y: q.y - top.value };
  }),
);
// move the center by a number of pixels on the screen
function pan(dx: number, dy: number) {
  const c = unproject(mid.value.x + dx, mid.value.y + dy, z.value);
  center.value = [c.lat, c.lng];
}
let drag: { x: number; y: number } | undefined;
function down(e: PointerEvent) {
  if ((e.target as HTMLElement).closest("button")) return;
  drag = { x: e.clientX, y: e.clientY };
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
}
function move(e: PointerEvent) {
  if (!drag) return;
  pan(drag.x - e.clientX, drag.y - e.clientY);
  drag = { x: e.clientX, y: e.clientY };
}
const KEYS: Record<string, [number, number]> = {
  ArrowLeft: [-80, 0],
  ArrowRight: [80, 0],
  ArrowUp: [0, -80],
  ArrowDown: [0, 80],
};
function key(e: KeyboardEvent) {
  const d = KEYS[e.key];
  if (d && e.target === e.currentTarget) {
    e.preventDefault();
    pan(...d);
  } else if (e.key === "+" || e.key === "=") zoom.value = Math.min(19, z.value + 1);
  else if (e.key === "-") zoom.value = Math.max(1, z.value - 1);
}
</script>

<style>
.bless-map {
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-map__view {
  position: relative;
  overflow: hidden;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-surface-2);
  touch-action: none;
  cursor: grab;
  user-select: none;
}
.bless-map__view:active {
  cursor: grabbing;
}
.bless-map__view:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-map__tile {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  inline-size: 256px;
  block-size: 256px;
  max-inline-size: none;
  pointer-events: none;
}
/* the tip of the pin sits on the place */
.bless-map__pin {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  gap: 2px;
  margin: -31px 0 0 -12px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--bless-color-text);
  font: inherit;
  cursor: pointer;
}
.bless-map__pin svg {
  inline-size: 24px;
  block-size: 32px;
  flex: none;
}
.bless-map__pin path {
  fill: var(--bless-color-accent);
  stroke: var(--bless-color-bg);
  stroke-width: 1.5;
}
.bless-map__pin circle {
  fill: var(--bless-color-bg);
}
.bless-map__pin.is-on path {
  fill: var(--bless-color-text);
}
.bless-map__label {
  align-self: flex-start;
  padding: 1px var(--bless-space-1);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  white-space: nowrap;
}
.bless-map__pin:not(.is-on) .bless-map__label {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.bless-map__pin:focus-visible {
  outline: 2px solid var(--bless-color-text);
  outline-offset: 2px;
}
.bless-map__zoom {
  position: absolute;
  inset-block-start: var(--bless-space-2);
  inset-inline-end: var(--bless-space-2);
  display: grid;
}
.bless-map__zoom button {
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-lg);
  cursor: pointer;
}
.bless-map__zoom button + button {
  border-block-start: 0;
}
.bless-map__zoom button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-map__credit {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
  padding: 1px var(--bless-space-1);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font-size: 11px;
}
</style>
