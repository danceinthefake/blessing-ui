<template>
  <div class="bless-variant">
    <fieldset v-for="o in options" :key="o.key" class="bless-variant__group">
      <legend class="bless-variant__legend">
        {{ o.name
        }}<span v-if="chosen(o)" class="bless-variant__chosen">: {{ chosen(o)!.label }}</span>
      </legend>
      <div class="bless-variant__values">
        <label
          v-for="v in o.values"
          :key="v.value"
          class="bless-variant__value"
          :class="{ 'is-swatch': v.color, 'is-sold': v.soldOut }"
          :title="v.soldOut ? `${v.label}, ${text.soldOut}` : v.label"
        >
          <input
            type="radio"
            class="bless-variant__input"
            :name="`${uid}-${o.key}`"
            :value="v.value"
            :checked="model[o.key] === v.value"
            :disabled="v.soldOut"
            @change="pick(o, v)"
          />
          <span
            v-if="v.color"
            class="bless-variant__swatch"
            :style="{ background: v.color }"
            aria-hidden="true"
          />
          <span :class="v.color ? 'bless-sr' : 'bless-variant__label'">{{ v.label }}</span>
          <span v-if="v.soldOut" class="bless-sr">, {{ text.soldOut }}</span>
        </label>
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessVariantPicker" });
const pack = useLabelPack("BlessVariantPicker");

export interface BlessVariantValue {
  value: string;
  label: string;
  /** a CSS color: the option shows as a swatch */
  color?: string;
  soldOut?: boolean;
}
export interface BlessVariantOption {
  /** the field in the model, for example `size` */
  key: string;
  /** the name of the option, for example "Size" */
  name: string;
  values: BlessVariantValue[];
}

const props = defineProps<{
  options: BlessVariantOption[];
  labels?: Partial<{ soldOut: string }>;
}>();
/** the chosen value of each option, by key */
const model = defineModel<Record<string, string>>({ default: () => ({}) });

const text = computed(() => ({ soldOut: "sold out", ...pack(), ...props.labels }));
const uid = useId();
const chosen = (o: BlessVariantOption) => o.values.find((v) => v.value === model.value[o.key]);
const pick = (o: BlessVariantOption, v: BlessVariantValue) =>
  (model.value = { ...model.value, [o.key]: v.value });
</script>

<style>
.bless-variant {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-variant__group {
  margin: 0;
  padding: 0;
  border: 0;
}
.bless-variant__legend {
  margin-block-end: var(--bless-space-2);
  padding: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-variant__chosen {
  font-weight: normal;
  color: var(--bless-color-text-muted);
}
.bless-variant__values {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.bless-variant__value {
  position: relative;
  display: inline-grid;
  place-items: center;
  min-inline-size: 2.75rem;
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  cursor: pointer;
}
.bless-variant__value.is-swatch {
  min-inline-size: 2.5rem;
  padding: 3px;
}
.bless-variant__input {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}
.bless-variant__swatch {
  inline-size: 100%;
  block-size: 100%;
  min-block-size: calc(2.5rem - 8px);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--bless-color-text) 15%, transparent);
}
.bless-variant__value:hover:not(.is-sold) {
  border-color: var(--bless-color-text);
}
/* the chosen value has a thick frame in the text color, so it shows on any swatch */
.bless-variant__value:has(:checked) {
  border-color: var(--bless-color-text);
  box-shadow: inset 0 0 0 1px var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-variant__value:has(:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
/* a sold-out value is crossed out and cannot be chosen */
.bless-variant__value.is-sold {
  color: var(--bless-color-text-muted);
  cursor: not-allowed;
}
.bless-variant__value.is-sold::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top right,
    transparent calc(50% - 1px),
    var(--bless-color-text-muted) calc(50% - 1px) calc(50% + 1px),
    transparent calc(50% + 1px)
  );
  pointer-events: none;
}
</style>
