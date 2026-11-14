<script setup lang="ts">
defineOptions({ name: "BlessDescriptions" });

export interface BlessDescriptionItem {
  label: string;
  /** plain text; use the `value` slot for anything richer */
  value?: string | number;
}

withDefaults(
  defineProps<{
    items: BlessDescriptionItem[];
    /** the most columns; a column is never narrower than `--bless-descriptions-min` (12rem) */
    columns?: number;
    /** lines between the pairs, as one plate */
    bordered?: boolean;
  }>(),
  { columns: 1 },
);
defineSlots<{
  value?(p: { item: BlessDescriptionItem; index: number }): unknown;
}>();
</script>

<template>
  <dl
    class="bless-desc"
    :class="{ 'bless-desc--bordered': bordered }"
    :style="{ '--_cols': columns }"
  >
    <div v-for="(item, index) in items" :key="index" class="bless-desc__item">
      <dt class="bless-desc__label">{{ item.label }}</dt>
      <dd class="bless-desc__value">
        <slot name="value" :item :index>{{ item.value ?? "—" }}</slot>
      </dd>
    </div>
  </dl>
</template>

<style>
.bless-desc {
  --_gap: var(--bless-space-4);
  box-sizing: border-box;
  /* auto-fill needs a definite width: a list of facts fills its container */
  inline-size: 100%;
  display: grid;
  /* up to --_cols columns, fewer when a column would be narrower than the minimum */
  grid-template-columns: repeat(
    auto-fill,
    minmax(
      max(
        var(--bless-descriptions-min, 12rem),
        calc((100% - (var(--_cols) - 1) * var(--_gap)) / var(--_cols))
      ),
      1fr
    )
  );
  gap: var(--bless-space-3) var(--_gap);
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-desc__item {
  display: grid;
  gap: var(--bless-space-1);
  align-content: start;
}
.bless-desc__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-desc__value {
  margin: 0;
  overflow-wrap: anywhere;
}
/* fused: the pairs are cells of one plate. Each cell draws its end and bottom line; the frame
   clips the ones on its own edge, so a short last row leaves an empty cell, not a block of color. */
.bless-desc--bordered {
  --_gap: 0px;
  gap: 0;
  overflow: hidden;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-desc--bordered .bless-desc__item {
  margin-inline-end: calc(-1 * var(--bless-border-width));
  margin-block-end: calc(-1 * var(--bless-border-width));
  padding: var(--bless-space-3) var(--bless-space-4);
  border-inline-end: var(--bless-border-width) solid var(--bless-color-border);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
}
</style>
