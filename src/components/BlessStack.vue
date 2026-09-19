<script setup lang="ts">
defineOptions({ name: "BlessStack" });

withDefaults(
  defineProps<{
    as?: string;
    direction?: "row" | "column";
    /** space token key */
    gap?: 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    justify?: "start" | "center" | "end" | "between" | "around";
    wrap?: boolean;
  }>(),
  { as: "div", direction: "column", gap: 3, align: "stretch", justify: "start" },
);
const map = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
  baseline: "baseline",
  between: "space-between",
  around: "space-around",
};
</script>

<template>
  <component
    :is="as"
    class="bless-stack"
    :style="{
      flexDirection: direction,
      gap: `var(--bless-space-${gap})`,
      alignItems: map[align],
      justifyContent: map[justify],
      flexWrap: wrap ? 'wrap' : undefined,
    }"
  >
    <slot />
  </component>
</template>

<style>
.bless-stack {
  display: flex;
}
</style>
