---
title: Calendar
---

<script setup>
import CalendarBasic from "../demos/CalendarBasic.vue";
</script>

# Calendar

<p class="bless-lead">Month grid</p>

An inline month you can pick a day — or a `range` — from. The model is an ISO date string (`"2019-09-25"`), or `[start, end]` in range mode; the second click closes the range and hovering previews it. `locale` drives the month name and weekday initials through `Intl`; `weekStart` is `1` (Monday) by default, `0` for Sunday. `min`, `max` and `disabledDates(iso)` strike out what can't be picked; `month` (`YYYY-MM`) sets the month shown before anything is selected.

Keyboard: arrows move a day or a week (← / → follow reading direction in RTL), Home / End to the week's ends, PageUp / PageDown a month, Enter or Space picks. One cell is in the tab order at a time — the focused day — so the grid is a single stop. The month heading is polite-live, so paging is announced.

For a date _field_ — this in a popover, or the native picker on touch — use [DatePicker](./date-picker).

<Demo title="Basic">
  <CalendarBasic />
  <template #code>

<<< ../demos/CalendarBasic.vue

  </template>
</Demo>

## Usage

```ts
import { BlessCalendar } from "blessing-ui";
```

## API

<PropsTable name="BlessCalendar" />
