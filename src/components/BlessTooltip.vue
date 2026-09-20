<script setup lang="ts">
import { nextTick, ref, useId, watch } from "vue";
import { useFloating, type Placement } from "../composables/useFloating";

defineOptions({ name: "BlessTooltip" });

const props = withDefaults(
  defineProps<{ text?: string; placement?: Placement; delay?: number }>(),
  { placement: "top", delay: 400 },
);

const open = ref(false);
const id = useId();
const anchor = ref<HTMLElement>();
const tip = ref<HTMLElement>();
const { x, y, side, arrowX, arrowY } = useFloating(anchor, tip, open, () => ({
  placement: props.placement,
  offset: 8,
  arrow: 5,
}));

let timer: ReturnType<typeof setTimeout> | undefined;
const show = (ms = props.delay) => {
  clearTimeout(timer);
  timer = setTimeout(() => (open.value = true), ms);
};
const hide = () => {
  clearTimeout(timer);
  open.value = false;
};
watch(
  open,
  (o) =>
    nextTick(() => {
      const el = tip.value;
      if (!el || typeof el.showPopover !== "function") return;
      if (o && !el.matches(":popover-open")) el.showPopover();
      else if (!o && el.matches(":popover-open")) el.hidePopover();
    }),
  { immediate: true },
);
</script>

<template>
  <span
    ref="anchor"
    class="bless-tooltip__anchor"
    :aria-describedby="id"
    @mouseenter="show()"
    @mouseleave="hide"
    @focusin="show(0)"
    @focusout="hide"
    @keydown.esc="hide"
  >
    <slot />
  </span>
  <div
    ref="tip"
    :id
    popover="manual"
    role="tooltip"
    class="bless-tooltip"
    :class="`bless-tooltip--${side}`"
    :style="{ left: `${x}px`, top: `${y}px`, '--_ax': `${arrowX}px`, '--_ay': `${arrowY}px` }"
  >
    <slot name="content">{{ text }}</slot>
    <span class="bless-tooltip__arrow" aria-hidden="true" />
  </div>
</template>

<style>
.bless-tooltip__anchor {
  display: inline-flex;
}
.bless-tooltip {
  border-radius: var(--bless-radius);
  position: fixed;
  inset: unset;
  margin: 0;
  overflow: visible; /* UA [popover] sets overflow:auto, which would clip the arrow */
  padding: var(--bless-space-1) var(--bless-space-3);
  border: 0;
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  line-height: var(--bless-leading-tight);
  max-width: 240px;
  pointer-events: none;
  transform: skewX(var(--bless-skew));
}
.bless-tooltip > :not(.bless-tooltip__arrow) {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.bless-tooltip:popover-open {
  animation: bless-pop-in var(--bless-duration-fast) var(--bless-ease-out);
}
/* arrow: a small square rotated 45°, sitting on the edge that faces the anchor */
.bless-tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
  transform: rotate(45deg);
}
.bless-tooltip--top .bless-tooltip__arrow {
  left: calc(var(--_ax) - 4px);
  bottom: -6px;
}
.bless-tooltip--bottom .bless-tooltip__arrow {
  left: calc(var(--_ax) - 4px);
  top: -6px;
}
.bless-tooltip--left .bless-tooltip__arrow {
  top: calc(var(--_ay) - 4px);
  right: -6px;
}
.bless-tooltip--right .bless-tooltip__arrow {
  top: calc(var(--_ay) - 4px);
  left: -6px;
}
</style>
