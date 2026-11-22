---
title: Time tracker
---

# Time tracker

<p class="bless-lead">A timer for the current task and a list of time entries with a total for each day</p>

Records how long each task takes, for billing a client or for a timesheet. For a countdown, use the [timer](./timer).

<Demo title="Basic">
  <TimeTrackerBasic />
  <template #code>

<<< ../demos/TimeTrackerBasic.vue

  </template>
</Demo>

- Type the task and press Start. The clock counts up each second. Stop adds an entry to the list.
- `v-model` is the list of entries. Each entry has an `id`, a `task`, and a `start` and an `end` in milliseconds since 1970.
- `v-model:running` holds the task that runs now, with its start time. Keep it in your store, so a reload does not lose a running timer.
- `v-model:running` is the timer that runs. If the parent sets it, for example from another device, the field shows its task.
- The entries are grouped by day, newest first. Each day shows its total, and each entry has a delete button with the task in its name.
- `locale` formats the days and times. `time-zone` sets an IANA time zone. If you render on a server, set it, so the server and the browser show the same day.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessTimeTracker } from "blessing-ui";
```

## API

<PropsTable name="BlessTimeTracker" />

<script setup>
import TimeTrackerBasic from "../demos/TimeTrackerBasic.vue";
</script>
