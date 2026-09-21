<script setup lang="ts">
import type { Component } from "vue";
defineOptions({ name: "BlessSkew" });

withDefaults(
  defineProps<{
    /** element to render */
    as?: string | Component;
    /** fill: text | accent | danger | surface; `none` just leans */
    color?: "text" | "accent" | "danger" | "surface" | "none";
    /** a standalone label: label padding and type */
    label?: boolean;
  }>(),
  { as: "span", color: "none" },
);
</script>

<template>
  <component
    :is="as"
    class="bless-skew"
    :class="[`bless-skew--${color}`, { 'bless-skew--label': label }]"
  >
    <span class="bless-skew__inner"><slot /></span>
  </component>
</template>

<style>
.bless-skew {
  border-radius: var(--bless-radius-plate);
  display: inline-block;
  transform: skewX(var(--bless-skew));
}
.bless-skew__inner {
  display: inline-block;
  transform: skewX(var(--bless-skew-counter));
}
/* a standalone label: padding and type */
.bless-skew--label {
  padding: 2px var(--bless-space-3);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  line-height: var(--bless-leading-normal);
}
.bless-skew--text {
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
}
.bless-skew--accent {
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-skew--danger {
  background: var(--bless-color-danger);
  color: var(--bless-color-on-accent);
}
.bless-skew--surface {
  background: var(--bless-color-surface);
  color: var(--bless-color-text);
}
</style>
