---
title: Parallel coordinates
---

<script setup>
import ParallelCoordinatesBasic from "../demos/ParallelCoordinatesBasic.vue";
</script>

# Parallel coordinates

<p class="bless-lead">Each item as a line across several axes</p>

Compares a few items on many measures at once, such as plays, length, and rating. Each axis is a measure, and each line is an item. Lines that cross show a trade-off. For two measures only, use the [scatter chart](./scatter-chart).

<Demo title="Basic">
  <ParallelCoordinatesBasic />
  <template #code>

<<< ../demos/ParallelCoordinatesBasic.vue

  </template>
</Demo>

- `data` is a list of rows, with a value for each axis and an optional `color`. `name` names the field with the name of a row.
- `axes` is a list of axes from left to right. Each axis has a `key`, a `label`, and an optional `format`.
- Each axis has its own scale, from a round number under its lowest value to a round number over its highest. The two ends show at the top and the bottom of the axis.
- A hover on a line makes the others faint. A legend under the chart names the lines. `height` sets the height in pixels (default 280).
- For screen readers, the chart is a table with a row for each item. `label` names the table. Change the name of the first column with `labels` or a [label pack](../guide/translating): `item`.

## Usage

```ts
import { BlessParallelCoordinates } from "blessing-ui";
```

## API

<PropsTable name="BlessParallelCoordinates" />
