<template>
  <section class="bless-prodcount" :aria-label="text.title">
    <div class="bless-prodcount__numbers">
      <div class="bless-prodcount__num is-good">
        <span class="bless-prodcount__label">{{ text.good }}</span>
        <strong>{{ num.format(good) }}</strong>
        <span v-if="target" class="bless-prodcount__target">{{
          text.target(num.format(target))
        }}</span>
      </div>
      <div class="bless-prodcount__num is-scrap">
        <span class="bless-prodcount__label">{{ text.scrap }}</span>
        <strong>{{ num.format(scrap) }}</strong>
        <span class="bless-prodcount__target">{{
          text.yield(total ? pct.format(good / total) : "—")
        }}</span>
      </div>
    </div>
    <div v-if="target" class="bless-prodcount__track" aria-hidden="true">
      <span :style="{ inlineSize: `${share * 100}%` }" />
    </div>
    <div class="bless-prodcount__buttons">
      <button type="button" class="bless-prodcount__btn is-good" @click="count('good')">
        {{ text.addGood }}
      </button>
      <button type="button" class="bless-prodcount__btn is-scrap" @click="count('scrap')">
        {{ text.addScrap }}
      </button>
    </div>
    <button type="button" class="bless-prodcount__undo" :disabled="!history.length" @click="undo">
      ↶ {{ text.undo }}
    </button>
    <span class="bless-sr" role="status">{{ said }}</span>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";

defineOptions({ name: "BlessProductionCounter" });
const pack = useLabelPack("BlessProductionCounter");

const props = withDefaults(
  defineProps<{
    /** how many good pieces the shift must make */
    target?: number;
    locale?: string;
    labels?: Partial<{
      title: string;
      good: string;
      scrap: string;
      addGood: string;
      addScrap: string;
      undo: string;
      target: (n: string) => string;
      yield: (percent: string) => string;
      said: (good: string, scrap: string) => string;
    }>;
  }>(),
  { locale: "en" },
);
const good = defineModel<number>("good", { default: 0 });
const scrap = defineModel<number>("scrap", { default: 0 });

const text = computed(() => ({
  title: "Production count",
  good: "Good",
  scrap: "Scrap",
  addGood: "+1 Good",
  addScrap: "+1 Scrap",
  undo: "Undo the last count",
  target: (n: string) => `of ${n}`,
  yield: (p: string) => `Yield ${p}`,
  said: (g: string, s: string) => `${g} good, ${s} scrap`,
  ...pack(),
  ...props.labels,
}));
const num = computed(() => new Intl.NumberFormat(props.locale));
const pct = computed(
  () => new Intl.NumberFormat(props.locale, { style: "percent", maximumFractionDigits: 1 }),
);
// the last taps, so a wrong tap can be taken back
const history = ref<("good" | "scrap")[]>([]);
const said = ref("");
// the models may update only after the parent writes them back, so the new values are set here
function set(g: number, sc: number) {
  good.value = g;
  scrap.value = sc;
  said.value = text.value.said(num.value.format(g), num.value.format(sc));
}
function count(kind: "good" | "scrap") {
  history.value.push(kind);
  set(good.value + (kind === "good" ? 1 : 0), scrap.value + (kind === "scrap" ? 1 : 0));
}
function undo() {
  const last = history.value.pop();
  if (!last) return;
  set(
    Math.max(0, good.value - (last === "good" ? 1 : 0)),
    Math.max(0, scrap.value - (last === "scrap" ? 1 : 0)),
  );
}
const total = computed(() => good.value + scrap.value);
const share = computed(() => (props.target ? Math.min(1, good.value / props.target) : 0));
</script>

<style>
.bless-prodcount {
  display: grid;
  gap: var(--bless-space-3);
  max-inline-size: 30rem;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-prodcount__numbers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--bless-space-3);
}
.bless-prodcount__num {
  display: grid;
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-prodcount__num strong {
  font-size: var(--bless-text-headline);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.bless-prodcount__label {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  text-transform: uppercase;
}
.bless-prodcount__target {
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-prodcount__num.is-scrap strong {
  color: var(--bless-color-danger-text);
}
.bless-prodcount__track {
  block-size: 0.75rem;
  background: var(--bless-color-surface-2);
}
.bless-prodcount__track span {
  display: block;
  block-size: 100%;
  background: var(--bless-color-accent);
}
/* big targets, for gloves and a quick tap at a station */
.bless-prodcount__buttons {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--bless-space-3);
}
.bless-prodcount__btn {
  min-block-size: 5rem;
  border: 0;
  font: inherit;
  font-size: var(--bless-text-xl);
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
  touch-action: manipulation;
}
.bless-prodcount__btn.is-good {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
}
.bless-prodcount__btn.is-scrap {
  border: 3px dashed var(--bless-color-danger);
  background: var(--bless-color-bg);
  color: var(--bless-color-danger-text);
}
.bless-prodcount__btn:active {
  transform: translateY(2px);
}
.bless-prodcount__btn:focus-visible,
.bless-prodcount__undo:focus-visible {
  outline: 3px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-prodcount__undo {
  justify-self: start;
  min-block-size: 2.75rem;
  padding: 0 var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-prodcount__undo:disabled {
  opacity: 0.4;
  cursor: default;
}
.bless-prodcount {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
