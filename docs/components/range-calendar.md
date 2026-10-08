---
title: RangeCalendar
---

<script setup>
import RangeCalendarBasic from "../demos/RangeCalendarBasic.vue";
</script>

# RangeCalendar

<p class="bless-lead">Paint the days you are free — or busy</p>

A month where the days are chosen by dragging across them, again and again, to build up a set: availability, days off, blackout dates, opening days. The value is every chosen day, not one range. For one date use [DatePicker](./date-picker); for a single from–to range, [Calendar](./calendar) with `range`.

<Demo title="Availability">
  <RangeCalendarBasic />
  <template #code>

<<< ../demos/RangeCalendarBasic.vue

  </template>
</Demo>

- `v-model` is the chosen days as sorted `YYYY-MM-DD` strings. **Drag** across days to add them; a drag that **starts on a chosen day** removes instead (it shows a dashed outline while you do). A plain click toggles one day. Nothing changes until you let go.
- Keyboard: one day is the tab stop; **arrows** move by day and week, **Home** / **End** to the week's ends, **Page Up** / **Page Down** change month, **Space** or **Enter** toggles the day. Hold **Shift** while pressing arrows to paint as you go — the first day decides whether the stroke adds or removes. Choices are announced.
- `min`, `max` and `disabledDates` make days unpaintable (a drag skips them; one starting on them does nothing). The footer says "5 days in 2 blocks" and has **Clear all**; `#summary="{ blocks }"` writes your own, and `change` gives the blocks as `{ start, end, count }`.
- The grid is a `role="grid"` with `aria-multiselectable`; each day is named in full ("Friday, May 1, 2026"). `locale` and `weekStart` set the names and the first column; `labels` translates the wording. Today is marked after mount, so a server-rendered page agrees.

## Usage

```ts
import { BlessRangeCalendar } from "blessing-ui";
```

## API

<PropsTable name="BlessRangeCalendar" />
