---
title: Countdown banner
---

<script setup>
import CountdownBannerBasic from "../demos/CountdownBannerBasic.vue";
</script>

# Countdown banner

<p class="bless-lead">A strip with the time left to an event, and a link</p>

Shows the time left to an event at the top of a page, for example a live recording or a launch. At the start, the banner says "Live now". It is a [banner](./banner) with a clock in it. For a timer that a person starts, use the [timer](./timer).

<Demo title="Basic">
  <CountdownBannerBasic />
  <template #code>

<<< ../demos/CountdownBannerBasic.vue

  </template>
</Demo>

- `to` is the start of the event, as a Date, a timestamp in ms, or a date string. `title` says what starts.
- The clock shows days, hours, minutes, and seconds. Under one day, it leaves out the days. At the start, it changes to "Live now" and emits `start`.
- The clock runs after the page loads, because the server does not know the time of the reader. `now` sets a fixed moment, for example in a test.
- The `action` slot holds a button or a link. The props of the banner pass through: `color`, `dismissible`, `persist`, `label`, and `v-model` for open.
- The clock does not speak every second. Screen readers hear the date of the start, such as "Starts Saturday, November 28, 2026 at 7:30 PM". `locale` sets the language of that date (default English).
- Change the words with `labels` or a [label pack](../guide/translating): `startsIn`, `live`, `days`, `hours`, `minutes`, `seconds`, and `startsAt` (a function of the date).

## Usage

```ts
import { BlessCountdownBanner } from "blessing-ui";
```

## API

<PropsTable name="BlessCountdownBanner" />
