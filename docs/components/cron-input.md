---
title: CronInput
---

# CronInput

<p class="bless-lead">A cron schedule, with the next run times</p>

Edits a schedule for a job, a backup, or a report, in the five-field cron format that servers use. People see the next run times, so they know that the schedule does what they want. For a single date and time, use the [date-time picker](./date-time-picker). For a length of time, use the [duration input](./duration-input).

<Demo title="Basic">
  <CronInputBasic />
  <template #code>

<<< ../demos/CronInputBasic.vue

  </template>
</Demo>

- `v-model` is the expression: minute, hour, day of the month, month, and day of the week, separated by spaces. Each part has its own field with a visible name.
- Each part takes `*`, a number, a range `1-5`, a list `1,15`, and a step `*/15` or `9-17/2`. Sunday is `0` or `7`. Names such as `MON` are not read. When a part is not valid, its field is marked, and a line asks you to check it.
- When both day fields are set, a day that matches either one runs, as in most cron programs.
- The next run times show under the fields (`count`, default 3, `0` hides them). They use the date format of `locale`. They are read after mount, because the server does not know the time zone of the browser.
- The run times are in the time zone of the browser. If your server runs the job in another zone, say so in the description.
- `blessCronNext(expr, from, count)` is exported. Use it to show the next run somewhere else, for example in a table of jobs.
- In a [field](./form), the field's label names the group and its first part.
- Change the words with `labels` or a [label pack](../guide/translating): the names of the five parts, `next`, and `invalid`.

## Usage

```ts
import { BlessCronInput, blessCronNext } from "blessing-ui";
```

## API

<PropsTable name="BlessCronInput" />

<script setup>
import CronInputBasic from "../demos/CronInputBasic.vue";
</script>
