<script setup lang="ts">
import { computed } from "vue";
import { useFieldId, useFieldState } from "../composables/useFieldId";

defineOptions({ name: "BlessTimePicker", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    /** minutes between options in the dropdown list */
    step?: number;
    min?: string;
    max?: string;
    /** 12-hour display in the list; the value stays "HH:MM" */
    hour12?: boolean;
    seconds?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    /** accessible name when there's no Field or <label>; defaults to "Time" outside a Field */
    label?: string;
    size?: "sm" | "md" | "lg";
  }>(),
  { step: 15, size: "md" },
);
/** "HH:MM" or "HH:MM:SS" */
const model = defineModel<string>({ default: "" });
const id = useFieldId(props);
const fs = useFieldState();
const fmt = (h: number, m: number) =>
  props.hour12
    ? `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`
    : `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
// options feed a <datalist>: native picker + quick picks, no custom dropdown. `step` only spaces
// the suggestions — on the input itself it would make any other typed minute invalid.
const options = computed(() => {
  const out: { value: string; label: string }[] = [];
  const [minH, minM] = (props.min ?? "00:00").split(":").map(Number);
  const [maxH, maxM] = (props.max ?? "23:59").split(":").map(Number);
  for (let t = minH * 60 + minM; t <= maxH * 60 + maxM; t += props.step) {
    const h = Math.floor(t / 60),
      m = t % 60;
    out.push({
      value: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      label: fmt(h, m),
    });
  }
  return out;
});
</script>

<template>
  <div
    class="bless-time"
    :class="[
      `bless-time--${size}`,
      { 'bless-time--disabled': disabled, 'bless-time--invalid': invalid },
    ]"
  >
    <input
      v-bind="$attrs"
      :id="id()"
      v-model="model"
      type="time"
      class="bless-time__control"
      :list="`${id()}-list`"
      :min
      :max
      :step="seconds ? 1 : 60"
      :disabled
      :aria-label="label ?? (fs.inField ? undefined : 'Time')"
      :aria-invalid="invalid || fs.invalid.value || undefined"
      :aria-describedby="($attrs['aria-describedby'] as string) ?? fs.describedby.value"
    />
    <datalist :id="`${id()}-list`">
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </datalist>
  </div>
</template>

<style>
.bless-time {
  border-radius: var(--bless-radius-plate);
  --_h: 40px;
  --_fs: var(--bless-text-md);
  display: inline-flex;
  height: var(--_h);
  background: var(--bless-color-surface);
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-time--sm {
  --_h: 32px;
  --_fs: var(--bless-text-sm);
}
.bless-time--lg {
  --_h: 48px;
  --_fs: var(--bless-text-lg);
}
.bless-time:focus-within {
  border-bottom-color: var(--bless-color-accent-text);
}
.bless-time--invalid {
  border-bottom-color: var(--bless-color-danger);
}
.bless-time__control {
  min-width: 8em;
  padding: 0 var(--bless-space-3);
  border: 0;
  background: transparent;
  font: inherit;
  font-size: var(--_fs);
  font-variant-numeric: tabular-nums;
  color: inherit;
  outline: 0;
  color-scheme: inherit;
}
.bless-time--disabled {
  opacity: 0.4;
  pointer-events: none;
}
/* parallelogram field; content counter-skews so text stays upright */
.bless-time {
  transform: skewX(var(--bless-skew));
}
.bless-time > :not(.bless-skew, .bless-chip, .bless-badge) {
  transform: skewX(var(--bless-skew-counter));
}
</style>
