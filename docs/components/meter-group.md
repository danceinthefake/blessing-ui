---
title: MeterGroup
---

<script setup>
import MeterGroupBasic from "../demos/MeterGroupBasic.vue";
</script>

# MeterGroup

<p class="bless-lead">Multi-segment meter with legend</p>

Parts of a whole on one bar — storage by file type, a budget by category, votes by option — with a legend that names each part, its value and its share. With `max` the bar is "used of available" and the remainder stays grey; without it the segments are shares of their own sum and fill the bar.

Colours come from `--bless-color-chart-1..5` in order; a segment's `color` can be any token key (`text-muted`, `accent`) or a CSS colour. `format` shapes the values; the `#legend` slot (`{ segment, percent }`) replaces a legend row. `orientation="vertical"` stands the bar up with the legend beside it. The bar is a `role="meter"` whose value is the sum; the segments are decoration and the legend carries the detail.

One value on a bar is [Progress](./progress); more than a handful of segments, or segments over time, is a [Chart](./chart).

<Demo title="Basic">
  <MeterGroupBasic />
  <template #code>

<<< ../demos/MeterGroupBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessMeterGroup } from "blessing-ui";
```

## API

<PropsTable name="BlessMeterGroup" />
