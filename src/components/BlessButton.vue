<template>
  <BlessSkew
    :as="tag.is"
    v-bind="tag.attrs"
    :color="skewColor"
    class="bless-button"
    :class="[
      `bless-button--${variant}`,
      `bless-button--${color}`,
      `bless-button--${size}`,
      {
        'bless-button--loading': loading,
        'bless-button--block': block,
        'bless-button--icon': icon,
      },
    ]"
    :type="href ? undefined : type"
    :disabled="href ? undefined : disabled"
    :aria-disabled="inactive || undefined"
    :aria-busy="loading || undefined"
    :tabindex="href && inactive ? -1 : undefined"
    @click="onClick"
  >
    <BlessSpinner v-if="loading" size="sm" label="" />
    <slot v-else name="prefix" />
    <slot />
    <slot name="suffix" />
  </BlessSkew>
</template>

<script setup lang="ts">
import { useLink } from "../composables/useLink";
import { computed } from "vue";
import BlessSkew from "./BlessSkew.vue";
import BlessSpinner from "./BlessSpinner.vue";

defineOptions({ name: "BlessButton" });

const props = withDefaults(
  defineProps<{
    variant?: "solid" | "outline" | "ghost";
    color?: "text" | "accent" | "danger";
    size?: "sm" | "md" | "lg";
    /** renders <a> when set */
    href?: string;
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit" | "reset";
    /** full width of its container */
    block?: boolean;
    /** icon-only: equal padding all round — pass an aria-label */
    icon?: boolean;
  }>(),
  { variant: "solid", color: "text", size: "md", type: "button" },
);

const emit = defineEmits<{ click: [e: MouseEvent] }>();

const link = useLink();
const tag = computed(() => link(props.href, undefined, "button"));
const inactive = computed(() => props.disabled || props.loading);
const skewColor = computed(() => (props.variant === "solid" ? props.color : "none"));
// an <a> has no disabled, and a loading button keeps focus: swallow the click
// (no navigation, no submit) and don't pass it on
function onClick(e: MouseEvent) {
  if (inactive.value) e.preventDefault();
  else emit("click", e);
}
</script>

<style>
.bless-button {
  --_c: var(--bless-color-text);
  --bless-radius-plate: var(--bless-radius-pill); /* unskewed tactile pill (revamp 2026-11 r2) */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  border: var(--bless-border-width) solid transparent;
  font-family: var(--bless-font-sans);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  line-height: var(--bless-leading-none);
  text-decoration: none;
  text-transform: var(--bless-label-case);
  transform: none;
  transition:
    transform var(--bless-duration-base) var(--bless-ease-spring),
    background var(--bless-duration-base) var(--bless-ease-out),
    border-color var(--bless-duration-base) var(--bless-ease-out),
    color var(--bless-duration-base) var(--bless-ease-out),
    box-shadow var(--bless-duration-base) var(--bless-ease-out);
}
.bless-button--accent {
  --_c: var(
    --bless-color-accent-text
  ); /* outline/ghost text + border; solid fills come from BlessSkew */
}
.bless-button--danger {
  --_c: var(--bless-color-danger-text); /* outline / ghost text; the solid fill is Skew's danger */
}

.bless-button--sm {
  min-height: 30px;
  padding: 0 var(--bless-space-3);
  font-size: var(--bless-text-xs);
}
.bless-button--md {
  min-height: 36px;
  padding: 0 var(--bless-space-4);
  font-size: var(--bless-text-sm);
}
.bless-button--lg {
  min-height: 44px;
  padding: 0 var(--bless-space-6);
  font-size: var(--bless-text-md);
}

.bless-button--outline {
  border-color: color-mix(in srgb, var(--_c) 26%, transparent);
  color: var(--_c);
  background: var(--bless-color-surface);
}
.bless-button--ghost {
  color: var(--_c);
  background: transparent;
}

/* AA-safe tactile hover (replaces 0.6 opacity washout & pill skew) */
.bless-button:hover:not([aria-disabled]) {
  transform: translateY(var(--bless-hover-lift));
}
.bless-button--solid.bless-button--text:hover:not([aria-disabled]) {
  background: color-mix(in srgb, var(--bless-color-text) 84%, var(--bless-color-accent));
  box-shadow: var(--bless-shadow-sm);
}
.bless-button--solid.bless-button--accent:hover:not([aria-disabled]) {
  background: color-mix(in srgb, var(--bless-color-accent) 88%, var(--bless-color-text));
  box-shadow: var(--bless-shadow-sm);
}
.bless-button--solid.bless-button--danger:hover:not([aria-disabled]) {
  background: color-mix(in srgb, var(--bless-color-danger) 88%, var(--bless-color-text));
  box-shadow: var(--bless-shadow-sm);
}
.bless-button--outline:hover:not([aria-disabled]) {
  background: var(--bless-color-surface-2);
  border-color: color-mix(in srgb, var(--_c) 42%, transparent);
}
.bless-button--ghost:hover:not([aria-disabled]) {
  background: var(--bless-color-hover);
}
/* colour means chosen: ink at rest, the accent only while pressed */
.bless-button--text:active:not([aria-disabled]),
.bless-button--accent:active:not([aria-disabled]) {
  border-color: var(--bless-color-accent);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
  transform: scale(var(--bless-press-scale));
}
.bless-button--danger:active:not([aria-disabled]) {
  transform: scale(var(--bless-press-scale));
}
.bless-button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-button[aria-disabled] {
  cursor: not-allowed;
  opacity: 0.4;
}
.bless-button--loading {
  cursor: progress;
}
.bless-button--block {
  display: flex;
  width: 100%;
}
.bless-button--block .bless-skew__inner {
  justify-content: center;
}
.bless-button--icon.bless-button--sm {
  width: 30px;
  padding: 0;
}
.bless-button--icon.bless-button--md {
  width: 36px;
  padding: 0;
}
.bless-button--icon.bless-button--lg {
  width: 44px;
  padding: 0;
}

.bless-button .bless-skew__inner {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  transform: none;
}
</style>
