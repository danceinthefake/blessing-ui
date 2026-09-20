<script setup lang="ts">
import { nextTick, ref, useId, watch } from "vue";
import { useFloating, type Placement } from "../composables/useFloating";

defineOptions({ name: "BlessPopover" });

const props = withDefaults(
  defineProps<{
    placement?: Placement;
    offset?: number;
    /** trigger interaction */
    trigger?: "click" | "hover" | "manual";
    openDelay?: number;
    closeDelay?: number;
    /** popover=auto gives light dismiss + Esc */
    modal?: boolean;
    title?: string;
    /** the accent edge slides along to point at the trigger */
    arrow?: boolean;
  }>(),
  { placement: "bottom", trigger: "click", openDelay: 300, closeDelay: 200 },
);

const open = defineModel<boolean>("open", { default: false });
const id = useId();
const anchor = ref<HTMLElement>();
const panel = ref<HTMLElement>();
const { x, y, side, arrowX, arrowY } = useFloating(anchor, panel, open, () => ({
  placement: props.placement,
  offset: props.arrow ? Math.max(props.offset ?? 8, 10) : props.offset,
  arrow: props.arrow ? 6 : 0,
}));

function sync(o: boolean) {
  const el = panel.value;
  if (!el || typeof el.showPopover !== "function") return;
  if (o && !el.matches(":popover-open")) el.showPopover();
  else if (!o && el.matches(":popover-open")) el.hidePopover();
}
watch(open, (o) => nextTick(() => sync(o)), { immediate: true });

let timer: ReturnType<typeof setTimeout> | undefined;
const later = (v: boolean, ms: number) => {
  clearTimeout(timer);
  timer = setTimeout(() => (open.value = v), ms);
};
const hover = {
  onMouseenter: () => props.trigger === "hover" && later(true, props.openDelay),
  onMouseleave: () => props.trigger === "hover" && later(false, props.closeDelay),
  onFocusin: () => props.trigger === "hover" && later(true, 0),
  onFocusout: () => props.trigger === "hover" && later(false, props.closeDelay),
};

function onToggle(e: Event) {
  open.value = (e as ToggleEvent).newState === "open";
}
</script>

<template>
  <span
    ref="anchor"
    class="bless-popover__anchor"
    v-bind="hover"
    @click="trigger === 'click' && (open = !open)"
  >
    <slot name="trigger" :open />
  </span>
  <div
    ref="panel"
    :id
    :popover="modal ? 'manual' : 'auto'"
    class="bless-popover"
    :class="[`bless-popover--${side}`, { 'bless-popover--arrow': arrow }]"
    :style="{ left: `${x}px`, top: `${y}px`, '--_ax': `${arrowX}px`, '--_ay': `${arrowY}px` }"
    role="dialog"
    :aria-label="title"
    v-bind="hover"
    @toggle="onToggle"
  >
    <strong v-if="title" class="bless-popover__title">{{ title }}</strong>
    <slot :close="() => (open = false)" />
  </div>
</template>

<style>
.bless-popover__anchor {
  display: inline-flex;
}
.bless-popover {
  position: fixed;
  inset: unset;
  margin: 0;
  overflow: visible; /* UA [popover] sets overflow:auto, which would clip the accent edge */
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  box-shadow: var(--bless-shadow-md);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
  max-width: min(320px, calc(100vw - 16px));
}
.bless-popover:popover-open {
  animation: bless-pop-in var(--bless-duration-base) var(--bless-ease-out);
}
.bless-popover__title {
  display: block;
  margin-bottom: var(--bless-space-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
}
/* skewed accent edge on the side facing the anchor; with `arrow` it slides to point at the trigger */
.bless-popover::before {
  content: "";
  position: absolute;
  background: var(--bless-color-accent);
  transform: skewX(var(--bless-skew));
}
.bless-popover--bottom::before {
  top: -1px;
  left: 12px;
  width: 32px;
  height: 3px;
}
.bless-popover--top::before {
  bottom: -1px;
  left: 12px;
  width: 32px;
  height: 3px;
}
.bless-popover--right::before {
  left: -1px;
  top: 12px;
  width: 3px;
  height: 32px;
  transform: none;
}
.bless-popover--left::before {
  right: -1px;
  top: 12px;
  width: 3px;
  height: 32px;
  transform: none;
}
@keyframes bless-pop-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .bless-popover:popover-open {
    animation: none;
  }
}
.bless-popover--arrow.bless-popover--bottom::before,
.bless-popover--arrow.bless-popover--top::before {
  left: calc(var(--_ax) - 16px);
}
.bless-popover--arrow.bless-popover--left::before,
.bless-popover--arrow.bless-popover--right::before {
  top: calc(var(--_ay) - 16px);
}
</style>
