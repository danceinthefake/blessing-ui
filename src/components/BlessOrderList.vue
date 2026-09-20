<script setup lang="ts" generic="T">
import { ref } from "vue";

defineOptions({ name: "BlessOrderList" });

const props = withDefaults(
  defineProps<{
    rowKey?: (item: T, index: number) => string | number;
    label?: string;
    /** hide the ↑ ↓ buttons (drag only) */
    buttons?: boolean;
  }>(),
  { label: "Reorder", buttons: true },
);
const model = defineModel<T[]>({ default: () => [] });
const emit = defineEmits<{ move: [from: number, to: number] }>();
const drag = ref<number | null>(null);
const over = ref<number | null>(null);
const live = ref("");

function move(from: number, to: number) {
  if (from === to || to < 0 || to >= model.value.length) return;
  const arr = model.value.slice();
  const [it] = arr.splice(from, 1);
  arr.splice(to, 0, it);
  model.value = arr;
  emit("move", from, to);
  live.value = `Moved to position ${to + 1} of ${arr.length}`;
}
function onDrop(i: number) {
  if (drag.value != null) move(drag.value, i);
  drag.value = over.value = null;
}
function onKey(i: number, e: KeyboardEvent) {
  if (!e.altKey) return;
  if (e.key === "ArrowUp") (e.preventDefault(), move(i, i - 1), refocus(i - 1));
  if (e.key === "ArrowDown") (e.preventDefault(), move(i, i + 1), refocus(i + 1));
}
const root = ref<HTMLElement>();
const refocus = (i: number) =>
  requestAnimationFrame(() =>
    root.value?.querySelectorAll<HTMLElement>(".bless-order__item")[i]?.focus(),
  );
</script>

<template>
  <ul ref="root" class="bless-order" role="list" :aria-label="label">
    <li
      v-for="(item, i) in model"
      :key="rowKey ? rowKey(item, i) : i"
      class="bless-order__item"
      :class="{ 'bless-order__item--drag': drag === i, 'bless-order__item--over': over === i }"
      draggable="true"
      tabindex="0"
      :aria-label="`Item ${i + 1} of ${model.length}. Alt+arrows to move.`"
      @dragstart="drag = i"
      @dragover.prevent="over = i"
      @dragleave="over === i && (over = null)"
      @drop.prevent="onDrop(i)"
      @dragend="drag = over = null"
      @keydown="onKey(i, $event)"
    >
      <span class="bless-order__grip" aria-hidden="true">⋮⋮</span>
      <span class="bless-order__body"
        ><slot :item :index="i">{{ item }}</slot></span
      >
      <span v-if="props.buttons" class="bless-order__btns">
        <button type="button" :aria-label="`Move up`" :disabled="i === 0" @click="move(i, i - 1)">
          ↑
        </button>
        <button
          type="button"
          :aria-label="`Move down`"
          :disabled="i === model.length - 1"
          @click="move(i, i + 1)"
        >
          ↓
        </button>
      </span>
    </li>
    <li class="bless-order__live" aria-live="polite">{{ live }}</li>
  </ul>
</template>

<style>
.bless-order {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-order__item {
  border-radius: var(--bless-radius);
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  cursor: grab;
}
.bless-order__item + .bless-order__item {
  margin-top: calc(-1 * var(--bless-border-width));
}
.bless-order__item:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
  z-index: 1;
}
.bless-order__item--drag {
  opacity: 0.4;
}
.bless-order__item--over {
  border-top: 2px solid var(--bless-color-accent);
}
.bless-order__grip {
  color: var(--bless-color-text-muted);
  letter-spacing: -3px;
}
.bless-order__body {
  flex: 1;
  min-width: 0;
}
.bless-order__btns {
  display: inline-flex;
  gap: 2px;
}
.bless-order__btns button {
  width: 24px;
  height: 24px;
  border: 0;
  background: var(--bless-color-surface);
  color: inherit;
  font: inherit;
  cursor: pointer;
  transform: skewX(var(--bless-skew));
}
.bless-order__btns button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.bless-order__btns button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
}
.bless-order__live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
