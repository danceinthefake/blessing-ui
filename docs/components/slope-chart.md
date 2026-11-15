---
title: Slope chart
---

<script setup>
import SlopeChartBasic from "../demos/SlopeChartBasic.vue";
</script>

# Slope chart

<p class="bless-lead">Two columns, such as before and after, with a line for each item</p>

Shows which items went up and which went down between two moments. The angle of a line shows the change. For the gap of each item on one row, use the [dumbbell](./dumbbell).

<Demo title="Basic">
  <SlopeChartBasic />
  <template #code>

<<< ../demos/SlopeChartBasic.vue

  </template>
</Demo>

- `data` is a list of items. Each item has a `label`, a `start` value, an `end` value, and an optional `color`.
- A rise has a solid line in the chart color. A fall has a dashed gray line, so the direction does not rest on the color alone.
- The name and the start value sit to the left, and the end value to the right. A hover on a line makes the others faint.
- `format` sets the text of a value, and `height` sets the height in pixels (default 300).
- For screen readers, the chart is a table with the change of each item. `label` names the table. Name the columns with `labels` or a [label pack](../guide/translating): `start` (default "Before"), `end` (default "After"), `item`, and `change`.

## Usage

```ts
import { BlessSlopeChart } from "blessing-ui";
```

## API

<PropsTable name="BlessSlopeChart" />
