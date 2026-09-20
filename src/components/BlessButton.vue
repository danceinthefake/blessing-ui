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
  }>(),
  { variant: "solid", color: "text", size: "md", type: "button" },
);

const link = useLink();
const tag = computed(() => link(props.href, undefined, "button"));
const inactive = computed(() => props.disabled || props.loading);
const skewColor = computed(() => (props.variant === "solid" ? props.color : "none"));
</script>

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
      { 'bless-button--loading': loading },
    ]"
    :type="href ? undefined : type"
    :disabled="href ? undefined : inactive"
    :aria-disabled="inactive || undefined"
    :aria-busy="loading || undefined"
    :tabindex="href && inactive ? -1 : undefined"
  >
    <BlessSpinner v-if="loading" size="sm" />
    <slot v-else name="prefix" />
    <slot />
    <slot name="suffix" />
  </BlessSkew>
</template>

<style>
.bless-button {
  --_c: var(--bless-color-text);
  cursor: pointer;
  border: var(--bless-border-width) solid transparent;
  font-family: var(--bless-font-sans);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  line-height: var(--bless-leading-none);
  text-decoration: none;
  text-transform: uppercase;
  transition: opacity var(--bless-duration-slow) var(--bless-ease-in-out);
}
.bless-button--accent {
  --_c: var(
    --bless-color-accent-text
  ); /* outline/ghost text + border; solid fills come from BlessSkew */
}
.bless-button--danger {
  --_c: var(--bless-color-danger);
}

.bless-button--sm {
  padding: var(--bless-space-1) var(--bless-space-3);
  font-size: var(--bless-text-xs);
}
.bless-button--md {
  padding: var(--bless-space-2) var(--bless-space-4);
  font-size: var(--bless-text-sm);
}
.bless-button--lg {
  padding: var(--bless-space-3) var(--bless-space-6);
  font-size: var(--bless-text-md);
}

.bless-button--outline {
  border-color: var(--_c);
  color: var(--_c);
  background: transparent;
}
.bless-button--ghost {
  color: var(--_c);
  background: transparent;
}

.bless-button:hover:not([aria-disabled]) {
  opacity: var(--bless-hover-opacity);
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

.bless-button .bless-skew__inner {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
}
</style>
