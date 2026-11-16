<script setup lang="ts">
import { computed, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessKnob from "./BlessKnob.vue";
import "./sr.css";

defineOptions({ name: "BlessThermostat" });
const pack = useLabelPack("BlessThermostat");

export type BlessThermostatMode = "heat" | "cool" | "auto" | "off";

const props = withDefaults(
  defineProps<{
    /** the temperature in the room now */
    current: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: "°C" | "°F";
    locale?: string;
    labels?: Partial<
      Record<BlessThermostatMode, string> & {
        title: string;
        target: string;
        now: (t: string) => string;
        lower: string;
        higher: string;
        heating: (t: string) => string;
        cooling: (t: string) => string;
        holding: (t: string) => string;
        stopped: string;
      }
    >;
  }>(),
  { min: 16, max: 30, step: 0.5, unit: "°C", locale: "en" },
);
const target = defineModel<number>({ default: 22 });
const mode = defineModel<BlessThermostatMode>("mode", { default: "auto" });

const text = computed(() => ({
  title: "Thermostat",
  target: "Target temperature",
  now: (t: string) => `Now ${t}`,
  lower: "Lower",
  higher: "Higher",
  heat: "Heat",
  cool: "Cool",
  auto: "Auto",
  off: "Off",
  heating: (t: string) => `Heating to ${t}`,
  cooling: (t: string) => `Cooling to ${t}`,
  holding: (t: string) => `Holding ${t}`,
  stopped: "The system is off",
  ...pack(),
  ...props.labels,
}));
const uid = useId();
const deg = (n: number) =>
  `${new Intl.NumberFormat(props.locale, { maximumFractionDigits: 1 }).format(n)} ${props.unit}`;
const nudge = (d: number) =>
  (target.value = Math.min(props.max, Math.max(props.min, target.value + d)));
// what the system does now, from the mode and the gap between now and the target
const status = computed(() => {
  const t = deg(target.value);
  if (mode.value === "off") return text.value.stopped;
  const gap = target.value - props.current;
  if (gap > 0.25 && mode.value !== "cool") return text.value.heating(t);
  if (gap < -0.25 && mode.value !== "heat") return text.value.cooling(t);
  return text.value.holding(t);
});
const MODES: BlessThermostatMode[] = ["heat", "cool", "auto", "off"];
</script>

<template>
  <section class="bless-thermo" :class="`is-${mode}`" :aria-label="text.title">
    <div class="bless-thermo__dial">
      <BlessKnob
        v-model="target"
        :min
        :max
        :step
        size="lg"
        :label="text.target"
        :format="deg"
        :disabled="mode === 'off'"
      />
      <p class="bless-thermo__now">{{ text.now(deg(current)) }}</p>
    </div>
    <div class="bless-thermo__nudge">
      <button
        type="button"
        :aria-label="text.lower"
        :disabled="mode === 'off' || target <= min"
        @click="nudge(-step)"
      >
        −
      </button>
      <button
        type="button"
        :aria-label="text.higher"
        :disabled="mode === 'off' || target >= max"
        @click="nudge(step)"
      >
        +
      </button>
    </div>
    <p class="bless-thermo__status" role="status">{{ status }}</p>
    <fieldset class="bless-thermo__modes">
      <legend class="bless-sr">{{ text.title }}</legend>
      <label v-for="m in MODES" :key="m" class="bless-thermo__mode">
        <input v-model="mode" type="radio" :name="`${uid}-mode`" :value="m" />
        <span>{{ text[m] }}</span>
      </label>
    </fieldset>
  </section>
</template>

<style>
.bless-thermo {
  display: grid;
  justify-items: center;
  gap: var(--bless-space-3);
  max-inline-size: 20rem;
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-thermo__dial {
  display: grid;
  justify-items: center;
  gap: var(--bless-space-1);
}
.bless-thermo__now {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-thermo__nudge {
  display: flex;
  gap: var(--bless-space-2);
}
.bless-thermo__nudge button {
  inline-size: 2.75rem;
  block-size: 2.75rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-lg);
  cursor: pointer;
}
.bless-thermo__nudge button:disabled {
  opacity: 0.4;
  cursor: default;
}
.bless-thermo__status {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-thermo__modes {
  display: flex;
  margin: 0;
  padding: 0;
  border: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-thermo__mode {
  position: relative;
  cursor: pointer;
}
.bless-thermo__mode input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.bless-thermo__mode span {
  display: block;
  padding: var(--bless-space-1) var(--bless-space-3);
}
.bless-thermo__mode:has(:checked) span {
  background: var(--bless-color-text);
  color: var(--bless-color-bg);
  font-weight: var(--bless-font-weight-bold);
}
.bless-thermo__mode:has(:focus-visible),
.bless-thermo__nudge button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
