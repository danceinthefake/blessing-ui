---
title: Range chart
---

<script setup>
import RangeChartBasic from "../demos/RangeChartBasic.vue";
</script>

# Range chart

<p class="bless-lead">Floating bars from a low to a high value for each row</p>

Shows the span of each item, such as the shortest and the longest episode of each show, or the low and the high price of each day. For a box with the quartiles, use the [box plot](./box-plot).

<Demo title="Basic">
  <RangeChartBasic />
  <template #code>

<<< ../demos/RangeChartBasic.vue

  </template>
</Demo>

- `data` is a list of rows. Each row has a `label`, a `low` value, and a `high` value. An optional `value` puts a mark inside the range, such as the average.
- The bar goes from the low value to the high value on one axis for all rows. The mark is a dark line across the bar.
- `color` sets the color of the bars (default `chart-1`), and `format` sets the text of a value.
- For screen readers, the chart is a table. If a row has a mark, the table has a column for it. `label` names the table. Name the columns with `labels` or a [label pack](../guide/translating): `item`, `low`, `high`, and `value`.

## Usage

```ts
import { BlessRangeChart } from "blessing-ui";
```

## API

<PropsTable name="BlessRangeChart" />
