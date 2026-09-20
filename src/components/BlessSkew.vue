<script setup lang="ts">
defineOptions({ name: "BlessSkew" });

withDefaults(
  defineProps<{
    /** element to render */
    as?: string;
    /** background token: text | accent | danger | surface */
    color?: "text" | "accent" | "danger" | "surface" | "none";
  }>(),
  { as: "span", color: "none" },
);
</script>

<template>
  <component :is="as" class="bless-skew" :class="`bless-skew--${color}`">
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
