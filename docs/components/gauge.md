---
title: Gauge
---

<script setup>
import GaugeBasic from "../demos/GaugeBasic.vue";
</script>

# Gauge

<p class="bless-lead">Zoned meter: semi-circle or linear</p>

A reading with a good range and a bad one — load, temperature, battery, a score. The zones say what the number means; the needle says where it is now. For progress toward a finish, use [Progress](./progress) or [CircularProgress](./circular-progress); to let the user set a value, a [Slider](./slider) or [Knob](./knob).

<Demo title="Basic">
  <GaugeBasic />
  <template #code>

<<< ../demos/GaugeBasic.vue

  </template>
</Demo>

- `zones` is a list of `{ to, color, label }`: each runs from the previous zone's end to its `to`. `color` is a token name (`success`, `warning`, `danger`, `info`, `chart-1`…) or any CSS colour, and `label` is what a screen reader hears after the number ("72%, Busy"). Color alone never carries the meaning.
- `variant="arc"` is the half circle with a needle; `"linear"` is a bar with a marker, for tight spaces.
- `min` and `max` set the scale (default 0 to 100). A value outside it pins the needle to the end and is announced clamped, but the number shown is the one you passed.
- `format` shapes the number; `label` names the meter and sits under the number.
- It is `role="meter"`, read-only. Without `zones` it is a bare scale and needle.

## Usage

```ts
import { BlessGauge } from "blessing-ui";
```

## API

<PropsTable name="BlessGauge" />
