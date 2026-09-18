<script setup lang="ts">
defineOptions({ name: "BlessIcon" });

withDefaults(
  defineProps<{
    /** token key (2xs…xl) or any CSS length */
    size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | (string & {});
    /** accessible name; omit for decorative */
    label?: string;
  }>(),
  { size: "md" },
);

const tokens = ["2xs", "xs", "sm", "md", "lg", "xl"];
</script>

<template>
  <span
    class="bless-icon"
    :style="{ '--_s': tokens.includes(size) ? `var(--bless-text-${size})` : size }"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <slot />
  </span>
</template>

<style>
.bless-icon {
  display: inline-flex;
  width: var(--_s);
  height: var(--_s);
  flex: none;
  vertical-align: middle;
  color: inherit;
}
.bless-icon > svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
</style>
