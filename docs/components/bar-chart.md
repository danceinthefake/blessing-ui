---
title: Bar chart
---

<script setup>
import BarChartBasic from "../demos/BarChartBasic.vue";
</script>

# Bar chart

<p class="bless-lead">Bars for categories, side by side or stacked</p>

Compares amounts across categories, for example plays by month. Use one series for one amount, more series for parts that you compare. For a trend over time, use the [line chart](./line-chart). For parts of one whole, use the [donut chart](./donut-chart).

<Demo title="Basic">
  <BarChartBasic />
  <template #code>

<<< ../demos/BarChartBasic.vue

  </template>
</Demo>

- `data` is a list of rows. `x` names the field with the category, and each item of `series` (`{ key, label, color }`) names a field with a number.
- Bars grow from zero, so a negative value goes below the zero line. `stacked` puts the series on each other: the positive parts go up and the negative parts go down.
- `horizontal` turns the chart: the categories go down the start edge and the bars grow to the side. Use it for long category names.
- The value axis has round steps (1, 2, 2.5, or 5 × a power of ten) that cover the data. A hover on a bar shows its category, series, and value.
- Colors go through the chart colors in order, in the same order as the legend of [`BlessChart`](./chart). Set `color` on a series to a token name or any CSS color.
- Put the chart in a [`BlessChart`](./chart) with `height="auto"` for a title, a description, and a legend.
- The chart draws at the width of its container, measured in the browser, and `height` sets the height (default 280).
- The chart is hidden from screen readers, and a table of the values is read in its place. `label` names the table. `format` sets the text of a value. Change the name of the first column with `labels` or a [label pack](../guide/translating): `category`.
- The chart is drawn as plain SVG. There is no chart library to install.

## Usage

```ts
import { BlessBarChart, type BlessChartSeries } from "blessing-ui";
```

## API

<PropsTable name="BlessBarChart" />
