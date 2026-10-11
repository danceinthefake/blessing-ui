<script setup lang="ts">
import { computed, ref } from "vue";
import BlessInput from "./BlessInput.vue";
import { caretAfterDigits, cardBrand, cardDigits, formatCard, luhn } from "./card";
import type { BlessCardBrand } from "./card";

defineOptions({ name: "BlessCardInput", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** check the number with the Luhn algorithm once it is complete */
    validate?: boolean;
    labels?: Partial<{ invalid: string }>;
  }>(),
  { validate: true },
);
/** the digits only, for example `4242424242424242` */
const model = defineModel<string>({ default: "" });
const emit = defineEmits<{ brand: [brand: BlessCardBrand] }>();

const text = computed(() => ({ invalid: "Check the card number", ...props.labels }));
const digits = computed(() => cardDigits(model.value));
const brand = computed(() => cardBrand(digits.value));
const shown = computed(() => formatCard(digits.value));
// a number is complete when it has the length of its brand; only a complete one can be wrong
const complete = computed(() =>
  brand.value === "amex" ? digits.value.length === 15 : digits.value.length >= 13,
);
const bad = computed(() => props.validate && complete.value && !luhn(digits.value));
const touched = ref(false);

// Runs in capture, before v-model reads the box: rewrite the box itself, so a rejected
// character cannot stay visible, and keep the caret next to the digit that was typed.
function fix(e: Event) {
  const el = e.target as HTMLInputElement;
  const before = cardDigits(el.value.slice(0, el.selectionStart ?? el.value.length)).length;
  const d = cardDigits(el.value);
  const f = formatCard(d);
  const prev = brand.value;
  if (el.value !== f) {
    el.value = f;
    const at = caretAfterDigits(f, Math.min(before, d.length));
    el.setSelectionRange(at, at);
  }
  model.value = d;
  if (cardBrand(d) !== prev) emit("brand", cardBrand(d));
}
</script>

<template>
  <BlessInput
    v-bind="$attrs"
    :model-value="shown"
    type="text"
    inputmode="numeric"
    autocomplete="cc-number"
    :invalid="touched && bad"
    :error="touched && bad ? text.invalid : undefined"
    @input.capture="fix"
    @blur="touched = true"
  >
    <template v-if="brand !== 'unknown'" #suffix
      ><span class="bless-card-input__brand">{{ brand }}</span></template
    >
  </BlessInput>
</template>

<style>
.bless-card-input__brand {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
</style>
