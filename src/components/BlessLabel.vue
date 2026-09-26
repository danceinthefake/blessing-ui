<script setup lang="ts">
defineOptions({ name: "BlessLabel" });

defineProps<{
  for?: string;
  /** draws the * only; put `required` on the control too */
  required?: boolean;
  /** a word or two after the label ("optional"); it is part of the label's accessible name */
  hint?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <label class="bless-label" :class="{ 'bless-label--disabled': disabled }" :for>
    <span class="bless-label__text"><slot /></span>
    <span v-if="required" class="bless-label__required" aria-hidden="true">*</span>
    <span v-if="hint" class="bless-label__hint">{{ hint }}</span>
  </label>
</template>

<style>
.bless-label {
  display: inline-flex;
  align-items: baseline;
  gap: var(--bless-space-1);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  line-height: var(--bless-leading-tight);
  text-transform: uppercase;
  color: var(--bless-color-text);
  cursor: default;
}
.bless-label[for] {
  cursor: pointer;
}
.bless-label--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
/* ink: a required mark is a fact about the field, not a choice */
.bless-label__required {
  color: inherit;
}
.bless-label__hint {
  margin-inline-start: var(--bless-space-1);
  font-weight: var(--bless-font-weight-normal);
  text-transform: none;
  letter-spacing: var(--bless-tracking-normal);
  color: var(--bless-color-text-muted);
}
</style>
