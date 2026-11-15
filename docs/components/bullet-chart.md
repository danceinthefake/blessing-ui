---
title: Bullet chart
---

<script setup>
import BulletChartBasic from "../demos/BulletChartBasic.vue";
</script>

# Bullet chart

<p class="bless-lead">One value against a target and bands, in one thin bar</p>

Shows one key number with its goal and how good it is, in a row that takes little space. Put a few in a stack for a page of key numbers. For a value in a ring, use the [gauge](./gauge). For a plain bar with no target, use the [progress bar](./progress).

<Demo title="Basic">
  <BulletChartBasic />
  <template #code>

<<< ../demos/BulletChartBasic.vue

  </template>
</Demo>

- `label` is the name at the start of the row, and `value` is the number. The value is the thin bar, and its text is at the end of the row.
- `target` draws a line across the bar at the goal.
- `bands` are the ends of the bands, from low to high, for example `[50, 80, 100]`. The first band is the darkest gray and means poor, and the last band is the lightest and means good.
- The scale goes from `min` (default 0) to `max`. With no `max`, the scale ends at the last band, or at a round number above the value and the target. A value past the end fills the bar.
- The labels of all rows have the same width, so the bars line up. Set the width with the `--bless-bullet-label` CSS variable (default `8rem`).
- `color` sets the color of the value bar, as a token name or any CSS color (default `chart-1`). `format` sets the text of a value.
- For screen readers, the bar is a meter. It says the value, the target, and the name of the band, for example "72%, target 80%, fair". Change the words with `labels` or a [label pack](../guide/translating): `target`, and `band` (a function of the place of the band and the number of bands).

## Usage

```ts
import { BlessBulletChart } from "blessing-ui";
```

## API

<PropsTable name="BlessBulletChart" />
