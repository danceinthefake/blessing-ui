<script setup lang="ts">
import { computed, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import { logicalKey } from "../composables/rtl";

defineOptions({ name: "BlessUptimeBar" });
const pack = useLabelPack("BlessUptimeBar");

export type BlessUptimeStatus = "up" | "degraded" | "down" | "none";
export interface BlessUptimeItem {
  status: BlessUptimeStatus;
  /** the period, for the tooltip: "Oct 12" */
  label?: string;
}

const props = defineProps<{
  /** one segment per period, oldest first */
  items: BlessUptimeItem[];
  /** formats the percent; defaults to the language of the browser */
  locale?: string;
  labels?: Partial<{
    summary: (percent: string, periods: number) => string;
    up: string;
    degraded: string;
    down: string;
    none: string;
  }>;
}>();

const text = computed(() => ({
  summary: (p: string, n: number) => `${p} uptime over ${n} periods`,
  up: "Operational",
  degraded: "Degraded",
  down: "Down",
  none: "No data",
  ...pack(),
  ...props.labels,
}));
/** periods with data that were not down, over all periods with data */
const ratio = computed(() => {
  const known = props.items.filter((i) => i.status !== "none");
  return known.length ? known.filter((i) => i.status !== "down").length / known.length : null;
});
const summary = computed(() => {
  if (ratio.value === null) return text.value.none;
  const p = new Intl.NumberFormat(props.locale, {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(ratio.value);
  return text.value.summary(p, props.items.length);
});
const tip = (i: BlessUptimeItem) =>
  i.label ? `${i.label}: ${text.value[i.status]}` : text.value[i.status];

// one tab stop, on the newest period by default; arrows walk the periods
const tab = ref<number | null>(null);
const focused = ref<number | null>(null);
const current = computed(() =>
  Math.min(tab.value ?? props.items.length - 1, props.items.length - 1),
);
function onKey(e: KeyboardEvent) {
  const last = props.items.length - 1;
  const to = {
    ArrowRight: current.value + 1,
    ArrowLeft: current.value - 1,
    Home: 0,
    End: last,
  }[logicalKey(e)];
  if (to === undefined) return;
  e.preventDefault();
  tab.value = Math.max(0, Math.min(last, to));
  ((e.currentTarget as HTMLElement).children[tab.value] as HTMLElement | undefined)?.focus();
}
</script>

<template>
  <div class="bless-uptime" role="group" :aria-label="summary" @keydown="onKey">
    <span
      v-for="(item, i) in items"
      :key="i"
      class="bless-uptime__seg"
      :class="`bless-uptime__seg--${item.status}`"
      role="img"
      :aria-label="tip(item)"
      :title="tip(item)"
      :tabindex="i === current ? 0 : -1"
      @focus="((tab = i), (focused = i))"
      @blur="focused = null"
    />
    <!-- a title does not show on focus: the keyboard gets the same text here -->
    <span
      v-if="focused !== null && items[focused]"
      class="bless-uptime__tip"
      :style="{ '--p': (focused + 0.5) / items.length }"
      aria-hidden="true"
      >{{ tip(items[focused]) }}</span
    >
  </div>
</template>

<style>
.bless-uptime {
  position: relative;
  display: flex;
  gap: 2px;
  height: var(--bless-uptime-height, 32px);
}
.bless-uptime__seg {
  flex: 1 1 0;
  min-width: 2px;
  background: var(--bless-color-surface);
}
.bless-uptime__seg--up {
  background: var(--bless-color-success);
}
/* stripes: lime and amber are close for color-blind readers, so degraded needs more than hue */
.bless-uptime__seg--degraded {
  background: repeating-linear-gradient(
    45deg,
    var(--bless-color-warning) 0 4px,
    var(--bless-color-bg) 4px 6px
  );
}
.bless-uptime__seg--down {
  background: var(--bless-color-danger);
}
.bless-uptime__seg:hover {
  outline: var(--bless-border-width) solid var(--bless-color-text);
}
.bless-uptime__seg:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
/* sits under its segment, and slides along so the first and last stay inside the bar */
.bless-uptime__tip {
  position: absolute;
  inset-block-start: calc(100% + var(--bless-space-1));
  inset-inline-start: calc(var(--p) * 100%);
  translate: calc(var(--p) * -100%);
  z-index: 1;
  padding: var(--bless-space-1) var(--bless-space-2);
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  white-space: nowrap;
  pointer-events: none;
}
.bless-uptime__tip:dir(rtl) {
  translate: calc(var(--p) * 100%);
}
.bless-uptime__seg {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: bless-grow var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
</style>
