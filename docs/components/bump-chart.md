---
title: Bump chart
---

# Bump chart

<p class="bless-lead">The rank of each item over time, as lines that cross</p>

Shows who is first, second, and third at each step, and when they change places. For the values and not the ranks, use the [line chart](./line-chart). For one ranking now, use the [leaderboard](./leaderboard).

<Demo title="Basic">
  <BumpChartBasic />
  <template #code>

<<< ../demos/BumpChartBasic.vue

  </template>
</Demo>

- `data` is a list of steps in order, with a value for each series. `x` names the field with the text of the step. `series` takes the same series as the line chart.
- The chart ranks the series at each step. The highest value is rank 1, at the top. With `lower`, the lowest value is rank 1, for example for a time. Equal values share a rank.
- Each line ends with the name of its series. A hover on a line makes the other lines faint, so you can follow it through the crossings.
- If the chart is narrow, the labels under it skip some steps. `format` sets the text of a value in the table, and `height` sets the height in pixels (default 260).
- For screen readers, the chart is a table with the rank and the value of each series at each step. `label` names the table. Change the words with `labels` or a [label pack](../guide/translating): `step`, and `rank` (a function of the rank and the value).

## Usage

```ts
import { BlessBumpChart } from "blessing-ui";
```

## API

<PropsTable name="BlessBumpChart" />

<script setup>
import BumpChartBasic from "../demos/BumpChartBasic.vue";
</script>
