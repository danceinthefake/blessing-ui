---
title: Opening hours
---

# Opening hours

<p class="bless-lead">The hours of each day of the week, and "Open now"</p>

Shows when a shop, a studio, or a help desk is open. A line at the top shows the state now and the time of the next change. For the free times of one day to book, use the [slot picker](./slot-picker).

<Demo title="Basic">
  <OpeningHoursBasic />
  <template #code>

<<< ../demos/OpeningHoursBasic.vue

  </template>
</Demo>

- `hours` is a list of seven days, Monday first. Each day is a list of shifts, each with an `open` and a `close` time as `HH:MM`. An empty day is closed.
- A day can have two or more shifts. A shift with a `close` at or before its `open` ends on the next day, such as 19:00 to 01:00.
- `time-zone` is the zone of the place, such as `Asia/Jakarta`. The status and "today" use the time there, not the time of the reader.
- The status shows after the page loads and changes every minute, because the server does not know the time of the reader. `now` sets a fixed moment, for example in a test.
- Open has a filled dot and closed a hollow dot, with words. `locale` sets the language of the days and the times (default English).
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `open`, `closed`, `today`, and the functions `closesAt` and `opensAt`.

## Usage

```ts
import { BlessOpeningHours } from "blessing-ui";
```

## API

<PropsTable name="BlessOpeningHours" />

<script setup>
import OpeningHoursBasic from "../demos/OpeningHoursBasic.vue";
</script>
