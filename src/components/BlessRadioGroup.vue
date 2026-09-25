<script setup lang="ts" generic="T extends string | number">
import { provide, toRef, useId } from "vue";
import { useFieldId, useFieldState } from "../composables/useFieldId";
import { radioKey } from "./radio";

defineOptions({ name: "BlessRadioGroup" });

const props = withDefaults(
  defineProps<{
    id?: string;
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
// The group, not its first radio, takes an enclosing Field: the field's label names the group
// and each radio keeps its own label.
const id = useFieldId(props);
const fs = useFieldState();
provide(radioKey, {
  name: toRef(() => props.name ?? uid),
  disabled: toRef(() => props.disabled),
  invalid: toRef(() => props.invalid || fs.invalid.value),
  model: model as ReturnType<typeof defineModel<string | number>>,
});
</script>

<template>
  <fieldset
    :id="id()"
    class="bless-radio-group"
    :class="`bless-radio-group--${orientation}`"
    role="radiogroup"
    :disabled
    :aria-labelledby="label || $slots.label ? undefined : fs.labelledby"
    :aria-invalid="invalid || fs.invalid.value || undefined"
    :aria-describedby="fs.describedby.value"
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
