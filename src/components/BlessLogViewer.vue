<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { parseAnsi, stripAnsi, type AnsiSegment } from "./ansi";
import BlessVirtualScroller from "./BlessVirtualScroller.vue";

defineOptions({ name: "BlessLogViewer" });
const pack = useLabelPack("BlessLogViewer");

const props = withDefaults(
  defineProps<{
    /** the log, one string per line; ANSI colors are kept, other escape codes dropped */
    lines: string[];
    /** CSS height of the line area */
    height?: string;
    /** names the log for screen readers */
    label?: string;
    labels?: Partial<{
      filter: string;
      follow: string;
      empty: string;
      count: (shown: number, total: number) => string;
    }>;
  }>(),
  { height: "320px", label: "Log" },
);
/** keep the newest line in view; scrolling up turns it off, scrolling to the end turns it on */
const follow = defineModel<boolean>("follow", { default: true });

const text = computed(() => ({
  filter: "Filter lines",
  follow: "Follow",
  empty: "No lines",
  count: (shown: number, total: number) => `${shown} of ${total} lines`,
  ...pack(),
  ...props.labels,
}));

const ROW = 20;
type Row = { n: number; raw: string; plain: string; segs: AnsiSegment[] };
// parse each line once: a growing log only parses its new lines
let cache: Row[] = [];
const rows = computed(() => {
  cache = props.lines.map((raw, i) =>
    cache[i]?.raw === raw
      ? cache[i]!
      : { n: i + 1, raw, plain: stripAnsi(raw), segs: parseAnsi(raw) },
  );
  return cache;
});
const query = ref("");
const shown = computed(() => {
  const q = query.value.trim().toLowerCase();
  return q ? rows.value.filter((r) => r.plain.toLowerCase().includes(q)) : rows.value;
});

const scroller = ref<{ scrollTo: (index: number) => void }>();
const toEnd = () => nextTick(() => scroller.value?.scrollTo(shown.value.length - 1));
watch([() => shown.value.length, follow], () => follow.value && toEnd(), { flush: "post" });
function onScroll(e: Event) {
  const el = e.target as HTMLElement;
  const atEnd = el.scrollHeight - el.scrollTop - el.clientHeight < ROW;
  if (atEnd !== follow.value) follow.value = atEnd;
}
const uid = useId();
</script>

<template>
  <div class="bless-log">
    <div class="bless-log__bar">
      <input
        v-model="query"
        type="search"
        class="bless-log__filter"
        :aria-label="text.filter"
        :placeholder="text.filter"
        :aria-controls="uid"
      />
      <span class="bless-log__count" aria-live="polite">{{
        query.trim() ? text.count(shown.length, lines.length) : ""
      }}</span>
      <button
        type="button"
        class="bless-log__follow"
        :aria-pressed="follow"
        @click="follow = !follow"
      >
        {{ text.follow }}
      </button>
    </div>
    <BlessVirtualScroller
      :id="uid"
      ref="scroller"
      :items="shown"
      :item-height="ROW"
      :height
      :label
      :row-key="(r) => r.n"
      class="bless-log__lines"
      @scroll.passive="onScroll"
    >
      <template #default="{ item }">
        <span class="bless-log__n">{{ item.n }}</span>
        <span class="bless-log__text"
          ><span v-for="(s, i) in item.segs" :key="i" :class="s.cls || undefined">{{
            s.text
          }}</span></span
        >
      </template>
    </BlessVirtualScroller>
    <p v-if="!shown.length" class="bless-log__empty">{{ text.empty }}</p>
  </div>
</template>

<style>
.bless-log {
  position: relative;
  display: grid;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-surface);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-log__bar {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-1) var(--bless-space-2);
  border-block-end: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-sm);
}
.bless-log__filter {
  flex: 1;
  min-inline-size: 0;
  padding: var(--bless-space-1);
  border: 0;
  border-block-end: var(--bless-border-width) solid var(--bless-color-text-muted);
  background: transparent;
  color: inherit;
  font: inherit;
}
.bless-log__count {
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.bless-log__follow {
  padding: var(--bless-space-1) var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-log__follow[aria-pressed="true"] {
  border-color: var(--bless-color-text);
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
}
.bless-log__filter:focus-visible,
.bless-log__follow:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-log__lines {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12.5px;
}
.bless-log__lines .bless-virtual__row {
  align-items: baseline;
  gap: var(--bless-space-3);
  padding-block: 2px 0;
  border: 0;
  white-space: pre;
}
.bless-log__n {
  flex: none;
  min-inline-size: 4ch;
  text-align: end;
  color: var(--bless-color-text-muted);
  user-select: none;
}
.bless-log__empty {
  position: absolute;
  inset: 50% 0 auto;
  margin: 0;
  text-align: center;
  color: var(--bless-color-text-muted);
}
.bless-ansi--bold {
  font-weight: var(--bless-font-weight-bold);
}
/* the muted text color, not opacity: it keeps 4.5:1 */
.bless-ansi--dim {
  color: var(--bless-color-text-muted);
}
.bless-ansi--underline {
  text-decoration: underline;
}
.bless-ansi--red {
  color: var(--bless-color-danger-text);
}
/* mixed with the text color, so a hue stays readable as text in both themes */
.bless-ansi--green {
  color: color-mix(in srgb, var(--bless-color-chart-4) 60%, var(--bless-color-text));
}
.bless-ansi--yellow {
  color: color-mix(in srgb, var(--bless-color-chart-3) 60%, var(--bless-color-text));
}
.bless-ansi--blue {
  color: var(--bless-color-info-text);
}
.bless-ansi--magenta {
  color: var(--bless-color-accent-text);
}
.bless-ansi--cyan {
  color: color-mix(in srgb, var(--bless-color-info) 60%, var(--bless-color-text));
}
.bless-ansi--black {
  color: var(--bless-color-text-muted);
}
.bless-ansi--white {
  color: var(--bless-color-text);
}
</style>
