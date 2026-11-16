---
title: Control chart
---

<script setup>
import ControlChartBasic from "../demos/ControlChartBasic.vue";
</script>

# Control chart

<p class="bless-lead">Measured values over time with the center line and the control limits (SPC)</p>

Watches a process for change, in SPC (statistical process control). A point outside the control limits says that something changed and needs a look. The chart follows the control chart of Walter A. Shewhart.

<Demo title="Basic">
  <ControlChartBasic />
  <template #code>

<<< ../demos/ControlChartBasic.vue

  </template>
</Demo>

- `values` is the list of measures in time order. `points` gives a label for each, such as the time.
- `center`, `ucl` (upper control limit), and `lcl` (lower control limit) set the lines. Without them, the chart takes the mean of the values and the mean ± 3 standard deviations.
- The limits are dashed red lines, and the mean is a solid line. A point out of control is a red diamond, and a point in control is a circle.
- The caption counts the points out of control and gives the three lines. A hidden table lists each point and its state for screen readers.
- `unit` adds the unit to the numbers. `height` sets the height in pixels (default 240). The chart takes the width of its box.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

The `controlLimits` function works out the lines. It is exported for your own views.

## Usage

```ts
import { BlessControlChart } from "blessing-ui";
```

## API

<PropsTable name="BlessControlChart" />
