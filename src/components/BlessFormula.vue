<script lang="ts">
export interface BlessFormulaVariable {
  name: string;
  /** what the chip says instead of the name */
  label?: string;
  value: number;
}
export type { FormulaError as BlessFormulaError } from "../composables/formula";
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, watch } from "vue";
import { evaluate, usedNames, type FormulaError, type FormulaFns } from "../composables/formula";

defineOptions({ name: "BlessFormula" });

const props = withDefaults(
  defineProps<{
    variables?: BlessFormulaVariable[];
    /** extra functions: `{ vat: (x) => x * 0.11 }` */
    functions?: FormulaFns;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    locale?: string;
    labels?: Partial<{
      insert: string;
      result: (value: string) => string;
      error: (e: FormulaError) => string;
      use: (name: string) => string;
    }>;
  }>(),
  { variables: () => [], label: "Formula", placeholder: "price * qty" },
);
const model = defineModel<string>({ default: "" });
const emit = defineEmits<{ result: [value: number | null] }>();

const text = computed(() => ({
  insert: "Insert a value",
  result: (v: string) => `= ${v}`,
  use: (n: string) => `Use “${n}”`,
  error: (e: FormulaError) => {
    switch (e.code) {
      case "unexpected":
        return e.name
          ? `Unexpected “${e.name}” at position ${e.pos + 1}`
          : "The formula ends too soon";
      case "unclosed":
        return "A bracket is not closed";
      case "unknown-variable":
        return `Unknown value “${e.name}”${e.suggestion ? ` — did you mean “${e.suggestion}”?` : ""}`;
      case "unknown-function":
        return `Unknown function “${e.name}”${e.suggestion ? ` — did you mean “${e.suggestion}”?` : ""}`;
      case "arity":
        return `${e.name} needs a value to work on`;
      case "divide-by-zero":
        return "Division by zero";
      default:
        return "The result is not a number";
    }
  },
  ...props.labels,
}));

const id = useId();
const input = ref<HTMLInputElement>();
const vars = computed(() => Object.fromEntries(props.variables.map((v) => [v.name, v.value])));
const outcome = computed(() => evaluate(model.value, vars.value, props.functions));
const empty = computed(() => !outcome.value.ok && outcome.value.error.code === "empty");
const error = computed(() => (outcome.value.ok || empty.value ? null : outcome.value.error));
const shown = computed(() =>
  outcome.value.ok
    ? new Intl.NumberFormat(props.locale, { maximumFractionDigits: 6 }).format(outcome.value.value)
    : "",
);
const used = computed(() => new Set(usedNames(model.value)));
// emitted once the page is live, not during setup: a parent that shows the value would otherwise
// render it on the server but start from its old value on the client, and hydration would disagree
const tell = () => emit("result", outcome.value.ok ? outcome.value.value : null);
onMounted(tell);
watch(outcome, tell);

/** put a name at the caret, with a space where it would otherwise touch a word */
async function insert(name: string) {
  const el = input.value;
  const src = model.value;
  const a = el?.selectionStart ?? src.length;
  const b = el?.selectionEnd ?? src.length;
  const word = /[A-Za-z0-9_.)]/;
  const pre = a > 0 && word.test(src[a - 1]!) ? " " : "";
  const post = b < src.length && word.test(src[b]!) ? " " : "";
  model.value = src.slice(0, a) + pre + name + post + src.slice(b);
  const caret = a + pre.length + name.length;
  await nextTick();
  el?.focus();
  el?.setSelectionRange(caret, caret);
}
function applySuggestion(e: FormulaError) {
  model.value = model.value.slice(0, e.pos) + e.suggestion + model.value.slice(e.pos + e.length);
  nextTick(() => input.value?.focus());
}
</script>

<template>
  <div class="bless-formula" :class="{ 'bless-formula--bad': error }">
    <label class="bless-formula__label" :for="`${id}-in`">{{ label }}</label>
    <input
      :id="`${id}-in`"
      ref="input"
      v-model="model"
      class="bless-formula__input"
      type="text"
      spellcheck="false"
      autocomplete="off"
      autocapitalize="off"
      :placeholder
      :disabled
      :aria-invalid="error ? true : undefined"
      :aria-describedby="`${id}-out`"
    />
    <div v-if="variables.length" class="bless-formula__vars" role="group" :aria-label="text.insert">
      <button
        v-for="v in variables"
        :key="v.name"
        type="button"
        class="bless-formula__chip"
        :aria-pressed="used.has(v.name)"
        :title="`${v.name} = ${v.value}`"
        :disabled
        @click="insert(v.name)"
      >
        {{ v.label ?? v.name }}
      </button>
    </div>
    <p :id="`${id}-out`" class="bless-formula__out" role="status" aria-live="polite">
      <template v-if="error">
        <span class="bless-formula__error">{{ text.error(error) }}</span>
        <button
          v-if="error.suggestion"
          type="button"
          class="bless-formula__fix"
          @click="applySuggestion(error)"
        >
          {{ text.use(error.suggestion) }}
        </button>
      </template>
      <span v-else-if="outcome.ok" class="bless-formula__value">{{ text.result(shown) }}</span>
    </p>
  </div>
</template>

<style>
.bless-formula {
  display: grid;
  gap: var(--bless-space-2);
  max-width: 480px;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-formula__label {
  font-weight: var(--bless-font-weight-bold, 700);
}
.bless-formula__input {
  box-sizing: border-box;
  width: 100%;
  min-height: 36px;
  padding: var(--bless-space-1) var(--bless-space-3);
  background: var(--bless-color-bg);
  border: var(--bless-border-width) solid var(--bless-color-border);
  color: var(--bless-color-text);
  font: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.bless-formula__input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-formula--bad .bless-formula__input {
  border-color: var(--bless-color-danger);
}
.bless-formula__vars {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1);
}
.bless-formula__chip {
  padding: 2px var(--bless-space-2);
  background: var(--bless-color-surface);
  border: var(--bless-border-width) solid var(--bless-color-border);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-xs);
  cursor: pointer;
}
.bless-formula__chip[aria-pressed="true"] {
  border-color: var(--bless-color-accent);
  color: var(--bless-color-accent-text);
}
.bless-formula__chip:focus-visible,
.bless-formula__fix:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-formula__out {
  min-height: 1.6em;
  margin: 0;
}
.bless-formula__value {
  font-weight: var(--bless-font-weight-bold, 700);
}
.bless-formula__error {
  color: var(--bless-color-danger-text);
}
.bless-formula__fix {
  margin-inline-start: var(--bless-space-2);
  padding: 0;
  border: 0;
  background: none;
  color: var(--bless-color-accent-text);
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}
</style>
