<template>
  <div class="bless-datatable" :class="{ 'bless-datatable--loading': loading }">
    <div class="bless-datatable__toolbar">
      <BlessInput
        v-if="searchable"
        v-model="state.query"
        type="search"
        size="sm"
        :placeholder="searchPlaceholder"
        :aria-label="text.search"
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
          ><button type="button" class="bless-datatable__cols-btn">{{ text.columns }} ▾</button></template
        >
      </BlessDropdownMenu>
    </div>

    <!-- a box that scrolls sideways takes focus, so the keyboard can scroll it too -->
    <div
      ref="scrollEl"
      class="bless-datatable__scroll"
      :tabindex="overflows ? 0 : undefined"
      :role="overflows ? 'region' : undefined"
      :aria-label="overflows ? caption || text.table : undefined"
    >
      <table
        class="bless-table bless-datatable__table"
        :style="tableStyle"
        :aria-busy="loading || undefined"
      >
        <caption v-if="caption" class="bless-table__caption">
          {{ caption }}
        </caption>
        <thead class="bless-table__head">
          <tr ref="headRow">
            <th
              v-if="selectable"
              scope="col"
              class="bless-table__th bless-datatable__check"
              :class="hasStartPin && 'bless-datatable__pin bless-datatable__pin--start'"
              :data-key="CHECK"
            >
              <BlessCheckbox
                ref="selectAllRef"
                :model-value="dt.allPageSelected.value"
                :indeterminate="!dt.allPageSelected.value && dt.somePageSelected.value"
                :aria-label="text.selectPage"
                @update:model-value="onTogglePage"
              />
            </th>
            <th
              v-for="c in visible"
              :key="c.key"
              scope="col"
              class="bless-table__th"
              :class="[cellClass(c), { 'bless-datatable__th--sortable': c.sortable }]"
              :style="cellStyle(c, true)"
              :data-key="c.key"
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
              <span
                v-if="canResize(c)"
                role="separator"
                aria-orientation="vertical"
                tabindex="0"
                class="bless-datatable__resize"
                :aria-label="text.resize(c.label)"
                :aria-valuenow="Math.round(widths[c.key] ?? measured[c.key] ?? MIN)"
                :aria-valuemin="MIN"
                @pointerdown="onResizeStart(c, $event)"
                @keydown="onResizeKey(c, $event)"
                @click.stop
              />
            </th>
          </tr>
        </thead>
        <TransitionGroup
          tag="tbody"
          appear
          appear-active-class="bless-appear"
          enter-active-class="bless-arrive"
          move-class="bless-move"
          @leave="(_el: Element, done: () => void) => done()"
        >
          <tr v-if="!dt.pageRows.value.length" key="bless-empty">
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
            <td
              v-if="selectable"
              class="bless-table__cell bless-datatable__check"
              :class="hasStartPin && 'bless-datatable__pin bless-datatable__pin--start'"
              @click.stop
            >
              <BlessCheckbox
                :model-value="state.selected.has(dt.keyOf(row))"
                :aria-label="text.selectRow(rowName(row, i))"
                @update:model-value="onToggle(row)"
              />
            </td>
            <component
              :is="c.header ? 'th' : 'td'"
              v-for="c in visible"
              :key="c.key"
              :scope="c.header ? 'row' : undefined"
              class="bless-table__cell"
              :class="cellClass(c)"
              :style="c.pin ? cellStyle(c) : undefined"
              :data-label="c.label"
            >
              <slot :name="`cell-${c.key}`" :row :value="row[c.key]" :index="i">{{
                row[c.key]
              }}</slot>
            </component>
          </tr>
        </TransitionGroup>
      </table>
    </div>

    <div class="bless-datatable__foot">
      <BlessText size="xs" muted role="status">
        <template v-if="selectable && state.selected.size"
          >{{ text.selected(state.selected.size) }} ·
        </template>
        {{ text.rows(dt.sorted.value.length) }}
      </BlessText>
      <div class="bless-datatable__pager">
        <BlessSelect
          :model-value="state.pageSize"
          size="sm"
          :aria-label="text.rowsPerPage"
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

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, onBeforeUnmount, onMounted, ref, toRef, watch, watchPostEffect } from "vue";
import { logicalKey } from "../composables/rtl";
import { useDataTable } from "../composables/useDataTable";
import { useLabelPack } from "../composables/useLabels";
import BlessCheckbox from "./BlessCheckbox.vue";
import BlessDropdownMenu from "./BlessDropdownMenu.vue";
import BlessInput from "./BlessInput.vue";
import BlessPagination from "./BlessPagination.vue";
import BlessSelect from "./BlessSelect.vue";
import BlessText from "./BlessText.vue";
import type { BlessDataColumn } from "./table";
import type { BlessMenuItem } from "./menu";

defineOptions({ name: "BlessDataTable" });
const pack = useLabelPack("BlessDataTable");

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
    /** names of the select-page checkbox and the page-size select */
    labels?: Partial<{
      search: string;
      selectPage: string;
      rowsPerPage: string;
      selectRow: (name: string) => string;
      resize: (column: string) => string;
      /** the name of the scroll box when the table scrolls sideways (falls back from `caption`) */
      table: string;
      columns: string;
      rows: (n: number) => string;
      selected: (n: number) => string;
    }>;
    emptyText?: string;
    caption?: string;
    /** rows are one server page; sort / query / page are yours to fetch with (see `state` event) */
    server?: boolean;
    /** server mode: total row count */
    total?: number;
    loading?: boolean;
    /** drag the edge of a header, or focus it and press ←/→, to change a column's width */
    resizable?: boolean;
  }>(),
  {
    pageSize: 10,
    pageSizes: () => [10, 25, 50],
    searchPlaceholder: "Search…",
    emptyText: "No rows.",
  },
);
const text = computed(() => ({
  search: "Search rows",
  selectPage: "Select page",
  rowsPerPage: "Rows per page",
  selectRow: (n: string) => `Select ${n}`,
  resize: (c: string) => `Resize ${c}`,
  table: "Table",
  columns: "Columns",
  rows: (n: number) => `${n} rows`,
  selected: (n: number) => `${n} selected`,
  ...pack(),
  ...props.labels,
}));
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
/** column widths in px, set by resizing; bind it to keep them */
const widths = defineModel<Record<string, number>>("widths", { default: () => ({}) });
const shown = computed(() => props.columns.filter((c) => !state.hidden.has(c.key)));
// pinned columns move to their side, so the sticky offsets add up from the edge
const visible = computed(() => [
  ...shown.value.filter((c) => c.pin === "start"),
  ...shown.value.filter((c) => !c.pin),
  ...shown.value.filter((c) => c.pin === "end"),
]);

// ── pinning: sticky cells, offset by the measured widths of the pinned cells before them
const CHECK = "__check";
const headRow = ref<HTMLTableRowElement>();
const measured = ref<Record<string, number>>({});
let ro: ResizeObserver | undefined;
onMounted(() => {
  if (typeof ResizeObserver === "undefined") return;
  ro = new ResizeObserver((entries) => {
    const m = { ...measured.value };
    for (const e of entries)
      m[(e.target as HTMLElement).dataset.key!] = (e.target as HTMLElement).offsetWidth;
    measured.value = m;
  });
  watchPostEffect(() => {
    ro!.disconnect();
    headRow.value?.querySelectorAll<HTMLElement>("th[data-key]").forEach((th) => ro!.observe(th));
  });
});
onBeforeUnmount(() => ro?.disconnect());

// ── sideways scroll: the box is a focusable region only while it overflows
const scrollEl = ref<HTMLElement>();
const overflows = ref(false);
let scrollRo: ResizeObserver | undefined;
const measureOverflow = () => {
  const el = scrollEl.value;
  overflows.value = !!el && el.scrollWidth > el.clientWidth + 1;
};
onMounted(() => {
  measureOverflow();
  if (typeof ResizeObserver === "undefined" || !scrollEl.value) return;
  scrollRo = new ResizeObserver(measureOverflow);
  scrollRo.observe(scrollEl.value);
  const table = scrollEl.value.querySelector("table");
  if (table) scrollRo.observe(table);
});
onBeforeUnmount(() => scrollRo?.disconnect());
const hasStartPin = computed(() => visible.value.some((c) => c.pin === "start"));
const sizeOf = (key: string) => widths.value[key] ?? measured.value[key] ?? 0;
const pinOffset = (c: BlessDataColumn<T>) => {
  const side = visible.value.filter((v) => v.pin === c.pin);
  const before =
    c.pin === "start" ? side.slice(0, side.indexOf(c)) : side.slice(side.indexOf(c) + 1);
  const extra = c.pin === "start" && props.selectable ? sizeOf(CHECK) : 0;
  return before.reduce((n, v) => n + sizeOf(v.key), extra);
};
const cellClass = (c: BlessDataColumn<T>) => [
  c.align && `bless-table__cell--${c.align}`,
  c.pin && `bless-datatable__pin bless-datatable__pin--${c.pin}`,
  {
    "bless-datatable__pin--edge":
      (c.pin === "start" && visible.value.filter((v) => v.pin === "start").at(-1) === c) ||
      (c.pin === "end" && visible.value.find((v) => v.pin === "end") === c),
  },
];
const cellStyle = (c: BlessDataColumn<T>, head = false) => {
  const w = widths.value[c.key] ? `${widths.value[c.key]}px` : c.width;
  return {
    ...(head && w ? { width: w } : {}),
    ...(c.pin === "start" ? { insetInlineStart: `${pinOffset(c)}px` } : {}),
    ...(c.pin === "end" ? { insetInlineEnd: `${pinOffset(c)}px` } : {}),
  };
};

// ── resizing: the first resize records every width, then the layout is fixed so widths hold
const MIN = 48;
const STEP = 16;
const canResize = (c: BlessDataColumn<T>) => props.resizable && c.resizable !== false;
const fixed = computed(
  () => props.resizable && visible.value.every((c) => widths.value[c.key] !== undefined),
);
const tableStyle = computed(() =>
  fixed.value
    ? {
        tableLayout: "fixed" as const,
        width: `${visible.value.reduce((n, c) => n + widths.value[c.key]!, props.selectable ? sizeOf(CHECK) : 0)}px`,
      }
    : undefined,
);
function setWidth(key: string, px: number) {
  const all = { ...widths.value };
  // freeze the others at their current size, so one column changes and the rest stay put
  headRow.value?.querySelectorAll<HTMLElement>("th[data-key]").forEach((th) => {
    const k = th.dataset.key!;
    if (k !== CHECK && all[k] === undefined) all[k] = th.offsetWidth;
  });
  all[key] = Math.max(MIN, Math.round(px));
  widths.value = all;
}
const thWidth = (e: Event) =>
  ((e.currentTarget as HTMLElement).parentElement as HTMLElement).offsetWidth;
function onResizeKey(c: BlessDataColumn<T>, e: KeyboardEvent) {
  const k = logicalKey(e);
  if (k !== "ArrowRight" && k !== "ArrowLeft") return;
  e.preventDefault();
  setWidth(c.key, (widths.value[c.key] ?? thWidth(e)) + (k === "ArrowRight" ? STEP : -STEP));
}
function onResizeStart(c: BlessDataColumn<T>, e: PointerEvent) {
  e.preventDefault();
  const handle = e.currentTarget as HTMLElement;
  const start = widths.value[c.key] ?? thWidth(e);
  const x0 = e.clientX;
  const dir = getComputedStyle(handle).direction === "rtl" ? -1 : 1;
  handle.setPointerCapture?.(e.pointerId);
  const move = (m: PointerEvent) => setWidth(c.key, start + dir * (m.clientX - x0));
  const up = () => {
    handle.removeEventListener("pointermove", move);
    handle.removeEventListener("pointerup", up);
    handle.removeEventListener("pointercancel", up);
  };
  handle.addEventListener("pointermove", move);
  handle.addEventListener("pointerup", up);
  handle.addEventListener("pointercancel", up);
}
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
  text-transform: var(--bless-label-case);
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
.bless-datatable__scroll:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-datatable__check {
  width: 36px;
}
/* pinned: sticky, opaque, so the cells that scroll under it do not show through */
.bless-datatable__pin {
  position: sticky;
  z-index: 1;
  background: var(--bless-color-bg);
}
.bless-datatable__check.bless-datatable__pin--start {
  inset-inline-start: 0;
}
.bless-datatable__pin--edge.bless-datatable__pin--start {
  border-inline-end: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-datatable__pin--edge.bless-datatable__pin--end {
  border-inline-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-datatable__row:hover > .bless-datatable__pin {
  background: var(--bless-color-surface);
}
.bless-datatable__row--selected > .bless-datatable__pin {
  background: color-mix(in srgb, var(--bless-color-accent) 8%, var(--bless-color-bg));
}
.bless-datatable__table th {
  position: relative;
}
.bless-datatable__table th.bless-datatable__pin {
  position: sticky;
}
.bless-datatable__table[style*="fixed"] :is(th, td) {
  overflow: hidden;
  text-overflow: ellipsis;
}
.bless-datatable__resize {
  position: absolute;
  inset-block: 0;
  inset-inline-end: -4px;
  z-index: 2;
  width: 8px;
  cursor: col-resize;
  touch-action: none;
}
.bless-datatable__resize::after {
  content: "";
  position: absolute;
  inset-block: 20%;
  inset-inline-start: 3px;
  width: 2px;
  background: var(--bless-color-border);
}
.bless-datatable__resize:hover::after {
  background: var(--bless-color-text);
}
.bless-datatable__resize:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
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
