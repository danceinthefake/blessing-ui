<script setup lang="ts">
defineOptions({ name: "BlessSeparator" });

withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical";
    /** purely visual (aria-hidden) vs semantic <hr> */
    decorative?: boolean;
    color?: "border" | "rule" | "accent";
    /** optional centered label */
    label?: string;
  }>(),
  { orientation: "horizontal", decorative: false, color: "border" },
);
</script>

<template>
  <div
    v-if="label"
    class="bless-separator bless-separator--labelled"
    :class="`bless-separator--${color}`"
    :aria-hidden="decorative || undefined"
  >
    <!-- no separator role here: its children would be presentational and the label would be lost -->
    <span class="bless-separator__label">{{ label }}</span>
  </div>
  <component
    v-else
    :is="orientation === 'horizontal' && !decorative ? 'hr' : 'div'"
    class="bless-separator"
    :class="[`bless-separator--${orientation}`, `bless-separator--${color}`]"
    :role="decorative ? 'none' : orientation === 'vertical' ? 'separator' : undefined"
    :aria-orientation="!decorative && orientation === 'vertical' ? 'vertical' : undefined"
    :aria-hidden="decorative || undefined"
  />
</template>

<style>
.bless-separator {
  --_c: var(--bless-color-border);
  margin: 0;
  border: 0;
  flex: none;
}
.bless-separator--rule {
  --_c: var(--bless-color-rule);
}
.bless-separator--accent {
  --_c: var(--bless-color-accent);
}
.bless-separator--horizontal {
  width: 100%;
  height: var(--bless-border-width);
  margin-block: var(--bless-space-4);
  background: var(--_c);
}
.bless-separator--vertical {
  align-self: stretch;
  width: var(--bless-border-width);
  min-height: 1em;
  margin-inline: var(--bless-space-3);
  background: var(--_c);
}
.bless-separator--labelled {
  margin-block: var(--bless-space-4);
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  font-family: var(--bless-font-sans);
}
.bless-separator--labelled::before,
.bless-separator--labelled::after {
  content: "";
  flex: 1;
  height: var(--bless-border-width);
  background: var(--_c);
}
.bless-separator__label {
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
</style>
