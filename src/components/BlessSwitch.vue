<template>
  <label
    class="bless-switch"
    :class="[
      `bless-switch--${size ?? 'md'}`,
      {
        'bless-switch--disabled': disabled,
        'bless-switch--start': labelPosition === 'start',
        'bless-switch--invalid': fs.invalid.value,
      },
    ]"
    :for="id()"
  >
    <input
      v-bind="$attrs"
      :id="id()"
      v-model="model"
      type="checkbox"
      role="switch"
      :disabled
      class="bless-switch__input"
      :aria-invalid="fs.invalid.value || undefined"
      :aria-describedby="joinIds(fs.describedby.value, $attrs['aria-describedby'] as string)"
    />
    <span class="bless-switch__track" aria-hidden="true"><span class="bless-switch__thumb" /></span>
    <span v-if="$slots.default" class="bless-switch__label"><slot /></span>
  </label>
</template>

<script setup lang="ts">
import { joinIds, useFieldId, useFieldState } from "../composables/useFieldId";

defineOptions({ name: "BlessSwitch", inheritAttrs: false });

const props = defineProps<{
  id?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  labelPosition?: "end" | "start";
}>();
const model = defineModel<boolean>({ default: false });
const id = useFieldId(props);
const fs = useFieldState();
</script>

<style>
.bless-switch {
  --_w: 40px;
  --_h: 22px;
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-md);
  color: var(--bless-color-text);
  cursor: pointer;
}
.bless-switch--sm {
  --_w: 32px;
  --_h: 18px;
}
.bless-switch--start {
  flex-direction: row-reverse;
}
.bless-switch__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}
.bless-switch__track {
  border-radius: var(--bless-radius-petal);
  position: relative;
  flex: none;
  width: var(--_w);
  height: var(--_h);
  background: var(--bless-color-surface-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  box-sizing: border-box;
  transition:
    background var(--bless-duration-base) var(--bless-ease-out),
    border-color var(--bless-duration-base) var(--bless-ease-out),
    box-shadow var(--bless-duration-base) var(--bless-ease-out);
}
.bless-switch__thumb {
  border-radius: var(--bless-radius-petal);
  position: absolute;
  top: 2px;
  inset-inline-start: 2px;
  width: calc(var(--_h) - 6px);
  height: calc(var(--_h) - 6px);
  background: var(--bless-color-surface);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
  transition: transform var(--bless-duration-base) var(--bless-ease-spring);
}
.bless-switch__input:checked + .bless-switch__track {
  background: var(--bless-color-accent);
  border-color: var(--bless-color-accent);
}
.bless-switch__input:checked + .bless-switch__track .bless-switch__thumb {
  background: var(--bless-color-on-accent);
  transform: translateX(calc(var(--_w) - var(--_h)));
}
/* the thumb starts at the inline start, so in right-to-left it travels left */
[dir="rtl"] .bless-switch__input:checked + .bless-switch__track .bless-switch__thumb {
  transform: translateX(calc(var(--_h) - var(--_w)));
}
.bless-switch__input:focus-visible + .bless-switch__track {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-switch:hover:not(.bless-switch--disabled) .bless-switch__track {
  box-shadow: 0 0 0 3px var(--bless-color-hover);
}
.bless-switch--invalid .bless-switch__track {
  outline: 2px solid var(--bless-color-danger);
  outline-offset: 2px;
}
.bless-switch--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
