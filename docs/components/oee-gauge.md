---
title: OEE gauge
---

# OEE gauge

<p class="bless-lead">Overall equipment effectiveness: availability × performance × quality</p>

OEE (overall equipment effectiveness) says how much of the planned time a machine makes good pieces at full speed. It comes from total productive maintenance by Seiichi Nakajima.

<Demo title="Basic">
  <OeeGaugeBasic />
  <template #code>

<<< ../demos/OeeGaugeBasic.vue

  </template>
</Demo>

- `availability` is the run time over the planned time, from 0 to 1.
- `performance` is the real output over the output at the ideal speed, from 0 to 1.
- `quality` is the good pieces over all pieces, from 0 to 1.
- The OEE is the product of the three. It shows on a [gauge](./gauge): red below three quarters of the goal, amber below the goal, and green at or above it.
- `goal` is the target (default 0.85, a level that is often called world class). A line under the dial says the goal with a mark.
- The three parts show as bars. The lowest part says "Lowest part" and has a striped bar, so the team knows where to start.
- `locale` sets the format of the percents. Change the words with `labels` or a [label pack](../guide/translating): `oee`, `availability`, `performance`, `quality`, `below`, and `goal` (a function).

## Usage

```ts
import { BlessOeeGauge } from "blessing-ui";
```

## API

<PropsTable name="BlessOeeGauge" />

<script setup>
import OeeGaugeBasic from "../demos/OeeGaugeBasic.vue";
</script>
