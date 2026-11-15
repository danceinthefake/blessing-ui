---
title: Box plot
---

<script setup>
import BoxPlotBasic from "../demos/BoxPlotBasic.vue";
</script>

# Box plot

<p class="bless-lead">The spread of values in groups</p>

Shows where most values of a group are, and which values are far from the rest, for example how long people listen on each day. An average hides this spread. For two numbers on each item, use the [scatter chart](./scatter-chart).

<Demo title="Basic">
  <BoxPlotBasic />
  <template #code>

<<< ../demos/BoxPlotBasic.vue

  </template>
</Demo>

- `groups` is a list of `{ label, values, color }`. You give the raw values, and the chart computes the rest. A value that is not a number is left out.
- The box goes from the lower quartile to the upper quartile, so it holds the middle half of the values. The line in the box is the median.
- The whiskers go to the lowest and the highest value that are inside 1.5 × the height of the box. A value outside that is an outlier and has its own dot.
- The quartiles use the linear method of most spreadsheets. A group with no values gets its label and no box.
- A hover on a box shows its numbers. The chart draws at the width of its container, and `height` sets the height (default 280).
- The chart is hidden from screen readers, and a table of the numbers of each group is read in its place. `label` names the table. `format` sets the text of a value. Change the column names with `labels` or a [label pack](../guide/translating): `group`, `min`, `q1`, `median`, `q3`, `max`, and `outliers`.
- The chart is drawn as plain SVG. There is no chart library to install.

## Usage

```ts
import { BlessBoxPlot, type BlessBoxGroup } from "blessing-ui";
```

## API

<PropsTable name="BlessBoxPlot" />
