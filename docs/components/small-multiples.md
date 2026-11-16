---
title: Small multiples
---

<script setup>
import SmallMultiplesBasic from "../demos/SmallMultiplesBasic.vue";
</script>

# Small multiples

<p class="bless-lead">A grid of small line charts on one scale</p>

Shows many series at a glance, one small chart for each, so that no lines cross. All the charts share one scale, so their heights compare. For a few series in one chart, use the [line chart](./line-chart).

<Demo title="Basic">
  <SmallMultiplesBasic />
  <template #code>

<<< ../demos/SmallMultiplesBasic.vue

  </template>
</Demo>

- `series` is a list of series. Each series has a `label`, a list of `values`, and an optional `color`.
- Each cell shows the name, the last value, and a [sparkline](./sparkline) with the area under it. A line above the grid gives the shared scale, from zero or the lowest value to a round number over the highest.
- `steps` names the steps for the table, such as the weeks. `height` sets the height of each small chart in pixels (default 56), and `format` sets the text of a value.
- The cells fill the width in columns of about 10rem.
- For screen readers, the grid is hidden and a table holds every value. `label` names the table. Change the words with `labels` or a [label pack](../guide/translating): `item`, and `scale` (a function of the two ends).

## Usage

```ts
import { BlessSmallMultiples } from "blessing-ui";
```

## API

<PropsTable name="BlessSmallMultiples" />
