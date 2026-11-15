---
title: Scatter chart
---

<script setup>
import ScatterChartBasic from "../demos/ScatterChartBasic.vue";
</script>

# Scatter chart

<p class="bless-lead">Points on two number axes, or bubbles with a size</p>

Shows how two numbers relate across many items, for example how often a show comes out and how many people listen. A third number can set the size of each dot, which makes a bubble chart. For the spread of one number in groups, use the [box plot](./box-plot).

<Demo title="Basic">
  <ScatterChartBasic />
  <template #code>

<<< ../demos/ScatterChartBasic.vue

  </template>
</Demo>

- `points` is a list of `{ x, y, size, label, group }`. A point with no number for `x` or `y` is left out.
- `size` makes a bubble. The area of the dot, not its width, grows with the size, so a bubble twice the size looks twice as big. Big bubbles are drawn first, so a small one is never under a big one.
- `groups` (`{ id, label, color }`) gives each group a color, in the same order as the legend of [`BlessChart`](./chart). A point with no group takes the first chart color.
- Both axes have round steps that cover the data. `x-label` and `y-label` name the axes, under and beside the chart and in the table.
- A hover on a dot shows its label and its numbers. The chart draws at the width of its container, and `height` sets the height (default 280).
- The chart is hidden from screen readers, and a table of the points is read in its place. `label` names the table. `format` sets the text of a y value and a size, and `format-x` of an x value. Change the other column names with `labels` or a [label pack](../guide/translating): `point`, `group`, and `size`.
- The chart is drawn as plain SVG. There is no chart library to install.

## Usage

```ts
import { BlessScatterChart, type BlessScatterGroup, type BlessScatterPoint } from "blessing-ui";
```

## API

<PropsTable name="BlessScatterChart" />
