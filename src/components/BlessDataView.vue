<script setup lang="ts" generic="T">
import { computed, ref } from "vue";
import BlessPagination from "./BlessPagination.vue";
import BlessToggle from "./BlessToggle.vue";
import BlessToggleGroup from "./BlessToggleGroup.vue";

defineOptions({ name: "BlessDataView" });

const props = withDefaults(
  defineProps<{
    items: T[];
    rowKey?: (item: T, index: number) => string | number;
    pageSize?: number;
    /** min card width in grid layout */
    columns?: string;
    label?: string;
    /** hide the list/grid switch */
    switchable?: boolean;
  }>(),
  { pageSize: 0, columns: "220px", label: "Items", switchable: true },
);
const layout = defineModel<"list" | "grid">("layout", { default: "list" });
const page = ref(1);
const pages = computed(() =>
  props.pageSize ? Math.max(1, Math.ceil(props.items.length / props.pageSize)) : 1,
);
const slice = computed(() =>
  props.pageSize
    ? props.items.slice((page.value - 1) * props.pageSize, page.value * props.pageSize)
    : props.items,
);
</script>

<template>
  <div class="bless-dataview" :class="`bless-dataview--${layout}`" :style="{ '--_col': columns }">
    <div v-if="$slots.header || switchable" class="bless-dataview__bar">
      <div class="bless-dataview__header"><slot name="header" :layout /></div>
      <BlessToggleGroup
        v-if="switchable"
        :model-value="layout"
        label="Layout"
        @update:model-value="layout = ($event ?? 'list') as 'list' | 'grid'"
      >
        <BlessToggle value="list" size="sm" label="List">☰</BlessToggle>
        <BlessToggle value="grid" size="sm" label="Grid">▦</BlessToggle>
      </BlessToggleGroup>
    </div>
    <div class="bless-dataview__items" role="list" :aria-label="label">
      <div
        v-for="(item, i) in slice"
        :key="rowKey ? rowKey(item, i) : i"
        class="bless-dataview__item"
        role="listitem"
      >
        <slot :item :index="(page - 1) * pageSize + i" :layout />
      </div>
      <div v-if="!slice.length" class="bless-dataview__empty">
        <slot name="empty">No items</slot>
      </div>
    </div>
    <BlessPagination v-if="pages > 1" v-model="page" :total="pages" class="bless-dataview__pager" />
  </div>
</template>

<style>
.bless-dataview {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-dataview__bar {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
}
.bless-dataview__header {
  flex: 1;
}
.bless-dataview--list .bless-dataview__items {
  display: flex;
  flex-direction: column;
}
.bless-dataview--list .bless-dataview__item + .bless-dataview__item {
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-dataview--grid .bless-dataview__items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--_col), 1fr));
  gap: var(--bless-space-3);
}
.bless-dataview__empty {
  padding: var(--bless-space-6);
  text-align: center;
  color: var(--bless-color-text-muted);
}
.bless-dataview__pager {
  align-self: center;
}
</style>
