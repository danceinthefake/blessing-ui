---
title: Rose chart
---

<script setup>
import RoseChartBasic from "../demos/RoseChartBasic.vue";
</script>

# Rose chart

<p class="bless-lead">Wedges of equal angle whose size is the value</p>

Shows values that go around a cycle, such as the months of a year or the hours of a day. Each item gets a wedge of the same angle, and a bigger value makes a bigger wedge. This form is also called a polar area chart. For parts of one whole, use the [donut chart](./donut-chart).

<Demo title="Basic">
  <RoseChartBasic />
  <template #code>

<<< ../demos/RoseChartBasic.vue

  </template>
</Demo>

- `data` is a list of items, clockwise from the top. Each item has a `label`, a `value`, and an optional `color`.
- The area of a wedge follows the value, so the radius grows with the square root of the value. The dashed rings mark a quarter, a half, three quarters, and all of the largest value.
- `color` sets the color of the wedges (default `chart-1`). An item with its own `color` stands out.
- `size` sets the width of the chart in pixels (default 300), and `format` sets the text of a value.
- For screen readers, the chart is a table. `label` names the table. Change the column names with `labels` or a [label pack](../guide/translating): `item` and `value`.

## Usage

```ts
import { BlessRoseChart } from "blessing-ui";
```

## API

<PropsTable name="BlessRoseChart" />
