<template>
  <ol role="list" class="bless-steps" :class="`bless-steps--${orientation}`" :aria-label="label">
    <li
      v-for="(s, i) in steps"
      :key="s.label"
      class="bless-steps__item"
      :class="{
        'bless-steps__item--done': i < current,
        'bless-steps__item--current': i === current,
      }"
      :aria-current="i === current ? 'step' : undefined"
    >
      <component
        :is="canGo(i, clickable, current) ? 'button' : 'div'"
        :type="canGo(i, clickable, current) ? 'button' : undefined"
        class="bless-steps__marker"
        :aria-label="canGo(i, clickable, current) ? text.go(i + 1, s.label) : undefined"
        @click="canGo(i, clickable, current) && (emit('select', i), (current = i))"
      >
        <span aria-hidden="true">{{ i < current ? "✓" : i + 1 }}</span>
      </component>
      <span class="bless-steps__text">
        <span class="bless-steps__label">{{ s.label }}</span>
        <span v-if="s.description" class="bless-steps__desc">{{ s.description }}</span>
      </span>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { useLabelPack } from "../composables/useLabels";
import { computed } from "vue";
defineOptions({ name: "BlessSteps" });

export interface BlessStep {
  label: string;
  description?: string;
}

const props = withDefaults(
  defineProps<{
    steps: BlessStep[];
    orientation?: "horizontal" | "vertical";
    /** completed steps are buttons that emit select; "all" makes every step one */
    clickable?: boolean | "all";
    label?: string;
    labels?: Partial<{ go: (number: number, label: string) => string }>;
  }>(),
  { orientation: "horizontal", label: "Progress" },
);
const pack = useLabelPack("BlessSteps");
const text = computed(() => ({
  go: (n: number, l: string) => `Go to step ${n}: ${l}`,
  ...pack(),
  ...props.labels,
}));

const current = defineModel<number>({ default: 0 });
const emit = defineEmits<{ select: [index: number] }>();
const canGo = (i: number, clickable: boolean | "all" | undefined, cur: number) =>
  clickable === "all" ? i !== cur : !!clickable && i < cur;
</script>

<style>
.bless-steps {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-3) var(--bless-space-2);
  max-width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text-muted);
}
.bless-steps--vertical {
  flex-direction: column;
  flex-wrap: nowrap;
  gap: var(--bless-space-4);
}
.bless-steps__item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-2);
  flex: 1 1 auto;
  min-width: fit-content;
}
/* connector to the next step */
.bless-steps--horizontal .bless-steps__item:not(:last-child)::after {
  content: "";
  flex: 1;
  min-width: var(--bless-space-3);
  height: var(--bless-border-width);
  margin-top: 14px;
  background: var(--bless-color-border);
}
.bless-steps--vertical .bless-steps__item:not(:last-child)::after {
  content: "";
  position: absolute;
  inset-inline-start: 14px;
  top: 32px;
  bottom: calc(-1 * var(--bless-space-4));
  width: var(--bless-border-width);
  background: var(--bless-color-border);
}
.bless-steps__item--done:not(:last-child)::after {
  background: var(--bless-color-accent);
}
.bless-steps__marker {
  border-radius: var(--bless-radius-plate);
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  transform: skewX(var(--bless-skew));
}
.bless-steps__marker > span {
  transform: skewX(var(--bless-skew-counter));
}
button.bless-steps__marker {
  cursor: pointer;
  transition:
    opacity var(--bless-duration-slow) var(--bless-ease-in-out),
    var(--bless-lean-transition);
}
button.bless-steps__marker:hover {
  transform: skewX(var(--bless-skew)) translateY(var(--bless-hover-lift));
  border-color: var(--bless-color-text);
}
button.bless-steps__marker:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-steps__item--done .bless-steps__marker {
  border-color: var(--bless-color-accent-text);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-steps__item--current {
  color: var(--bless-color-text);
}
.bless-steps__item--current .bless-steps__marker {
  border-color: var(--bless-color-accent-text);
  color: var(--bless-color-accent-text);
}
.bless-steps__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 5px;
  min-width: 0;
}
.bless-steps__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: var(--bless-label-case);
  white-space: nowrap;
}
.bless-steps__desc {
  font-size: var(--bless-text-xs);
}
</style>
