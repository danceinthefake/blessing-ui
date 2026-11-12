<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

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
</script>

<template>
  <div class="bless-uptime" role="img" :aria-label="summary">
    <span
      v-for="(item, i) in items"
      :key="i"
      class="bless-uptime__seg"
      :class="`bless-uptime__seg--${item.status}`"
      :title="tip(item)"
    />
  </div>
</template>

<style>
.bless-uptime {
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
</style>
