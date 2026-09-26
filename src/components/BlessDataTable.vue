<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, onMounted, ref, toRef, watch } from "vue";
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
    /** accessible name of the search box */
    searchLabel?: string;
    emptyText?: string;
    caption?: string;
    /** rows are one server page; sort / query / page are yours to fetch with (see `state` event) */
    server?: boolean;
    /** server mode: total row count */
    total?: number;
    loading?: boolean;
  }>(),
  {
    pageSize: 10,
    pageSizes: () => [10, 25, 50],
    searchPlaceholder: "Search…",
    searchLabel: "Search rows",
    emptyText: "No rows.",
  },
);
const emit = defineEmits<{
  "update:selected": [rows: T[]];
  rowClick: [row: T];
  state: [
    s: {
      sortKey: string | null;
      sortDir: "asc" | "desc";
      query: string;
      page: number;
      pageSize: number;
    },
  ];
}>();

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
  server: props.server,
  total: toRef(() => props.total ?? 0),
});
const { state } = dt;
// server mode: tell the consumer what to fetch whenever sort / query / page / size change.
// The first emit waits for mount so SSR output and hydration match (no fetching on the server).
const snapshot = () => ({
  sortKey: state.sortKey,
  sortDir: state.sortDir,
  query: state.query,
  page: state.page,
  pageSize: state.pageSize,
});
watch(
  () => [state.sortKey, state.sortDir, state.query, state.page, state.pageSize],
  () => props.server && emit("state", snapshot()),
);
onMounted(() => props.server && emit("state", snapshot()));
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
// a row checkbox is named after the row's header cell ("Select Megumi"), else its position
const headerKey = computed(() => props.columns.find((c) => c.header)?.key);
const rowName = (row: T, i: number) =>
  headerKey.value
    ? String(row[headerKey.value])
    : `row ${(state.page - 1) * state.pageSize + i + 1}`;

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
  <div class="bless-datatable" :class="{ 'bless-datatable--loading': loading }">
    <div class="bless-datatable__toolbar">
      <BlessInput
        v-if="searchable"
        v-model="state.query"
        type="search"
        size="sm"
        :placeholder="searchPlaceholder"
        :aria-label="searchLabel"
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
      <table class="bless-table bless-datatable__table" :aria-busy="loading || undefined">
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
                :aria-label="`Select ${rowName(row, i)}`"
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
      <BlessText size="xs" muted role="status">
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
  border-radius: var(--bless-radius);
  display: grid;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-datatable--loading tbody {
  opacity: 0.5;
  transition: opacity var(--bless-duration-base);
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
  margin-inline-start: auto;
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
/* hover is attention, not a choice: ink */
.bless-datatable__sort:hover {
  color: var(--bless-color-text);
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
  color: var(--bless-color-accent-text);
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
