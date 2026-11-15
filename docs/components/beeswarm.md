---
title: Beeswarm
---

<script setup>
import BeeswarmBasic from "../demos/BeeswarmBasic.vue";
</script>

# Beeswarm

<p class="bless-lead">Each value as a dot on one axis, with no overlap</p>

Shows every value of a set, so the spread and the clusters show. Dots with close values move up or down, so all of them stay in view. For a summary of the spread, use the [box plot](./box-plot). For values in bins, use the [histogram](./histogram).

<Demo title="Basic">
  <BeeswarmBasic />
  <template #code>

<<< ../demos/BeeswarmBasic.vue

  </template>
</Demo>

- `data` is a list of numbers, or of points with a `value`, an optional `label` for the hover, and an optional `group`.
- `groups` gives each group a `key`, a `label`, and an optional `color`. A legend names them.
- In order of value, each dot takes the free place nearest to the middle line. A dense part of the data makes a wide swarm.
- `radius` sets the size of a dot in pixels (default 5), and `height` sets the height of the chart (default 200). If the swarm is taller than the chart, make the chart taller or the dots smaller.
- For screen readers, the chart is a table with the count, the lowest value, the median, and the highest value of each group. `label` names the table. Change the words with `labels` or a [label pack](../guide/translating): `group`, `count`, `min`, `median`, `max`, and `all`.

## Usage

```ts
import { BlessBeeswarm } from "blessing-ui";
```

## API

<PropsTable name="BlessBeeswarm" />
