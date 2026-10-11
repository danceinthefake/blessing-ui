---
title: Stat
---

<script setup>
import StatBasic from "../demos/StatBasic.vue";
</script>

# Stat

<p class="bless-lead">KPI tile: value, change, and trend</p>

A number that people check at a glance: revenue, error rate, signups. Show the value large and thin, the change under it, and an optional trend line. For a chart that the reader studies, use [Chart](./chart). For a trend in a table row, use [Sparkline](./sparkline).

<Demo title="Basic">
  <StatBasic />
  <template #code>

<<< ../demos/StatBasic.vue

  </template>
</Demo>

- `delta` is a number with a sign or a string. A number shows an arrow, the size, and `deltaUnit` (default `%`). A string shows as you wrote it.
- `goodWhen="down"` marks a fall as good news, for example an error rate. Only bad news turns red. Good news stays ink, because color means chosen.
- The direction is also text. A screen reader hears "Up 12.5%", "Down 0.4%", or "No change". Replace the words with `labels`.
- `data` draws a [Sparkline](./sparkline) under the value. Name it with `dataLabel`.
- The `#hint` slot adds a line of small text. The default slot replaces the value, for example with a [CountUp](./count-up).

## Usage

```ts
import { BlessStat } from "blessing-ui";
```

## API

<PropsTable name="BlessStat" />
