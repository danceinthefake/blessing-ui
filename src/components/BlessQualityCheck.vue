<template>
  <form
    class="bless-quality"
    :aria-label="text.title"
    @submit.prevent="emit('submit', results, passed === items.length)"
  >
    <p class="bless-quality__summary" role="status">
      {{ text.summary(passed, done, items.length)
      }}<template v-if="complete">
        · <strong>{{ passed === items.length ? text.ok : text.notOk }}</strong></template
      >
    </p>
    <ol class="bless-stagger bless-quality__list" role="list">
      <li
        v-for="i in items"
        :key="i.id"
        class="bless-quality__item"
        :class="state(i) === true ? 'is-pass' : state(i) === false ? 'is-fail' : ''"
      >
        <div class="bless-quality__box">
          <span :id="`${uid}-${i.id}`" class="bless-quality__label">{{ i.label }}</span>
          <template v-if="measured(i)">
            <span class="bless-quality__limits">{{ range(i) }}</span>
            <input
              type="number"
              step="any"
              inputmode="decimal"
              :value="results[i.id]?.value ?? ''"
              :aria-labelledby="`${uid}-${i.id}`"
              :aria-invalid="state(i) === false || undefined"
              @change="
                set(i.id, {
                  value:
                    ($event.target as HTMLInputElement).value === ''
                      ? undefined
                      : ($event.target as HTMLInputElement).valueAsNumber,
                })
              "
            />
            <span v-if="state(i) !== undefined" class="bless-quality__verdict">
              <span aria-hidden="true">{{ state(i) ? "✓" : "✕" }}</span>
              {{ state(i) ? text.inLimits : text.outLimits }}
            </span>
          </template>
          <div
            v-else
            class="bless-quality__toggle"
            role="radiogroup"
            :aria-labelledby="`${uid}-${i.id}`"
          >
            <label class="is-pass"
              ><input
                type="radio"
                :name="`${uid}-${i.id}-r`"
                :checked="results[i.id]?.pass === true"
                @change="set(i.id, { pass: true })"
              /><span aria-hidden="true">✓</span> {{ text.pass }}</label
            >
            <label class="is-fail"
              ><input
                type="radio"
                :name="`${uid}-${i.id}-r`"
                :checked="results[i.id]?.pass === false"
                @change="set(i.id, { pass: false })"
              /><span aria-hidden="true">✕</span> {{ text.fail }}</label
            >
          </div>
        </div>
      </li>
    </ol>
    <BlessButton type="submit" :disabled="!complete">{{ text.submit }}</BlessButton>
  </form>
</template>

<script lang="ts">
export interface BlessQualityItem {
  id: string;
  label: string;
  /** a measured value with limits; without it, the check is pass or fail */
  min?: number;
  max?: number;
  unit?: string;
}
export type BlessQualityResult = Record<string, { pass?: boolean; value?: number }>;
/** Whether a check passes: a measure inside its limits, or a pass mark. Undefined until done. */
export function checkPasses(item: BlessQualityItem, r?: { pass?: boolean; value?: number }) {
  if (item.min !== undefined || item.max !== undefined) {
    if (r?.value === undefined || Number.isNaN(r.value)) return undefined;
    return (
      (item.min === undefined || r.value >= item.min) &&
      (item.max === undefined || r.value <= item.max)
    );
  }
  return r?.pass;
}
</script>

<script setup lang="ts">
import { computed, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessQualityCheck" });
const pack = useLabelPack("BlessQualityCheck");

const props = withDefaults(
  defineProps<{
    items: BlessQualityItem[];
    locale?: string;
    labels?: Partial<{
      title: string;
      pass: string;
      fail: string;
      inLimits: string;
      outLimits: string;
      limits: (low: string, high: string) => string;
      summary: (passed: number, done: number, total: number) => string;
      ok: string;
      notOk: string;
      submit: string;
    }>;
  }>(),
  { locale: "en" },
);
const results = defineModel<BlessQualityResult>({ default: () => ({}) });
const emit = defineEmits<{ submit: [results: BlessQualityResult, passed: boolean] }>();

const text = computed(() => ({
  title: "Quality check",
  pass: "Pass",
  fail: "Fail",
  inLimits: "In limits",
  outLimits: "Out of limits",
  limits: (l: string, h: string) => `${l} – ${h}`,
  summary: (p: number, d: number, t: number) => `${p} passed, ${d - p} failed, ${t - d} to do`,
  ok: "The unit passes.",
  notOk: "The unit fails.",
  submit: "Save the check",
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const num = computed(() => new Intl.NumberFormat(props.locale, { maximumFractionDigits: 3 }));
const state = (i: BlessQualityItem) => checkPasses(i, results.value[i.id]);
const done = computed(() => props.items.filter((i) => state(i) !== undefined).length);
const passed = computed(() => props.items.filter((i) => state(i) === true).length);
const complete = computed(() => done.value === props.items.length);
const set = (id: string, r: { pass?: boolean; value?: number }) =>
  (results.value = { ...results.value, [id]: r });
const measured = (i: BlessQualityItem) => i.min !== undefined || i.max !== undefined;
const range = (i: BlessQualityItem) =>
  `${text.value.limits(i.min !== undefined ? num.value.format(i.min) : "…", i.max !== undefined ? num.value.format(i.max) : "…")}${i.unit ? ` ${i.unit}` : ""}`;
</script>

<style>
.bless-quality {
  display: grid;
  justify-items: start;
  gap: var(--bless-space-3);
  max-inline-size: 40rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-quality__summary {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-quality__list {
  display: grid;
  gap: var(--bless-space-2);
  inline-size: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}
/* the space sits on a div, so a list reset of the host page keeps it */
.bless-quality__box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-2) var(--bless-space-3);
  padding: var(--bless-space-3);
  border: 2px solid var(--bless-color-border);
}
.is-pass > .bless-quality__box {
  border-color: var(--bless-color-text);
}
.is-fail > .bless-quality__box {
  border: 2px dashed var(--bless-color-danger);
  background: color-mix(in srgb, var(--bless-color-danger) 8%, var(--bless-color-bg));
}
.bless-quality__label {
  flex: 1 1 12rem;
  font-weight: var(--bless-font-weight-bold);
}
.bless-quality__limits {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text);
  font-variant-numeric: tabular-nums;
}
.bless-quality__box input[type="number"] {
  inline-size: 7rem;
  min-block-size: 2.75rem;
  padding: 0 var(--bless-space-2);
  border: 2px solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-md);
  text-align: end;
}
.bless-quality__verdict {
  font-weight: var(--bless-font-weight-bold);
}
.is-fail .bless-quality__verdict {
  color: var(--bless-color-danger-text);
}
.bless-quality__toggle {
  display: flex;
  gap: var(--bless-space-2);
}
.bless-quality__toggle label {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  min-block-size: 2.75rem;
  padding: 0 var(--bless-space-3);
  border: 2px solid var(--bless-color-border);
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
}
.bless-quality__toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.bless-quality__toggle label.is-pass:has(:checked) {
  border-color: var(--bless-color-text);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-quality__toggle label.is-fail:has(:checked) {
  border-color: var(--bless-color-danger);
  background: var(--bless-color-danger);
  color: #fff;
}
.bless-quality__toggle label:has(:focus-visible),
.bless-quality__box input[type="number"]:focus-visible {
  outline: 3px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
