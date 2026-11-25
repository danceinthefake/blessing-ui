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
    :style
    role="dialog"
    :aria-label="title"
    v-bind="{ ...$attrs, ...hover }"
    @toggle="onToggle"
    @keydown.esc="modal && ($event.preventDefault(), (open = false))"
  >
    <strong v-if="title" class="bless-popover__title">{{ title }}</strong>
    <slot :close="() => (open = false)" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, useId, watch } from "vue";
import { adoptCss } from "../composables/adoptCss";
import { useFloating, type Placement } from "../composables/useFloating";

// two roots (the trigger and the panel): `class` and other attributes go on the panel
defineOptions({ name: "BlessPopover", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    placement?: Placement;
    offset?: number;
    /** trigger interaction */
    trigger?: "click" | "hover" | "manual";
    openDelay?: number;
    closeDelay?: number;
    /** no light dismiss: only Esc or your own control closes it */
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
const { side, style } = useFloating(anchor, panel, open, () => ({
  placement: props.placement,
  offset: props.arrow ? Math.max(props.offset ?? 8, 10) : props.offset,
  arrow: props.arrow ? 6 : 0,
  facing: true,
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

// A click-trigger is the consumer's element (slot): tell it what it opens and whether it's open.
function wireTrigger() {
  const t = anchor.value?.firstElementChild as HTMLElement | null | undefined;
  if (props.trigger !== "click" || !t?.matches("button, a[href], [role=button]")) return;
  t.setAttribute("aria-haspopup", "dialog");
  t.setAttribute("aria-controls", id);
  t.setAttribute("aria-expanded", String(open.value));
}
onMounted(wireTrigger);
watch(open, () => nextTick(wireTrigger));

function onToggle(e: Event) {
  const opening = (e as ToggleEvent).newState === "open";
  // closing with focus inside would drop it to <body>: hand it back to the trigger
  if (!opening && panel.value?.contains(document.activeElement))
    (anchor.value?.firstElementChild as HTMLElement | null)?.focus?.();
  open.value = opening;
}

// CSS anchor positioning flipped the panel: the accent edge goes to the other edge. Added at run time,
// because the CSS minifier of Vite 8 cannot parse `@container anchored(...)` yet.
onMounted(() =>
  adoptCss(
    "bless-popover-flip",
    `@container anchored(fallback: flip-block) or anchored(fallback: flip-block flip-inline) or anchored(fallback: flip-inline flip-block) {
  .bless-popover--bottom::before {
    top: auto;
    bottom: -1px;
  }
  .bless-popover--top::before {
    bottom: auto;
    top: -1px;
  }
}
@container anchored(fallback: flip-inline) or anchored(fallback: flip-block flip-inline) or anchored(fallback: flip-inline flip-block) {
  .bless-popover--right::before {
    left: auto;
    right: -1px;
  }
  .bless-popover--left::before {
    right: auto;
    left: -1px;
  }
}
`,
  ),
);
</script>

<style>
.bless-popover__anchor {
  display: inline-flex;
}
.bless-popover {
  border-radius: var(--bless-radius);
  position: fixed;
  inset: unset;
  margin: 0;
  overflow: visible; /* UA [popover] sets overflow:auto, which would clip the accent edge */
  container-type: anchored; /* the accent edge asks it which way CSS flipped the panel */
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  box-shadow: var(--bless-shadow-plate);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  line-height: var(--bless-leading-normal);
  max-width: min(320px, calc(100vw - 16px));
}
.bless-popover:popover-open {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
.bless-popover__title {
  display: block;
  margin-bottom: var(--bless-space-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: var(--bless-label-case);
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
.bless-popover--arrow.bless-popover--bottom::before,
.bless-popover--arrow.bless-popover--top::before {
  left: calc(var(--_ax) - 16px);
}
.bless-popover--arrow.bless-popover--left::before,
.bless-popover--arrow.bless-popover--right::before {
  top: calc(var(--_ay) - 16px);
}
</style>
