<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref } from "vue";
import BlessTable from "./BlessTable.vue";
import type { BlessColumn } from "./table";

defineOptions({ name: "BlessTreeTable" });

const props = withDefaults(
  defineProps<{
    columns: BlessColumn<T>[];
    /** rows with an optional `children` array of the same shape */
    rows: T[];
    rowKey: keyof T & string;
    childrenKey?: string;
    /** column that carries the indent + toggle; default: first */
    treeColumn?: keyof T & string;
    caption?: string;
    striped?: boolean;
    /** ids expanded initially */
    defaultExpanded?: (string | number)[];
  }>(),
  { childrenKey: "children", defaultExpanded: () => [] },
);
type Id = string | number;
const expanded = defineModel<Id[] | undefined>("expanded");
const local = ref<Id[]>([...props.defaultExpanded]);
const list = computed<Id[]>(() => (expanded.value as Id[] | undefined) ?? local.value);
const isOpen = (id: Id) => list.value.includes(id);
function toggle(id: Id) {
  const next: Id[] = isOpen(id) ? list.value.filter((x: Id) => x !== id) : [...list.value, id];
  if (expanded.value) expanded.value = next;
  else local.value = next;
}
const treeCol = computed(() => props.treeColumn ?? props.columns[0]?.key);

type Flat = T & { __depth: number; __has: boolean; __open: boolean };
const flat = computed(() => {
  const out: Flat[] = [];
  const walk = (rows: T[], depth: number) => {
    for (const r of rows) {
      const kids = (r[props.childrenKey] as T[] | undefined) ?? [];
      const id = r[props.rowKey] as string | number;
      const open = isOpen(id);
      out.push({ ...r, __depth: depth, __has: kids.length > 0, __open: open });
      if (open) walk(kids, depth + 1);
    }
  };
  walk(props.rows, 0);
  return out;
});
</script>

<template>
  <BlessTable
    :columns
    :rows="flat as unknown as T[]"
    :row-key
    :caption
    :striped
    :stack="false"
    class="bless-treetable"
  >
    <template v-for="(_, name) in $slots" #[name]="scope"
      ><slot :name v-bind="scope ?? {}"
    /></template>
    <template #[`cell-${treeCol}`]="{ row, value }">
      <span class="bless-treetable__cell" :style="{ '--_d': (row as Flat).__depth }">
        <button
          v-if="(row as Flat).__has"
          type="button"
          class="bless-treetable__toggle"
          :aria-expanded="(row as Flat).__open"
          :aria-label="String(value)"
          @click="toggle(row[rowKey] as string | number)"
        >
          <span aria-hidden="true">›</span>
        </button>
        <span v-else class="bless-treetable__spacer" aria-hidden="true" />
        <slot :name="`tree-${treeCol}`" :row :value>{{ value }}</slot>
      </span>
    </template>
  </BlessTable>
</template>

<style>
.bless-treetable__cell {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  padding-inline-start: calc(var(--_d, 0) * var(--bless-space-6));
}
.bless-treetable__toggle,
.bless-treetable__spacer {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  flex: none;
}
.bless-treetable__toggle {
  border: 0;
  background: none;
  color: var(--bless-color-text-muted);
  font: inherit;
  font-size: var(--bless-text-md);
  cursor: pointer;
}
.bless-treetable__toggle > span {
  display: inline-block;
  transition: transform var(--bless-duration-base);
}
.bless-treetable__toggle[aria-expanded="true"] > span {
  transform: rotate(90deg);
}
.bless-treetable__toggle:focus-visible {
  outline: 2px solid var(--bless-color-accent);
}
</style>
