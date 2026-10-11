---
title: Radar
---

<script setup>
import RadarBasic from "../demos/RadarBasic.vue";
</script>

# Radar

<p class="bless-lead">Spider chart: one shape per series</p>

A spider chart: several measures of one thing on spokes around a center, with one shape for each series. Use it to compare a few items on the same five or six measures. For one measure over time, use [Sparkline](./sparkline) or [Chart](./chart).

<Demo title="Basic">
  <RadarBasic />
  <template #code>

<<< ../demos/RadarBasic.vue

  </template>
</Demo>

- `axes` names the spokes (three or more). Each series has one value for each axis, in the same order.
- `max` is the value at the edge. Without it, the biggest value sets the edge. A value above `max` stays at the edge. A missing value counts as 0.
- `rings` sets the number of rings between the center and the edge (default 4). `size` sets the width and height in px, and the chart scales down inside a small container.
- Series use `--bless-color-chart-1..5` in order, or the `color` of the series. With two or more series, a legend names them.
- The `aria-label` lists every value, for example "Tram: Speed 3, Reach 4". Give the numbers as text or a [Table](./table) too when the exact values matter.

## Usage

```ts
import { BlessRadar } from "blessing-ui";
```

## API

<PropsTable name="BlessRadar" />
