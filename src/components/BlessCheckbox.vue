<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { useFieldId, useFieldState } from "../composables/useFieldId";

defineOptions({ name: "BlessCheckbox", inheritAttrs: false });

const props = defineProps<{
  id?: string;
  value?: string | number;
  indeterminate?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  description?: string;
}>();

const model = defineModel<boolean | Array<string | number>>({ default: false });
const id = useFieldId(props);
const fs = useFieldState();
const attrs = useAttrs();
const invalidNow = computed(() => props.invalid || fs.invalid.value);
// every description the box has: its own line, the field's error, and one passed in
const describedby = computed(
  () =>
    [
      props.description ? `${id()}-desc` : undefined,
      fs.describedby.value,
      attrs["aria-describedby"] as string | undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined,
);
</script>

<template>
  <label
    class="bless-checkbox"
    :class="{ 'bless-checkbox--disabled': disabled, 'bless-checkbox--invalid': invalidNow }"
    :for="id()"
  >
    <input
      v-bind="$attrs"
      :id="id()"
      v-model="model"
      type="checkbox"
      :value
      :disabled
      :indeterminate
      class="bless-checkbox__input"
      :aria-invalid="invalidNow || undefined"
      :aria-describedby="describedby"
    />
    <span class="bless-checkbox__box" aria-hidden="true">
      <svg viewBox="0 0 16 16" class="bless-checkbox__check"><path d="M3 8.5l3 3 7-7" /></svg>
      <span class="bless-checkbox__mixed" />
    </span>
    <span v-if="$slots.default || description" class="bless-checkbox__text">
      <span class="bless-checkbox__label"><slot /></span>
      <span v-if="description" :id="`${id()}-desc`" class="bless-checkbox__description">{{
        description
      }}</span>
    </span>
  </label>
</template>

<style>
.bless-checkbox {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-md);
  color: var(--bless-color-text);
  cursor: pointer;
  line-height: var(--bless-leading-tight);
}
.bless-checkbox__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}
.bless-checkbox__box {
  position: relative;
  flex: none;
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  border: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
  background: var(--bless-color-bg);
  transform: skewX(var(--bless-skew));
  transition:
    background var(--bless-duration-base),
    border-color var(--bless-duration-base);
}
.bless-checkbox__check {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: var(--bless-color-on-accent);
  stroke-width: 2.5;
  stroke-linecap: square;
  transform: skewX(var(--bless-skew-counter)) scale(0);
  transition: transform var(--bless-duration-base) var(--bless-ease-out);
}
.bless-checkbox__mixed {
  position: absolute;
  width: 8px;
  height: 2px;
  background: var(--bless-color-on-accent);
  transform: scaleX(0);
  transition: transform var(--bless-duration-base) var(--bless-ease-out);
}
.bless-checkbox__input:checked + .bless-checkbox__box,
.bless-checkbox__input:indeterminate + .bless-checkbox__box {
  background: var(--bless-color-accent);
  border-color: var(--bless-color-accent-text);
}
.bless-checkbox__input:checked + .bless-checkbox__box .bless-checkbox__check {
  transform: skewX(var(--bless-skew-counter)) scale(1);
}
.bless-checkbox__input:indeterminate + .bless-checkbox__box .bless-checkbox__check {
  transform: scale(0);
}
.bless-checkbox__input:indeterminate + .bless-checkbox__box .bless-checkbox__mixed {
  transform: scaleX(1);
}
.bless-checkbox__input:focus-visible + .bless-checkbox__box {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-checkbox:hover .bless-checkbox__box {
  border-color: var(--bless-color-text);
}
.bless-checkbox--invalid .bless-checkbox__box {
  border-color: var(--bless-color-danger);
}
.bless-checkbox--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-checkbox__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.bless-checkbox__description {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
