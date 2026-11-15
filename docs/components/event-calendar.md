---
title: Event calendar
---

<script setup>
import EventCalendarBasic from "../demos/EventCalendarBasic.vue";
</script>

# Event calendar

<p class="bless-lead">A month of events in a grid</p>

Shows the events of a month, for example the plan of a team. For the hours of a week, with events that a person can move, use the [scheduler](./scheduler). For picking a date, use the [calendar](./calendar).

<Demo title="Basic">
  <EventCalendarBasic />
  <template #code>

<<< ../demos/EventCalendarBasic.vue

  </template>
</Demo>

- `events` is a list of `{ id, title, date, start, end, color }`. The date is a `YYYY-MM-DD` text, and `start` and `end` are minutes after midnight, as in [`BlessScheduler`](./scheduler), so both can show the same list.
- An event with no `start` is for the whole day. It has a filled background and comes first. The other events come in the order of their start time, with the time in the format of `locale`.
- A day shows `max` lines (default 3). When a day has more events, the last line is "+2 more", which shows all of them in the day. A click on an event emits `select`.
- `v-model:date` is a day in the month shown. With no date, the calendar shows the month of the first event, or of today. The buttons go to the previous month, the next month, and today, and the name of the month is spoken when it changes.
- Each week shows in full, so the first and the last row can have days of the next and previous month, in a muted color. Today has the accent color.
- `week-start` sets the first day of the week (1 = Monday, 0 = Sunday). On a small screen the rows are lower and the times are not shown.
- The grid is a table with the names of the days as column headers. Each day has its full date for screen readers.
- Change the words with `labels` or a [label pack](../guide/translating): `prev`, `next`, `today`, `more`, and `less`.

## Usage

```ts
import { BlessEventCalendar, type BlessCalendarEvent } from "blessing-ui";
```

## API

<PropsTable name="BlessEventCalendar" />
