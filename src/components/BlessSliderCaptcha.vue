<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from "vue";

defineOptions({ name: "BlessSliderCaptcha" });

const props = withDefaults(
  defineProps<{
    /** background picture; without it a checker pattern is drawn */
    src?: string;
    /** how close counts, as a fraction of the track (0.03 = 3%) */
    tolerance?: number;
    label?: string;
  }>(),
  { tolerance: 0.03, label: "Slide the piece into the gap" },
);
/** true once solved; the widget then stays locked until `reset()` */
const verified = defineModel<boolean>("verified", { default: false });
const emit = defineEmits<{ verify: [info: { ms: number }]; fail: [] }>();

const id = useId();
const stage = ref<HTMLElement>();
const W = ref(320);
const H = () => Math.round(W.value / 2);
const PIECE = 0.16; // piece width, as a fraction of the stage
const f = ref(0); // slider position, 0..1 of the track
// gap position: fraction of the track, fraction of the free height. Fixed until mounted, so the
// server-rendered page matches what the browser first builds; shuffled on mount.
const gap = ref({ at: 0.6, y: 0.3 });
const dragging = ref(false);
const failed = ref(false);
const live = ref("");
let started = 0;

function shuffle() {
  gap.value = { at: 0.35 + Math.random() * 0.55, y: 0.1 + Math.random() * 0.5 };
}

let ro: ResizeObserver | undefined;
onMounted(() => {
  shuffle();
  const el = stage.value;
  if (!el) return;
  W.value = el.clientWidth || 320;
  if (typeof ResizeObserver === "undefined") return;
  ro = new ResizeObserver(() => (W.value = el.clientWidth || 320));
  ro.observe(el);
});
onBeforeUnmount(() => ro?.disconnect());

const size = () => W.value * PIECE;
const gapX = () => gap.value.at * W.value * (1 - PIECE);
const gapY = () => gap.value.y * (H() - size());
const bg = () =>
  props.src
    ? { backgroundImage: `url(${props.src})`, backgroundSize: `${W.value}px ${H()}px` }
    : {};

function check() {
  if (verified.value) return;
  if (Math.abs(f.value - gap.value.at) <= props.tolerance) {
    verified.value = true;
    f.value = gap.value.at;
    live.value = "Verified";
    emit("verify", { ms: Math.round(performance.now() - started) });
  } else {
    failed.value = true;
    live.value = "Not quite, try again";
    emit("fail");
    f.value = 0;
    shuffle();
    setTimeout(() => (failed.value = false), 400);
  }
}
function reset() {
  verified.value = false;
  failed.value = false;
  f.value = 0;
  live.value = "";
  shuffle();
}
defineExpose({ reset });

let from = { x: 0, f: 0 };
function down(e: PointerEvent) {
  if (verified.value || e.button) return;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  from = { x: e.clientX, f: f.value };
  dragging.value = true;
  if (!started || f.value === 0) started = performance.now();
}
function move(e: PointerEvent) {
  if (!dragging.value) return;
  const travel = (stage.value?.clientWidth || W.value) - size();
  f.value = Math.min(1, Math.max(0, from.f + (e.clientX - from.x) / travel));
}
function up() {
  if (!dragging.value) return;
  dragging.value = false;
  check();
}
function onKey(e: KeyboardEvent) {
  if (verified.value) return;
  const step = e.shiftKey ? 0.1 : 0.01;
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    if (!f.value) started = performance.now();
    f.value = Math.min(1, Math.max(0, f.value + (e.key === "ArrowRight" ? step : -step)));
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    check();
  }
}
</script>

<template>
  <div
    class="bless-captcha"
    :class="{ 'bless-captcha--ok': verified, 'bless-captcha--fail': failed }"
  >
    <div
      ref="stage"
      class="bless-captcha__stage"
      :style="{ height: `${H()}px`, ...bg() }"
      aria-hidden="true"
    >
      <span
        class="bless-captcha__gap"
        :style="{
          width: `${size()}px`,
          height: `${size()}px`,
          left: `${gapX()}px`,
          top: `${gapY()}px`,
        }"
      ></span>
      <span
        class="bless-captcha__piece"
        :class="{ 'bless-captcha__piece--drag': dragging }"
        :style="{
          width: `${size()}px`,
          height: `${size()}px`,
          top: `${gapY()}px`,
          left: `${f * (W - size())}px`,
          ...bg(),
          backgroundPosition: `-${gapX()}px -${gapY()}px`,
        }"
      ></span>
    </div>
    <div class="bless-captcha__track">
      <span :id="`${id}-l`" class="bless-captcha__label">{{ verified ? "Verified" : label }}</span>
      <button
        type="button"
        class="bless-captcha__handle"
        :class="{ 'bless-captcha__handle--drag': dragging }"
        role="slider"
        :aria-labelledby="`${id}-l`"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.round(f * 100)"
        :aria-disabled="verified || undefined"
        :style="{ left: `${f * 100}%`, translate: `${-f * 100}% 0` }"
        @pointerdown="down"
        @pointermove="move"
        @pointerup="up"
        @pointercancel="up"
        @keydown="onKey"
      >
        <span aria-hidden="true">{{ verified ? "✓" : "→" }}</span>
      </button>
    </div>
    <span class="bless-captcha__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-captcha {
  position: relative;
  max-width: 360px;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-captcha__stage {
  position: relative;
  overflow: hidden;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background-color: var(--bless-color-surface);
  background-image: conic-gradient(
    var(--bless-color-border) 25%,
    transparent 0 50%,
    var(--bless-color-border) 0 75%,
    transparent 0
  );
  background-size: 24px 24px;
  user-select: none;
}
.bless-captcha__gap {
  position: absolute;
  background: color-mix(in srgb, var(--bless-color-text) 55%, transparent);
  box-shadow: inset 0 0 0 2px var(--bless-color-bg);
}
.bless-captcha__piece {
  position: absolute;
  background-color: var(--bless-color-surface);
  background-image: conic-gradient(
    var(--bless-color-border) 25%,
    transparent 0 50%,
    var(--bless-color-border) 0 75%,
    transparent 0
  );
  background-size: 24px 24px;
  border: 2px solid var(--bless-color-bg);
  outline: 1px solid var(--bless-color-text);
  box-shadow: var(--bless-shadow-plate);
  transition: left var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-captcha__piece--drag {
  transition: none;
}
.bless-captcha__track {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin-top: var(--bless-space-2);
  background: var(--bless-color-surface);
  border: var(--bless-border-width) solid var(--bless-color-border);
  color: var(--bless-color-text-muted);
}
.bless-captcha__handle {
  position: absolute;
  top: -1px;
  bottom: -1px;
  width: 44px;
  border: 0;
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
  font: inherit;
  cursor: grab;
  touch-action: none;
  transition:
    left var(--bless-duration-slow) var(--bless-ease-out),
    translate var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-captcha__handle--drag {
  cursor: grabbing;
  transition: none;
}
.bless-captcha__handle:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-captcha--ok .bless-captcha__handle {
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  cursor: default;
}
.bless-captcha--fail .bless-captcha__track {
  border-color: var(--bless-color-danger-text);
}
.bless-captcha__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
@media (prefers-reduced-motion: reduce) {
  .bless-captcha__piece,
  .bless-captcha__handle {
    transition: none;
  }
}
</style>
