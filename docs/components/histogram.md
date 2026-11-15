---
title: Histogram
---

<script setup>
import HistogramBasic from "../demos/HistogramBasic.vue";
</script>

# Histogram

<p class="bless-lead">Raw values in round bins, as bars</p>

Shows the shape of many values, for example how long people listen: where most values are, and whether there are two groups. For the spread of values in a few groups side by side, use the [box plot](./box-plot).

<Demo title="Basic">
  <HistogramBasic />
  <template #code>

<<< ../demos/HistogramBasic.vue

  </template>
</Demo>

- `values` is a list of raw numbers. The chart counts them in bins of equal width. A value that is not a number is left out.
- `bins` is about how many bins (default 10). The edges are round numbers, so the real count can be a little different. A bin holds the values from its start up to its end, and the last bin also holds its end.
- The bars touch, because the bins have no gaps between them. The edges of the bins are on the x axis. A hover on a bar shows its range and count.
- `color` sets the color of the bars, as a token name or any CSS color (default `chart-1`). The chart draws at the width of its container, and `height` sets the height (default 240).
- The chart is hidden from screen readers, and a table of the ranges and counts is read in its place. `label` names the table, and `format` sets the text of an edge. Change the column names with `labels` or a [label pack](../guide/translating): `range` and `count`.
- The chart is drawn as plain SVG. There is no chart library to install.

## Usage

```ts
import { BlessHistogram } from "blessing-ui";
```

## API

<PropsTable name="BlessHistogram" />
