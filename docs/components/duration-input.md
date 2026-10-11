---
title: DurationInput
---

<script setup>
import DurationInputBasic from "../demos/DurationInputBasic.vue";
</script>

# DurationInput

<p class="bless-lead">Time as h:mm:ss or 1h 30m, held in seconds</p>

A field for a length of time: a run time, a timer, an estimate. People type it in the way they think of it, and the value is a number of seconds.

<Demo title="Basic">
  <DurationInputBasic />
  <template #code>

<<< ../demos/DurationInputBasic.vue

  </template>
</Demo>

- `v-model` is the duration in seconds, or `null` when the field is empty or not a time.
- It reads `1:30:00`, `1h 30m`, `90s` and `1.5h`. Two colon parts are minutes and seconds. With `:seconds="false"` they are hours and minutes (`1:30` is 5400 seconds).
- On blur, the text becomes one format: `h:mm:ss`, or `h:mm` without seconds. Text that is not a time stays in the field and shows "Enter a time such as 1:30 or 1h 30m". Replace the text with `labels.invalid`.
- `min` and `max` are in seconds. A value outside them moves to the nearest limit as you type.
- `parseDuration` and `formatDuration` are exported for use outside the field.

## Usage

```ts
import { BlessDurationInput } from "blessing-ui";
```

## API

<PropsTable name="BlessDurationInput" />
