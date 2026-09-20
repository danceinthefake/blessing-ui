<script setup lang="ts">
import { computed, ref } from "vue";
import { useFieldId } from "../composables/useFieldId";

defineOptions({ name: "BlessInputNumber", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
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
const focused = ref(false);
const fmt = computed(() => new Intl.NumberFormat(props.locale, props.format));
const shown = computed(() =>
  model.value == null
    ? ""
    : focused.value || !props.format
      ? String(model.value)
      : fmt.value.format(model.value),
);
const clamp = (v: number) =>
  Math.min(
    props.max ?? Infinity,
    Math.max(props.min ?? -Infinity, Math.round(v / props.step) * props.step),
  );
function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/[^\d.-]/g, "");
  model.value = raw === "" || raw === "-" ? null : Number(raw);
}
function onBlur() {
  focused.value = false;
  if (model.value != null) model.value = clamp(model.value);
}
const nudge = (d: number) => (model.value = clamp((model.value ?? 0) + d * props.step));
</script>

<template>
  <div
    class="bless-number"
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
      :aria-invalid="invalid || undefined"
      role="spinbutton"
      :aria-valuenow="model ?? undefined"
      :aria-valuemin="min"
      :aria-valuemax="max"
      @focus="focused = true"
      @blur="onBlur"
      @input="onInput"
      @keydown.up.prevent="nudge(1)"
      @keydown.down.prevent="nudge(-1)"
    />
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
.bless-number__btn:hover:not(:disabled) {
  color: var(--bless-color-accent-text);
}
.bless-number__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.bless-number--disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
