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
const { x, y, side } = useFloating(anchor, tip, open, { placement: props.placement, offset: 6 });

let timer: ReturnType<typeof setTimeout> | undefined;
const show = (ms = props.delay) => {
  clearTimeout(timer);
  timer = setTimeout(() => (open.value = true), ms);
};
const hide = () => {
  clearTimeout(timer);
  open.value = false;
};
watch(open, (o) =>
  nextTick(() => {
    const el = tip.value;
    if (!el || typeof el.showPopover !== "function") return;
    if (o && !el.matches(":popover-open")) el.showPopover();
    else if (!o && el.matches(":popover-open")) el.hidePopover();
  }),
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
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <slot name="content">{{ text }}</slot>
  </div>
</template>

<style>
.bless-tooltip__anchor {
  display: inline-flex;
}
.bless-tooltip {
  position: fixed;
  inset: unset;
  margin: 0;
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
.bless-tooltip > * {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
.bless-tooltip:popover-open {
  animation: bless-pop-in var(--bless-duration-fast) var(--bless-ease-out);
}
</style>
