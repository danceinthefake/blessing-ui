<script setup lang="ts">
defineOptions({ name: "BlessText" });

withDefaults(
  defineProps<{
    as?: string;
    size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "display";
    weight?: "thin" | "light" | "normal" | "bold";
    tracking?: "tight" | "normal" | "wide" | "wider";
    leading?: "none" | "tight" | "normal";
    muted?: boolean;
    uppercase?: boolean;
  }>(),
  { as: "span", size: "md", weight: "normal", tracking: "normal", leading: "normal" },
);
</script>

<template>
  <component
    :is="as"
    class="bless-text"
    :class="[
      `bless-text--${size}`,
      `bless-text--w-${weight}`,
      `bless-text--t-${tracking}`,
      `bless-text--l-${leading}`,
      { 'bless-text--muted': muted, 'bless-text--upper': uppercase },
    ]"
  >
    <slot />
  </component>
</template>

<style>
.bless-text {
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-text--2xs {
  font-size: var(--bless-text-2xs);
}
.bless-text--xs {
  font-size: var(--bless-text-xs);
}
.bless-text--sm {
  font-size: var(--bless-text-sm);
}
.bless-text--md {
  font-size: var(--bless-text-md);
}
.bless-text--lg {
  font-size: var(--bless-text-lg);
}
.bless-text--xl {
  font-size: var(--bless-text-xl);
}
.bless-text--display {
  font-size: var(--bless-text-display);
}
.bless-text--w-thin {
  font-weight: var(--bless-font-weight-thin);
}
.bless-text--w-light {
  font-weight: var(--bless-font-weight-light);
}
.bless-text--w-normal {
  font-weight: var(--bless-font-weight-normal);
}
.bless-text--w-bold {
  font-weight: var(--bless-font-weight-bold);
}
.bless-text--t-tight {
  letter-spacing: var(--bless-tracking-tight);
}
.bless-text--t-normal {
  letter-spacing: var(--bless-tracking-normal);
}
.bless-text--t-wide {
  letter-spacing: var(--bless-tracking-wide);
}
.bless-text--t-wider {
  letter-spacing: var(--bless-tracking-wider);
}
.bless-text--l-none {
  line-height: var(--bless-leading-none);
}
.bless-text--l-tight {
  line-height: var(--bless-leading-tight);
}
.bless-text--l-normal {
  line-height: var(--bless-leading-normal);
}
.bless-text--muted {
  color: var(--bless-color-text-muted);
}
.bless-text--upper {
  text-transform: uppercase;
}
</style>
