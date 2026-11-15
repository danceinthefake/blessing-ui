---
title: Pareto
---

<script setup>
import ParetoBasic from "../demos/ParetoBasic.vue";
</script>

# Pareto

<p class="bless-lead">Bars from high to low, with a line for the running share</p>

Finds the few causes that make most of a problem. The bars go from the biggest cause to the smallest, and the line shows the share of the total up to each bar. For bars in your own order, use the [bar chart](./bar-chart).

<Demo title="Basic">
  <ParetoBasic />
  <template #code>

<<< ../demos/ParetoBasic.vue

  </template>
</Demo>

- `data` is a list of items, each with a `label` and a `value`. The chart puts them in order from high to low and leaves out values of zero or less.
- The left axis is the value of a bar. The right axis is the running share, from 0% to 100%.
- `cut` is the share that marks "the few" (default 0.8, for the 80/20 rule). A dashed line shows it. The bars up to the first bar that reaches it are in full color, and the other bars are lighter.
- `color` sets the color of the bars, and `format` sets the text of a value. `height` sets the height in pixels (default 260).
- For screen readers, the chart is a table with the value and the running share of each item. `label` names the table. Change the column names with `labels` or a [label pack](../guide/translating): `item`, `value`, and `running`.

## Usage

```ts
import { BlessPareto } from "blessing-ui";
```

## API

<PropsTable name="BlessPareto" />
