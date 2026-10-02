---
title: Timer
---

<script setup>
import TimerBasic from "../demos/TimerBasic.vue";
</script>

# Timer

<p class="bless-lead">Countdown, stopwatch and interval timer</p>

A clock the user starts and stops — a cooking timer, a workout, a speaking slot. To pick a time use [TimePicker](./time-picker); for progress toward a goal that is not time, [Progress](./progress).

<Demo title="Basic">
  <TimerBasic />
  <template #code>

<<< ../demos/TimerBasic.vue

  </template>
</Demo>

- `mode="countdown"` counts down from `duration` seconds; `"stopwatch"` counts up with no end; `"interval"` walks through `phases` (`[{ label: "Work", seconds: 25 }, { label: "Rest", seconds: 5 }]`) `rounds` times and shows which phase and round it is in.
- Time comes from `performance.now()`, not from counting ticks, so a throttled background tab or a busy page does not make it drift. Past an hour the display turns to `h:mm:ss`.
- Buttons: Start, Pause (then Resume), Reset; `:controls="false"` hides them. `v-model:running` reads or sets it, the component exposes `start()`, `pause()`, `reset()` and `toggle()`, and `autostart` begins at once. Changing the plan resets the clock.
- `finish` fires once at the end of a countdown or interval; `phase(phase, index, round)` on every change of phase. Finishing and phase changes are announced; the ticking itself is not, so a screen reader is not read a number every second.
- Starting a finished timer begins a fresh run.

## Usage

```ts
import { BlessTimer } from "blessing-ui";
```

## API

<PropsTable name="BlessTimer" />
