<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref } from "vue";
import { useDataTable } from "../composables/useDataTable";
import BlessCheckbox from "./BlessCheckbox.vue";
import BlessDropdownMenu from "./BlessDropdownMenu.vue";
import BlessInput from "./BlessInput.vue";
import BlessPagination from "./BlessPagination.vue";
import BlessSelect from "./BlessSelect.vue";
import BlessText from "./BlessText.vue";
import type { BlessDataColumn } from "./table";
import type { BlessMenuItem } from "./menu";

defineOptions({ name: "BlessDataTable" });

const props = withDefaults(
  defineProps<{
    columns: BlessDataColumn<T>[];
    rows: T[];
    rowKey: keyof T & string;
    pageSize?: number;
    pageSizes?: number[];
    selectable?: boolean;
    searchable?: boolean;
    searchKeys?: (keyof T & string)[];
    searchPlaceholder?: string;
    emptyText?: string;
    caption?: string;
  }>(),
  {
    pageSize: 10,
    pageSizes: () => [10, 25, 50],
    searchPlaceholder: "Search…",
    emptyText: "No rows.",
  },
);
const emit = defineEmits<{ "update:selected": [rows: T[]]; rowClick: [row: T] }>();

const rowsRef = computed(() => props.rows);
const sizeOptions = computed(() =>
  [...new Set([props.pageSize, ...props.pageSizes])]
    .sort((a, b) => a - b)
    .map((n) => ({ value: n, label: `${n} / page` })),
);
const dt = useDataTable(rowsRef, {
  rowKey: props.rowKey,
  pageSize: props.pageSize,
  searchKeys: props.searchKeys,
});
const { state } = dt;
const visible = computed(() => props.columns.filter((c) => !state.hidden.has(c.key)));
const colMenu = computed<BlessMenuItem[]>(() => [
  { type: "label", label: "Columns" },
  ...props.columns
    .filter((c) => c.hideable !== false)
    .map((c) => ({ type: "checkbox" as const, label: c.label, value: c.key })),
]);
const colChecked = computed(() =>
  Object.fromEntries(props.columns.map((c) => [c.key, !state.hidden.has(c.key)])),
);
const selectAllRef = ref<InstanceType<typeof BlessCheckbox>>();

function onToggle(r: T) {
  dt.toggle(r);
  emit("update:selected", dt.selectedRows.value);
}
function onTogglePage() {
  dt.togglePage();
  emit("update:selected", dt.selectedRows.value);
}
defineExpose({ state, selectedRows: dt.selectedRows });
</script>

<template>
  <div class="bless-datatable">
    <div class="bless-datatable__toolbar">
      <BlessInput
        v-if="searchable"
        v-model="state.query"
        type="search"
        size="sm"
        :placeholder="searchPlaceholder"
        class="bless-datatable__search"
        @update:model-value="state.page = 1"
      />
      <slot name="toolbar" :state :selected="dt.selectedRows.value" />
      <BlessDropdownMenu
        :items="colMenu"
        :checked="colChecked"
        placement="bottom-end"
        class="bless-datatable__cols"
        @select="$event.type === 'checkbox' && dt.toggleColumn($event.value)"
      >
        <template #trigger
          ><button type="button" class="bless-datatable__cols-btn">Columns ▾</button></template
        >
      </BlessDropdownMenu>
    </div>

    <div class="bless-datatable__scroll">
      <table class="bless-table bless-datatable__table">
        <caption v-if="caption" class="bless-table__caption">
          {{
            caption
          }}
        </caption>
        <thead class="bless-table__head">
          <tr>
            <th v-if="selectable" scope="col" class="bless-table__th bless-datatable__check">
              <BlessCheckbox
                ref="selectAllRef"
                :model-value="dt.allPageSelected.value"
                :indeterminate="!dt.allPageSelected.value && dt.somePageSelected.value"
                aria-label="Select page"
                @update:model-value="onTogglePage"
              />
            </th>
            <th
              v-for="c in visible"
              :key="c.key"
              scope="col"
              class="bless-table__th"
              :class="[
                c.align && `bless-table__cell--${c.align}`,
                { 'bless-datatable__th--sortable': c.sortable },
              ]"
              :style="c.width ? { width: c.width } : undefined"
              :aria-sort="
                state.sortKey === c.key
                  ? state.sortDir === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : c.sortable
                    ? 'none'
                    : undefined
              "
            >
              <button
                v-if="c.sortable"
                type="button"
                class="bless-datatable__sort"
                @click="dt.sortBy(c.key)"
              >
                {{ c.label }}
                <span class="bless-datatable__sort-icon" aria-hidden="true">{{
                  state.sortKey === c.key ? (state.sortDir === "asc" ? "↑" : "↓") : "↕"
                }}</span>
              </button>
              <template v-else>{{ c.label }}</template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!dt.pageRows.value.length">
            <td
              :colspan="visible.length + (selectable ? 1 : 0)"
              class="bless-table__cell bless-datatable__empty"
            >
              {{ emptyText }}
            </td>
          </tr>
          <tr
            v-for="(row, i) in dt.pageRows.value"
            :key="String(dt.keyOf(row))"
            class="bless-table__row bless-datatable__row"
            :class="{ 'bless-datatable__row--selected': state.selected.has(dt.keyOf(row)) }"
            :aria-selected="selectable ? state.selected.has(dt.keyOf(row)) : undefined"
            @click="emit('rowClick', row)"
          >
            <td v-if="selectable" class="bless-table__cell bless-datatable__check" @click.stop>
              <BlessCheckbox
                :model-value="state.selected.has(dt.keyOf(row))"
                :aria-label="`Select row ${dt.keyOf(row)}`"
                @update:model-value="onToggle(row)"
              />
            </td>
            <component
              :is="c.header ? 'th' : 'td'"
              v-for="c in visible"
              :key="c.key"
              :scope="c.header ? 'row' : undefined"
              class="bless-table__cell"
              :class="c.align && `bless-table__cell--${c.align}`"
              :data-label="c.label"
            >
              <slot :name="`cell-${c.key}`" :row :value="row[c.key]" :index="i">{{
                row[c.key]
              }}</slot>
            </component>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bless-datatable__foot">
      <BlessText size="xs" muted>
        <template v-if="selectable && state.selected.size"
          >{{ state.selected.size }} selected ·
        </template>
        {{ dt.sorted.value.length }} rows
      </BlessText>
      <div class="bless-datatable__pager">
        <BlessSelect
          :model-value="state.pageSize"
          size="sm"
          aria-label="Rows per page"
          :options="sizeOptions"
          class="bless-datatable__size"
          @update:model-value="
            state.pageSize = Number($event);
            state.page = 1;
          "
        />
        <BlessPagination v-model="state.page" :total="dt.pageCount.value" :siblings="1" />
      </div>
    </div>
  </div>
</template>

<style>
.bless-datatable {
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-datatable__toolbar {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  flex-wrap: wrap;
}
.bless-datatable__search {
  width: 240px;
}
.bless-datatable__cols {
  margin-left: auto;
}
.bless-datatable__cols-btn {
  padding: var(--bless-space-2) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  cursor: pointer;
  transform: skewX(var(--bless-skew));
}
.bless-datatable__cols-btn:hover {
  border-color: var(--bless-color-text);
}
.bless-datatable__cols-btn:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-datatable__scroll {
  overflow-x: auto;
}
.bless-datatable__check {
  width: 36px;
}
.bless-datatable__sort {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  cursor: pointer;
}
.bless-datatable__sort:hover {
  color: var(--bless-color-accent);
}
.bless-datatable__sort:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-datatable__sort-icon {
  opacity: 0.4;
  font-size: var(--bless-text-2xs);
}
[aria-sort="ascending"] .bless-datatable__sort-icon,
[aria-sort="descending"] .bless-datatable__sort-icon {
  opacity: 1;
  color: var(--bless-color-accent);
}
.bless-datatable__row {
  transition: background var(--bless-duration-fast);
}
.bless-datatable__row:hover {
  background: var(--bless-color-surface);
}
.bless-datatable__row--selected {
  background: color-mix(in srgb, var(--bless-color-accent) 8%, transparent);
}
.bless-datatable__empty {
  text-align: center;
  color: var(--bless-color-text-muted);
  padding: var(--bless-space-8);
}
.bless-datatable__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-3);
  flex-wrap: wrap;
}
.bless-datatable__pager {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
}
.bless-datatable__size {
  width: 120px;
}
</style>
