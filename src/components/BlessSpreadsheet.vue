<script lang="ts">
/** The name of a column as in a spreadsheet app: A … Z, AA, AB … */
export function columnName(i: number): string {
  let s = "";
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26))
    s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}
/** Text copied from a spreadsheet app (tabs between cells, new lines between rows) as rows of cells. */
export function parseTsv(text: string): string[][] {
  const rows = text.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n");
  return rows.map((r) => r.split("\t"));
}
</script>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";

defineOptions({ name: "BlessSpreadsheet" });

const props = withDefaults(
  defineProps<{
    /** the names over the columns; default: A, B, C … */
    columns?: string[];
    /** at least this many columns, for an empty sheet */
    minColumns?: number;
    readonly?: boolean;
    /** names the grid for screen readers */
    label?: string;
  }>(),
  { minColumns: 0, label: "Spreadsheet" },
);
/** the cells, row by row, as text */
const rows = defineModel<string[][]>({ default: () => [] });

const colCount = computed(() =>
  Math.max(props.minColumns, props.columns?.length ?? 0, ...rows.value.map((r) => r.length), 1),
);
const heads = computed(() =>
  Array.from({ length: colCount.value }, (_, i) => props.columns?.[i] ?? columnName(i)),
);
const value = (r: number, c: number) => rows.value[r]?.[c] ?? "";
const numeric = (v: string) => v.trim() !== "" && !Number.isNaN(Number(v.replace(/,/g, "")));

// the active cell, and the other corner of the selection
const at = ref({ r: 0, c: 0 });
const anchor = ref({ r: 0, c: 0 });
const range = computed(() => ({
  r0: Math.min(at.value.r, anchor.value.r),
  r1: Math.max(at.value.r, anchor.value.r),
  c0: Math.min(at.value.c, anchor.value.c),
  c1: Math.max(at.value.c, anchor.value.c),
}));
const inRange = (r: number, c: number) =>
  r >= range.value.r0 && r <= range.value.r1 && c >= range.value.c0 && c <= range.value.c1;

const table = ref<HTMLTableElement>();
const focusCell = () =>
  nextTick(() =>
    table.value
      ?.querySelector<HTMLElement>(`[data-cell="${at.value.r}:${at.value.c}"]`)
      ?.focus({ preventScroll: false }),
  );
function go(r: number, c: number, extend = false) {
  at.value = {
    r: Math.min(Math.max(0, r), Math.max(0, rows.value.length - 1)),
    c: Math.min(Math.max(0, c), colCount.value - 1),
  };
  if (!extend) anchor.value = { ...at.value };
  focusCell();
}

/** writes a block of text into the sheet from a corner; new rows come at the end when needed */
function write(r0: number, c0: number, block: string[][], addRow = false) {
  const next = rows.value.map((r) => [...r]);
  block.forEach((line, i) =>
    line.forEach((v, j) => {
      const c = c0 + j;
      if (c >= colCount.value) return;
      const row = (next[r0 + i] ??= []);
      while (row.length < c) row.push("");
      row[c] = v;
    }),
  );
  // one write only: the model updates through the parent, so a second write would start from the old rows
  rows.value = addRow ? [...next, []] : next;
  return next.length + (addRow ? 1 : 0);
}

const editing = ref(false);
const draft = ref("");
function edit(start?: string) {
  if (props.readonly) return;
  editing.value = true;
  draft.value = start ?? value(at.value.r, at.value.c);
  nextTick(() => table.value?.querySelector<HTMLInputElement>(".bless-spreadsheet__input")?.focus());
}
function commit(dr: number, dc: number) {
  if (!editing.value) return;
  // Enter on the last row adds a row, as in a spreadsheet app
  const count = write(
    at.value.r,
    at.value.c,
    [[draft.value]],
    dr > 0 && at.value.r + dr >= rows.value.length,
  );
  editing.value = false;
  at.value = {
    r: Math.min(Math.max(0, at.value.r + dr), count - 1),
    c: Math.min(Math.max(0, at.value.c + dc), colCount.value - 1),
  };
  anchor.value = { ...at.value };
  focusCell();
}
function cancel() {
  editing.value = false;
  focusCell();
}
function clear() {
  if (props.readonly) return;
  const { r0, r1, c0, c1 } = range.value;
  write(
    r0,
    c0,
    Array.from({ length: r1 - r0 + 1 }, () => Array(c1 - c0 + 1).fill("")),
  );
}

function onKey(e: KeyboardEvent) {
  if (editing.value) return;
  const { r, c } = at.value;
  const mod = e.ctrlKey || e.metaKey;
  const moves: Record<string, [number, number]> = {
    ArrowUp: [r - 1, c],
    ArrowDown: [r + 1, c],
    ArrowLeft: [r, c - 1],
    ArrowRight: [r, c + 1],
    Home: mod ? [0, 0] : [r, 0],
    End: mod ? [rows.value.length - 1, colCount.value - 1] : [r, colCount.value - 1],
  };
  const m = moves[e.key];
  if (m) {
    e.preventDefault();
    const rtl = getComputedStyle(table.value!).direction === "rtl";
    if (rtl && (e.key === "ArrowLeft" || e.key === "ArrowRight")) m[1] = c - (m[1] - c);
    go(m[0], m[1], e.shiftKey);
  } else if (e.key === "Tab") {
    if (c + (e.shiftKey ? -1 : 1) < 0 || c + (e.shiftKey ? -1 : 1) >= colCount.value) return;
    e.preventDefault();
    go(r, c + (e.shiftKey ? -1 : 1));
  } else if (e.key === "Enter" || e.key === "F2") {
    e.preventDefault();
    edit();
  } else if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault();
    clear();
  } else if (e.key.length === 1 && !mod && !e.altKey) {
    // typing on a cell replaces its text, as in a spreadsheet app
    e.preventDefault();
    edit(e.key);
  }
}
function onEditKey(e: KeyboardEvent) {
  if (e.key === "Enter") (e.preventDefault(), commit(e.shiftKey ? -1 : 1, 0));
  else if (e.key === "Tab") (e.preventDefault(), commit(0, e.shiftKey ? -1 : 1));
  else if (e.key === "Escape") (e.preventDefault(), cancel());
}

function selectedTsv() {
  const { r0, r1, c0, c1 } = range.value;
  const out: string[] = [];
  for (let r = r0; r <= r1; r++) {
    const line: string[] = [];
    for (let c = c0; c <= c1; c++) line.push(value(r, c));
    out.push(line.join("\t"));
  }
  return out.join("\n");
}
function onCopy(e: ClipboardEvent, cut = false) {
  if (editing.value) return;
  e.preventDefault();
  e.clipboardData?.setData("text/plain", selectedTsv());
  if (cut) clear();
}
function onPaste(e: ClipboardEvent) {
  if (editing.value || props.readonly) return;
  const text = e.clipboardData?.getData("text/plain");
  if (!text) return;
  e.preventDefault();
  const block = parseTsv(text);
  const count = write(range.value.r0, range.value.c0, block);
  anchor.value = { r: range.value.r0, c: range.value.c0 };
  at.value = {
    r: Math.min(anchor.value.r + block.length - 1, count - 1),
    c: Math.min(anchor.value.c + Math.max(...block.map((l) => l.length)) - 1, colCount.value - 1),
  };
}
function onDown(e: PointerEvent, r: number, c: number) {
  if (editing.value) commit(0, 0);
  go(r, c, e.shiftKey);
}
</script>

<template>
  <div class="bless-spreadsheet">
    <table
      ref="table"
      class="bless-spreadsheet__table"
      role="grid"
      :aria-label="label"
      :aria-rowcount="rows.length + 1"
      :aria-colcount="colCount + 1"
      :aria-readonly="readonly || undefined"
      :aria-multiselectable="true"
      @keydown="onKey"
      @copy="onCopy"
      @cut="(e) => onCopy(e, !readonly)"
      @paste="onPaste"
    >
      <thead>
        <tr>
          <td class="bless-spreadsheet__corner" />
          <th v-for="(h, c) in heads" :key="c" scope="col" class="bless-spreadsheet__col">{{ h }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(_, r) in rows" :key="r">
          <th scope="row" class="bless-spreadsheet__row">{{ r + 1 }}</th>
          <td
            v-for="c in colCount"
            :key="c"
            role="gridcell"
            class="bless-spreadsheet__cell"
            :class="{
              'is-active': at.r === r && at.c === c - 1,
              'is-number': numeric(value(r, c - 1)),
            }"
            :data-cell="`${r}:${c - 1}`"
            :tabindex="at.r === r && at.c === c - 1 ? 0 : -1"
            :aria-selected="inRange(r, c - 1)"
            @pointerdown="onDown($event, r, c - 1)"
            @dblclick="edit()"
          >
            <input
              v-if="editing && at.r === r && at.c === c - 1"
              v-model="draft"
              class="bless-spreadsheet__input"
              :aria-label="`${heads[c - 1]}${r + 1}`"
              @keydown.stop="onEditKey"
              @blur="commit(0, 0)"
            />
            <template v-else>{{ value(r, c - 1) }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.bless-spreadsheet {
  max-inline-size: 100%;
  overflow: auto;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-spreadsheet__table {
  border-collapse: collapse;
  table-layout: fixed;
}
.bless-spreadsheet__table th,
.bless-spreadsheet__table td {
  block-size: 2rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-spreadsheet__col,
.bless-spreadsheet__row,
.bless-spreadsheet__corner {
  background: var(--bless-color-surface-2);
  color: var(--bless-color-text);
  font-size: var(--bless-text-xs);
  font-weight: normal;
}
.bless-spreadsheet__col {
  min-inline-size: var(--bless-spreadsheet-column, 7.5rem);
}
.bless-spreadsheet__row {
  inline-size: 2.5rem;
  font-variant-numeric: tabular-nums;
}
.bless-spreadsheet__cell {
  position: relative;
  max-inline-size: var(--bless-spreadsheet-column, 7.5rem);
  padding: 0 var(--bless-space-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: cell;
  outline: none;
  user-select: none;
}
.bless-spreadsheet__cell.is-number {
  font-variant-numeric: tabular-nums;
  text-align: end;
}
.bless-spreadsheet__cell[aria-selected="true"] {
  background: color-mix(in srgb, var(--bless-color-accent) 16%, var(--bless-color-bg));
}
/* the active cell has a thick frame, and a focus ring when the grid has the focus */
.bless-spreadsheet__cell.is-active {
  box-shadow: inset 0 0 0 2px var(--bless-color-accent);
}
.bless-spreadsheet__cell.is-active:focus-visible {
  box-shadow: inset 0 0 0 3px var(--bless-color-accent);
}
.bless-spreadsheet__input {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  padding: 0 var(--bless-space-2);
  border: 0;
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
</style>
