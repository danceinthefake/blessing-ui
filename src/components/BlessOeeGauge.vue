<template>
  <section class="bless-oee" :aria-label="text.oee">
    <div class="bless-oee__dial">
      <BlessGauge
        :value="oee * 100"
        :label="text.oee"
        :format="(v) => pct.format(v / 100)"
        :zones="[
          { to: goal * 100 * 0.75, color: 'danger' },
          { to: goal * 100, color: 'warning' },
          { to: 100, color: 'success' },
        ]"
      />
      <p class="bless-oee__goal" :class="{ 'is-met': oee >= goal }">
        <span aria-hidden="true">{{ oee >= goal ? "✓" : "↓" }}</span>
        {{ text.goal(pct.format(goal)) }}
      </p>
    </div>
    <dl class="bless-oee__parts">
      <div
        v-for="p in parts"
        :key="p.key"
        class="bless-oee__part"
        :class="{ 'is-weak': p.key === weakest }"
      >
        <dt>{{ text[p.key] }}<template v-if="p.key === weakest"> · {{ text.below }}</template></dt>
        <dd>
          <span class="bless-oee__value">{{ pct.format(p.value) }}</span>
          <span class="bless-oee__bar" aria-hidden="true"
            ><span :style="{ inlineSize: `${p.value * 100}%` }"
          /></span>
        </dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessGauge from "./BlessGauge.vue";

defineOptions({ name: "BlessOeeGauge" });
const pack = useLabelPack("BlessOeeGauge");

const props = withDefaults(
  defineProps<{
    /** run time / planned time, 0 to 1 */
    availability: number;
    /** actual output / output at the ideal speed, 0 to 1 */
    performance: number;
    /** good pieces / all pieces, 0 to 1 */
    quality: number;
    /** the goal for OEE, 0 to 1; 0.85 is often called world class */
    goal?: number;
    locale?: string;
    labels?: Partial<{
      oee: string;
      availability: string;
      performance: string;
      quality: string;
      goal: (percent: string) => string;
      below: string;
    }>;
  }>(),
  { goal: 0.85, locale: "en" },
);

const text = computed(() => ({
  oee: "OEE",
  availability: "Availability",
  performance: "Performance",
  quality: "Quality",
  goal: (p: string) => `Goal ${p}`,
  below: "Lowest part",
  ...pack(),
  ...props.labels,
}));
const clamp = (n: number) => Math.min(1, Math.max(0, n));
// overall equipment effectiveness: availability × performance × quality (Nakajima, TPM)
const oee = computed(
  () => clamp(props.availability) * clamp(props.performance) * clamp(props.quality),
);
const pct = computed(
  () => new Intl.NumberFormat(props.locale, { style: "percent", maximumFractionDigits: 1 }),
);
const parts = computed(() => [
  { key: "availability" as const, value: clamp(props.availability) },
  { key: "performance" as const, value: clamp(props.performance) },
  { key: "quality" as const, value: clamp(props.quality) },
]);
const weakest = computed(() => parts.value.reduce((a, b) => (b.value < a.value ? b : a)).key);
</script>

<style>
.bless-oee {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-oee__dial {
  display: grid;
  justify-items: center;
  gap: var(--bless-space-1);
}
.bless-oee__goal {
  margin: 0;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-oee__parts {
  display: grid;
  flex: 1;
  gap: var(--bless-space-2);
  min-inline-size: 14rem;
  margin: 0;
}
.bless-oee__part dt {
  font-size: var(--bless-text-xs);
}
.bless-oee__part.is-weak dt {
  font-weight: var(--bless-font-weight-bold);
}
.bless-oee__part dd {
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  align-items: center;
  gap: var(--bless-space-2);
  margin: 0;
}
.bless-oee__value {
  font-weight: var(--bless-font-weight-bold);
  font-variant-numeric: tabular-nums;
}
.bless-oee__bar {
  block-size: 0.6rem;
  background: var(--bless-color-surface-2);
}
.bless-oee__bar span {
  display: block;
  block-size: 100%;
  background: var(--bless-color-text);
}
.bless-oee__part.is-weak .bless-oee__bar span {
  background: repeating-linear-gradient(
    -45deg,
    var(--bless-color-text) 0 5px,
    color-mix(in srgb, var(--bless-color-text) 45%, var(--bless-color-bg)) 5px 10px
  );
}
.bless-oee__bar {
  transform-box: fill-box;
  transform-origin: 0 50%;
  --_gx: var(--bless-grow);
  --_gy: 1;
  animation: bless-grow var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
.bless-oee__bar:dir(rtl) {
  transform-origin: 100% 50%;
}
/* the chart opens out from its middle */
.bless-oee__dial {
  --_gx: calc(0.6 + 0.4 * var(--bless-grow));
  --_gy: var(--_gx);
  animation: bless-grow var(--bless-duration-draw) var(--bless-ease-soft) backwards;
}
</style>
