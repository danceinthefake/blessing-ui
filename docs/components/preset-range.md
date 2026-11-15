---
title: Preset range
---

<script setup>
import PresetRangeBasic from "../demos/PresetRangeBasic.vue";
</script>

# Preset range

<p class="bless-lead">A date range with presets, such as the last 7 days, next to a calendar</p>

Lets a person pick a common range in one click, or any range on the calendar. It fits the filters of a report or a dashboard. For a date range field that opens on click, use the [date picker](./date-picker).

<Demo title="Basic">
  <PresetRangeBasic />
  <template #code>

<<< ../demos/PresetRangeBasic.vue

  </template>
</Demo>

- `v-model` is the range as `[start, end]`, each as `YYYY-MM-DD`.
- The common presets are today, yesterday, the last 7 days, the last 30 days, this month, and last month. `presets` puts your own list in their place, each with a `label` and a `range`.
- The common presets need today. `today` sets it. Without it, the presets use today of the reader and show after the page loads.
- The preset that matches the range has a bar and bold words. A preset in another month opens the calendar on that month.
- The line above the calendar says the range in words, such as `Nov 10 – 16, 2026`. It is a status line, so screen readers hear the change. `locale` sets the language, and `week-start` the first day of the week.
- The presets are toggle buttons in a group. Change the words with `labels` or a [label pack](../guide/translating): `presets`, `today`, `yesterday`, `last7`, `last30`, `thisMonth`, `lastMonth`, and `none`.

## Usage

```ts
import { BlessPresetRange } from "blessing-ui";
```

## API

<PropsTable name="BlessPresetRange" />
