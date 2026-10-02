<script lang="ts">
export interface BlessCropRect {
  /** pixels of the full-size image after `rotation` has been applied */
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: 0 | 90 | 180 | 270;
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { initialBox, moveBox, resizeBox, scaleBox, type CropBox } from "../composables/cropBox";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessCropper" });

const props = withDefaults(
  defineProps<{
    src: string;
    /** width / height of the result, e.g. `1` or `16 / 9`; leave out to crop freely */
    aspect?: number;
    /** `anonymous` lets `toBlob` read images from another origin that sends CORS headers */
    crossorigin?: "anonymous" | "use-credentials";
    /** show the rotate buttons */
    controls?: boolean;
    label?: string;
  }>(),
  { crossorigin: "anonymous", controls: true, label: "Crop area" },
);
const model = defineModel<BlessCropRect | null>({ default: null });
const emit = defineEmits<{ ready: []; error: [] }>();

const id = useId();
const stage = ref<HTMLElement>();
const canvas = ref<HTMLCanvasElement>();
const img = ref<HTMLImageElement | null>(null);
const failed = ref(false);
const rot = ref<0 | 90 | 180 | 270>(0);
const box = ref<CropBox>({ l: 0, t: 0, r: 1, b: 1 });
const live = ref("");

const dims = computed(() => {
  const i = img.value;
  if (!i) return { w: 0, h: 0 };
  return rot.value % 180
    ? { w: i.naturalHeight, h: i.naturalWidth }
    : { w: i.naturalWidth, h: i.naturalHeight };
});
/** the aspect in fractions of the displayed image; 0 = free */
const ratio = computed(() =>
  props.aspect && dims.value.w ? (props.aspect * dims.value.h) / dims.value.w : 0,
);
const rect = computed<BlessCropRect | null>(() => {
  const { w, h } = dims.value;
  if (!w) return null;
  const b = box.value;
  return {
    x: Math.round(b.l * w),
    y: Math.round(b.t * h),
    width: Math.round((b.r - b.l) * w),
    height: Math.round((b.b - b.t) * h),
    rotation: rot.value,
  };
});
watch(rect, (r) => r && (model.value = r));

function paint(c: HTMLCanvasElement, scale: number) {
  const i = img.value;
  const ctx = c.getContext("2d");
  if (!i || !ctx) return;
  c.width = Math.max(1, Math.round(dims.value.w * scale));
  c.height = Math.max(1, Math.round(dims.value.h * scale));
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate((rot.value * Math.PI) / 180);
  ctx.drawImage(
    i,
    (-i.naturalWidth * scale) / 2,
    (-i.naturalHeight * scale) / 2,
    i.naturalWidth * scale,
    i.naturalHeight * scale,
  );
}
const reset = () => (box.value = initialBox(ratio.value));
watch(
  () => [img.value, rot.value] as const,
  () =>
    nextTick(
      () =>
        canvas.value &&
        paint(canvas.value, Math.min(1, 1024 / Math.max(dims.value.w, dims.value.h))),
    ),
);
watch(() => [img.value, rot.value, props.aspect], reset);

let loading: HTMLImageElement | undefined;
watch(
  () => [props.src, props.crossorigin] as const,
  ([src, cors]) => {
    img.value = null;
    failed.value = false;
    const i = new Image();
    loading = i;
    i.crossOrigin = cors;
    i.onload = () => {
      if (loading !== i) return;
      img.value = i;
      emit("ready");
    };
    i.onerror = () => {
      if (loading !== i) return;
      failed.value = true;
      emit("error");
    };
    i.src = src;
  },
  { immediate: true },
);
onBeforeUnmount(() => (loading = undefined));

const turn = (d: 90 | -90) => (rot.value = ((rot.value + d + 360) % 360) as 0 | 90 | 180 | 270);

// --- pointer ---
let act: { h: string | null; box: CropBox; x: number; y: number } | null = null;
const at = (e: PointerEvent) => {
  const r = stage.value!.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
};
function down(h: string | null, e: PointerEvent) {
  if (e.button) return;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  e.stopPropagation();
  act = { h, box: box.value, ...at(e) };
}
function move(e: PointerEvent) {
  if (!act) return;
  const p = at(e);
  box.value = act.h
    ? resizeBox(act.box, act.h, p.x, p.y, ratio.value)
    : moveBox(act.box, p.x - act.x, p.y - act.y);
}
const up = () => (act = null);

// --- keyboard ---
function onKey(e: KeyboardEvent) {
  const s = e.shiftKey ? 0.1 : 0.01;
  const d: Record<string, [number, number]> = {
    ArrowLeft: [-s, 0],
    ArrowRight: [s, 0],
    ArrowUp: [0, -s],
    ArrowDown: [0, s],
  };
  if (d[e.key]) box.value = moveBox(box.value, ...d[e.key]!);
  else if (e.key === "+" || e.key === "=") box.value = scaleBox(box.value, s * 2);
  else if (e.key === "-" || e.key === "_") box.value = scaleBox(box.value, -s * 2);
  else return;
  e.preventDefault();
  const r = rect.value!;
  live.value = `${r.width} by ${r.height} pixels, from ${r.x}, ${r.y}`;
}

const handles = computed(() =>
  ratio.value ? ["nw", "ne", "se", "sw"] : ["nw", "n", "ne", "e", "se", "s", "sw", "w"],
);
const frame = computed(() => ({
  left: `${box.value.l * 100}%`,
  top: `${box.value.t * 100}%`,
  width: `${(box.value.r - box.value.l) * 100}%`,
  height: `${(box.value.b - box.value.t) * 100}%`,
}));

/** The cropped pixels at full resolution (or at most `maxWidth` wide). */
function toBlob(
  o: { type?: string; quality?: number; maxWidth?: number } = {},
): Promise<Blob | null> {
  const r = rect.value;
  if (!r || !img.value) return Promise.resolve(null);
  const full = document.createElement("canvas");
  paint(full, 1);
  const k = o.maxWidth && r.width > o.maxWidth ? o.maxWidth / r.width : 1;
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(r.width * k));
  out.height = Math.max(1, Math.round(r.height * k));
  out.getContext("2d")?.drawImage(full, r.x, r.y, r.width, r.height, 0, 0, out.width, out.height);
  return new Promise((res) => out.toBlob(res, o.type ?? "image/png", o.quality));
}
defineExpose({ toBlob, rotate: turn, reset });
</script>

<template>
  <div class="bless-cropper">
    <p v-if="failed" class="bless-cropper__error" role="alert">The image could not be loaded.</p>
    <div v-else ref="stage" class="bless-cropper__stage" :aria-busy="!img">
      <canvas ref="canvas" class="bless-cropper__canvas" aria-hidden="true"></canvas>
      <div
        v-if="img"
        class="bless-cropper__frame"
        tabindex="0"
        role="group"
        :aria-label="label"
        :aria-describedby="`${id}-hint`"
        :style="frame"
        @pointerdown="down(null, $event)"
        @pointermove="move"
        @pointerup="up"
        @pointercancel="up"
        @keydown="onKey"
      >
        <span
          v-for="h in handles"
          :key="h"
          class="bless-cropper__handle"
          :class="`bless-cropper__handle--${h}`"
          aria-hidden="true"
          @pointerdown="down(h, $event)"
          @pointermove="move"
          @pointerup="up"
          @pointercancel="up"
        ></span>
      </div>
    </div>
    <div v-if="img" class="bless-cropper__foot">
      <span :id="`${id}-hint`" class="bless-cropper__readout"
        >{{ rect?.width }} × {{ rect?.height }} px · arrows move, + − resize</span
      >
      <span v-if="controls" class="bless-cropper__controls">
        <BlessButton size="sm" variant="ghost" aria-label="Rotate left" @click="turn(-90)"
          >↺</BlessButton
        >
        <BlessButton size="sm" variant="ghost" aria-label="Rotate right" @click="turn(90)"
          >↻</BlessButton
        >
      </span>
    </div>
    <span class="bless-cropper__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-cropper {
  position: relative;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-cropper__stage {
  position: relative;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  background: var(--bless-color-surface);
}
.bless-cropper__canvas {
  display: block;
  width: 100%;
  height: auto;
}
.bless-cropper__frame {
  position: absolute;
  box-sizing: border-box;
  border: 2px solid var(--bless-color-bg);
  outline: 1px solid var(--bless-color-text);
  box-shadow: 0 0 0 9999px color-mix(in srgb, var(--bless-color-bg) 55%, transparent);
  cursor: move;
  touch-action: none;
}
.bless-cropper__frame:focus-visible {
  outline: 2px solid var(--bless-color-accent);
}
.bless-cropper__handle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--bless-color-bg);
  border: 1px solid var(--bless-color-text);
  touch-action: none;
}
.bless-cropper__handle--nw {
  inset-block-start: -7px;
  inset-inline-start: -7px;
  cursor: nwse-resize;
}
.bless-cropper__handle--ne {
  inset-block-start: -7px;
  inset-inline-end: -7px;
  cursor: nesw-resize;
}
.bless-cropper__handle--se {
  inset-block-end: -7px;
  inset-inline-end: -7px;
  cursor: nwse-resize;
}
.bless-cropper__handle--sw {
  inset-block-end: -7px;
  inset-inline-start: -7px;
  cursor: nesw-resize;
}
.bless-cropper__handle--n,
.bless-cropper__handle--s {
  inset-inline-start: calc(50% - 6px);
  cursor: ns-resize;
}
.bless-cropper__handle--n {
  inset-block-start: -7px;
}
.bless-cropper__handle--s {
  inset-block-end: -7px;
}
.bless-cropper__handle--e,
.bless-cropper__handle--w {
  inset-block-start: calc(50% - 6px);
  cursor: ew-resize;
}
.bless-cropper__handle--e {
  inset-inline-end: -7px;
}
.bless-cropper__handle--w {
  inset-inline-start: -7px;
}
.bless-cropper__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
  margin-top: var(--bless-space-2);
  color: var(--bless-color-text-muted);
  font-size: var(--bless-text-xs);
}
.bless-cropper__controls {
  display: inline-flex;
  gap: var(--bless-space-1);
}
.bless-cropper__error {
  margin: 0;
  color: var(--bless-color-danger-text);
}
.bless-cropper__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
