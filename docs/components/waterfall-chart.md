---
title: Waterfall chart
---

# Waterfall chart

<p class="bless-lead">How a value goes up and down, step by step</p>

Shows how a start value becomes an end value through a list of changes, for example the money of a month: income goes up, costs go down. For values that you compare side by side, use the [bar chart](./bar-chart).

<Demo title="Basic">
  <WaterfallChartBasic />
  <template #code>

<<< ../demos/WaterfallChartBasic.vue

  </template>
</Demo>

- `steps` is a list of `{ label, value, total }`. Each step adds its value to the sum, so its bar goes from the sum before it to the sum after it.
- A step with `total` has no value. Its bar goes from zero to the sum so far, for example the end of the month. A first step with a value is the start.
- A step that goes up is green, a step that goes down is red, and a total has the first chart color. The hover and the table also show the sign, so the chart does not depend on color.
- A dashed line goes from the end of each bar to the start of the next one. A hover on a bar shows its change, or the total.
- The chart draws at the width of its container, and `height` sets the height (default 280).
- The chart is hidden from screen readers, and a table of the steps (step, change, total) is read in its place. `label` names the table, and `format` sets the text of a value. Change the column names with `labels` or a [label pack](../guide/translating): `step`, `change`, and `total`.
- The chart is drawn as plain SVG. There is no chart library to install.

## Usage

```ts
import { BlessWaterfallChart, type BlessWaterfallStep } from "blessing-ui";
```

## API

<PropsTable name="BlessWaterfallChart" />

<script setup>
import WaterfallChartBasic from "../demos/WaterfallChartBasic.vue";
</script>
