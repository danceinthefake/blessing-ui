<template>
  <article class="bless-handover">
    <header class="bless-handover__head">
      <h3 class="bless-handover__title">{{ title }}</h3>
      <span class="bless-handover__by">{{ by }}</span>
    </header>
    <dl v-if="facts?.length" class="bless-handover__facts">
      <div v-for="f in facts" :key="f.label">
        <dt>{{ f.label }}</dt>
        <dd>{{ f.value }}</dd>
      </div>
    </dl>
    <div v-if="notes" class="bless-handover__notes">{{ notes }}</div>
    <section v-if="issues.length" class="bless-handover__issues" :aria-label="text.issues">
      <p class="bless-handover__count" role="status">{{ text.open(openCount) }}</p>
      <ul class="bless-stagger bless-handover__list" role="list">
        <li v-for="i in sorted" :key="i.id" :class="[`is-${i.level}`, { 'is-closed': i.closed }]">
          <label class="bless-handover__issue">
            <input
              type="checkbox"
              :checked="!!i.closed"
              :aria-label="text.close(i.text)"
              @change="flip(i.id, ($event.target as HTMLInputElement).checked)"
            />
            <span class="bless-handover__level"
              ><span aria-hidden="true">{{ MARK[i.level] }}</span> {{ text[i.level] }}</span
            >
            <span class="bless-handover__text"
              >{{ i.text }}<template v-if="i.owner"> · {{ text.owner(i.owner) }}</template></span
            >
          </label>
        </li>
      </ul>
    </section>
    <footer class="bless-handover__foot">
      <p v-if="readBy" class="bless-handover__read">✓ {{ text.readBy(readBy) }}</p>
      <BlessButton v-else @click="emit('acknowledge')">{{ text.acknowledge }}</BlessButton>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessShiftHandover" });
const pack = useLabelPack("BlessShiftHandover");

export type BlessIssueLevel = "info" | "watch" | "stop";
export interface BlessHandoverIssue {
  id: string;
  text: string;
  level: BlessIssueLevel;
  closed?: boolean;
  owner?: string;
}

const props = defineProps<{
  /** for example "Night shift → Morning shift" */
  title: string;
  /** who wrote it and when, as text */
  by: string;
  notes?: string;
  /** key numbers of the shift, for example output against target */
  facts?: { label: string; value: string }[];
  /** who took over, after the button */
  readBy?: string;
  labels?: Partial<
    Record<BlessIssueLevel, string> & {
      issues: string;
      open: (count: number) => string;
      close: (text: string) => string;
      acknowledge: string;
      readBy: (name: string) => string;
      owner: (name: string) => string;
    }
  >;
}>();
const issues = defineModel<BlessHandoverIssue[]>("issues", { default: () => [] });
const emit = defineEmits<{ acknowledge: [] }>();

const text = computed(() => ({
  info: "Info",
  watch: "Watch",
  stop: "Stop",
  issues: "Open issues",
  open: (n: number) => (n === 1 ? "1 issue open" : `${n} issues open`),
  close: (t: string) => `Closed: ${t}`,
  acknowledge: "Read and take over",
  readBy: (n: string) => `Taken over by ${n}`,
  owner: (n: string) => `owner ${n}`,
  ...pack(),
  ...props.labels,
}));
const LEVEL_ORDER: BlessIssueLevel[] = ["stop", "watch", "info"];
const MARK: Record<BlessIssueLevel, string> = { stop: "✕", watch: "!", info: "i" };
const sorted = computed(() =>
  [...issues.value].sort(
    (a, b) =>
      Number(!!a.closed) - Number(!!b.closed) ||
      LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level),
  ),
);
const openCount = computed(() => issues.value.filter((i) => !i.closed).length);
const flip = (id: string, closed: boolean) =>
  (issues.value = issues.value.map((i) => (i.id === id ? { ...i, closed } : i)));
</script>

<style>
.bless-handover {
  display: grid;
  gap: var(--bless-space-3);
  max-inline-size: 40rem;
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-handover__head {
  display: grid;
  gap: 2px;
}
/* two classes, so the heading styles of a host page do not win */
.bless-handover .bless-handover__title {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: var(--bless-text-lg);
}
.bless-handover__by {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-handover__facts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  gap: var(--bless-space-2);
  margin: 0;
}
.bless-handover__facts div {
  padding: var(--bless-space-2);
  background: var(--bless-color-surface-2);
}
.bless-handover__facts dt {
  font-size: var(--bless-text-xs);
}
.bless-handover__facts dd {
  margin: 0;
  font-size: var(--bless-text-md);
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
.bless-handover__notes {
  line-height: 1.55;
  white-space: pre-line;
}
.bless-handover__issues {
  display: grid;
  gap: var(--bless-space-2);
}
.bless-handover__count {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-handover__list {
  display: grid;
  gap: var(--bless-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-handover__issue {
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  cursor: pointer;
}
.is-stop > .bless-handover__issue {
  border: 2px solid var(--bless-color-danger);
}
.is-watch > .bless-handover__issue {
  border: 2px dashed var(--bless-color-text);
}
.bless-handover__issue input {
  flex: none;
  inline-size: 1.15rem;
  block-size: 1.15rem;
  margin-block-start: 2px;
  accent-color: var(--bless-color-accent);
}
.bless-handover__issue input:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-handover__level {
  flex: none;
  min-inline-size: 4.5rem;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  text-transform: var(--bless-label-case);
}
.is-stop .bless-handover__level {
  color: var(--bless-color-danger-text);
}
.is-closed .bless-handover__text {
  text-decoration: line-through;
  color: var(--bless-color-text-muted);
}
.bless-handover__read {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
</style>
