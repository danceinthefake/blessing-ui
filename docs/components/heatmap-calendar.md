---
title: HeatmapCalendar
---

<script setup>
import HeatmapCalendarBasic from "../demos/HeatmapCalendarBasic.vue";
</script>

# HeatmapCalendar

<p class="bless-lead">Contribution-style grid, one square per day</p>

A year of activity at a glance — commits, workouts, check-ins. One column per week, one square per day; the darker the square, the more happened. For picking a date to enter, use [Calendar](./calendar) or [DatePicker](./date-picker).

<Demo title="Basic">
  <HeatmapCalendarBasic />
  <template #code>

<<< ../demos/HeatmapCalendarBasic.vue

  </template>
</Demo>

- Pass `data` as `{ "2026-09-27": 4 }`; days left out count as 0. Intensity is ink, not accent: the accent only marks the day you picked.
- The darkest step is the largest value in `data`; set `max` to fix the scale across several grids. `levels` sets how many steps there are above zero (default 4).
- `end` is the last day shown (default today), `weeks` how many columns (default 53), `weekStart` the first row (`1` Monday, `0` Sunday). Month and weekday labels follow `locale`.
- Every day is a button with a full label ("3 commits on Thu, Oct 1, 2026"). One tab stop; **↑ ↓** move by day, **← →** by week (mirrored under RTL), **Home** / **End** jump to the first and last day. Click or press Enter to pick a day, again to clear it.
- The line under the grid shows the hovered or focused day, and the total otherwise.

## Usage

```ts
import { BlessHeatmapCalendar } from "blessing-ui";
```

## API

<PropsTable name="BlessHeatmapCalendar" />
