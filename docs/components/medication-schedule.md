---
title: Medication schedule
---

# Medication schedule

<p class="bless-lead">The doses of each medicine for the day, which you mark as taken</p>

Helps a patient or a carer keep track of medicine. The app gives the plan. The component does not give medical advice.

<Demo title="Basic">
  <MedicationScheduleBasic />
  <template #code>

<<< ../demos/MedicationScheduleBasic.vue

  </template>
</Demo>

- `doses` is a list of doses. Each dose has an `id`, the `medicine`, the `amount`, and the `time` as `HH:MM`. It can also have a `note`, such as "with food".
- The doses group by time, in order of the day.
- `v-model` is the list of ids of the doses taken. Each dose has a native check box, named with the medicine and the time. A taken dose is struck through.
- `now` is the time now, as `HH:MM`. With it, a dose that is due and not taken says "late" and has a dashed red edge. Without it, nothing is late. Give it from the clock of the reader after the page loads.
- A status line on top counts the taken doses, such as "1 of 4 doses taken".
- Change the words with `labels` or a [label pack](../guide/translating): `title`, `late`, and the functions `taken` and `mark`.

## Usage

```ts
import { BlessMedicationSchedule } from "blessing-ui";
```

## API

<PropsTable name="BlessMedicationSchedule" />

<script setup>
import MedicationScheduleBasic from "../demos/MedicationScheduleBasic.vue";
</script>
