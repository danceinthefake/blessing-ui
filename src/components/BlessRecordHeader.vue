<template>
  <header class="bless-record">
    <div class="bless-record__top">
      <div class="bless-record__name">
        <span v-if="code" class="bless-record__code">{{ code }}</span>
        <component :is="`h${level}`" class="bless-record__title">{{ title }}</component>
        <span v-if="status" class="bless-record__status" :class="`is-${color}`">
          <span aria-hidden="true">{{ MARK[color] }}</span> {{ status }}
        </span>
      </div>
      <div v-if="$slots.default" class="bless-record__actions"><slot /></div>
    </div>
    <dl v-if="facts.length" class="bless-record__facts">
      <div v-for="f in facts" :key="f.label" class="bless-record__fact">
        <dt>{{ f.label }}</dt>
        <dd>{{ f.value }}</dd>
      </div>
    </dl>
  </header>
</template>

<script setup lang="ts">
defineOptions({ name: "BlessRecordHeader" });

export interface BlessRecordFact {
  label: string;
  value: string;
}

withDefaults(
  defineProps<{
    title: string;
    /** the code of the record, for example "PO-2026-0142" */
    code?: string;
    /** the state, as a word */
    status?: string;
    /** how the state reads: a mark and a tint */
    color?: "text" | "success" | "warning" | "danger";
    facts?: BlessRecordFact[];
    /** the heading level of the title */
    level?: 1 | 2 | 3;
  }>(),
  { color: "text", facts: () => [], level: 1 },
);
const MARK = { text: "●", success: "✓", warning: "!", danger: "✕" } as const;
</script>

<style>
.bless-record {
  display: grid;
  gap: var(--bless-space-3);
  padding-block-end: var(--bless-space-3);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-record__top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--bless-space-3);
}
.bless-record__name {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-1) var(--bless-space-3);
  min-inline-size: 0;
}
.bless-record__code {
  flex-basis: 100%;
  font-family: var(--bless-font-mono, ui-monospace, monospace);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
/* two classes, so the heading styles of a host page do not win */
.bless-record .bless-record__title {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-lg);
  line-height: var(--bless-leading-tight);
}
.bless-record__status {
  padding: 2px var(--bless-space-2);
  border: var(--bless-border-width) solid currentColor;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-record__status.is-danger {
  color: var(--bless-color-danger-text);
}
.bless-record__status.is-success {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  border-color: var(--bless-color-text);
}
.bless-record__status.is-warning {
  border-style: dashed;
}
.bless-record__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.bless-record__facts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: var(--bless-space-2) var(--bless-space-4);
  margin: 0;
}
.bless-record__fact {
  display: grid;
  gap: 2px;
}
.bless-record__fact dt {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-record__fact dd {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
.bless-record {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
