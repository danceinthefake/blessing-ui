<script setup lang="ts" generic="T extends string | number">
import { provide, toRef, useId } from "vue";
import { radioKey } from "./radio";

defineOptions({ name: "BlessRadioGroup" });

const props = withDefaults(
  defineProps<{
    name?: string;
    label?: string;
    orientation?: "vertical" | "horizontal";
    disabled?: boolean;
    invalid?: boolean;
  }>(),
  { orientation: "vertical" },
);

const model = defineModel<T>();
const uid = useId();
provide(radioKey, {
  name: toRef(() => props.name ?? uid),
  disabled: toRef(() => props.disabled),
  invalid: toRef(() => props.invalid),
  model: model as ReturnType<typeof defineModel<string | number>>,
});
</script>

<template>
  <fieldset
    class="bless-radio-group"
    :class="`bless-radio-group--${orientation}`"
    :disabled
    :aria-invalid="invalid || undefined"
  >
    <legend v-if="label || $slots.label" class="bless-radio-group__label">
      <slot name="label">{{ label }}</slot>
    </legend>
    <div class="bless-radio-group__items"><slot /></div>
  </fieldset>
</template>

<style>
.bless-radio-group {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
  font-family: var(--bless-font-sans);
}
.bless-radio-group__label {
  padding: 0;
  margin-bottom: var(--bless-space-2);
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-radio-group__items {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-2);
}
.bless-radio-group--horizontal .bless-radio-group__items {
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--bless-space-4);
}
.bless-radio-group:disabled {
  opacity: 0.4;
}
</style>
