<template>
  <section class="bless-picking" :aria-label="order ? `${text.title}: ${order}` : text.title">
    <div class="bless-picking__head">
      <strong v-if="order" class="bless-picking__order">{{ order }}</strong>
      <span class="bless-picking__progress" role="status">{{
        complete ? text.done : text.progress(picked, total)
      }}</span>
    </div>
    <div class="bless-picking__bar" aria-hidden="true">
      <span :style="{ inlineSize: `${total ? (picked / total) * 100 : 0}%` }" />
    </div>
    <BlessSkuField v-model="code" kind="sku" :label="text.scan" clear-on-scan @scan="scan" />
    <p class="bless-picking__error" role="alert">{{ error }}</p>
    <ol class="bless-stagger bless-picking__list" role="list">
      <li
        v-for="l in ordered"
        :key="l.id"
        class="bless-picking__line"
        :class="{ 'is-done': (l.picked ?? 0) >= l.quantity }"
      >
        <div class="bless-picking__box">
          <span class="bless-picking__loc">{{ l.location }}</span>
          <span class="bless-picking__item">
            <strong>{{ l.name }}</strong>
            <span class="bless-picking__sku">{{ l.sku }}</span>
          </span>
          <span class="bless-picking__count">
            <button
              type="button"
              :aria-label="text.remove(l.name)"
              :disabled="!(l.picked ?? 0)"
              @click="bump(l.id, -1)"
            >
              −
            </button>
            <span class="bless-picking__num">
              <span aria-hidden="true">{{ l.picked ?? 0 }} / {{ l.quantity }}</span>
              <span class="bless-sr">{{ text.picked(l.name, l.picked ?? 0, l.quantity) }}</span>
            </span>
            <button
              type="button"
              :aria-label="text.add(l.name)"
              :disabled="(l.picked ?? 0) >= l.quantity"
              @click="bump(l.id, 1)"
            >
              +
            </button>
          </span>
        </div>
      </li>
    </ol>
    <span class="bless-sr" aria-live="polite">{{ said }}</span>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessSkuField from "./BlessSkuField.vue";
import "./sr.css";

defineOptions({ name: "BlessPickingList" });
const pack = useLabelPack("BlessPickingList");

export interface BlessPickLine {
  id: string;
  sku: string;
  name: string;
  /** the shelf or the bin, for example "A-03-2"; the list walks them in order */
  location: string;
  quantity: number;
  picked?: number;
}

const props = defineProps<{
  /** the order or the wave, for the title */
  order?: string;
  labels?: Partial<{
    title: string;
    scan: string;
    progress: (picked: number, total: number) => string;
    done: string;
    unknown: (code: string) => string;
    tooMany: (name: string) => string;
    picked: (name: string, n: number, q: number) => string;
    add: (name: string) => string;
    remove: (name: string) => string;
  }>;
}>();
const lines = defineModel<BlessPickLine[]>({ default: () => [] });
const emit = defineEmits<{ finish: [] }>();

const text = computed(() => ({
  title: "Picking list",
  scan: "Scan an item",
  progress: (p: number, t: number) => `${p} of ${t} items picked`,
  done: "All items are picked.",
  unknown: (c: string) => `${c} is not on this list.`,
  tooMany: (n: string) => `${n}: all are picked already.`,
  picked: (n: string, p: number, q: number) => `${n}: ${p} of ${q}`,
  add: (n: string) => `One more ${n}`,
  remove: (n: string) => `One less ${n}`,
  ...pack(),
  ...props.labels,
}));
// the walk order: by location, so the picker does not go back
const ordered = computed(() =>
  [...lines.value].sort((a, b) =>
    a.location.localeCompare(b.location, undefined, { numeric: true }),
  ),
);
const total = computed(() => lines.value.reduce((n, l) => n + l.quantity, 0));
const picked = computed(() =>
  lines.value.reduce((n, l) => n + Math.min(l.quantity, l.picked ?? 0), 0),
);
const complete = computed(() => total.value > 0 && picked.value >= total.value);
const said = ref("");
const error = ref("");
const code = ref("");
function bump(id: string, d: 1 | -1) {
  const l = lines.value.find((x) => x.id === id);
  if (!l) return;
  const p = Math.min(l.quantity, Math.max(0, (l.picked ?? 0) + d));
  // the model may update only after the parent writes it back, so check the new list here
  const next = lines.value.map((x) => (x.id === id ? { ...x, picked: p } : x));
  lines.value = next;
  said.value = text.value.picked(l.name, p, l.quantity);
  if (d === 1 && next.every((x) => (x.picked ?? 0) >= x.quantity)) emit("finish");
}
function scan(c: string) {
  error.value = "";
  const l = lines.value.find((x) => x.sku.toUpperCase() === c.toUpperCase());
  if (!l) return (error.value = text.value.unknown(c));
  if ((l.picked ?? 0) >= l.quantity) return (error.value = text.value.tooMany(l.name));
  bump(l.id, 1);
}
</script>

<style>
.bless-picking {
  display: grid;
  gap: var(--bless-space-3);
  max-inline-size: 40rem;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-picking__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.bless-picking__progress {
  font-weight: var(--bless-font-weight-bold);
}
.bless-picking__bar {
  block-size: 0.6rem;
  background: var(--bless-color-surface-2);
}
.bless-picking__bar span {
  display: block;
  block-size: 100%;
  background: var(--bless-color-accent);
}
.bless-picking__error {
  margin: 0;
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-picking__error:empty {
  display: none;
}
.bless-picking__list {
  display: grid;
  gap: var(--bless-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}
/* the space sits on a div, so a list reset of the host page keeps it */
.bless-picking__box {
  display: grid;
  grid-template-columns: 5.5rem 1fr auto;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) var(--bless-space-3);
  border: 2px solid var(--bless-color-border);
}
.is-done > .bless-picking__box {
  border-color: var(--bless-color-text);
  background: var(--bless-color-surface-2);
}
.is-done .bless-picking__item strong {
  text-decoration: line-through;
}
.bless-picking__loc {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
}
.bless-picking__item {
  display: grid;
  min-inline-size: 0;
}
.bless-picking__sku {
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-xs);
}
.bless-picking__count {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-picking__count button {
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border: 2px solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-lg);
  cursor: pointer;
}
.bless-picking__count button:disabled {
  opacity: 0.35;
  cursor: default;
}
.bless-picking__count button:focus-visible {
  outline: 3px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-picking__num {
  min-inline-size: 3.5rem;
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
  text-align: center;
}
.bless-picking__error {
  animation: bless-enter var(--bless-duration-voice) var(--bless-ease-snap);
}
</style>
