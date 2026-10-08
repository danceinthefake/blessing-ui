<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { burst, step, type Particle } from "../composables/confetti";
import { reducedMotion } from "../composables/useMedia";

defineOptions({ name: "BlessConfetti" });

const props = withDefaults(
  defineProps<{
    /** pieces per burst */
    count?: number;
    /** token names (`chart-2`, `accent`…) or CSS colours */
    colors?: string[];
    /** milliseconds until the last piece has faded */
    duration?: number;
    /** width of the cone the pieces leave in, degrees; 360 is all around */
    spread?: number;
    /** launch strength, px per second */
    power?: number;
    gravity?: number;
  }>(),
  {
    count: 90,
    colors: () => ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "warning"],
    duration: 2200,
    spread: 80,
    power: 900,
    gravity: 1400,
  },
);
const emit = defineEmits<{ done: [] }>();

const canvas = ref<HTMLCanvasElement>();
let pieces: Particle[] = [];
let raf = 0;
let last = 0;

const resolve = (c: string) =>
  /^[a-z0-9-]+$/i.test(c) && canvas.value
    ? getComputedStyle(canvas.value).getPropertyValue(`--bless-color-${c}`).trim() || c
    : c;

function frame(now: number) {
  const cv = canvas.value;
  const ctx = cv?.getContext("2d");
  if (!cv || !ctx) return stop();
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  ctx.clearRect(0, 0, cv.width, cv.height);
  const k = window.devicePixelRatio || 1;
  for (const p of pieces) {
    step(p, dt, props.gravity, props.duration / 1000);
    if (p.life <= 0) continue;
    ctx.save();
    ctx.globalAlpha = Math.min(1, p.life * 3);
    ctx.fillStyle = p.color;
    ctx.translate(p.x * k, p.y * k);
    ctx.rotate(p.rot);
    if (p.round) {
      ctx.beginPath();
      ctx.arc(0, 0, (p.size * k) / 2, 0, Math.PI * 2);
      ctx.fill();
    } else ctx.fillRect((-p.size * k) / 2, (-p.size * k) / 3, p.size * k, (p.size * k) / 1.6);
    ctx.restore();
  }
  pieces = pieces.filter((p) => p.life > 0 && p.y < window.innerHeight + 40);
  if (pieces.length) raf = requestAnimationFrame(frame);
  else {
    stop();
    emit("done");
  }
}
function stop() {
  cancelAnimationFrame(raf);
  raf = 0;
  pieces = [];
  const cv = canvas.value;
  cv?.getContext("2d")?.clearRect(0, 0, cv.width, cv.height);
}

/**
 * Throw a burst. `from` is a point in viewport px or an element to burst out of (default: the
 * middle of the window); `angle` points the cone (default straight up). Does nothing under
 * `prefers-reduced-motion`.
 */
function fire(from?: { x: number; y: number } | HTMLElement, angle = 270) {
  const cv = canvas.value;
  if (!cv || reducedMotion()) return void emit("done");
  const k = window.devicePixelRatio || 1;
  cv.width = window.innerWidth * k;
  cv.height = window.innerHeight * k;
  let origin = { x: window.innerWidth / 2, y: window.innerHeight * 0.65 };
  if (from instanceof HTMLElement) {
    const r = from.getBoundingClientRect();
    origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  } else if (from) origin = from;
  pieces.push(
    ...burst({
      count: props.count,
      origin,
      angle,
      spread: props.spread,
      power: props.power,
      colors: props.colors.map(resolve),
    }),
  );
  if (!raf) {
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
}
onBeforeUnmount(stop);
defineExpose({ fire, stop });
</script>

<template>
  <canvas ref="canvas" class="bless-confetti" aria-hidden="true" />
</template>

<style>
.bless-confetti {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: calc(var(--bless-z-modal) + 1);
}
</style>
