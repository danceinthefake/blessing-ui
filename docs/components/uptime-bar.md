---
title: UptimeBar
---

# UptimeBar

<p class="bless-lead">Status history, one segment per period</p>

A row of segments that shows the status of a service over time, as on a status page. Each segment is one period, for example one day. The oldest period is first.

<Demo title="Basic">
  <UptimeBarBasic />
  <template #code>

<<< ../demos/UptimeBarBasic.vue

  </template>
</Demo>

- `items` is a list of `{ status, label }`. `status` is `up`, `degraded`, `down`, or `none` (no data). The tooltip of a segment shows its `label` and its status.
- A degraded segment has stripes. The colors of up and degraded are close for some color-blind readers, so the stripes tell them apart.
- The bar is a group, and its name is a summary, such as "98.21% uptime over 60 periods". Degraded periods count as up. Periods without data do not count.
- The bar is one tab stop, on the newest period. Use ← and → to move to the next period, and Home and End to go to the first or last period. The focused segment shows its tooltip text under the bar, and a screen reader reads the same text.
- `locale` formats the percent. Change the words with `labels` or a [label pack](../guide/translating). `labels.summary` gets the formatted percent and the number of periods, so you can write "days" in place of "periods".
- The bar fills the width of its container. Set `--bless-uptime-height` to change its height (default 32px). Put the start and end dates under the bar yourself, as the demo does.

## Usage

```ts
import { BlessUptimeBar } from "blessing-ui";
```

## API

<PropsTable name="BlessUptimeBar" />

<script setup>
import UptimeBarBasic from "../demos/UptimeBarBasic.vue";
</script>
