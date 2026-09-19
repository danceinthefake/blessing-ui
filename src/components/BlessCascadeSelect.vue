<script setup lang="ts" generic="T extends string | number">
import { computed, ref, useId, watch } from "vue";
import BlessPopover from "./BlessPopover.vue";
import type { BlessCascadeOption } from "./cascade";

defineOptions({ name: "BlessCascadeSelect" });

const props = withDefaults(
  defineProps<{
    options: BlessCascadeOption<T>[];
    placeholder?: string;
    /** show the full path in the trigger (A › B › C) or only the leaf */
    showPath?: boolean;
    separator?: string;
    disabled?: boolean;
    invalid?: boolean;
    label?: string;
    size?: "sm" | "md" | "lg";
  }>(),
  { placeholder: "Select…", showPath: true, separator: " › ", size: "md", label: "Cascade select" },
);
const model = defineModel<T | undefined>();
const emit = defineEmits<{
  select: [option: BlessCascadeOption<T>, path: BlessCascadeOption<T>[]];
}>();
const open = ref(false);
const uid = useId();

/** path of indexes currently drilled into (one per rendered column beyond the first) */
const trail = ref<number[]>([]);
const columns = computed(() => {
  const cols: BlessCascadeOption<T>[][] = [props.options];
  let level = props.options;
  for (const i of trail.value) {
    const next = level[i]?.children;
    if (!next?.length) break;
    cols.push(next);
    level = next;
  }
  return cols;
});
const active = ref<number[]>([0]); // active row per column, for keyboard

function findPath(
  list: BlessCascadeOption<T>[],
  v: T,
  acc: BlessCascadeOption<T>[] = [],
): BlessCascadeOption<T>[] | null {
  for (const o of list) {
    if (o.value === v) return [...acc, o];
    if (o.children) {
      const r = findPath(o.children, v, [...acc, o]);
      if (r) return r;
    }
  }
  return null;
}
const selectedPath = computed(() =>
  model.value == null ? null : findPath(props.options, model.value),
);
const text = computed(() =>
  !selectedPath.value
    ? ""
    : props.showPath
      ? selectedPath.value.map((o) => o.label).join(props.separator)
      : selectedPath.value.at(-1)!.label,
);

function enter(col: number, i: number) {
  const o = columns.value[col]?.[i];
  if (!o || o.disabled) return;
  trail.value = [...trail.value.slice(0, col), i];
  active.value = [...active.value.slice(0, col), i, 0];
}
function pick(col: number, i: number) {
  const o = columns.value[col]?.[i];
  if (!o || o.disabled) return;
  if (o.children?.length) return enter(col, i);
  model.value = o.value;
  emit("select", o, [...trail.value.slice(0, col).map((t, k) => columns.value[k][t]), o]);
  open.value = false;
}
function onKey(e: KeyboardEvent) {
  const col = Math.min(active.value.length - 1, columns.value.length - 1);
  const list = columns.value[col];
  const cur = active.value[col] ?? 0;
  const setActive = (i: number) =>
    (active.value = [...active.value.slice(0, col), Math.max(0, Math.min(list.length - 1, i))]);
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      setActive(cur + 1);
      break;
    case "ArrowUp":
      e.preventDefault();
      setActive(cur - 1);
      break;
    case "ArrowRight":
      e.preventDefault();
      if (list[cur]?.children?.length) enter(col, cur);
      break;
    case "ArrowLeft":
      e.preventDefault();
      if (col > 0) {
        trail.value = trail.value.slice(0, col - 1);
        active.value = active.value.slice(0, col);
      }
      break;
    case "Enter":
    case " ":
      e.preventDefault();
      pick(col, cur);
      break;
    case "Escape":
      open.value = false;
      break;
  }
}
watch(open, (o) => {
  if (!o) return;
  // open on the selected path
  const p = selectedPath.value;
  if (!p) return void ((trail.value = []), (active.value = [0]));
  const idx: number[] = [];
  let level = props.options;
  for (const node of p) {
    idx.push(level.indexOf(node));
    level = node.children ?? [];
  }
  trail.value = idx.slice(0, -1);
  active.value = idx;
});
</script>

<template>
  <BlessPopover v-model:open="open" placement="bottom-start" class="bless-cascade">
    <template #trigger>
      <button
        type="button"
        class="bless-cascade__trigger"
        :class="[
          `bless-cascade__trigger--${size}`,
          { 'bless-cascade__trigger--invalid': invalid, 'bless-cascade__trigger--empty': !text },
        ]"
        :disabled
        :aria-label="label"
        :aria-invalid="invalid || undefined"
        aria-haspopup="listbox"
        :aria-expanded="open"
      >
        <span class="bless-cascade__text">{{ text || placeholder }}</span>
        <span class="bless-cascade__chevron" aria-hidden="true" />
      </button>
    </template>
    <div class="bless-cascade__panel" tabindex="0" @keydown="onKey">
      <div
        v-for="(list, col) in columns"
        :key="col"
        class="bless-cascade__col"
        role="listbox"
        :aria-label="`Level ${col + 1}`"
      >
        <div
          v-for="(o, i) in list"
          :id="`${uid}-${col}-${i}`"
          :key="String(o.value)"
          class="bless-cascade__option"
          :class="{
            'bless-cascade__option--active': active[col] === i,
            'bless-cascade__option--open': trail[col] === i,
            'bless-cascade__option--selected': o.value === model,
            'bless-cascade__option--disabled': o.disabled,
          }"
          role="option"
          :aria-selected="o.value === model"
          :aria-disabled="o.disabled || undefined"
          @mouseenter="
            !o.disabled &&
            (active = [...active.slice(0, col), i]) &&
            o.children?.length &&
            enter(col, i)
          "
          @click="pick(col, i)"
        >
          <span class="bless-cascade__label">{{ o.label }}</span>
          <span v-if="o.children?.length" class="bless-cascade__more" aria-hidden="true">›</span>
        </div>
      </div>
    </div>
  </BlessPopover>
</template>

<style>
.bless-cascade__trigger {
  --_h: 40px;
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  min-width: 200px;
  height: var(--_h);
  padding: 0 var(--bless-space-3);
  border: 0;
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
  background: var(--bless-color-surface);
  color: var(--bless-color-text);
  font: inherit;
  font-family: var(--bless-font-sans);
  text-align: left;
  cursor: pointer;
}
.bless-cascade__trigger--sm {
  --_h: 32px;
  font-size: var(--bless-text-sm);
}
.bless-cascade__trigger--lg {
  --_h: 48px;
  font-size: var(--bless-text-lg);
}
.bless-cascade__trigger:focus-visible {
  outline: 0;
  border-bottom-color: var(--bless-color-accent);
}
.bless-cascade__trigger--empty .bless-cascade__text {
  color: var(--bless-color-text-muted);
}
.bless-cascade__trigger--invalid {
  border-bottom-color: var(--bless-color-danger);
}
.bless-cascade__trigger:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-cascade__text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-cascade__chevron {
  width: 8px;
  height: 8px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-2px) rotate(45deg);
}
.bless-cascade .bless-popover {
  padding: 0;
}
.bless-cascade__panel {
  display: flex;
  outline: 0;
}
.bless-cascade__panel:focus-visible {
  outline: 2px solid var(--bless-color-accent);
}
.bless-cascade__col {
  min-width: 160px;
  max-height: 280px;
  overflow-y: auto;
  padding: var(--bless-space-1) 0;
  scrollbar-width: thin;
}
.bless-cascade__col + .bless-cascade__col {
  border-left: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-cascade__option {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  font-size: var(--bless-text-sm);
  cursor: pointer;
}
.bless-cascade__option--active,
.bless-cascade__option--open {
  background: var(--bless-color-surface);
}
.bless-cascade__option--selected {
  color: var(--bless-color-accent);
  font-weight: var(--bless-font-weight-bold);
}
.bless-cascade__option--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-cascade__label {
  flex: 1;
}
.bless-cascade__more {
  color: var(--bless-color-text-muted);
}
</style>
