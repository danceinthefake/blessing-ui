<script setup lang="ts">
defineOptions({ name: "BlessChart" });

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    height?: string;
    /** series names for the built-in legend, in palette order */
    legend?: string[];
  }>(),
  { height: "240px" },
);
</script>

<template>
  <figure class="bless-chart" :style="{ '--_h': height }">
    <figcaption v-if="title || description || $slots.header" class="bless-chart__header">
      <slot name="header">
        <strong v-if="title" class="bless-chart__title">{{ title }}</strong>
        <span v-if="description" class="bless-chart__desc">{{ description }}</span>
      </slot>
    </figcaption>
    <div class="bless-chart__plot"><slot /></div>
    <ul v-if="legend?.length || $slots.legend" class="bless-chart__legend">
      <slot name="legend">
        <li
          v-for="(l, i) in legend"
          :key="l"
          :style="{ '--_c': `var(--bless-color-chart-${i + 1})` }"
        >
          {{ l }}
        </li>
      </slot>
    </ul>
    <div v-if="$slots.footer" class="bless-chart__footer"><slot name="footer" /></div>
  </figure>
</template>

<style>
/* Maps --bless-* onto Unovis' --vis-* so any @unovis/vue chart dropped in the
 * default slot picks up the palette, type and dark mode. Both --vis-* and
 * --vis-dark-* point at the same bless tokens because those already invert. */
.bless-chart {
  --vis-font-family: var(--bless-font-sans);
  --vis-color-main: var(--bless-color-chart-1);
  --vis-color0: var(--bless-color-chart-1);
  --vis-color1: var(--bless-color-chart-2);
  --vis-color2: var(--bless-color-chart-3);
  --vis-color3: var(--bless-color-chart-4);
  --vis-color4: var(--bless-color-chart-5);
  --vis-dark-color-main: var(--bless-color-chart-1);
  --vis-dark-color0: var(--bless-color-chart-1);
  --vis-dark-color1: var(--bless-color-chart-2);
  --vis-dark-color2: var(--bless-color-chart-3);
  --vis-dark-color3: var(--bless-color-chart-4);
  --vis-dark-color4: var(--bless-color-chart-5);

  --vis-axis-font-family: var(--bless-font-sans);
  --vis-axis-tick-color: var(--bless-color-border);
  --vis-axis-domain-color: var(--bless-color-border);
  --vis-axis-grid-color: var(--bless-color-border);
  --vis-axis-tick-label-color: var(--bless-color-text-muted);
  --vis-axis-label-color: var(--bless-color-text);
  --vis-dark-axis-tick-color: var(--bless-color-border);
  --vis-dark-axis-domain-color: var(--bless-color-border);
  --vis-dark-axis-grid-color: var(--bless-color-border);
  --vis-dark-axis-tick-label-color: var(--bless-color-text-muted);
  --vis-dark-axis-label-color: var(--bless-color-text);

  --vis-tooltip-background-color: var(--bless-color-bg);
  --vis-tooltip-border-color: var(--bless-color-border);
  --vis-tooltip-text-color: var(--bless-color-text);
  --vis-tooltip-shadow-color: rgb(0 0 0 / 0.2);
  --vis-tooltip-padding: var(--bless-space-2) var(--bless-space-3);
  --vis-tooltip-backdrop-filter: none;
  --vis-dark-tooltip-background-color: var(--bless-color-bg);
  --vis-dark-tooltip-border-color: var(--bless-color-border);
  --vis-dark-tooltip-text-color: var(--bless-color-text);
  --vis-dark-tooltip-shadow-color: rgb(0 0 0 / 0.6);

  --vis-legend-label-color: var(--bless-color-text);
  --vis-dark-legend-label-color: var(--bless-color-text);
  --vis-crosshair-line-stroke-color: var(--bless-color-text-muted);
  --vis-dark-crosshair-line-stroke-color: var(--bless-color-text-muted);

  display: flex;
  flex-direction: column;
  gap: var(--bless-space-3);
  margin: 0;
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-chart__header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.bless-chart__title {
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
}
.bless-chart__desc {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-chart__plot {
  height: var(--_h);
  min-width: 0;
}
.bless-chart__plot > * {
  height: 100%;
}
.bless-chart__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-1) var(--bless-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-wide);
}
.bless-chart__legend > li {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-2);
}
.bless-chart__legend > li::before {
  content: "";
  width: 12px;
  height: 12px;
  background: var(--_c, var(--bless-color-chart-1));
  transform: skewX(var(--bless-skew));
}
.bless-chart__footer {
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
