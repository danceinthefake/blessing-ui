---
title: Streamgraph
---

# Streamgraph

<p class="bless-lead">Stacked areas around a center line</p>

Shows how a mix changes over time, for example the plays of each topic month by month. The streams sit on top of each other around a center line, so the thickness of the whole is the total. To read exact values over time, use the [line chart](./line-chart).

<Demo title="Basic">
  <StreamgraphBasic />
  <template #code>

<<< ../demos/StreamgraphBasic.vue

  </template>
</Demo>

- `data` is a list of steps in order. `x` names the field of a row with the text of its step, such as `month`.
- `series` takes the same series as the bar and the line charts. Each series has a `key`, an optional `label`, and an optional `color`. The first series is the bottom stream.
- Values below zero count as zero. The legend above the chart names the streams in the same order.
- If the chart is narrow, the labels under it skip some steps. `format` sets the text of a value in the table, and `height` sets the height in pixels (default 260).
- For screen readers, the chart is a table with a row for each step. `label` names the table. Change the name of the first column with `labels` or a [label pack](../guide/translating): `step`.

## Usage

```ts
import { BlessStreamgraph } from "blessing-ui";
```

## API

<PropsTable name="BlessStreamgraph" />

<script setup>
import StreamgraphBasic from "../demos/StreamgraphBasic.vue";
</script>
