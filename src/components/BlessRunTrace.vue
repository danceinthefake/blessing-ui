<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessRunTrace" });
const pack = useLabelPack("BlessRunTrace");

export type BlessTraceStatus = "ok" | "error" | "running";
export interface BlessTraceStep {
  id: string;
  name: string;
  /** for example "model", "tool", or "search" */
  kind: string;
  status: BlessTraceStatus;
  /** milliseconds from the start of the run */
  start: number;
  duration: number;
  input?: string;
  output?: string;
  children?: BlessTraceStep[];
}

const props = withDefaults(
  defineProps<{
    steps: BlessTraceStep[];
    locale?: string;
    labels?: Partial<
      Record<BlessTraceStatus, string> & {
        summary: (steps: number, time: string, errors: number) => string;
        input: string;
        output: string;
      }
    >;
  }>(),
  { locale: "en" },
);

const text = computed(() => ({
  ok: "done",
  error: "error",
  running: "running",
  summary: (n: number, t: string, e: number) =>
    `${n} steps · ${t}${e ? ` · ${e === 1 ? "1 error" : `${e} errors`}` : ""}`,
  input: "Input",
  output: "Output",
  ...pack(),
  ...props.labels,
}));
// the tree as rows with their depth, in the order of the run
const rows = computed(() => {
  const out: (BlessTraceStep & { depth: number })[] = [];
  const walk = (list: BlessTraceStep[], depth: number) =>
    list.forEach((s) => {
      out.push({ ...s, depth });
      if (s.children) walk(s.children, depth + 1);
    });
  walk(props.steps, 0);
  return out;
});
const total = computed(() => Math.max(1, ...rows.value.map((r) => r.start + r.duration)));
function time(ms: number) {
  const s = ms >= 1000;
  return new Intl.NumberFormat(props.locale, {
    style: "unit",
    unit: s ? "second" : "millisecond",
    unitDisplay: "narrow",
    maximumFractionDigits: s ? 1 : 0,
  }).format(s ? ms / 1000 : ms);
}
const MARK: Record<BlessTraceStatus, string> = { ok: "✓", error: "✕", running: "◐" };
const errors = computed(() => rows.value.filter((r) => r.status === "error").length);
</script>

<template>
  <div class="bless-trace">
    <div class="bless-trace__summary">{{ text.summary(rows.length, time(total), errors) }}</div>
    <ol class="bless-trace__list" role="list">
      <li v-for="r in rows" :key="r.id" :class="`is-${r.status}`">
        <details class="bless-trace__step" :style="{ '--_depth': r.depth }">
          <summary class="bless-trace__sum">
            <div class="bless-trace__row">
              <span class="bless-trace__name">
                <span class="bless-trace__mark" aria-hidden="true">{{ MARK[r.status] }}</span>
                {{ r.name }}
                <span class="bless-trace__kind">{{ r.kind }}</span>{{ " "
                }}<span class="bless-trace__status">{{ text[r.status] }}</span>
              </span>
              <span class="bless-trace__lane" aria-hidden="true">
                <span
                  :style="{
                    insetInlineStart: `${(r.start / total) * 100}%`,
                    inlineSize: `max(2px, ${(r.duration / total) * 100}%)`,
                  }"
                />
              </span>
              <span class="bless-trace__time">{{ time(r.duration) }}</span>
            </div>
          </summary>
          <div class="bless-trace__io">
            <template v-if="r.input">
              <div class="bless-trace__label">{{ text.input }}</div>
              <pre>{{ r.input }}</pre>
            </template>
            <template v-if="r.output">
              <div class="bless-trace__label">{{ text.output }}</div>
              <pre>{{ r.output }}</pre>
            </template>
          </div>
        </details>
      </li>
    </ol>
  </div>
</template>

<style>
.bless-trace {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-trace__summary {
  font-weight: var(--bless-font-weight-bold);
}
.bless-trace__list {
  margin: 0;
  padding: 0;
  list-style: none;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-trace__list li + li {
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-trace__row {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(6rem, 1fr) 4rem;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-2) var(--bless-space-3);
  padding-inline-start: calc(var(--bless-space-3) + var(--_depth) * 1.25rem);
}
/* the space sits on a div, so a reset of details and summary in the host page keeps it */
.bless-trace__sum {
  list-style: none;
  cursor: pointer;
}
.bless-trace__sum::-webkit-details-marker {
  display: none;
}
.bless-trace__sum:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: -2px;
}
.bless-trace__step[open] .bless-trace__row {
  background: var(--bless-color-surface-2);
}
.bless-trace__name {
  min-inline-size: 0;
  overflow: hidden;
  font-weight: var(--bless-font-weight-bold);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-trace__mark {
  display: inline-block;
  inline-size: 1.25em;
}
.is-error .bless-trace__mark,
.is-error .bless-trace__status {
  color: var(--bless-color-danger-text);
}
.bless-trace__kind,
.bless-trace__status {
  margin-inline-start: var(--bless-space-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-normal);
}
.bless-trace__kind {
  padding: 0 var(--bless-space-1);
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-trace__lane {
  position: relative;
  block-size: 0.75rem;
  background: var(--bless-color-surface-2);
}
.bless-trace__lane span {
  position: absolute;
  inset-block: 0;
  background: var(--bless-color-chart-1, var(--bless-color-accent));
}
.is-error .bless-trace__lane span {
  background: repeating-linear-gradient(
    135deg,
    var(--bless-color-danger) 0 4px,
    transparent 4px 7px
  );
}
.is-running .bless-trace__lane span {
  opacity: 0.6;
}
.bless-trace__time {
  font-variant-numeric: tabular-nums;
  text-align: end;
}
.bless-trace__io {
  display: grid;
  gap: var(--bless-space-1);
  padding: var(--bless-space-2) var(--bless-space-3) var(--bless-space-3);
  padding-inline-start: calc(var(--bless-space-3) + var(--_depth) * 1.25rem);
}
.bless-trace__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-trace__io pre {
  margin: 0;
  max-block-size: 12rem;
  overflow: auto;
  padding: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-xs);
  white-space: pre-wrap;
}
.bless-trace {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
