<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "BlessPasswordMeter" });

export interface BlessPasswordRule {
  label: string;
  test: (v: string) => boolean;
}

const props = withDefaults(
  defineProps<{
    value: string;
    /** each passing rule adds one step; default: 8+ chars, lower+upper, digit, symbol */
    rules?: BlessPasswordRule[];
    labels?: string[];
    /** list the rules with pass / fail marks */
    showRules?: boolean;
    /** read after each rule for screen readers: [met, not met] */
    ruleState?: [string, string];
  }>(),
  {
    rules: () => [
      { label: "8+ characters", test: (v) => v.length >= 8 },
      { label: "Upper and lower case", test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
      { label: "A number", test: (v) => /\d/.test(v) },
      // any letter or digit in any script is not a symbol; `_` is
      { label: "A symbol", test: (v) => /[^\p{L}\p{N}\s]/u.test(v) },
    ],
    labels: () => ["Weak", "Fair", "Good", "Strong"],
    ruleState: () => ["met", "not met"],
  },
);
const passed = computed(() => props.rules.map((r) => r.test(props.value)));
const score = computed(() => passed.value.filter(Boolean).length);
const label = computed(() =>
  props.value ? props.labels[Math.min(props.labels.length - 1, Math.max(0, score.value - 1))] : "",
);
</script>

<template>
  <div class="bless-pwmeter" :data-score="score">
    <div class="bless-pwmeter__head">
      <meter
        class="bless-pwmeter__meter"
        :value="score"
        min="0"
        :max="rules.length"
        :low="Math.ceil(rules.length / 2)"
        :high="rules.length - 1"
        :optimum="rules.length"
        :aria-label="`Password strength: ${label || 'none'}`"
      />
      <span class="bless-pwmeter__label" aria-live="polite">{{ label }}</span>
    </div>
    <ul role="list" v-if="showRules" class="bless-pwmeter__rules">
      <li v-for="(r, i) in rules" :key="r.label" :class="{ 'bless-pwmeter__rule--ok': passed[i] }">
        <span aria-hidden="true">{{ passed[i] ? "✓" : "·" }}</span> {{ r.label }}
        <span class="bless-pwmeter__state">{{ ruleState[passed[i] ? 0 : 1] }}</span>
      </li>
    </ul>
  </div>
</template>

<style>
.bless-pwmeter {
  --_c: var(--bless-color-danger);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-pwmeter[data-score="2"] {
  --_c: var(--bless-color-warning);
}
.bless-pwmeter[data-score="3"] {
  --_c: var(--bless-color-info);
}
.bless-pwmeter[data-score="4"] {
  --_c: var(--bless-color-success);
}
.bless-pwmeter__head {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-pwmeter__meter {
  border-radius: var(--bless-radius);
  flex: 1;
  height: 6px;
  appearance: none;
  border: 0;
  background: var(--bless-color-surface);
  transform: skewX(var(--bless-skew));
}
.bless-pwmeter__meter::-webkit-meter-bar {
  background: var(--bless-color-surface);
  border: 0;
  border-radius: var(--bless-radius);
}
.bless-pwmeter__meter::-webkit-meter-optimum-value,
.bless-pwmeter__meter::-webkit-meter-suboptimum-value,
.bless-pwmeter__meter::-webkit-meter-even-less-good-value {
  background: var(--_c);
}
.bless-pwmeter__meter::-moz-meter-bar {
  background: var(--_c);
}
.bless-pwmeter__label {
  min-width: 3.5em;
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-pwmeter__state {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.bless-pwmeter__rules {
  margin: var(--bless-space-2) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 2px;
}
.bless-pwmeter__rule--ok > span {
  color: var(--bless-color-success); /* the tick only; the label stays legible */
  font-weight: var(--bless-font-weight-bold);
}
</style>
