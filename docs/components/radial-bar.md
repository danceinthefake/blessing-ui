---
title: Radial bar
---

<script setup>
import RadialBarBasic from "../demos/RadialBarBasic.vue";
</script>

# Radial bar

<p class="bless-lead">Rings that fill to a share, one ring for each goal</p>

Shows how far each goal is, as rings in one circle. Each ring fills to the share of its goal. For one value with a needle, use the [gauge](./gauge). For parts of one whole, use the [donut chart](./donut-chart).

<Demo title="Basic">
  <RadialBarBasic />
  <template #code>

<<< ../demos/RadialBarBasic.vue

  </template>
</Demo>

- `data` is a list of goals. Each goal has a `label`, a `value`, an optional `max` (default 100), and an optional `color`. The first goal is the outer ring.
- A ring stops at full. If a value is more than its max, the legend still shows the real value.
- The circle has room for four rings. If the list is longer, the legend shows all goals, but the circle draws only the first four.
- The legend shows the name, the share, the value, and the max of each goal. `format` sets the text of a value, and `size` sets the width of the circle in pixels (default 180).
- For screen readers, the circle is hidden and the legend is a list. `label` names the chart.

## Usage

```ts
import { BlessRadialBar } from "blessing-ui";
```

## API

<PropsTable name="BlessRadialBar" />
