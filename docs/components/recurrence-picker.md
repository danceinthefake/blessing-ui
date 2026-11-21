---
title: Recurrence picker
---

# Recurrence picker

<p class="bless-lead">A rule that repeats, with the rule in one sentence</p>

Sets how often an event repeats, on which days, and when it stops. A sentence under the fields says the rule in plain words. For a rule as a cron line, use the [cron input](./cron-input).

<Demo title="Basic">
  <RecurrencePickerBasic />
  <template #code>

<<< ../demos/RecurrencePickerBasic.vue

  </template>
</Demo>

- `v-model` is the rule. `freq` is `daily`, `weekly`, `monthly`, or `yearly`, and `interval` is the step. `days` holds the days of a weekly rule, and 0 is Monday.
- The end is `{ type: "never" }`, `{ type: "count", count }`, or `{ type: "until", until }` with a date as `YYYY-MM-DD`.
- A weekly rule shows a button for each day. A rule keeps at least one day.
- `toRRule(rule)` gives the rule as an RRULE of the iCalendar standard, such as `FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TH;COUNT=10`. Calendar apps and many servers read this form.
- `locale` sets the language of the day names, the list, and the date (default English).
- The fields are native fields, with a group of radio buttons for the end. The sentence is a status line, so screen readers hear the new rule. Change the words with `labels` or a [label pack](../guide/translating). The words are `every`, `on`, `ends`, `never`, `after`, `times`, and `onDate`. The functions are `unit`, `everyUnit`, `endCount`, `endUntil`, and `summary`.

## Usage

```ts
import { BlessRecurrencePicker, toRRule } from "blessing-ui";
```

## API

<PropsTable name="BlessRecurrencePicker" />

<script setup>
import RecurrencePickerBasic from "../demos/RecurrencePickerBasic.vue";
</script>
