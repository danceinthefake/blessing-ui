---
title: Heatmap
---

<script setup>
import HeatmapBasic from "../demos/HeatmapBasic.vue";
</script>

# Heatmap

<p class="bless-lead">A grid of rows and columns, colored by value</p>

Shows a number for each pair of two things, for example plays by weekday and hour, so busy and quiet times stand out. For one value a day over a year, use the [heatmap calendar](./heatmap-calendar).

<Demo title="Basic">
  <HeatmapBasic />
  <template #code>

<<< ../demos/HeatmapBasic.vue

  </template>
</Demo>

- `rows` and `columns` are the names on the two edges. `values[row][column]` is the number of each cell. `null` is a cell with no data, and it is gray.
- The color of a cell goes from a light tint for the lowest value to the full color for the highest. `color` sets that color, as a token name or any CSS color (default `chart-1`).
- The legend under the grid shows the scale from the lowest to the highest value. A hover on a cell shows its row, column, and value.
- The grid is a real table, with the names of the rows and columns as headers, so screen readers read each value with its row and column. `label` names the table, and `format` sets the text of a value.
- A wide grid scrolls to the side in its own box.

## Usage

```ts
import { BlessHeatmap } from "blessing-ui";
```

## API

<PropsTable name="BlessHeatmap" />
