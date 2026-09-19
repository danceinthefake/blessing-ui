<script setup lang="ts">
defineOptions({ name: "BlessSteps" });

export interface BlessStep {
  label: string;
  description?: string;
}

withDefaults(
  defineProps<{
    steps: BlessStep[];
    orientation?: "horizontal" | "vertical";
    /** completed steps are buttons that emit select */
    clickable?: boolean;
    label?: string;
  }>(),
  { orientation: "horizontal", label: "Progress" },
);
const current = defineModel<number>({ default: 0 });
const emit = defineEmits<{ select: [index: number] }>();
</script>

<template>
  <ol class="bless-steps" :class="`bless-steps--${orientation}`" :aria-label="label">
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
        :is="clickable && i < current ? 'button' : 'div'"
        :type="clickable && i < current ? 'button' : undefined"
        class="bless-steps__marker"
        @click="clickable && i < current && (emit('select', i), (current = i))"
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

<style>
.bless-steps {
  display: flex;
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text-muted);
}
.bless-steps--vertical {
  flex-direction: column;
  gap: var(--bless-space-4);
}
.bless-steps__item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-2);
  flex: 1;
  min-width: 0;
}
/* connector to the next step */
.bless-steps--horizontal .bless-steps__item:not(:last-child)::after {
  content: "";
  flex: 1;
  height: var(--bless-border-width);
  margin-top: 14px;
  background: var(--bless-color-border);
}
.bless-steps--vertical .bless-steps__item:not(:last-child)::after {
  content: "";
  position: absolute;
  left: 14px;
  top: 32px;
  bottom: calc(-1 * var(--bless-space-4));
  width: var(--bless-border-width);
  background: var(--bless-color-border);
}
.bless-steps__item--done:not(:last-child)::after {
  background: var(--bless-color-accent);
}
.bless-steps__marker {
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
}
button.bless-steps__marker:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-steps__item--done .bless-steps__marker {
  border-color: var(--bless-color-accent);
  background: var(--bless-color-accent);
  color: var(--bless-color-on-accent);
}
.bless-steps__item--current {
  color: var(--bless-color-text);
}
.bless-steps__item--current .bless-steps__marker {
  border-color: var(--bless-color-accent);
  color: var(--bless-color-accent);
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
  text-transform: uppercase;
  white-space: nowrap;
}
.bless-steps__desc {
  font-size: var(--bless-text-xs);
}
</style>
