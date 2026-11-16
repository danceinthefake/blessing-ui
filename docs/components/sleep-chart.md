---
title: Sleep chart
---

<script setup>
import SleepChartBasic from "../demos/SleepChartBasic.vue";
</script>

# Sleep chart

<p class="bless-lead">The stages of sleep across a night</p>

Shows one night from a sleep tracker. This kind of chart is a hypnogram: each stage has its own row, so the stage shows by its height and not only by its color.

<Demo title="Basic">
  <SleepChartBasic />
  <template #code>

<<< ../demos/SleepChartBasic.vue

  </template>
</Demo>

- `spans` is the night in order. Each span has a `stage` (`awake`, `rem`, `light`, or `deep`), a `start`, and an `end` as `HH:MM`.
- A time before the first start is on the next day, so a night can cross midnight.
- Awake is on top and deep sleep is at the bottom. Ticks mark each full hour of the clock.
- Under the chart, the totals show the time asleep and the time in each stage. Screen readers hear the same totals as the name of the chart.
- `height` sets the height in pixels (default 180). The chart takes the width of its box.
- Change the words with `labels` or a [label pack](../guide/translating): `title`, the four stages, and the functions `total` and `hours`.

The `sleepSpans` function turns the clock times into minutes from the start. It is exported for your own views.

## Usage

```ts
import { BlessSleepChart } from "blessing-ui";
```

## API

<PropsTable name="BlessSleepChart" />
