<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessSignaturePad" });

const props = withDefaults(
  defineProps<{
    height?: number;
    lineWidth?: number;
    color?: string;
    label?: string;
    clearLabel?: string;
    disabled?: boolean;
    /** export format */
    type?: "image/png" | "image/jpeg" | "image/webp";
  }>(),
  { height: 160, lineWidth: 2, label: "Signature", clearLabel: "Clear", type: "image/png" },
);
/** data URL of the drawing; empty when blank */
const model = defineModel<string>({ default: "" });
const emit = defineEmits<{ end: [dataUrl: string] }>();
const canvas = ref<HTMLCanvasElement>();
const empty = ref(true);
let ctx: CanvasRenderingContext2D | null = null;
let drawing = false;

function fit() {
  const c = canvas.value!;
  const dpr = window.devicePixelRatio || 1;
  const w = c.clientWidth;
  c.width = w * dpr;
  c.height = props.height * dpr;
  ctx = c.getContext("2d");
  ctx!.scale(dpr, dpr);
  ctx!.lineCap = ctx!.lineJoin = "round";
}
const pos = (e: PointerEvent) => {
  const r = canvas.value!.getBoundingClientRect();
  return [e.clientX - r.left, e.clientY - r.top] as const;
};
function down(e: PointerEvent) {
  if (props.disabled || !ctx) return;
  canvas.value!.setPointerCapture(e.pointerId);
  drawing = true;
  ctx.strokeStyle = props.color || getComputedStyle(canvas.value!).color;
  ctx.lineWidth = props.lineWidth;
  ctx.beginPath();
  ctx.moveTo(...pos(e));
}
function move(e: PointerEvent) {
  if (!drawing || !ctx) return;
  ctx.lineTo(...pos(e));
  ctx.stroke();
  empty.value = false;
}
function up() {
  if (!drawing) return;
  drawing = false;
  model.value = empty.value ? "" : canvas.value!.toDataURL(props.type);
  emit("end", model.value);
}
function clear() {
  ctx?.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
  empty.value = true;
  model.value = "";
}
onMounted(() => {
  fit();
  new ResizeObserver(fit).observe(canvas.value!);
});
watch(model, (v) => v === "" && !empty.value && clear());
defineExpose({ clear, isEmpty: () => empty.value });
</script>

<template>
  <div class="bless-signature" :class="{ 'bless-signature--disabled': disabled }">
    <canvas
      ref="canvas"
      class="bless-signature__canvas"
      :style="{ height: `${height}px` }"
      role="img"
      :aria-label="label"
      tabindex="0"
      @pointerdown="down"
      @pointermove="move"
      @pointerup="up"
      @pointercancel="up"
      @keydown.delete="clear"
    />
    <div class="bless-signature__bar">
      <span class="bless-signature__hint">{{ empty ? "Sign above" : "" }}</span>
      <slot name="actions" :clear :empty>
        <BlessButton size="sm" variant="outline" :disabled="empty || disabled" @click="clear">{{
          clearLabel
        }}</BlessButton>
      </slot>
    </div>
  </div>
</template>

<style>
.bless-signature {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-signature__canvas {
  display: block;
  width: 100%;
  background: var(--bless-color-surface);
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
  touch-action: none;
  cursor: crosshair;
}
.bless-signature__canvas:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-signature__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-signature__hint {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-signature--disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
