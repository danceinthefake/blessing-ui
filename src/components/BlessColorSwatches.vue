<template>
  <div
    class="bless-swatches"
    :class="`bless-swatches--${size}`"
    role="radiogroup"
    :aria-label="text.label"
  >
    <label
      v-for="s in list"
      :key="s.value"
      class="bless-swatches__swatch"
      :class="{ 'bless-swatches__swatch--on': same(model, s.value) }"
      :style="{ '--_c': s.value }"
      :title="s.label"
    >
      <input
        type="radio"
        class="bless-swatches__input"
        :name
        :value="s.value"
        :checked="same(model, s.value)"
        :disabled
        :aria-label="s.label"
        @change="model = s.value"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessColorSwatches" });
const pack = useLabelPack("BlessColorSwatches");

export interface BlessColorSwatch {
  /** any CSS color */
  value: string;
  /** the name that screen readers say, for example "Pink"; default: the value */
  label?: string;
}

const props = withDefaults(
  defineProps<{
    /** the colors: a CSS color, or `{ value, label }` so a screen reader says a name, not a code */
    swatches: (string | BlessColorSwatch)[];
    size?: "sm" | "md";
    disabled?: boolean;
    labels?: Partial<{ label: string }>;
  }>(),
  { size: "md" },
);
const model = defineModel<string | null>({ default: null });

const text = computed(() => ({ label: "Colors", ...pack(), ...props.labels }));
const name = useId();
const list = computed(() =>
  props.swatches.map((s) =>
    typeof s === "string" ? { value: s, label: s } : { label: s.value, ...s },
  ),
);
const same = (a: string | null, b: string) => !!a && a.toLowerCase() === b.toLowerCase();
</script>

<style>
.bless-swatches {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1);
}
.bless-swatches__swatch {
  position: relative;
  inline-size: 28px;
  block-size: 28px;
  border: 2px solid transparent;
  background: var(--_c);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
.bless-swatches--sm .bless-swatches__swatch {
  inline-size: 20px;
  block-size: 20px;
}
.bless-swatches__swatch:hover {
  transform: skewX(var(--bless-skew)) translateY(var(--bless-hover-lift));
  border-color: var(--bless-color-text);
}
/* the picked color: a ring in the text color, with a gap in the background color */
.bless-swatches__swatch--on {
  border-color: var(--bless-color-text);
  box-shadow: inset 0 0 0 2px var(--bless-color-bg);
}
.bless-swatches__swatch:has(:focus-visible) {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-swatches__swatch:has(:disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-swatches__input {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}
@media (prefers-reduced-motion: reduce) {
  .bless-swatches__swatch {
    transition: none;
  }
}
</style>
