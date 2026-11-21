---
title: World clock
---

# World clock

<p class="bless-lead">The time now in several time zones</p>

Shows the time in the cities of a team, side by side, so you can find a good time for a call. For a field that chooses one time zone, use the [time zone picker](./timezone-picker).

<Demo title="Basic">
  <WorldClockBasic />
  <template #code>

<<< ../demos/WorldClockBasic.vue

  </template>
</Demo>

- `zones` is a list of IANA zone names, such as `Asia/Jakarta`, or of objects with a `zone` and a `label`. With no label, the clock shows the city of the zone.
- Each clock shows the time, the day compared with the zone of the reader ("today", "tomorrow"), and the offset from UTC. Set `home` to compare the days with a different zone.
- From 18:00 to 6:00, a clock has the dark plate, so night hours show at a glance.
- `locale` sets the language of the times and the day words (default English). `hour12` sets a 12-hour or 24-hour clock. The default is the habit of the locale.
- The clocks start after the page loads, because the server does not know the time of the reader. Before that, each clock shows "--:--". The clocks update every 15 seconds. A fixed `now` stops them, for example in a screenshot.

## Usage

```ts
import { BlessWorldClock } from "blessing-ui";
```

## API

<PropsTable name="BlessWorldClock" />

<script setup>
import WorldClockBasic from "../demos/WorldClockBasic.vue";
</script>
