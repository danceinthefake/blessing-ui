---
title: Candlestick
---

# Candlestick

<p class="bless-lead">The open, high, low, and close of each period</p>

Shows how a price or a range moves each day. Each period is a candle. The thin line goes from the low to the high, and the box goes from the open to the close. For one value each day, use the [line chart](./line-chart).

<Demo title="Basic">
  <CandlestickBasic />
  <template #code>

<<< ../demos/CandlestickBasic.vue

  </template>
</Demo>

- `data` is a list of periods. Each period has a `label` and the numbers `open`, `high`, `low`, and `close`.
- A period that closes at or above its open is hollow, in the `up` color (default `success`). A period that closes below its open is filled, in the `down` color (default `danger`). The shape tells the two apart, so the color is not the only sign.
- The axis starts and ends at round numbers around the lowest low and the highest high. If the chart is narrow, the labels under the candles skip some periods.
- `format` sets the text of a value, and `height` sets the height in pixels (default 260).
- For screen readers, the chart is a table with a row for each period. `label` names the table. Change the column names with `labels` or a [label pack](../guide/translating): `period`, `open`, `high`, `low`, and `close`.

## Usage

```ts
import { BlessCandlestick } from "blessing-ui";
```

## API

<PropsTable name="BlessCandlestick" />

<script setup>
import CandlestickBasic from "../demos/CandlestickBasic.vue";
</script>
