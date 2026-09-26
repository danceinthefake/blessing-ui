<script setup lang="ts">
import { computed, ref } from "vue";
import { useFieldId, useFieldState } from "../composables/useFieldId";

defineOptions({ name: "BlessInputNumber", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    /** submitted with the form as the plain number, not the formatted text */
    name?: string;
    min?: number;
    max?: number;
    step?: number;
    /** ± buttons */
    buttons?: boolean;
    prefix?: string;
    suffix?: string;
    /** Intl.NumberFormat options used while not focused */
    format?: Intl.NumberFormatOptions;
    locale?: string;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    invalid?: boolean;
    label?: string;
  }>(),
  { step: 1, buttons: true, size: "md" },
);
const model = defineModel<number | null>({ default: null });
const id = useFieldId(props);
const fs = useFieldState();
const focused = ref(false);
const fmt = computed(() => new Intl.NumberFormat(props.locale, props.format));
/** the locale's decimal mark: typed and shown while editing */
const dec = computed(
  () =>
    new Intl.NumberFormat(props.locale).formatToParts(1.1).find((p) => p.type === "decimal")
      ?.value ?? ".",
);
const shown = computed(() =>
  model.value == null
    ? ""
    : focused.value || !props.format
      ? String(model.value).replace(".", dec.value)
      : fmt.value.format(model.value),
);
const valuetext = computed(() =>
  model.value == null
    ? undefined
    : [props.prefix, props.format ? fmt.value.format(model.value) : model.value, props.suffix]
        .filter((x) => x != null && x !== "")
        .join(" "),
);
const decimals = computed(() => (String(props.step).split(".")[1] ?? "").length);
/** steps count from `min` (as in HTML), rounded to the step's decimals so 0.1 × 3 is 0.3 */
function clamp(v: number) {
  const base = props.min ?? 0;
  const snapped = Number(
    (base + Math.round((v - base) / props.step) * props.step).toFixed(decimals.value),
  );
  return Math.min(props.max ?? Infinity, Math.max(props.min ?? -Infinity, snapped));
}
function onInput(e: Event) {
  let raw = (e.target as HTMLInputElement).value;
  if (dec.value !== ".") raw = raw.replaceAll(".", "").replace(dec.value, ".");
  raw = raw.replace(/[^\d.-]/g, "");
  model.value = raw === "" || raw === "-" ? null : Number(raw);
}
function onBlur() {
  focused.value = false;
  if (model.value != null) model.value = clamp(model.value);
}
const nudge = (d: number) =>
  (model.value = clamp((model.value ?? props.min ?? 0) + d * props.step));
/** spinbutton keys: arrows one step, Page keys ten, Home/End to the bounds when set */
function onKey(e: KeyboardEvent) {
  const by = ({ ArrowUp: 1, ArrowDown: -1, PageUp: 10, PageDown: -10 } as Record<string, number>)[
    e.key
  ];
  const to = e.key === "Home" ? props.min : e.key === "End" ? props.max : undefined;
  if (by) nudge(by);
  else if (to != null) model.value = to;
  else return;
  e.preventDefault();
}
</script>

<template>
  <div
    class="bless-number bless-lean--field"
    :class="[
      `bless-number--${size}`,
      { 'bless-number--disabled': disabled, 'bless-number--invalid': invalid },
    ]"
  >
    <button
      v-if="buttons"
      type="button"
      class="bless-number__btn"
      aria-label="Decrease"
      :disabled="disabled || (min != null && (model ?? 0) <= min)"
      tabindex="-1"
      @click="nudge(-1)"
    >
      −
    </button>
    <span v-if="prefix" class="bless-number__affix">{{ prefix }}</span>
    <input
      v-bind="$attrs"
      :id="id()"
      type="text"
      inputmode="decimal"
      class="bless-number__control"
      :value="shown"
      :disabled
      :aria-label="label"
      :aria-invalid="invalid || fs.invalid.value || undefined"
      :aria-describedby="($attrs['aria-describedby'] as string) ?? fs.describedby.value"
      role="spinbutton"
      :aria-valuenow="model ?? undefined"
      :aria-valuetext="valuetext"
      :aria-valuemin="min"
      :aria-valuemax="max"
      @focus="focused = true"
      @blur="onBlur"
      @input="onInput"
      @keydown="onKey"
    />
    <input v-if="name" type="hidden" :name :value="model ?? ''" />
    <span v-if="suffix" class="bless-number__affix">{{ suffix }}</span>
    <button
      v-if="buttons"
      type="button"
      class="bless-number__btn"
      aria-label="Increase"
      :disabled="disabled || (max != null && (model ?? 0) >= max)"
      tabindex="-1"
      @click="nudge(1)"
    >
      +
    </button>
  </div>
</template>

<style>
.bless-number {
  border-radius: var(--bless-radius-plate);
  --_h: 40px;
  display: inline-flex;
  align-items: stretch;
  height: var(--_h);
  background: var(--bless-color-surface);
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-number--sm {
  --_h: 32px;
}
.bless-number--lg {
  --_h: 48px;
}
.bless-number:focus-within {
  border-bottom-color: var(--bless-color-accent-text);
}
.bless-number--invalid {
  border-bottom-color: var(--bless-color-danger);
}
.bless-number__control {
  width: 6em;
  min-width: 0;
  padding: 0 var(--bless-space-2);
  border: 0;
  background: transparent;
  font: inherit;
  font-variant-numeric: tabular-nums;
  text-align: end;
  color: inherit;
  outline: 0;
}
.bless-number__affix {
  display: inline-flex;
  align-items: center;
  padding: 0 var(--bless-space-2);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-number__btn {
  width: var(--_h);
  border: 0;
  background: transparent;
  color: var(--bless-color-text-muted);
  font: inherit;
  font-size: var(--bless-text-md);
  cursor: pointer;
}
/* hover is attention, not a choice: ink */
.bless-number__btn:hover:not(:disabled) {
  color: var(--bless-color-text);
}
.bless-number__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.bless-number--disabled {
  opacity: 0.4;
  pointer-events: none;
}
/* parallelogram field; content counter-skews so text stays upright */
.bless-number {
  transform: skewX(var(--bless-skew));
}
.bless-number > :not(.bless-skew, .bless-chip, .bless-badge) {
  transform: skewX(var(--bless-skew-counter));
}
</style>
