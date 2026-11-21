---
title: Line chart
---

# Line chart

<p class="bless-lead">Lines or areas over a number or a date axis</p>

Shows how amounts change, for example listeners each day. For amounts in categories, use the [bar chart](./bar-chart). For a small trend inside text or a table, use the [sparkline](./sparkline).

<Demo title="Basic">
  <LineChartBasic />
  <template #code>

<<< ../demos/LineChartBasic.vue

  </template>
</Demo>

- `data` is a list of rows. `x` names the field with the x value, and each item of `series` (`{ key, label, color }`) names a field with a number.
- If every x value is a number, the x axis is a number axis with round steps. Else each x value is read as a date (a `Date`, a time in milliseconds, or a date text), and the axis shows a short date in the local format.
- The rows are drawn in the order of x, so the data can come in any order. A missing value (`null`, empty, or not a number) breaks the line, and the line starts again at the next value.
- The value axis has round steps that cover the data. It does not have to start at zero, so a small change is easy to see.
- `area` fills the area under each line. A hover shows a line at the nearest point, with the value of each series in a box.
- Put the chart in a [`BlessChart`](./chart) with `height="auto"` for a title, a description, and a legend. Colors go through the chart colors in the same order as its legend.
- The chart draws at the width of its container, measured in the browser, and `height` sets the height (default 280). The dates are written after the page loads, so the server and the browser agree on the time zone.
- The chart is hidden from screen readers, and a table of the values is read in its place. `label` names the table, and `x-label` names its first column. `format` sets the text of a value, and `format-x` the text of an x value.
- The chart is drawn as plain SVG. There is no chart library to install.

## Usage

```ts
import { BlessLineChart, type BlessChartSeries } from "blessing-ui";
```

## API

<PropsTable name="BlessLineChart" />

<script setup>
import LineChartBasic from "../demos/LineChartBasic.vue";
</script>
