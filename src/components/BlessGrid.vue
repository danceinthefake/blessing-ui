<template>
  <component
    :is="as"
    class="bless-grid"
    :style="{ gridTemplateColumns: template, gap: space, alignItems: align }"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "BlessGrid" });

const props = withDefaults(
  defineProps<{
    as?: string;
    /** the most columns. Alone, it is a fixed count */
    columns?: number;
    /** the narrowest a column can be, for example "16rem". With `columns`, the grid drops columns before they get narrower */
    min?: string;
    /** space token key */
    gap?: 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;
    align?: "start" | "center" | "end" | "stretch";
  }>(),
  { as: "div", gap: 4, align: "stretch" },
);

const space = computed(() => `var(--bless-space-${props.gap})`);
// minmax(0, 1fr), not 1fr: a wide child (a table, a long word) cannot push the grid wider than its box
const template = computed(() => {
  const { columns: n, min } = props;
  if (n && !min) return `repeat(${n}, minmax(0, 1fr))`;
  const narrowest = `min(${min ?? "16rem"}, 100%)`;
  if (!n) return `repeat(auto-fit, minmax(${narrowest}, 1fr))`;
  // at most n columns: each is at least 1/n of the row, and never narrower than min
  return `repeat(auto-fit, minmax(max(${narrowest}, calc((100% - ${n - 1} * ${space.value}) / ${n})), 1fr))`;
});
</script>

<style>
.bless-grid {
  display: grid;
}
</style>
