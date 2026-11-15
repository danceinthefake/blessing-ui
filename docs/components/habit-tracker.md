---
title: Habit tracker
---

<script setup>
import HabitTrackerBasic from "../demos/HabitTrackerBasic.vue";
</script>

# Habit tracker

<p class="bless-lead">A grid of days for each habit, with checks and the streak</p>

Shows which days a person did each habit, and how many days in a row they kept it. A click on a day marks it. For a whole year of activity, use the [heatmap calendar](./heatmap-calendar).

<Demo title="Basic">
  <HabitTrackerBasic />
  <template #code>

<<< ../demos/HabitTrackerBasic.vue

  </template>
</Demo>

- `habits` is a list of habits, each with an `id` and a `name`.
- `v-model:done` holds the done days of each habit by id, as `YYYY-MM-DD`, such as `{ read: ["2026-11-15", "2026-11-16"] }`. A click on a day adds it or removes it.
- `days` sets the number of days to show (default 7). `end` sets the last day. With no `end`, the last day is the today of the reader, and the grid shows after the page loads.
- The streak counts the days in a row that are done, back from the last day. If the last day is not done yet, the count starts on the day before, so a streak does not break in the morning.
- Each day is a native check box. Its name says the habit and the date, such as "Read one article, Monday, November 16". `locale` sets the language of the dates (default English).
- Change the words with `labels` or a [label pack](../guide/translating): `habit`, `streak`, and the functions `streakOf` and `mark`.

## Usage

```ts
import { BlessHabitTracker } from "blessing-ui";
```

## API

<PropsTable name="BlessHabitTracker" />
