<script lang="ts">
/**
 * Checks a GS1 barcode number (EAN-8, UPC-A, EAN-13, or GTIN-14): from the right, the digits
 * have weights 3 and 1 in turn, and the check digit makes the sum a multiple of 10.
 */
export function gs1Valid(code: string): boolean {
  if (!/^\d{8}$|^\d{12,14}$/.test(code)) return false;
  const digits = [...code].map(Number);
  const check = digits.pop()!;
  const sum = digits.reverse().reduce((n, d, i) => n + d * (i % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === check;
}
</script>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessSkuField" });
const pack = useLabelPack("BlessSkuField");

const props = withDefaults(
  defineProps<{
    /** `barcode` takes GS1 numbers and checks them; `sku` takes your own codes */
    kind?: "barcode" | "sku";
    label?: string;
    /** clear the field after each scan, for a run of scans */
    clearOnScan?: boolean;
    labels?: Partial<{
      hint: string;
      valid: string;
      invalid: string;
      scanned: (code: string) => string;
    }>;
  }>(),
  { kind: "barcode", clearOnScan: false },
);
const code = defineModel<string>({ default: "" });
const emit = defineEmits<{ scan: [code: string] }>();

const text = computed(() => ({
  hint: "Scan or type the code, then press Enter.",
  valid: "The check digit is right.",
  invalid: "This barcode is not valid. Check the digits.",
  scanned: (c: string) => `Scanned ${c}`,
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const said = ref("");
const touched = ref(false);
const clean = (v: string) =>
  props.kind === "barcode" ? v.replace(/\D/g, "") : v.toUpperCase().replace(/[^A-Z0-9._-]/g, "");
const state = computed(() =>
  props.kind !== "barcode" || !touched.value || !code.value
    ? ""
    : gs1Valid(code.value)
      ? "valid"
      : "invalid",
);
function onInput(e: Event) {
  code.value = clean((e.target as HTMLInputElement).value);
}
// a scanner types fast and ends with Enter
function submit() {
  touched.value = true;
  if (!code.value || state.value === "invalid") return;
  emit("scan", code.value);
  said.value = text.value.scanned(code.value);
  if (props.clearOnScan) {
    code.value = "";
    touched.value = false;
  }
}
</script>

<template>
  <form class="bless-sku" :class="state && `is-${state}`" @submit.prevent="submit">
    <label class="bless-sku__label" :for="`${uid}-in`">{{
      label ?? (kind === "barcode" ? "Barcode" : "SKU")
    }}</label>
    <div class="bless-sku__box">
      <span class="bless-sku__icon" aria-hidden="true">|||</span>
      <input
        :id="`${uid}-in`"
        class="bless-sku__input"
        :value="code"
        :inputmode="kind === 'barcode' ? 'numeric' : 'text'"
        autocomplete="off"
        autocapitalize="characters"
        spellcheck="false"
        :aria-invalid="state === 'invalid' || undefined"
        :aria-describedby="`${uid}-hint ${uid}-msg`"
        @input="onInput"
        @blur="touched = !!code"
      />
    </div>
    <p :id="`${uid}-hint`" class="bless-sku__hint">{{ text.hint }}</p>
    <p :id="`${uid}-msg`" class="bless-sku__msg" role="status">
      <template v-if="state === 'invalid'">✕ {{ text.invalid }}</template>
      <template v-else-if="state === 'valid'">✓ {{ text.valid }}</template>
    </p>
    <span class="bless-sr" aria-live="polite">{{ said }}</span>
  </form>
</template>

<style>
.bless-sku {
  display: grid;
  gap: var(--bless-space-1);
  max-inline-size: 22rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-sku__label {
  font-weight: var(--bless-font-weight-bold);
}
.bless-sku__box {
  display: flex;
  align-items: center;
  border: 2px solid var(--bless-color-border);
  background: var(--bless-color-bg);
}
.bless-sku__box:focus-within {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.is-invalid .bless-sku__box {
  border-color: var(--bless-color-danger);
  border-style: dashed;
}
.is-valid .bless-sku__box {
  border-color: var(--bless-color-text);
}
.bless-sku__icon {
  padding-inline: var(--bless-space-2);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: -0.1em;
}
.bless-sku__input {
  flex: 1;
  min-inline-size: 0;
  min-block-size: 2.75rem;
  padding: 0 var(--bless-space-2) 0 0;
  border: 0;
  background: none;
  color: inherit;
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-md);
  letter-spacing: 0.05em;
}
.bless-sku__input:focus {
  outline: none;
}
.bless-sku__hint {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-sku__msg {
  margin: 0;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.is-invalid .bless-sku__msg {
  color: var(--bless-color-danger-text);
}
.bless-sku__msg:empty {
  display: none;
}
</style>
