<script setup lang="ts">
import { nextTick, onMounted, ref, useId, watch } from "vue";

defineOptions({ name: "BlessSheet" });

const props = withDefaults(
  defineProps<{
    side?: "left" | "right" | "top" | "bottom";
    title?: string;
    size?: string;
    dismissible?: boolean;
    closeLabel?: string;
    /** bottom drawer: show drag handle and allow swipe-down to close */
    handle?: boolean;
  }>(),
  { side: "right", dismissible: true, closeLabel: "Close" },
);

const open = defineModel<boolean>({ default: false });
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement>();
const dragY = ref(0);
const titleId = `${useId()}-title`; // names the dialog whether the title is a prop or the slot
let startY = 0;

function sync(o: boolean) {
  const el = dialog.value;
  if (!el) return;
  if (o && !el.open) {
    el.showModal();
    if (!el.contains(document.activeElement))
      el.querySelector<HTMLElement>(".bless-sheet__panel")?.focus();
  } else if (!o && el.open) el.close();
}
watch(open, (o) => nextTick(() => sync(o)));
onMounted(() => sync(open.value));

// only when the press started on the backdrop too — a selection dragged out of the panel isn't a dismissal
let downOnBackdrop = false;
function onBackdropDown(e: PointerEvent) {
  downOnBackdrop = e.target === dialog.value;
}
function onBackdrop(e: MouseEvent) {
  if (props.dismissible && downOnBackdrop && e.target === dialog.value) open.value = false;
}
function onDown(e: PointerEvent) {
  startY = e.clientY;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}
function onMove(e: PointerEvent) {
  if (startY) dragY.value = Math.max(0, e.clientY - startY);
}
function onUp() {
  // a swipe down is a dismissal, so it follows `dismissible` like Esc and the backdrop
  if (dragY.value > 80 && props.dismissible) open.value = false;
  dragY.value = 0;
  startY = 0;
}
</script>

<template>
  <dialog
    ref="dialog"
    class="bless-sheet"
    :class="`bless-sheet--${side}`"
    :style="size ? { '--_size': size } : undefined"
    :aria-labelledby="title || $slots.title ? titleId : undefined"
    @close="
      open = false;
      emit('close');
    "
    @cancel.prevent="dismissible && (open = false)"
    @pointerdown="onBackdropDown"
    @click="onBackdrop"
  >
    <div
      class="bless-sheet__panel"
      tabindex="-1"
      :style="dragY ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined"
    >
      <div
        v-if="handle"
        class="bless-sheet__handle"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onUp"
      >
        <span />
      </div>
      <button
        type="button"
        class="bless-sheet__close"
        :aria-label="closeLabel"
        @click="open = false"
      >
        <span aria-hidden="true">×</span>
      </button>
      <header v-if="title || $slots.title" class="bless-sheet__header">
        <h2 :id="titleId" class="bless-sheet__title">
          <slot name="title">{{ title }}</slot>
        </h2>
      </header>
      <div class="bless-sheet__body"><slot /></div>
      <footer v-if="$slots.footer" class="bless-sheet__footer"><slot name="footer" /></footer>
    </div>
  </dialog>
</template>

<style>
.bless-sheet {
  --_size: 360px;
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
  overflow: hidden;
}
.bless-sheet[open] {
  display: flex;
}
.bless-sheet::backdrop {
  background: var(--bless-color-backdrop);
}
.bless-sheet__panel {
  border-radius: var(--bless-radius);
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: var(--bless-color-bg);
  outline: 0;
  animation: var(--_anim) var(--bless-duration-slow) var(--bless-ease-out);
}
.bless-sheet--right {
  justify-content: flex-end;
}
.bless-sheet--right .bless-sheet__panel {
  --_anim: bless-sheet-right;
  width: min(var(--_size), 100%);
  height: 100%;
}
.bless-sheet--left .bless-sheet__panel {
  --_anim: bless-sheet-left;
  width: min(var(--_size), 100%);
  height: 100%;
}
.bless-sheet--top .bless-sheet__panel {
  --_anim: bless-sheet-top;
  width: 100%;
  height: auto;
  max-height: 90dvh;
}
.bless-sheet--bottom {
  align-items: flex-end;
}
.bless-sheet--bottom .bless-sheet__panel {
  --_anim: bless-sheet-bottom;
  width: 100%;
  height: auto;
  max-height: 90dvh;
}
.bless-sheet__handle {
  display: grid;
  place-items: center;
  padding: var(--bless-space-2) 0;
  cursor: grab;
  touch-action: none;
}
.bless-sheet__handle > span {
  width: 40px;
  height: 4px;
  background: var(--bless-color-text-muted);
  transform: skewX(var(--bless-skew));
}
.bless-sheet__close {
  position: absolute;
  top: var(--bless-space-2);
  right: var(--bless-space-2);
  z-index: 1;
  width: 36px;
  height: 36px;
  border: 0;
  padding: 0;
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
  font-size: var(--bless-text-lg);
  line-height: 1;
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-sheet__close > span {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.bless-sheet__close:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-sheet__close:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-sheet__header {
  padding: var(--bless-space-6) var(--bless-space-16) 0 var(--bless-space-6);
}
.bless-sheet__title {
  margin: 0;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  line-height: var(--bless-leading-none);
  text-transform: uppercase;
  color: var(--bless-color-text);
  border: 0;
}
.bless-sheet__body {
  flex: 1;
  overflow: auto;
  padding: var(--bless-space-6);
}
.bless-sheet__footer {
  display: flex;
  gap: var(--bless-space-2);
  justify-content: flex-end;
  padding: var(--bless-space-4) var(--bless-space-6);
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
@keyframes bless-sheet-right {
  from {
    transform: translateX(100%);
  }
}
@keyframes bless-sheet-left {
  from {
    transform: translateX(-100%);
  }
}
@keyframes bless-sheet-top {
  from {
    transform: translateY(-100%);
  }
}
@keyframes bless-sheet-bottom {
  from {
    transform: translateY(100%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-sheet__panel {
    animation: none;
  }
}
</style>
