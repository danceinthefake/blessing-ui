<script setup lang="ts" generic="T extends string | number">
import { computed, ref, useId, watch } from "vue";
import { useFieldId, useFieldState } from "../composables/useFieldId";
import type { BlessOption } from "./select";

defineOptions({ name: "BlessListbox" });

const props = withDefaults(
  defineProps<{
    id?: string;
    /** submitted with the form, one value per selected option */
    name?: string;
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
const id = useFieldId(props);
const fs = useFieldState();
const root = ref<HTMLElement>();

const enabled = computed(() =>
  props.options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0),
);
const isSelected = (v: T) =>
  Array.isArray(model.value) ? model.value.includes(v) : model.value === v;
const selected = computed(() => props.options.filter((o) => isSelected(o.value)));
// start on the (first) selected option, else the first enabled one — never a disabled row
const active = ref(
  Math.max(
    props.options.findIndex((o) => !o.disabled && isSelected(o.value)),
    enabled.value[0] ?? 0,
  ),
);
function pick(i: number) {
  const o = props.options[i];
  if (!o || o.disabled || props.disabled) return;
  active.value = i;
  if (props.multiple) {
    const cur = Array.isArray(model.value) ? model.value : [];
    model.value = cur.includes(o.value) ? cur.filter((v) => v !== o.value) : [...cur, o.value];
  } else model.value = o.value;
}
// options can change under it (a PickList move): keep the active row on an enabled option
watch(enabled, (list) => {
  if (!list.includes(active.value))
    active.value = list.find((i) => i > active.value) ?? list.at(-1) ?? 0;
});
function reveal() {
  root.value
    ?.querySelector<HTMLElement>(`[data-i="${active.value}"]`)
    ?.scrollIntoView?.({ block: "nearest" });
}
function move(d: number) {
  const list = enabled.value;
  const at = list.indexOf(active.value);
  const next = list[Math.max(0, Math.min(list.length - 1, (at < 0 ? 0 : at) + d))];
  if (next != null) active.value = next;
  reveal();
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
      reveal();
      break;
    case "End":
      e.preventDefault();
      active.value = list.at(-1) ?? 0;
      reveal();
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
        if (hit != null) ((active.value = hit), reveal());
      }
  }
}
</script>

<template>
  <div
    :id="id()"
    ref="root"
    class="bless-listbox"
    :class="{ 'bless-listbox--disabled': disabled }"
    role="listbox"
    :tabindex="disabled ? -1 : 0"
    :aria-label="label"
    :aria-labelledby="label ? undefined : fs.labelledby"
    :aria-describedby="fs.describedby.value"
    :aria-invalid="fs.invalid.value || undefined"
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
    <template v-if="name">
      <input v-for="o in selected" :key="o.value" type="hidden" :name :value="o.value" />
    </template>
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
/* the active row is where the keys or the pointer are — only shown while they are there,
   so a list at rest doesn't show a grey row that reads as a choice */
.bless-listbox:is(:focus-visible, :hover) .bless-listbox__option--active {
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
  line-height: 1;
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
