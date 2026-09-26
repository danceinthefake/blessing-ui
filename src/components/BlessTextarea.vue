<script setup lang="ts">
import { computed } from "vue";
import { joinIds, useFieldId, useFieldState } from "../composables/useFieldId";

defineOptions({ name: "BlessTextarea", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    id?: string;
    rows?: number;
    /** grow with content (field-sizing: content) */
    autogrow?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    description?: string;
    error?: string;
    maxlength?: number;
    /** show n / maxlength */
    counter?: boolean;
  }>(),
  { rows: 3, autogrow: true },
);

const model = defineModel<string>({ default: "" });
const id = useFieldId(props);
const fs = useFieldState();
const descId = () => `${id()}-desc`;
// the count is announced only near the limit; a live count on every keystroke is noise
const near = computed(
  () =>
    !!props.maxlength &&
    props.maxlength - String(model.value).length <= Math.max(10, props.maxlength * 0.1),
);
const errId = () => `${id()}-err`;
</script>

<template>
  <div
    class="bless-textarea"
    :class="{
      'bless-textarea--invalid': invalid || error || fs.invalid.value,
      'bless-textarea--disabled': disabled,
      'bless-textarea--autogrow': autogrow,
    }"
  >
    <div class="bless-textarea__field bless-lean--field">
      <textarea
        v-bind="$attrs"
        :id="id()"
        v-model="model"
        :rows
        :disabled
        :readonly
        :maxlength
        class="bless-textarea__control"
        :aria-invalid="invalid || error || fs.invalid.value ? 'true' : undefined"
        :aria-describedby="
          joinIds(
            description && descId(),
            error && errId(),
            fs.describedby.value,
            $attrs['aria-describedby'] as string,
          )
        "
      />
    </div>
    <div class="bless-textarea__foot">
      <p v-if="description" :id="descId()" class="bless-textarea__description">
        {{ description }}
      </p>
      <p v-if="error" :id="errId()" class="bless-textarea__error" role="alert">{{ error }}</p>
      <span
        v-if="counter && maxlength"
        class="bless-textarea__counter"
        :aria-live="near ? 'polite' : 'off'"
        >{{ String(model).length }} / {{ maxlength }}</span
      >
    </div>
  </div>
</template>

<style>
.bless-textarea {
  display: block;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-textarea__field {
  border-radius: var(--bless-radius-plate);
  position: relative;
  background: transparent; /* a line you write on, not a box */
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-text-muted);
}
.bless-textarea__field::after {
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
[dir="rtl"] .bless-textarea__field::after {
  transform-origin: 100% 50%;
}
.bless-textarea__field:focus-within::after {
  transform: scaleX(1);
}
.bless-textarea__control {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: var(--bless-space-3);
  border: 0;
  background: transparent;
  font: inherit;
  font-size: var(--bless-text-md);
  line-height: var(--bless-leading-normal);
  color: inherit;
  resize: vertical;
  outline: 0;
}
.bless-textarea--autogrow .bless-textarea__control {
  field-sizing: content;
  resize: none;
}
.bless-textarea__control::placeholder {
  color: var(--bless-color-text-muted);
}
.bless-textarea--invalid .bless-textarea__field {
  border-bottom-color: var(--bless-color-danger);
}
.bless-textarea--invalid .bless-textarea__field::after {
  background: var(--bless-color-danger);
}
.bless-textarea--disabled {
  opacity: 0.4;
}
.bless-textarea--disabled .bless-textarea__control {
  cursor: not-allowed;
}
.bless-textarea__foot {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-3);
}
.bless-textarea__description,
.bless-textarea__error {
  margin: var(--bless-space-1) 0 0;
  font-size: var(--bless-text-xs);
  line-height: var(--bless-leading-tight);
  color: var(--bless-color-text-muted);
}
.bless-textarea__error {
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-textarea__counter {
  margin-inline-start: auto;
  margin-top: var(--bless-space-1);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
/* fields are parallelograms like everything else; content counter-skews so text stays upright */
.bless-textarea__field {
  transform: skewX(var(--bless-skew));
}
.bless-textarea__field > :not(.bless-skew, .bless-chip, .bless-badge) {
  transform: skewX(var(--bless-skew-counter));
}
.bless-textarea__field > :first-child {
  padding-inline-start: calc(var(--bless-space-3) + 4px);
}
.bless-textarea__field > :last-child {
  padding-inline-end: calc(var(--bless-space-3) + 4px);
}
</style>
