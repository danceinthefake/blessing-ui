---
title: Donut chart
---

<script setup>
import DonutChartBasic from "../demos/DonutChartBasic.vue";
</script>

# Donut chart

<p class="bless-lead">Parts of one whole, as a ring or a pie</p>

Shows how one total splits into a few parts, for example storage by type. Use it for up to about six parts. For more parts, or parts that you compare with each other, use the [bar chart](./bar-chart). For parts in a row, use the [meter group](./meter-group).

<Demo title="Basic">
  <DonutChartBasic />
  <template #code>

<<< ../demos/DonutChartBasic.vue

  </template>
</Demo>

- `data` is a list of `{ label, value, color }`. Each slice is its share of the total, from the top and clockwise. A value of 0 or less has no slice, but it stays in the legend.
- The total is in the center. `pie` draws a full pie, with no hole and no total.
- The legend shows each part with its value and its share. It is real text, so screen readers read it, and the ring is hidden from them. `label` names the chart.
- A hover on a slice shows its label, value, and share. Colors go through the chart colors in order. Set `color` to a token name or any CSS color.
- `size` sets the width of the ring in pixels (default 180). The legend goes beside the ring, or below it when there is no room.
- `format` sets the text of a value. Change the word under the total with `labels` or a [label pack](../guide/translating): `total`.
- The chart is drawn as plain SVG. There is no chart library to install.

## Usage

```ts
import { BlessDonutChart, type BlessDonutSlice } from "blessing-ui";
```

## API

<PropsTable name="BlessDonutChart" />
