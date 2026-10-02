<script lang="ts">
export interface BlessKanbanColumn<T = unknown> {
  id: string;
  title: string;
  items: T[];
  /** most cards the column takes; a full column refuses drops */
  limit?: number;
}
</script>

<script setup lang="ts" generic="T">
import { nextTick, ref, useId } from "vue";
import { logicalKey } from "../composables/rtl";

defineOptions({ name: "BlessKanban" });

defineProps<{
  rowKey?: (item: T) => string | number;
  label?: string;
}>();
const model = defineModel<BlessKanbanColumn<T>[]>({ default: () => [] });
const emit = defineEmits<{
  move: [item: T, from: { column: string; index: number }, to: { column: string; index: number }];
}>();

const root = ref<HTMLElement>();
const live = ref("");
const hint = `${useId()}-hint`;
const drag = ref<{ col: number; index: number } | null>(null);
/** where a drop would land: column, and the slot before which the card goes */
const over = ref<{ col: number; index: number } | null>(null);
const held = ref<{ col: number; index: number } | null>(null);
let snapshot: BlessKanbanColumn<T>[] = [];
let origin = { col: 0, index: 0 };

const full = (col: number, from: number) => {
  const c = model.value[col]!;
  return col !== from && c.limit != null && c.items.length >= c.limit;
};
/** card `index` of column `from` goes to column `to`, landing at `at` (a slot index after removal) */
function relocate(from: number, index: number, to: number, at: number) {
  const next = model.value.map((c) => ({ ...c, items: c.items.slice() }));
  const [item] = next[from]!.items.splice(index, 1);
  next[to]!.items.splice(at, 0, item!);
  model.value = next;
  emit(
    "move",
    item!,
    { column: model.value[from]!.id, index },
    { column: model.value[to]!.id, index: at },
  );
}

// --- pointer ---
function colAt(x: number, y: number) {
  for (const el of document.elementsFromPoint(x, y)) {
    const c = (el as HTMLElement).closest?.("[data-kanban-col]");
    if (c && root.value?.contains(c)) return c as HTMLElement;
  }
  return null;
}
function track(e: PointerEvent) {
  if (!drag.value) return;
  const el = colAt(e.clientX, e.clientY);
  if (!el) return void (over.value = null);
  const col = Number(el.dataset.kanbanCol);
  if (full(col, drag.value.col)) return void (over.value = null);
  const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-kanban-card]"));
  const slot = cards.filter((c) => {
    const r = c.getBoundingClientRect();
    return r.top + r.height / 2 < e.clientY;
  }).length;
  over.value = { col, index: slot };
}
function grab(col: number, index: number, e: PointerEvent) {
  if (e.button) return;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  drag.value = { col, index };
  over.value = { col, index };
}
function drop() {
  const d = drag.value;
  const o = over.value;
  drag.value = over.value = null;
  if (!d || !o) return;
  // inserting below the card's own old position shifts everything up by one
  const at = o.col === d.col && o.index > d.index ? o.index - 1 : o.index;
  if (o.col === d.col && at === d.index) return;
  relocate(d.col, d.index, o.col, at);
  live.value = `Moved to ${model.value[o.col]!.title}, position ${at + 1} of ${model.value[o.col]!.items.length}`;
}
const cancel = () => (drag.value = over.value = null);

// --- keyboard ---
const refocus = (col: number, index: number) =>
  nextTick(() => root.value?.querySelector<HTMLElement>(`[data-grip="${col}:${index}"]`)?.focus());

function step(c: number, i: number, to: number, at: number) {
  const n = model.value.length;
  if (to < 0 || to >= n) return;
  if (full(to, c)) {
    live.value = `${model.value[to]!.title} is full`;
    return;
  }
  const len = model.value[to]!.items.length - (to === c ? 1 : 0);
  at = Math.min(Math.max(at, 0), len);
  if (to === c && at === i) return;
  relocate(c, i, to, at);
  held.value = { col: to, index: at };
  live.value = `${model.value[to]!.title}, position ${at + 1} of ${model.value[to]!.items.length}`;
  refocus(to, at);
}
function onKey(c: number, i: number, e: KeyboardEvent) {
  const k = logicalKey(e);
  const h = held.value;
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    if (!h) {
      held.value = { col: c, index: i };
      origin = { col: c, index: i };
      snapshot = model.value.map((x) => ({ ...x, items: x.items.slice() }));
      live.value = `Grabbed. Up and down move it in the column, left and right to another column, Space drops it, Escape cancels.`;
    } else {
      held.value = null;
      live.value = `Dropped in ${model.value[c]!.title}, position ${i + 1}`;
    }
  } else if (e.key === "Escape" && h) {
    e.preventDefault();
    model.value = snapshot;
    held.value = null;
    live.value = "Cancelled, order restored";
    refocus(origin.col, origin.index);
  } else if (h) {
    if (k === "ArrowUp") (e.preventDefault(), step(c, i, c, i - 1));
    else if (k === "ArrowDown") (e.preventDefault(), step(c, i, c, i + 1));
    else if (k === "ArrowLeft") (e.preventDefault(), step(c, i, c - 1, i));
    else if (k === "ArrowRight") (e.preventDefault(), step(c, i, c + 1, i));
  }
}
const release = () =>
  requestAnimationFrame(() => {
    if (held.value && !root.value?.contains(document.activeElement)) held.value = null;
  });
const mark = (c: number, i: number) => {
  const o = over.value;
  if (!o || o.col !== c || !drag.value) return null;
  return o.index === i ? "before" : null;
};
const endMark = (c: number) =>
  over.value?.col === c && drag.value && over.value.index >= model.value[c]!.items.length;
</script>

<template>
  <div ref="root" class="bless-kanban" role="group" :aria-label="label ?? 'Board'">
    <section
      v-for="(col, c) in model"
      :key="col.id"
      class="bless-kanban__col"
      :class="{ 'bless-kanban__col--full': col.limit != null && col.items.length >= col.limit }"
      :data-kanban-col="c"
      :aria-label="col.title"
    >
      <header class="bless-kanban__head">
        <slot name="header" :column="col">
          <h3 class="bless-kanban__title">{{ col.title }}</h3>
        </slot>
        <span class="bless-kanban__count"
          >{{ col.items.length
          }}<template v-if="col.limit != null"> / {{ col.limit }}</template></span
        >
      </header>
      <ul class="bless-kanban__list" role="list" :class="{ 'bless-kanban__list--end': endMark(c) }">
        <li
          v-for="(item, i) in col.items"
          :key="rowKey ? rowKey(item) : i"
          data-kanban-card
          class="bless-kanban__card"
          :class="[
            {
              'bless-kanban__card--drag': drag?.col === c && drag.index === i,
              'bless-kanban__card--held': held?.col === c && held.index === i,
            },
            mark(c, i) && `bless-kanban__card--${mark(c, i)}`,
          ]"
        >
          <button
            type="button"
            class="bless-kanban__grip"
            :data-grip="`${c}:${i}`"
            :aria-label="`Move card ${i + 1} of ${col.title}`"
            aria-roledescription="sortable card"
            :aria-pressed="held?.col === c && held.index === i"
            :aria-describedby="hint"
            @pointerdown="grab(c, i, $event)"
            @pointermove="track"
            @pointerup="drop"
            @pointercancel="cancel"
            @keydown="onKey(c, i, $event)"
            @blur="release"
          >
            <span aria-hidden="true">⋮⋮</span>
          </button>
          <div class="bless-kanban__body">
            <slot name="card" :item :column="col" :index="i">{{ item }}</slot>
          </div>
        </li>
      </ul>
    </section>
    <span :id="hint" hidden
      >Press Space to grab a card. Up and down move it in its column, left and right to another
      column. Space drops it, Escape cancels.</span
    >
    <span class="bless-kanban__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-kanban {
  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(220px, 1fr);
  gap: var(--bless-space-3);
  align-items: start;
  overflow-x: auto;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-kanban__col {
  min-width: 0;
  padding: var(--bless-space-2);
  background: var(--bless-color-surface);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-kanban__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--bless-space-2);
  padding: var(--bless-space-1) var(--bless-space-1) var(--bless-space-2);
}
.bless-kanban__title {
  margin: 0;
  font-size: var(--bless-text-sm);
  font-weight: 600;
}
.bless-kanban__count {
  color: var(--bless-color-text-muted);
  font-size: var(--bless-text-xs);
}
.bless-kanban__col--full .bless-kanban__count {
  color: var(--bless-color-danger-text);
}
.bless-kanban__list {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0 0 var(--bless-space-3);
  list-style: none;
  min-height: 2rem;
}
.bless-kanban__list--end {
  box-shadow: inset 0 -2px 0 var(--bless-color-accent);
}
.bless-kanban__card {
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2);
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-kanban__card--drag {
  opacity: 0.4;
}
.bless-kanban__card--held {
  border-color: var(--bless-color-accent);
}
.bless-kanban__card--before {
  box-shadow: 0 -5px 0 -3px var(--bless-color-accent);
  border-top-color: var(--bless-color-accent);
}
.bless-kanban__grip {
  flex: none;
  padding: 0 var(--bless-space-1);
  border: 0;
  background: transparent;
  color: var(--bless-color-text-muted);
  font: inherit;
  letter-spacing: -3px;
  cursor: grab;
  touch-action: none;
}
.bless-kanban__grip:active {
  cursor: grabbing;
}
.bless-kanban__grip:focus-visible {
  outline: 2px solid var(--bless-color-accent);
}
.bless-kanban__body {
  flex: 1;
  min-width: 0;
}
.bless-kanban__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
