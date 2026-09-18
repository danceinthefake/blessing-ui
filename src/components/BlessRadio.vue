<script setup lang="ts">
import { inject, useId } from "vue";
import { radioKey } from "./radio";

defineOptions({ name: "BlessRadio", inheritAttrs: false });

const props = defineProps<{
  value: string | number;
  id?: string;
  disabled?: boolean;
  description?: string;
}>();
const group = inject(radioKey, null);
const uid = useId();
const id = () => props.id ?? uid;
</script>

<template>
  <label
    class="bless-radio"
    :class="{ 'bless-radio--disabled': disabled, 'bless-radio--invalid': group?.invalid.value }"
    :for="id()"
  >
    <input
      v-bind="$attrs"
      :id="id()"
      type="radio"
      :name="group?.name.value"
      :value
      :checked="group ? group.model.value === value : undefined"
      :disabled="disabled || group?.disabled.value"
      class="bless-radio__input"
      :aria-describedby="description ? `${id()}-desc` : undefined"
      @change="group && (group.model.value = value)"
    />
    <span class="bless-radio__dot" aria-hidden="true" />
    <span v-if="$slots.default || description" class="bless-radio__text">
      <span class="bless-radio__label"><slot /></span>
      <span v-if="description" :id="`${id()}-desc`" class="bless-radio__description">{{
        description
      }}</span>
    </span>
  </label>
</template>

<style>
.bless-radio {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-md);
  color: var(--bless-color-text);
  line-height: var(--bless-leading-tight);
  cursor: pointer;
}
.bless-radio__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}
.bless-radio__dot {
  position: relative;
  flex: none;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  box-sizing: border-box;
  border: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
  border-radius: 50%;
  background: var(--bless-color-bg);
  transition: border-color var(--bless-duration-base);
}
.bless-radio__dot::after {
  content: "";
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: var(--bless-color-accent);
  transform: scale(0);
  transition: transform var(--bless-duration-base) var(--bless-ease-out);
}
.bless-radio__input:checked + .bless-radio__dot {
  border-color: var(--bless-color-accent);
}
.bless-radio__input:checked + .bless-radio__dot::after {
  transform: scale(1);
}
.bless-radio__input:focus-visible + .bless-radio__dot {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-radio:hover .bless-radio__dot {
  border-color: var(--bless-color-text);
}
.bless-radio--invalid .bless-radio__dot {
  border-color: var(--bless-color-danger);
}
.bless-radio--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-radio__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.bless-radio__description {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
