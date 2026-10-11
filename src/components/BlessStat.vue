<script setup lang="ts">
import { computed, useId } from "vue";
import BlessSparkline from "./BlessSparkline.vue";

defineOptions({ name: "BlessStat" });

const props = withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    /** change since the last period. A number shows its sign and a percent sign. */
    delta?: number | string;
    /** which direction is good news: `up` (default) or `down` (for example, error rate) */
    goodWhen?: "up" | "down";
    /** unit text for the delta, read after the number (default `%`) */
    deltaUnit?: string;
    /** trend line under the value */
    data?: number[];
    /** names the trend line for screen readers */
    dataLabel?: string;
    /** words for the direction, read by screen readers */
    labels?: Partial<{ up: string; down: string; flat: string }>;
  }>(),
  { goodWhen: "up", deltaUnit: "%" },
);

const id = useId();
const words = computed(() => ({
  up: "Up",
  down: "Down",
  flat: "No change",
  ...props.labels,
}));
// a string delta has no sign to read, so it counts as flat
const dir = computed<"up" | "down" | "flat">(() =>
  typeof props.delta !== "number" || props.delta === 0 ? "flat" : props.delta > 0 ? "up" : "down",
);
// bad news is the only delta that gets a color: the good kind stays ink
const bad = computed(() => dir.value !== "flat" && dir.value !== props.goodWhen);
const shown = computed(() =>
  typeof props.delta === "number"
    ? `${Math.abs(props.delta)}${props.deltaUnit}`
    : String(props.delta ?? ""),
);
const arrow = { up: "▲", down: "▼", flat: "▬" } as const;
</script>

<template>
  <div class="bless-stat" role="group" :aria-labelledby="`${id}-l`">
    <div :id="`${id}-l`" class="bless-stat__label">{{ label }}</div>
    <div class="bless-stat__value">
      <slot>{{ value }}</slot>
    </div>
    <div
      v-if="delta !== undefined"
      class="bless-stat__delta"
      :class="{ 'bless-stat__delta--bad': bad }"
    >
      <span aria-hidden="true">{{ arrow[dir] }}</span>
      <span class="bless-stat__sr">{{ words[dir] }}</span>
      {{ shown }}
    </div>
    <BlessSparkline v-if="data?.length" class="bless-stat__trend" :data="data" :label="dataLabel" />
    <div v-if="$slots.hint" class="bless-stat__hint"><slot name="hint" /></div>
  </div>
</template>

<style>
.bless-stat {
  box-sizing: border-box;
  display: grid;
  gap: var(--bless-space-1);
  padding: var(--bless-space-4);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-stat__label {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-stat__value {
  font-size: var(--bless-text-xl);
  font-weight: var(--bless-font-weight-thin);
  line-height: var(--bless-leading-none);
}
.bless-stat__delta {
  position: relative;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-stat__delta--bad {
  color: var(--bless-color-danger-text);
}
.bless-stat__trend {
  margin-block-start: var(--bless-space-2);
}
.bless-stat__hint {
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text-muted);
}
.bless-stat__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
