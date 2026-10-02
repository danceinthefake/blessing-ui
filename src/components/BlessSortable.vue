<script setup lang="ts" generic="T">
import { nextTick, ref, useId } from "vue";
import { logicalKey } from "../composables/rtl";
import { moveItem, useSortable } from "../composables/useSortable";

defineOptions({ name: "BlessSortable" });

withDefaults(
  defineProps<{
    rowKey?: (item: T, index: number) => string | number;
    label?: string;
    /** lay the items out in this many equal columns (a grid); 1 is a list */
    columns?: number;
  }>(),
  { label: "Sortable", columns: 1 },
);
const model = defineModel<T[]>({ default: () => [] });
const emit = defineEmits<{ move: [from: number, to: number] }>();

const root = ref<HTMLElement>();
const live = ref("");
const hint = `${useId()}-hint`;
/** index of the item grabbed by keyboard, and the order to restore on Esc */
const held = ref<number | null>(null);
let snapshot: T[] = [];
let origin = 0;

function move(from: number, to: number) {
  if (from === to || to < 0 || to >= model.value.length) return;
  model.value = moveItem(model.value, from, to);
  emit("move", from, to);
  live.value = `Moved to position ${to + 1} of ${model.value.length}`;
}
const sortable = useSortable(root, move);
const { drag, over } = sortable;

const grips = () => root.value?.querySelectorAll<HTMLElement>(".bless-sortable__grip") ?? [];
const refocus = (i: number) => nextTick(() => grips()[i]?.focus());

function onKey(i: number, e: KeyboardEvent) {
  const k = logicalKey(e);
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    if (held.value == null) {
      held.value = i;
      snapshot = model.value.slice();
      origin = i;
      live.value = `Grabbed item ${i + 1} of ${model.value.length}. Arrow keys move it, Space drops it, Escape cancels.`;
    } else {
      live.value = `Dropped at position ${held.value + 1} of ${model.value.length}`;
      held.value = null;
    }
  } else if (e.key === "Escape" && held.value != null) {
    e.preventDefault();
    model.value = snapshot;
    held.value = null;
    live.value = "Cancelled, order restored";
    refocus(origin);
  } else if (held.value != null) {
    const d =
      k === "ArrowUp" || k === "ArrowLeft" ? -1 : k === "ArrowDown" || k === "ArrowRight" ? 1 : 0;
    if (!d) return;
    e.preventDefault();
    move(held.value, held.value + d);
    held.value = Math.min(Math.max(held.value + d, 0), model.value.length - 1);
    refocus(held.value);
  }
}
// a moved row can blur for a frame; only let go once focus really left the list
const release = () =>
  requestAnimationFrame(() => {
    if (held.value != null && !root.value?.contains(document.activeElement)) held.value = null;
  });
const side = (i: number) =>
  over.value === i && drag.value != null && drag.value !== i
    ? i > drag.value
      ? "after"
      : "before"
    : null;
</script>

<template>
  <div ref="root" class="bless-sortable">
    <ul
      class="bless-sortable__list"
      role="list"
      :aria-label="label"
      :style="columns > 1 ? { '--bless-sortable-cols': columns } : undefined"
      :class="{ 'bless-sortable__list--grid': columns > 1 }"
    >
      <li
        v-for="(item, i) in model"
        :key="rowKey ? rowKey(item, i) : i"
        data-sortable-item
        class="bless-sortable__item"
        :class="[
          { 'bless-sortable__item--drag': drag === i, 'bless-sortable__item--held': held === i },
          side(i) && `bless-sortable__item--${side(i)}`,
        ]"
      >
        <button
          type="button"
          class="bless-sortable__grip"
          :aria-label="`Reorder item ${i + 1}`"
          aria-roledescription="sortable item"
          :aria-pressed="held === i"
          :aria-describedby="hint"
          @pointerdown="sortable.grab(i, $event)"
          @pointermove="sortable.track"
          @pointerup="sortable.drop"
          @pointercancel="sortable.cancel"
          @keydown="onKey(i, $event)"
          @blur="release"
        >
          <span aria-hidden="true">⋮⋮</span>
        </button>
        <span class="bless-sortable__body"
          ><slot :item :index="i">{{ item }}</slot></span
        >
      </li>
    </ul>
    <span :id="hint" hidden
      >Press Space to grab, arrow keys to move, Space to drop, Escape to cancel.</span
    >
    <span class="bless-sortable__live" aria-live="polite">{{ live }}</span>
  </div>
</template>

<style>
.bless-sortable {
  position: relative;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-sortable__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--bless-space-2);
}
.bless-sortable__list--grid {
  grid-template-columns: repeat(var(--bless-sortable-cols), minmax(0, 1fr));
}
.bless-sortable__item {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
}
.bless-sortable__item--drag {
  opacity: 0.4;
}
.bless-sortable__item--held {
  border-color: var(--bless-color-accent);
}
.bless-sortable__item--before {
  box-shadow: inset 0 2px 0 var(--bless-color-accent);
}
.bless-sortable__item--after {
  box-shadow: inset 0 -2px 0 var(--bless-color-accent);
}
.bless-sortable__list--grid .bless-sortable__item--before {
  box-shadow: inset 2px 0 0 var(--bless-color-accent);
}
.bless-sortable__list--grid .bless-sortable__item--after {
  box-shadow: inset -2px 0 0 var(--bless-color-accent);
}
[dir="rtl"] .bless-sortable__list--grid .bless-sortable__item--before {
  box-shadow: inset -2px 0 0 var(--bless-color-accent);
}
[dir="rtl"] .bless-sortable__list--grid .bless-sortable__item--after {
  box-shadow: inset 2px 0 0 var(--bless-color-accent);
}
.bless-sortable__grip {
  flex: none;
  padding: var(--bless-space-1) var(--bless-space-2);
  border: 0;
  background: transparent;
  color: var(--bless-color-text-muted);
  font: inherit;
  letter-spacing: -3px;
  cursor: grab;
  touch-action: none;
}
.bless-sortable__grip:active {
  cursor: grabbing;
}
.bless-sortable__grip:focus-visible {
  outline: 2px solid var(--bless-color-accent);
}
.bless-sortable__body {
  flex: 1;
  min-width: 0;
}
.bless-sortable__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
