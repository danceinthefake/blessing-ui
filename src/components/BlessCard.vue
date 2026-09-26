<script setup lang="ts">
import { useLink } from "../composables/useLink";
import BlessSkew from "./BlessSkew.vue";

defineOptions({ name: "BlessCard" });
const link = useLink();

withDefaults(
  defineProps<{
    as?: string;
    /** skewed header label */
    label?: string;
    labelColor?: "text" | "accent" | "danger" | "surface";
    surface?: "bg" | "surface";
    bordered?: boolean;
    /** whole card is a link */
    href?: string;
  }>(),
  { as: "div", labelColor: "text", surface: "bg", bordered: true },
);
</script>

<template>
  <component
    :is="link(href, undefined, as).is"
    v-bind="link(href, undefined, as).attrs"
    class="bless-card"
    :class="[
      `bless-card--${surface}`,
      { 'bless-card--bordered': bordered, 'bless-card--link': href },
    ]"
  >
    <BlessSkew v-if="label || $slots.label" :color="labelColor" class="bless-card__label">
      <slot name="label">{{ label }}</slot>
    </BlessSkew>
    <div v-if="$slots.media" class="bless-card__media"><slot name="media" /></div>
    <div class="bless-card__body"><slot /></div>
    <div v-if="$slots.footer" class="bless-card__footer"><slot name="footer" /></div>
  </component>
</template>

<style>
.bless-card {
  position: relative;
  display: block;
  box-sizing: border-box;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
  text-decoration: none;
  border-radius: var(--bless-radius);
}
.bless-card--bg {
  background: var(--bless-color-bg);
}
.bless-card--surface {
  background: var(--bless-color-surface);
}
.bless-card--bordered {
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-card--link {
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-card--link:hover {
  opacity: var(--bless-hover-opacity);
}
.bless-card--link:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-card__label {
  position: absolute;
  top: calc(-1 * var(--bless-space-3));
  inset-inline-start: var(--bless-space-4);
  z-index: 1;
  padding: var(--bless-space-1) var(--bless-space-3);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  line-height: var(--bless-leading-none);
  text-transform: uppercase;
}
.bless-card__media {
  line-height: 0;
}
.bless-card__media > img,
.bless-card__media > video {
  display: block;
  width: 100%;
  height: auto;
}
.bless-card__body {
  padding: var(--bless-space-4);
}
.bless-card__footer {
  padding: var(--bless-space-3) var(--bless-space-4);
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
</style>
