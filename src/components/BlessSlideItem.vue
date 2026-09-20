<script setup lang="ts">
import { ref } from "vue";
import { usePan } from "../composables/useGesture";

defineOptions({ name: "BlessSlideItem" });

const props = withDefaults(
  defineProps<{
    /** px of travel to trigger */
    threshold?: number;
    /** keep the actions revealed after release instead of firing */
    sticky?: boolean;
    disabled?: boolean;
  }>(),
  { threshold: 80 },
);
const emit = defineEmits<{
  left: [reset: () => void];
  right: [reset: () => void];
  slide: [side: "left" | "right" | null];
}>();
const root = ref<HTMLElement>();
const x = ref(0);
const settled = ref<"left" | "right" | null>(null);
const reset = () => ((x.value = 0), (settled.value = null), emit("slide", null));
let dragging = false;
const hasSlot = (s: "left" | "right") => !!slots[s];
const slots = defineSlots<{
  default?: () => unknown;
  left?: (p: { reset: () => void }) => unknown;
  right?: (p: { reset: () => void }) => unknown;
}>();

usePan(root, (e) => {
  if (props.disabled) return;
  if (e.phase === "start") dragging = true;
  else if (e.phase === "move") {
    if (!dragging || Math.abs(e.dy) > Math.abs(e.dx)) return;
    const base =
      settled.value === "left" ? -props.threshold : settled.value === "right" ? props.threshold : 0;
    let nx = base + e.dx;
    if (nx > 0 && !hasSlot("left")) nx = 0;
    if (nx < 0 && !hasSlot("right")) nx = 0;
    x.value = Math.max(-props.threshold * 1.5, Math.min(props.threshold * 1.5, nx));
    if (Math.abs(nx) > 8) e.event.preventDefault();
  } else {
    dragging = false;
    // right-swipe (x > 0) reveals the LEFT actions; left-swipe reveals RIGHT
    if (x.value >= props.threshold) {
      if (props.sticky)
        ((x.value = props.threshold), (settled.value = "right"), emit("slide", "right"));
      else emit("left", reset);
      if (!props.sticky) x.value = props.threshold;
    } else if (x.value <= -props.threshold) {
      if (props.sticky)
        ((x.value = -props.threshold), (settled.value = "left"), emit("slide", "left"));
      else emit("right", reset);
      if (!props.sticky) x.value = -props.threshold;
    } else reset();
  }
});
defineExpose({ reset });
</script>

<template>
  <div
    ref="root"
    class="bless-slide"
    :class="{ 'bless-slide--disabled': disabled }"
    :style="{ '--_x': `${x}px` }"
  >
    <div
      v-if="$slots.left"
      class="bless-slide__side bless-slide__side--left"
      :class="{ 'bless-slide__side--on': x > 0 }"
    >
      <slot name="left" :reset />
    </div>
    <div
      v-if="$slots.right"
      class="bless-slide__side bless-slide__side--right"
      :class="{ 'bless-slide__side--on': x < 0 }"
    >
      <slot name="right" :reset />
    </div>
    <div class="bless-slide__content"><slot /></div>
  </div>
</template>

<style>
.bless-slide {
  position: relative;
  overflow: hidden;
  touch-action: pan-y;
  user-select: none;
}
.bless-slide__content {
  position: relative;
  background: var(--bless-color-bg);
  transform: translateX(var(--_x));
  transition: transform var(--bless-duration-base) var(--bless-ease-out);
}
.bless-slide__side {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: stretch;
  visibility: hidden;
}
.bless-slide__side--on {
  visibility: visible;
}
.bless-slide__side--left {
  left: 0;
}
.bless-slide__side--right {
  right: 0;
}
.bless-slide__side > * {
  display: inline-flex;
  align-items: center;
  padding: 0 var(--bless-space-4);
}
.bless-slide--disabled {
  touch-action: auto;
}
</style>
