<script setup lang="ts" generic="T extends string | number">
import { computed, ref, useId } from "vue";
import type { BlessOption } from "./select";

defineOptions({ name: "BlessListbox" });

const props = withDefaults(
  defineProps<{
    options: BlessOption<T>[];
    multiple?: boolean;
    disabled?: boolean;
    label?: string;
    /** visible rows before scrolling; 0 = no limit */
    rows?: number;
  }>(),
  { rows: 0 },
);
const model = defineModel<T | T[] | undefined>();
const uid = useId();
const active = ref(0);
const root = ref<HTMLElement>();

const enabled = computed(() =>
  props.options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0),
);
const isSelected = (v: T) =>
  Array.isArray(model.value) ? model.value.includes(v) : model.value === v;
function pick(i: number) {
  const o = props.options[i];
  if (!o || o.disabled || props.disabled) return;
  active.value = i;
  if (props.multiple) {
    const cur = Array.isArray(model.value) ? model.value : [];
    model.value = cur.includes(o.value) ? cur.filter((v) => v !== o.value) : [...cur, o.value];
  } else model.value = o.value;
}
function move(d: number) {
  const list = enabled.value;
  const at = list.indexOf(active.value);
  const next = list[Math.max(0, Math.min(list.length - 1, (at < 0 ? 0 : at) + d))];
  if (next != null) active.value = next;
  root.value
    ?.querySelector<HTMLElement>(`[data-i="${active.value}"]`)
    ?.scrollIntoView?.({ block: "nearest" });
}
let typed = "";
let timer: ReturnType<typeof setTimeout> | undefined;
function onKey(e: KeyboardEvent) {
  const list = enabled.value;
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      move(1);
      break;
    case "ArrowUp":
      e.preventDefault();
      move(-1);
      break;
    case "Home":
      e.preventDefault();
      active.value = list[0] ?? 0;
      break;
    case "End":
      e.preventDefault();
      active.value = list.at(-1) ?? 0;
      break;
    case " ":
    case "Enter":
      e.preventDefault();
      pick(active.value);
      break;
    default:
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        typed += e.key.toLowerCase();
        clearTimeout(timer);
        timer = setTimeout(() => (typed = ""), 500);
        const hit = list.find((i) => props.options[i].label.toLowerCase().startsWith(typed));
        if (hit != null) active.value = hit;
      }
  }
}
</script>

<template>
  <div
    ref="root"
    class="bless-listbox"
    :class="{ 'bless-listbox--disabled': disabled }"
    role="listbox"
    :tabindex="disabled ? -1 : 0"
    :aria-label="label"
    :aria-multiselectable="multiple || undefined"
    :aria-activedescendant="`${uid}-${active}`"
    :aria-disabled="disabled || undefined"
    :style="rows ? { '--_rows': rows } : undefined"
    @keydown="onKey"
  >
    <div
      v-for="(o, i) in options"
      :id="`${uid}-${i}`"
      :key="o.value"
      class="bless-listbox__option"
      :class="{
        'bless-listbox__option--active': i === active,
        'bless-listbox__option--selected': isSelected(o.value),
        'bless-listbox__option--disabled': o.disabled,
      }"
      role="option"
      :aria-selected="isSelected(o.value)"
      :aria-disabled="o.disabled || undefined"
      :data-i="i"
      @click="pick(i)"
      @mousemove="!o.disabled && (active = i)"
    >
      <span v-if="multiple" class="bless-listbox__check" aria-hidden="true">{{
        isSelected(o.value) ? "✓" : ""
      }}</span>
      <slot :option="o" :selected="isSelected(o.value)">{{ o.label }}</slot>
    </div>
  </div>
</template>

<style>
.bless-listbox {
  border-radius: var(--bless-radius);
  --_row: 36px;
  display: block;
  max-height: calc(var(--_rows, 1000) * var(--_row));
  overflow-y: auto;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
  scrollbar-width: thin;
}
.bless-listbox:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-listbox__option {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  min-height: var(--_row);
  padding: 0 var(--bless-space-3);
  cursor: pointer;
}
.bless-listbox__option--active {
  background: var(--bless-color-surface);
}
.bless-listbox__option--selected {
  color: var(--bless-color-accent-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-listbox__option--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-listbox__check {
  display: inline-grid;
  place-items: center;
  width: 16px;
  height: 16px;
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-2xs);
  transform: skewX(var(--bless-skew));
}
.bless-listbox__option--selected .bless-listbox__check {
  border-color: var(--bless-color-accent-text);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-listbox--disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
