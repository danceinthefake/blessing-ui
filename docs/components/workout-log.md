---
title: Workout log
---

<script setup>
import WorkoutLogBasic from "../demos/WorkoutLogBasic.vue";
</script>

# Workout log

<p class="bless-lead">Sets of an exercise with weight and repetitions, and the last session</p>

Logs one exercise in a gym or fitness app, set by set. A rep (repetition) is one lift. A set is a group of reps without a rest.

<Demo title="Basic">
  <WorkoutLogBasic />
  <template #code>

<<< ../demos/WorkoutLogBasic.vue

  </template>
</Demo>

- `exercise` is the name of the exercise.
- `v-model` is the list of sets. Each set has a `weight`, the `reps`, and `done`.
- `previous` is the list of sets of the last session. Each row shows the set of the same number from last time, such as "60 × 8", so the lifter knows what to beat.
- Each row has number fields for the weight and the reps, and a check box for done. Each field has a name with its set number, such as "Weight, set 2". A done row turns light green.
- "Add a set" copies the last set, as lifters often repeat it. The ✕ button removes a set.
- The volume under the table is weight × reps of the done sets. `unit` is the unit of the weight (default `kg`), and `locale` sets the format.
- Change the words with `labels` or a [label pack](../guide/translating): `set`, `last`, `weight`, `reps`, `done`, `add`, and the functions `remove`, `volume`, and `field`.

## Usage

```ts
import { BlessWorkoutLog } from "blessing-ui";
```

## API

<PropsTable name="BlessWorkoutLog" />
