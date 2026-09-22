<script setup lang="ts" generic="T extends string | number">
import { computed, nextTick, ref, watch } from "vue";
import { useFieldId, useFieldState } from "../composables/useFieldId";
import { useFloating } from "../composables/useFloating";
import BlessBadge from "./BlessBadge.vue";
import type { BlessOption } from "./select";

defineOptions({ name: "BlessCombobox" });

const props = withDefaults(
  defineProps<{
    id?: string;
    options: BlessOption<T>[];
    placeholder?: string;
    multiple?: boolean;
    /** allow creating a new option from the query; emits `create` */
    creatable?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    emptyText?: string;
    size?: "sm" | "md" | "lg";
    /** accessible name when there is no <label for> */
    label?: string;
  }>(),
  { emptyText: "No results.", size: "md" },
);

const model = defineModel<T | T[] | undefined>();
const emit = defineEmits<{
  create: [label: string];
  /** the query as the user types — bind `options` to a fetched list for server-side search */
  search: [query: string];
}>();

const id = useFieldId(props)();
const fs = useFieldState();
const query = ref("");
const open = ref(false);
const active = ref(0);
const anchor = ref<HTMLElement>();
const panel = ref<HTMLElement>();
const input = ref<HTMLInputElement>();
const { x, y } = useFloating(anchor, panel, open, { placement: "bottom-start", offset: 4 });

const selected = computed<T[]>(() =>
  Array.isArray(model.value) ? model.value : model.value === undefined ? [] : [model.value],
);
const labelOf = (v: T) => props.options.find((o) => o.value === v)?.label ?? String(v);
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return props.options.filter((o) => !q || o.label.toLowerCase().includes(q));
});
const canCreate = computed(
  () =>
    props.creatable &&
    query.value.trim() &&
    !props.options.some((o) => o.label.toLowerCase() === query.value.trim().toLowerCase()),
);
const activeId = computed(() =>
  filtered.value[active.value]
    ? `${id}-opt-${active.value}`
    : canCreate.value
      ? `${id}-create`
      : undefined,
);

watch(filtered, () => (active.value = 0));
watch(open, (o) =>
  nextTick(() => {
    const el = panel.value;
    if (!el || typeof el.showPopover !== "function") return;
    if (o && !el.matches(":popover-open")) el.showPopover();
    else if (!o && el.matches(":popover-open")) el.hidePopover();
  }),
);
// single: reflect selection into the input text when closed
watch(
  () => [model.value, open.value] as const,
  ([, o]) => {
    if (!props.multiple && !o)
      query.value = selected.value[0] !== undefined ? labelOf(selected.value[0]) : "";
  },
  { immediate: true },
);

function pick(v: T) {
  if (props.multiple) {
    const cur = selected.value;
    model.value = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
    query.value = "";
    input.value?.focus();
  } else {
    model.value = v;
    open.value = false;
  }
}
function create() {
  const label = query.value.trim();
  if (!label) return;
  emit("create", label);
  query.value = "";
  if (!props.multiple) open.value = false;
}
function remove(v: T) {
  model.value = selected.value.filter((x) => x !== v);
}
function onKey(e: KeyboardEvent) {
  const n = filtered.value.length + (canCreate.value ? 1 : 0);
  if (e.key === "ArrowDown") {
    e.preventDefault();
    open.value = true;
    active.value = (active.value + 1) % Math.max(1, n);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    active.value = (active.value - 1 + n) % Math.max(1, n);
  } else if (e.key === "Enter") {
    if (!open.value) return;
    e.preventDefault();
    const o = filtered.value[active.value];
    if (o && !o.disabled) pick(o.value);
    else if (canCreate.value) create();
  } else if (e.key === "Escape") {
    open.value = false;
  } else if (e.key === "Backspace" && props.multiple && !query.value && selected.value.length)
    remove(selected.value.at(-1)!);
}
function onBlur(e: FocusEvent) {
  if (!panel.value?.contains(e.relatedTarget as Node)) open.value = false;
}
</script>

<template>
  <div
    class="bless-combobox"
    :class="[
      `bless-combobox--${size}`,
      {
        'bless-combobox--open': open,
        'bless-combobox--invalid': invalid,
        'bless-combobox--disabled': disabled,
      },
    ]"
  >
    <div
      ref="anchor"
      class="bless-combobox__field"
      @click="
        input?.focus();
        open = true;
      "
    >
      <template v-if="multiple">
        <BlessBadge
          v-for="v in selected"
          :key="String(v)"
          color="text"
          class="bless-combobox__chip"
        >
          {{ labelOf(v) }}
          <button
            type="button"
            class="bless-combobox__chip-x"
            :aria-label="`Remove ${labelOf(v)}`"
            tabindex="-1"
            @click.stop="remove(v)"
          >
            ×
          </button>
        </BlessBadge>
      </template>
      <input
        ref="input"
        :id
        v-model="query"
        type="text"
        class="bless-combobox__input"
        role="combobox"
        :aria-label="label"
        :placeholder="multiple && selected.length ? '' : placeholder"
        :disabled
        aria-autocomplete="list"
        :aria-expanded="open"
        :aria-controls="`${id}-list`"
        :aria-activedescendant="open ? activeId : undefined"
        :aria-invalid="invalid || fs.invalid.value || undefined"
        autocomplete="off"
        @focus="open = true"
        @input="
          open = true;
          emit('search', query);
        "
        @keydown="onKey"
        @blur="onBlur"
      />
      <span class="bless-combobox__chevron" aria-hidden="true" />
    </div>
    <div
      ref="panel"
      popover="manual"
      class="bless-combobox__panel"
      :style="{
        left: `${x}px`,
        top: `${y}px`,
        width: anchor ? `${anchor.offsetWidth}px` : undefined,
      }"
    >
      <div
        :id="`${id}-list`"
        role="listbox"
        :aria-multiselectable="multiple || undefined"
        class="bless-combobox__list"
      >
        <div
          v-for="(o, i) in filtered"
          :key="String(o.value)"
          :id="`${id}-opt-${i}`"
          role="option"
          class="bless-combobox__option"
          :class="{
            'bless-combobox__option--active': i === active,
            'bless-combobox__option--selected': selected.includes(o.value),
          }"
          :aria-selected="selected.includes(o.value)"
          :aria-disabled="o.disabled || undefined"
          @mousedown.prevent
          @mousemove="active = i"
          @click="!o.disabled && pick(o.value)"
        >
          <span class="bless-combobox__check" aria-hidden="true">{{
            selected.includes(o.value) ? "✓" : ""
          }}</span>
          <slot name="option" :option="o">{{ o.label }}</slot>
        </div>
        <div
          v-if="canCreate"
          :id="`${id}-create`"
          role="option"
          class="bless-combobox__option bless-combobox__option--create"
          :class="{ 'bless-combobox__option--active': active === filtered.length }"
          :aria-selected="false"
          @mousedown.prevent
          @mousemove="active = filtered.length"
          @click="create"
        >
          <span class="bless-combobox__check" aria-hidden="true">＋</span>Create “{{
            query.trim()
          }}”
        </div>
        <p v-if="!filtered.length && !canCreate" class="bless-combobox__empty">{{ emptyText }}</p>
      </div>
    </div>
  </div>
</template>

<style>
.bless-combobox {
  --_h: 40px;
  --_fs: var(--bless-text-md);
  position: relative;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-combobox--sm {
  --_h: 32px;
  --_fs: var(--bless-text-sm);
}
.bless-combobox--lg {
  --_h: 48px;
  --_fs: var(--bless-text-lg);
}
.bless-combobox__field {
  border-radius: var(--bless-radius-plate);
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-1);
  min-height: var(--_h);
  padding: var(--bless-space-1) var(--bless-space-8) var(--bless-space-1) var(--bless-space-3);
  box-sizing: border-box;
  background: var(--bless-color-surface);
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
  cursor: text;
}
.bless-combobox__field::after {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  bottom: calc(-2 * var(--bless-border-width));
  width: 100%;
  height: calc(2 * var(--bless-border-width));
  background: var(--bless-color-accent);
  transform: scaleX(0);
  transform-origin: 0 50%;
  transition: transform var(--bless-duration-slow) var(--bless-ease-out);
}
[dir="rtl"] .bless-combobox__field::after {
  transform-origin: 100% 50%;
}
.bless-combobox--open .bless-combobox__field::after,
.bless-combobox__field:focus-within::after {
  transform: scaleX(1);
}
.bless-combobox__input {
  flex: 1;
  min-width: 60px;
  height: calc(var(--_h) - 2 * var(--bless-space-1));
  border: 0;
  background: transparent;
  font: inherit;
  font-size: var(--_fs);
  color: inherit;
  outline: 0;
}
.bless-combobox__input::placeholder {
  color: var(--bless-color-text-muted);
}
.bless-combobox__chevron {
  position: absolute;
  inset-inline-end: var(--bless-space-3);
  top: 50%;
  width: 8px;
  height: 8px;
  border-inline-end: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
  transition: transform var(--bless-duration-base);
}
.bless-combobox__chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--bless-text-xs);
}
.bless-combobox__chip-x {
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: 1;
  padding: 0 2px;
  cursor: pointer;
  opacity: 0.7;
}
.bless-combobox__chip-x:hover {
  opacity: 1;
}
.bless-combobox__panel {
  position: fixed;
  inset: unset;
  margin: 0;
  padding: 0;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  box-shadow: var(--bless-shadow-plate);
}
.bless-combobox__list {
  max-height: 240px;
  overflow-y: auto;
  padding: var(--bless-space-1) 0;
  scrollbar-width: thin;
}
.bless-combobox__option {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-3);
  font-size: var(--bless-text-sm);
  cursor: pointer;
}
.bless-combobox__option--active {
  background: var(--bless-color-surface);
  color: var(--bless-color-accent-text);
}
.bless-combobox__option--selected {
  font-weight: var(--bless-font-weight-bold);
}
.bless-combobox__option[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-combobox__option--create {
  color: var(--bless-color-accent-text);
}
.bless-combobox__check {
  width: 1em;
  flex: none;
  font-size: var(--bless-text-xs);
}
.bless-combobox__empty {
  margin: 0;
  padding: var(--bless-space-3);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-combobox--invalid .bless-combobox__field {
  border-bottom-color: var(--bless-color-danger);
}
.bless-combobox--disabled {
  opacity: 0.4;
  pointer-events: none;
}
/* fields are parallelograms like everything else; content counter-skews so text stays upright */
.bless-combobox__field {
  transform: skewX(var(--bless-skew));
}
.bless-combobox__field > :not(.bless-skew, .bless-chip, .bless-badge) {
  transform: skewX(var(--bless-skew-counter));
}
.bless-combobox__field > :first-child {
  padding-inline-start: calc(var(--bless-space-3) + 4px);
}
.bless-combobox__field > :last-child {
  padding-inline-end: calc(var(--bless-space-3) + 4px);
}
/* a clipped V, not a rotated square: rotations don't survive the field's skew */
.bless-combobox__field > .bless-combobox__chevron {
  width: 11px;
  height: 7px;
  border: 0;
  background: currentColor;
  clip-path: polygon(0 0, 18% 0, 50% 55%, 82% 0, 100% 0, 50% 100%);
  transform: skewX(var(--bless-skew-counter)) translateY(-50%);
  inset-inline-end: calc(var(--bless-space-3) + 4px);
}
.bless-combobox--open .bless-combobox__field > .bless-combobox__chevron {
  transform: skewX(var(--bless-skew-counter)) translateY(-50%) scaleY(-1);
}
</style>
