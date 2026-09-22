<script setup lang="ts">
import { useFieldId, useFieldState } from "../composables/useFieldId";

defineOptions({ name: "BlessInput", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    type?: string;
    size?: "sm" | "md" | "lg";
    invalid?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    /** text under the field; also wired via aria-describedby */
    description?: string;
    /** error text; sets aria-invalid */
    error?: string;
  }>(),
  { type: "text", size: "md" },
);

const model = defineModel<string | number>({ default: "" });
const id = useFieldId(props);
const fs = useFieldState();
const descId = () => `${id()}-desc`;
const errId = () => `${id()}-err`;

defineExpose({ id });
</script>

<template>
  <div
    class="bless-input"
    :class="[
      `bless-input--${size}`,
      { 'bless-input--invalid': invalid || error, 'bless-input--disabled': disabled },
    ]"
  >
    <div class="bless-input__field">
      <span v-if="$slots.prefix" class="bless-input__affix bless-input__affix--prefix"
        ><slot name="prefix"
      /></span>
      <input
        v-bind="$attrs"
        :id="id()"
        v-model="model"
        :type
        :disabled
        :readonly
        class="bless-input__control"
        :aria-invalid="invalid || error || fs.invalid.value ? 'true' : undefined"
        :aria-describedby="error ? errId() : description ? descId() : fs.describedby.value"
      />
      <span v-if="$slots.suffix" class="bless-input__affix bless-input__affix--suffix"
        ><slot name="suffix"
      /></span>
    </div>
    <p v-if="error" :id="errId()" class="bless-input__error" role="alert">{{ error }}</p>
    <p v-else-if="description" :id="descId()" class="bless-input__description">{{ description }}</p>
  </div>
</template>

<style>
.bless-input {
  --_h: 40px;
  --_fs: var(--bless-text-md);
  display: block;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-input--sm {
  --_h: 32px;
  --_fs: var(--bless-text-sm);
}
.bless-input--lg {
  --_h: 48px;
  --_fs: var(--bless-text-lg);
}
.bless-input__field {
  border-radius: var(--bless-radius-plate);
  position: relative;
  display: flex;
  align-items: center;
  height: var(--_h);
  background: var(--bless-color-surface);
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
  transition: border-color var(--bless-duration-slow) var(--bless-ease-in-out);
}
/* skewed accent underline that grows on focus */
.bless-input__field::after {
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
[dir="rtl"] .bless-input__field::after {
  transform-origin: 100% 50%;
}
.bless-input__field:focus-within::after {
  transform: scaleX(1);
}
.bless-input__control {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 var(--bless-space-3);
  border: 0;
  background: transparent;
  font: inherit;
  font-size: var(--_fs);
  color: inherit;
  outline: 0;
}
.bless-input__control::placeholder {
  color: var(--bless-color-text-muted);
}
.bless-input__control:focus-visible {
  outline: 0;
}
.bless-input__field:focus-within {
  outline: 2px solid transparent;
}
.bless-input__affix {
  display: inline-flex;
  align-items: center;
  flex: none;
  padding: 0 var(--bless-space-3);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-input__affix--prefix + .bless-input__control {
  padding-inline-start: 0;
}
.bless-input__affix--suffix {
  padding-inline-start: 0;
}
.bless-input--invalid .bless-input__field {
  border-bottom-color: var(--bless-color-danger);
}
.bless-input--invalid .bless-input__field::after {
  background: var(--bless-color-danger);
}
.bless-input--disabled {
  opacity: 0.4;
}
.bless-input--disabled .bless-input__control {
  cursor: not-allowed;
}
.bless-input__description,
.bless-input__error {
  margin: var(--bless-space-1) 0 0;
  font-size: var(--bless-text-xs);
  line-height: var(--bless-leading-tight);
  color: var(--bless-color-text-muted);
}
.bless-input__error {
  color: var(--bless-color-danger);
  font-weight: var(--bless-font-weight-bold);
}
/* fields are parallelograms like everything else; content counter-skews so text stays upright */
.bless-input__field {
  transform: skewX(var(--bless-skew));
}
.bless-input__field > :not(.bless-skew, .bless-chip, .bless-badge) {
  transform: skewX(var(--bless-skew-counter));
}
.bless-input__field > :first-child {
  padding-inline-start: calc(var(--bless-space-3) + 4px);
}
.bless-input__field > :last-child {
  padding-inline-end: calc(var(--bless-space-3) + 4px);
}
</style>
